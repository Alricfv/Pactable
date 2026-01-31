import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  SUPABASE_AUTH_ERROR_HEADER,
  SUPABASE_AUTH_ERROR_MESSAGE_HEADER,
  SUPABASE_USER_HEADER,
  encodeUserForHeader,
} from '@/lib/authHeaders'

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const pendingCookies: Array<{
    action: 'set' | 'remove'
    name: string
    value?: string
    options?: CookieOptions
  }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          pendingCookies.push({ action: 'set', name, value, options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          pendingCookies.push({ action: 'remove', name, options })
        },
      },
    }
  )
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const isMissingSession =
    error?.message === 'Auth session missing!' ||
    error?.status === 401 ||
    error?.status === 400

  if (user) {
    requestHeaders.set(SUPABASE_USER_HEADER, encodeUserForHeader(user))
  } else {
    requestHeaders.delete(SUPABASE_USER_HEADER)
  }

  if (error && !isMissingSession) {
    requestHeaders.set(SUPABASE_AUTH_ERROR_HEADER, String(error.status ?? 'unknown'))
    requestHeaders.set(
      SUPABASE_AUTH_ERROR_MESSAGE_HEADER,
      encodeURIComponent(error.message ?? 'Supabase auth error')
    )
  } else {
    requestHeaders.delete(SUPABASE_AUTH_ERROR_HEADER)
    requestHeaders.delete(SUPABASE_AUTH_ERROR_MESSAGE_HEADER)
  }

  const applyPendingCookies = (nextResponse: NextResponse) => {
    for (const operation of pendingCookies) {
      if (operation.action === 'set') {
        nextResponse.cookies.set({
          name: operation.name,
          value: operation.value ?? '',
          ...(operation.options ?? {}),
        })
      } else {
        nextResponse.cookies.set({
          name: operation.name,
          value: '',
          ...(operation.options ?? {}),
        })
      }
    }
    return nextResponse
  }

  const {pathname} = request.nextUrl

  if (!user && !error && pathname.startsWith('/dashboard')) {
    return applyPendingCookies(NextResponse.redirect(new URL('/signin', request.url)))
  }

  if (user && (pathname === '/signin' || pathname ==='/signup')){
    return applyPendingCookies(NextResponse.redirect(new URL('/dashboard', request.url)))
  }

  return applyPendingCookies(NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  }))
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/signup'],
}