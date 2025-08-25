'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import { FcGoogle } from 'react-icons/fc'


export default function SignInPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

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
            <div className="flex items-center justify-center min-h-[70vh]" >
                <div className="w-full max-w-md space-y-6 bg-[#0f0f0f] rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-center mb-2">Log In</h2>
                    <form 
                        onSubmit={handleSignIn} 
                        className="space-y-4"
                    >
                        
                        <input
                            className="bg-[#000000] rounded-md px-3 py-2 text w-full border-[#262626] border"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                            type="email"
                            required
                        />
                        <input
                            className="bg-[#000000] rounded-md px-3 py-2 text-white w-full border-[#262626] border"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password"
                            type="password"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-white text-black rounded px-3 py-2"
                            style={{width:'100%'}}
                        >
                            Continue
                        </button>
                        {error && <div className="text-red">{error}</div>}
                    </form>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-700"/>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#09090b] px-2 text-gray-400">
                                Or....
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleGoogleSignIn}
                        className="bg-white w-full flex items-center justify-center gap-2 text-black rounded px-3 py-3 font-semibold hover:bg-gray-200"
                    >
                        <FcGoogle className=" h-5 w-5" />
                        Sign in with Google
                    </button>
                    <p className = "text-center text-gray-400 text-sm mt-4">
                        Don't have an account?{' '}
                        <a href="/signup" className="text-indigo-400 underline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
    )
}