'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const { data, error } = await supabase.auth.signUp({ 
        email,
        password,
        options: {
           data: {
            username: username
           }
        } 
    })
    if (error) {
      setError(error.message)
    } else {
      setSuccess("Check your email for a confirmation link!")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md space-y-6 bg-[#0f0f0f] rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            className="bg-[#000000] rounded px-3 py-2 text-white w-full"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            type="text"
            required
          />
          <input
            className="bg-[#000000] rounded px-3 py-2 text-white w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <input
            className="bg-[#000000] rounded px-3 py-2 text-white w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
          />
          <button
            type="submit"
            className="bg-white text-black rounded px-3 py-2 w-full"
          >
            Continue
          </button>
          <p className = "text-center text-gray-400 text-sm mt-4">
            Already have an account?{' '}
                <a href="/signin" className="text-indigo-400 underline">
                    Sign In
                </a>
          </p>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
        </form>
      </div>
    </div>
  )
}