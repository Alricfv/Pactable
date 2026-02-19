'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import { useSessionContext } from '@/contexts/SessionContext'
import { FcGoogle } from 'react-icons/fc'


export default function SignInPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()
    const { user, loading } = useSessionContext()

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (!loading && user) {
            router.replace('/dashboard')
        }
    }, [user, loading, router])

    // Check for error from OAuth callback
    useEffect(() => {
        const errorParam = searchParams.get('error')
        if (errorParam) {
            setError(decodeURIComponent(errorParam))
        }
    }, [searchParams])

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setError(error.message)
        } 
        else{
            router.push('/dashboard')
        }
    }

    const handleGoogleSignIn = async () => {
        setError(null)
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/auth/callback`
            }
        })
    }

    return(
            <div className="flex items-center justify-center min-h-screen bg-gray-50" >
                <div className="w-full max-w-md space-y-6 bg-white border border-gray-300 rounded-xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">Log In</h2>
                    <form 
                        onSubmit={handleSignIn} 
                        className="space-y-4"
                    >
                        
                        <input
                            className="bg-white rounded-md px-3 py-2 text-gray-900 w-full border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                            type="email"
                            required
                        />
                        <input
                            className="bg-white rounded-md px-3 py-2 text-gray-900 w-full border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password"
                            type="password"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white rounded-md px-3 py-2 w-full font-medium hover:bg-indigo-700 transition-colors"
                        >
                            Continue
                        </button>
                        {error && <div className="text-red-500 text-sm text-center pt-4">{error}</div>}
                    </form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-300"/>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">
                                Or
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleGoogleSignIn}
                        className="bg-white w-full flex items-center justify-center gap-2 text-gray-700 rounded-md px-3 py-3 font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                        <FcGoogle className="h-5 w-5" />
                        Sign in with Google
                    </button>
                    <p className="text-center text-gray-500 text-sm mt-4">
                        Don&apos;t have an account?{' '}
                        <a href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
    )
}