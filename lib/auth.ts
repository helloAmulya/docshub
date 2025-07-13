
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { env } from "@/lib/env"

const JWT_SECRET = env.ADMIN_SECRET
const TOKEN_EXPIRY = "7d"

export interface AdminPayload {
  email: string
  role: "admin"
  iat: number
  exp: number
}

export function generateAdminToken(email: string): string {
  return jwt.sign(
    { email, role: "admin" },
    JWT_SECRET,
    {
      expiresIn: TOKEN_EXPIRY,
      issuer: "docs-hub",
      audience: "admin",
    },
  )
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: "docs-hub",
      audience: "admin",
    }) as AdminPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function validateAdminCredentials(email: string, password: string): boolean {
  return email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD
}

export function extractTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7)

  const cookieHeader = request.headers.get("cookie")
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map(cookie => cookie.trim().split("=")),
    )
    return cookies["admin-token"] || null
  }

  return null
}

export function generateSessionId(): string {
  return jwt.sign(
    {
      sessionId: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    },
    JWT_SECRET,
    { expiresIn: "1h" },
  )
}


