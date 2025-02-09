import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Limit the number of requests per IP
const rateLimit = new Map<string, { count: number; timestamp: number }>()

export function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  const ip = request.ip ?? "127.0.0.1"
  const now = Date.now()
  const windowMs = 60 * 1000 // 1 minute
  const max = 10 // max 10 requests per minute

  const rateLimitInfo = rateLimit.get(ip) ?? { count: 0, timestamp: now }

  // Reset if outside window
  if (now - rateLimitInfo.timestamp > windowMs) {
    rateLimitInfo.count = 0
    rateLimitInfo.timestamp = now
  }

  rateLimitInfo.count++
  rateLimit.set(ip, rateLimitInfo)

  const response = NextResponse.next()

  if (rateLimitInfo.count > max) {
    return new NextResponse("Rate limit exceeded", { status: 429 })
  }

  // Add rate limit headers
  response.headers.set("X-RateLimit-Limit", max.toString())
  response.headers.set("X-RateLimit-Remaining", Math.max(0, max - rateLimitInfo.count).toString())

  return response
}

export const config = {
  matcher: "/api/:path*",
}

