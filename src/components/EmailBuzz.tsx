'use client'

import { useState } from 'react';

export function EmailBuzz() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitted) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div id="subscribe" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-stone-100 text-stone-600 text-sm font-medium mb-4">
          Stay Updated
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
          Get notified about new features
        </h2>
        <p className="text-stone-500 mb-8 max-w-md mx-auto leading-relaxed">
          Join our waitlist for early access to new templates and features. No spam, just progress.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isSubmitted}
            className="flex-1 h-12 px-5 rounded-full bg-stone-50 border border-stone-300 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || isSubmitted}
            className={`h-12 px-8 rounded-full font-semibold transition-all ${isSubmitted
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-stone-900 text-white hover:bg-stone-800"
              } disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isSubmitted ? (
              "Subscribed ✓"
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}