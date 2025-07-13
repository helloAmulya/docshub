import type { BlogPost } from "./types"

// Mock database - in a real app, this would be MongoDB
const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    slug: "getting-started-with-nextjs-15",
    content:
      "<h2>Introduction to Next.js 15</h2><p>Next.js 15 brings exciting new features and improvements that make building React applications even more powerful and efficient.</p><h3>Key Features</h3><ul><li>Improved App Router</li><li>Better performance optimizations</li><li>Enhanced developer experience</li></ul><p>In this comprehensive guide, we'll explore all the new features and how to leverage them in your projects.</p>",
    excerpt:
      "Discover the exciting new features in Next.js 15 and learn how to build modern React applications with improved performance and developer experience.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    published: true,
  },
  {
    id: "2",
    title: "Mastering TailwindCSS for Modern UI Design",
    slug: "mastering-tailwindcss-for-modern-ui-design",
    content:
      "<h2>Why TailwindCSS?</h2><p>TailwindCSS has revolutionized the way we approach CSS by providing utility-first classes that make styling faster and more maintainable.</p><h3>Benefits of Utility-First CSS</h3><ul><li>Rapid prototyping</li><li>Consistent design system</li><li>Smaller bundle sizes</li><li>Better maintainability</li></ul><p>Let's dive into advanced techniques and best practices for using TailwindCSS in your projects.</p>",
    excerpt:
      "Learn advanced TailwindCSS techniques and best practices for creating beautiful, maintainable user interfaces with utility-first CSS.",
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    published: true,
  },
  {
    id: "3",
    title: "Building Scalable React Applications",
    slug: "building-scalable-react-applications",
    content:
      "<h2>Architecture Patterns for Scale</h2><p>As React applications grow in complexity, having the right architecture becomes crucial for maintainability and team productivity.</p><h3>Key Principles</h3><ul><li>Component composition</li><li>State management strategies</li><li>Code organization</li><li>Performance optimization</li></ul><p>We'll explore proven patterns and techniques used by successful React teams.</p>",
    excerpt:
      "Explore proven architecture patterns and techniques for building large-scale React applications that are maintainable and performant.",
    createdAt: "2024-01-05T09:15:00Z",
    updatedAt: "2024-01-05T09:15:00Z",
    published: true,
  },
]

export const mockDatabase = {
  async getAllPosts(): Promise<BlogPost[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    return [...mockPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return mockPosts.find((post) => post.slug === slug) || null
  },

  async createPost(data: { title: string; content: string; slug: string }): Promise<BlogPost> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: this.generateExcerpt(data.content),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: true,
    }

    mockPosts.push(newPost)
    return newPost
  },

  async updatePost(id: string, data: { title: string; content: string; slug: string }): Promise<BlogPost | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const postIndex = mockPosts.findIndex((post) => post.id === id)
    if (postIndex === -1) return null

    mockPosts[postIndex] = {
      ...mockPosts[postIndex],
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: this.generateExcerpt(data.content),
      updatedAt: new Date().toISOString(),
    }

    return mockPosts[postIndex]
  },

  async deletePost(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const postIndex = mockPosts.findIndex((post) => post.id === id)
    if (postIndex === -1) return false

    mockPosts.splice(postIndex, 1)
    return true
  },

  generateExcerpt(content: string): string {
    // Remove HTML tags and get first 150 characters
    const plainText = content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
    return plainText.length > 150 ? plainText.substring(0, 150) + "..." : plainText
  },
}
