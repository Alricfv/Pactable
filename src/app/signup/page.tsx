'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try{
      const { data: existingUser, error: lookupError } = await supabase.rpc('get_user_id_by_email', {
        email_input: email.toLowerCase().trim()
      });

      if (existingUser){
        setError("This email is already in use");
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.signUp({ 
        email,
        password,
        options: {
           data: {
            username: username
           }
        } 
      });

      if (error){
        setError(error.message);
      }
      else{
        setSuccess('Success! Check your email to confirm your account.')
      }
    } 
    catch(err){
      console.error("Signup Error:", err);
      setError("An unexpected error occured. Please try again.");
    }
    finally{
      setIsLoading(false);
    } 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md space-y-6 bg-white border border-gray-300 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">Sign Up</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            className="bg-white rounded-md px-3 py-2 text-gray-900 w-full border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            type="text"
            required
            disabled={isLoading}
          />
          <input
            className="bg-white rounded-md px-3 py-2 text-gray-900 w-full border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            disabled={isLoading}
          />
          <input
            className="bg-white rounded-md px-3 py-2 text-gray-900 w-full border border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white rounded-md px-3 py-2 w-full font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </button>
          {error && <div className="text-red-500 text-center text-sm">{error}</div>}
          {success && <div className="text-green-600 text-center text-sm">{success}</div>}
          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{' '}
            <a href="/signin" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}