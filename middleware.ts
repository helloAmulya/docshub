// /**
//  * Next.js Middleware for Admin Route Protection
//  * This runs on the Edge Runtime for maximum security
//  */




import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip login and public routes
  if (pathname === "/admin/login" || !pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Check only if token exists (NO verification)
  const token = request.cookies.get("admin-token")?.value

  if (!token) {
    console.log("No token found, redirecting to login")
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  // Optionally: add header so your route knows there's a token
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-has-token", "true")

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}





// import { verifyAdminAuth } from "@/lib/admin-api"

// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"
// import { verifyAdminToken, extractTokenFromRequest } from "./lib/auth"

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // Skip middleware for login page and public routes
//   if (pathname === "/admin/login" || !pathname.startsWith("/admin")) {
//     return NextResponse.next()
//   }

//   // Extract token from request
//   const token = extractTokenFromRequest(request)

//   if (!token) {
//     console.log("No token found, redirecting to login")
//     return NextResponse.redirect(new URL("/admin/login", request.url))
//   }

//   // Verify token
//   const payload = verifyAdminToken(token)

//   if (!payload) {
//     console.log("Invalid token, redirecting to login")
//     // Clear invalid token
//     const response = NextResponse.redirect(new URL("/admin/login", request.url))
//     response.cookies.delete("admin-token")
//     return response
//   }

//   // Check if token is about to expire (less than 1 day remaining)
//   const now = Math.floor(Date.now() / 1000)
//   const timeUntilExpiry = payload.exp - now
//   const oneDayInSeconds = 24 * 60 * 60

//   if (timeUntilExpiry < oneDayInSeconds) {
//     console.log("Token expiring soon, refreshing...")
//     // Generate new token
//     const { generateAdminToken } = require("./lib/auth")
//     const newToken = generateAdminToken(payload.email)

//     const response = NextResponse.next()
//     response.cookies.set("admin-token", newToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//       path: "/",
//     })

//     return response
//   }

//   // Add admin info to headers for API routes
//   const requestHeaders = new Headers(request.headers)
//   requestHeaders.set("x-admin-email", payload.email)
//   requestHeaders.set("x-admin-role", payload.role)

//   return NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   })
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all admin routes except login
//      * - /admin (dashboard)
//      * - /admin/create
//      * - /admin/edit/[slug]
//      * - /api/admin/* (admin API routes)
//      */
//     "/admin/:path*",
//     "/api/admin/:path*",
//   ],
// }
