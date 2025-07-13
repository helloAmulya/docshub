export const runtime = "nodejs"

import { NextRequest, NextResponse } from "next/server"
import { verifyAdminAuth } from "@/lib/admin-api"

import { cookies } from "next/headers"

export async function POST() {
  try {
    // Clear the admin token cookie
    const cookieStore = await cookies()
    cookieStore.delete("admin-token")

    return NextResponse.json({ message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "Logout failed" }, { status: 500 })
  }
}
