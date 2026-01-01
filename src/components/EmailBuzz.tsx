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
    <div id="subscribe" className="bg-black py-24 border-t border-neutral-900">
      <div className="mx-auto max-w-xl px-6 text-center">
        <p className="text-sm text-neutral-500 uppercase tracking-wider mb-4">Stay updated</p>
        <h2 className="text-2xl sm:text-3xl font-medium text-white mb-4">
          Get notified about new features
        </h2>
        <p className="text-neutral-500 mb-8">
          No spam. Unsubscribe anytime.
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={isSubmitted}
            className="flex-1 h-12 px-4 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || isSubmitted}
            className={`h-12 px-6 rounded-lg font-medium transition-colors ${isSubmitted
                ? "bg-emerald-600 text-white"
                : "bg-white text-black hover:bg-neutral-200"
              } disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : isSubmitted ? (
              "Done ✓"
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}