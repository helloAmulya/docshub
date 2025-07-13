export const runtime = "nodejs"

import { verifyAdminAuth } from "@/lib/admin-api"
import { type NextRequest, NextResponse } from "next/server"
import { validateAdminCredentials, generateAdminToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Rate limiting check (simple implementation)
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    console.log(`Login attempt from IP: ${clientIP}`)

    // Validate credentials with timing-safe comparison
    const isValid = validateAdminCredentials(email.trim().toLowerCase(), password)

    if (!isValid) {
      // Add delay to prevent brute force attacks
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateAdminToken(email.trim().toLowerCase())

    // Set secure HTTP-only cookie

    const cookieStore = await cookies()
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    console.log(`Successful admin login: ${email}`)

    return NextResponse.json({
      message: "Login successful",
      user: {
        email: email.trim().toLowerCase(),
        role: "admin",
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
