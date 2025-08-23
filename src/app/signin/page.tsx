'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { FcGoogle } from "react-icons/fc"

export default function SignInPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setError(error?.message ?? null)
    }

    const handleGoogleSignIn = async () => {
        setError(null)
        const {error} = await supabase.auth.signInWithOAuth({
            provider: 'google'
        })
        if (error) setError(error.message)
    }

    return(
        <div className="flex items-center justify-center min-h-[70vh]" >
            <form 
                onSubmit={handleSignIn} 
                className="flex flex-col gap-4 max-w-xs w-full"
            >
                <h2 className="text-2xl font-bold text-center mb-2">Log In</h2>
                <input
                    className="bg-slate-950 rounded px-3 py-2 text-white"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    required
                />
                <input
                    className="bg-slate-950 rounded px-3 py-2 text-white"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    required
                />
                <button
                    type="submit"
                    className="bg-white text-black rounded px-3 py-2"
                >
                    Continue
                </button>
                {error && <div className="text-red">{error}</div>}
            </form>
            <div>
                <div>
                    <span></span>
                </div>
                <div>
                    <span>
                        Or....
                    </span>
                </div>
            </div>
            <Button
                onClick={handleGoogleSignIn}
            >
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign in with Google
            </Button>
        </div>
    )
}