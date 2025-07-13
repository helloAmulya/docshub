export const runtime = "nodejs"

import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/database"
import { verifyAdminAuth } from "@/lib/admin-api"

interface RouteParams {
  params: {
    identifier: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { identifier } = params

    // For GET requests, check if it's an admin request or public request
    const auth = verifyAdminAuth(request)

    let post
    if (auth.authenticated) {
      // Admin can see any post (including unpublished)
      post = await database.getPostBySlug(identifier)
      if (!post) {
        post = await database.getPostById(identifier)
      }
    } else {
      // Public users can only see published posts
      post = await database.getPostBySlug(identifier)
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify admin authentication for updating posts
    
    // const auth = verifyAdminAuth(request)
    const auth = await verifyAdminAuth(request)


    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { identifier } = params
    const body = await request.json()
    const { title, content, slug } = body

    if (!title || !content || !slug) {
      return NextResponse.json({ error: "Title, content, and slug are required" }, { status: 400 })
    }

    const updatedPost = await database.updatePost(identifier, {
      id: identifier,
      title,
      content,
      slug,
    })

    if (!updatedPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    console.log(`Post updated by admin: ${auth.email}`)

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating post:", error)
    if (error instanceof Error && error.message.includes("slug already exists")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify admin authentication for deleting posts
    const auth = verifyAdminAuth(request)

    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { identifier } = params

    const success = await database.deletePost(identifier)

    if (!success) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    console.log(`Post deleted by admin: ${auth.email}`)

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
