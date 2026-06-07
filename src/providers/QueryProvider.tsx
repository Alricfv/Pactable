'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 60 * 1000, // 30 minutes - data stays fresh much longer
        gcTime: 60 * 60 * 1000, // 1 hour in cache
        refetchOnWindowFocus: false, // Never refetch on window focus
        refetchOnMount: false, // Use cached data
        refetchOnReconnect: false, // Don't refetch on reconnect
        retry: (failureCount, error: any) => {
          // Don't retry on rate limit (429) or auth errors (401, 403)
          if (error?.status === 429 || error?.status === 401 || error?.status === 403) {
            return false
          }
          return failureCount < 2
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      },
      mutations: {
        retry: false, // Don't retry mutations
      }
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}