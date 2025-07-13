export const runtime = "nodejs"



import { type NextRequest, NextResponse } from "next/server"
import { database } from "@/lib/database"
import { generateSlug } from "@/lib/utils"
import { verifyAdminAuth } from "@/lib/admin-api"

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication for getting all posts (including unpublished)
    const auth = verifyAdminAuth(request)

    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const posts = await database.getAllPostsAdmin()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication for creating posts
    const auth = verifyAdminAuth(request)

    if (!auth.authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, slug } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    const finalSlug = slug || generateSlug(title)

    const newPost = await database.createPost({
      title,
      content,
      slug: finalSlug,
    })

    console.log(`Post created by admin: ${auth.email}`)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    if (error instanceof Error && error.message.includes("slug already exists")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
