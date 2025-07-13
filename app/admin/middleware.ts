import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Check if user is accessing admin routes
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    // Check for admin session cookie
    const adminSession = request.cookies.get("admin-session")

    if (!adminSession || adminSession.value !== "authenticated") {
      // Redirect to login page
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}
