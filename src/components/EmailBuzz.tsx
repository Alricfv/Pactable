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
    <div id="subscribe" className="bg-background py-32 border-t border-neutral-900/50">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-[0.2em] mb-4">Updates</p>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">
          Get notified about new features
        </h2>
        <p className="text-neutral-500 mb-10 max-w-md mx-auto leading-relaxed">
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
            className="flex-1 h-12 px-4 rounded-xl bg-neutral-900/50 border border-neutral-800 text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 focus:bg-neutral-900 transition-all duration-300 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || isSubmitted}
            className={`h-12 px-8 rounded-xl font-medium transition-all duration-300 active:scale-95 ${isSubmitted
              ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/20"
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