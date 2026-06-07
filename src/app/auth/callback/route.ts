import { NextResponse } from 'next/server'

// Redirect ALL callback requests to the client-side handler
// The browser needs to handle PKCE because the code verifier is in localStorage
export async function GET(request: Request) {
  const { search, origin } = new URL(request.url)
  
  // Pass ALL query params to the client-side page
  return NextResponse.redirect(`${origin}/auth/callback/exchange${search}`)
}