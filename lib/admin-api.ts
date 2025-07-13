/**
 * Admin API utilities with authentication
 */

import { extractTokenFromRequest, verifyAdminToken } from "./auth"

/**
 * Verify admin authentication for API routes
 */
export function verifyAdminAuth(request: Request): { authenticated: boolean; email?: string } {
  const token = extractTokenFromRequest(request)

  if (!token) {
    return { authenticated: false }
  }

  const payload = verifyAdminToken(token)

  if (!payload) {
    return { authenticated: false }
  }

  return {
    authenticated: true,
    email: payload.email,
  }
}
// export async function verifyAdminAuth(request: Request): Promise<{ authenticated: boolean; email?: string }> {
//   const token = extractTokenFromRequest(request)
//   if (!token) return { authenticated: false }

//   const payload = await verifyAdminToken(token)
//   if (!payload) return { authenticated: false }

//   return {
//     authenticated: true,
//     email: payload.email,
//   }
// }


/**
 * Admin-only API route wrapper
 */
export function withAdminAuth<T extends any[]>(
  handler: (...args: T) => Promise<Response>,
): (...args: T) => Promise<Response> {
  return async (...args: T) => {
    const request = args[0] as Request

    const auth = verifyAdminAuth(request)

    if (!auth.authenticated) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    return handler(...args)
  }
}
