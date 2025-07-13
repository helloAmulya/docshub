export const runtime = "nodejs"


import { verifyAdminAuth } from "@/lib/admin-api"

import { type NextRequest, NextResponse } from "next/server"
import { extractTokenFromRequest, verifyAdminToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromRequest(request)

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const payload = verifyAdminToken(token)

    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: payload.email,
        role: payload.role,
      },
    })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
