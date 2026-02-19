'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

export default function ExchangePage() {
  const [status, setStatus] = useState('Completing sign in...')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuth = async () => {
      // Check for OAuth errors first
      const oauthError = searchParams.get('error')
      const errorDescription = searchParams.get('error_description')
      if (oauthError) {
        const msg = errorDescription || oauthError
        router.replace('/signin?error=' + encodeURIComponent(msg))
        return
      }

      const next = searchParams.get('next') || '/dashboard'
      const supabase = createClient()

      try {
        // With implicit flow, the session should already be set via detectSessionInUrl
        // or we might have a code to exchange (if PKCE somehow)
        
        // First check if we already have a session
        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData?.session) {
          setStatus('Success! Redirecting...')
          router.replace(next)
          return
        }

        // If there's a code param, try to exchange it
        const code = searchParams.get('code')
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            console.error('Exchange error:', exchangeError.message)
            setError(exchangeError.message)
            setTimeout(() => {
              router.replace('/signin?error=' + encodeURIComponent(exchangeError.message))
            }, 2000)
            return
          }

          if (data.session) {
            setStatus('Success! Redirecting...')
            router.replace(next)
            return
          }
        }

        // No session found - check hash fragment (implicit flow)
        // The hash is handled automatically by detectSessionInUrl on client
        // Give it a moment then check again
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const { data: retrySession } = await supabase.auth.getSession()
        if (retrySession?.session) {
          setStatus('Success! Redirecting...')
          router.replace(next)
          return
        }

        // Still no session
        router.replace('/signin?error=' + encodeURIComponent('Authentication failed - please try again'))
      } catch (err: any) {
        console.error('Unexpected error:', err)
        setError(err.message || 'An unexpected error occurred')
        setTimeout(() => {
          router.replace('/signin?error=' + encodeURIComponent(err.message || 'An unexpected error occurred'))
        }, 2000)
      }
    }

    handleAuth()
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center p-8">
        {error ? (
          <>
            <div className="text-red-500 text-lg mb-2">Authentication Error</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-400">Redirecting to sign in...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{status}</p>
          </>
        )}
      </div>
    </div>
  )
}
