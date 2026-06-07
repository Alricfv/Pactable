import { NextResponse, type NextRequest } from 'next/server'

/**
 * Lightweight middleware - just passes requests through.
 * Auth is handled client-side via SessionContext.
 * 
 * With implicit OAuth flow, tokens are stored in localStorage (client-only).
 * Server-side middleware can't access localStorage, so we let client handle auth.
 */
export async function middleware(request: NextRequest) {
  // Just pass through - client-side will handle auth redirects
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
}
