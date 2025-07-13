export const runtime = "nodejs"




import { NextResponse } from "next/server"
import { database } from "@/lib/database"

export async function GET() {
  try {
    // Get only published posts for public view
    const posts = await database.getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching public posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
