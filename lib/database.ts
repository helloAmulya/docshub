/**
 * Database Operations
 *
 * USING REAL MONGODB DATABASE
 */

import connectDB from "./mongodb"
import Post from "./models/Post"
import { generateSlug } from "./utils"

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  createdAt: string
  updatedAt: string
  published: boolean
}

export interface CreatePostData {
  title: string
  content: string
  slug?: string
}

export interface UpdatePostData extends CreatePostData {
  id: string
}

class DatabaseService {
  /**
   * Get all published posts, sorted by creation date (newest first)
   */
  async getAllPosts(): Promise<BlogPost[]> {
    try {
      await connectDB()
      // const posts = await Post.find({ published: true }).sort({ createdAt: -1 }).lean()

      // loading the posts faster
      const posts = await Post.find({ published: true })
        .select("title slug excerpt createdAt updatedAt published")
        .sort({ createdAt: -1 })
        .lean()

      return posts.map(this.transformPost)
    } catch (error) {
      console.error("Error fetching posts:", error)
      throw new Error("Failed to fetch posts")
    }
  }

  /**
   * Get all posts (including unpublished) for admin dashboard
   */
  async getAllPostsAdmin(): Promise<BlogPost[]> {
    try {
      await connectDB()
      const posts = await Post.find({}).sort({ createdAt: -1 }).lean()
      return posts.map(this.transformPost)
    } catch (error) {
      console.error("Error fetching admin posts:", error)
      throw new Error("Failed to fetch posts")
    }
  }

  /**
   * Get a single post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      await connectDB()
      const post = await Post.findOne({ slug, published: true }).lean()
      if (!post) return null
      return this.transformPost(post)
    } catch (error) {
      console.error("Error fetching post by slug:", error)
      throw new Error("Failed to fetch post")
    }
  }

  /**
   * Get a single post by ID (for admin operations)
   */
  async getPostById(id: string): Promise<BlogPost | null> {
    try {
      await connectDB()
      const post = await Post.findById(id).lean()
      if (!post) return null
      return this.transformPost(post)
    } catch (error) {
      console.error("Error fetching post by ID:", error)
      throw new Error("Failed to fetch post")
    }
  }

  /**
   * Create a new blog post
   */
  async createPost(data: CreatePostData): Promise<BlogPost> {
    try {
      await connectDB()
      const slug = data.slug || generateSlug(data.title)

      // Check if slug already exists
      const existingPost = await Post.findOne({ slug })
      if (existingPost) {
        throw new Error("A post with this slug already exists")
      }

      const excerpt = this.generateExcerpt(data.content)
      const post = new Post({
        title: data.title,
        slug,
        content: data.content,
        excerpt,
      })

      const savedPost = await post.save()
      return this.transformPost(savedPost.toObject())
    } catch (error) {
      console.error("Error creating post:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Failed to create post")
    }
  }

  /**
   * Update an existing blog post
   */
  async updatePost(id: string, data: UpdatePostData): Promise<BlogPost | null> {
    try {
      await connectDB()
      const slug = data.slug || generateSlug(data.title)

      // Check if slug already exists (excluding current post)
      const existingPost = await Post.findOne({ slug, _id: { $ne: id } })
      if (existingPost) {
        throw new Error("A post with this slug already exists")
      }

      const excerpt = this.generateExcerpt(data.content)
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          title: data.title,
          slug,
          content: data.content,
          excerpt,
        },
        { new: true, runValidators: true },
      ).lean()

      if (!updatedPost) return null
      return this.transformPost(updatedPost)
    } catch (error) {
      console.error("Error updating post:", error)
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Failed to update post")
    }
  }

  /**
   * Delete a blog post
   */
  async deletePost(id: string): Promise<boolean> {
    try {
      await connectDB()
      const deletedPost = await Post.findByIdAndDelete(id)
      return !!deletedPost
    } catch (error) {
      console.error("Error deleting post:", error)
      throw new Error("Failed to delete post")
    }
  }

  /**
   * Search posts by title and content
   */
  async searchPosts(query: string): Promise<BlogPost[]> {
    try {
      await connectDB()
      const posts = await Post.find({
        $and: [
          { published: true },
          {
            $or: [
              { title: { $regex: query, $options: "i" } },
              { content: { $regex: query, $options: "i" } },
              { excerpt: { $regex: query, $options: "i" } },
            ],
          },
        ],
      })
        .sort({ createdAt: -1 })
        .lean()

      return posts.map(this.transformPost)
    } catch (error) {
      console.error("Error searching posts:", error)
      throw new Error("Failed to search posts")
    }
  }

  /**
   * Transform MongoDB document to BlogPost interface
   */
  private transformPost(post: any): BlogPost {
    return {
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      published: post.published,
    }
  }

  /**
   * Generate excerpt from content
   */
  private generateExcerpt(content: string): string {
    // Remove HTML tags and get first 150 characters
    const plainText = content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText
  }
}

// Export singleton instance
export const database = new DatabaseService()
