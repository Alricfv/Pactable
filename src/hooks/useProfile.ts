import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabaseClient'
import { getFromStorage, persistToStorage } from '@/lib/requestThrottle'

const supabase = createClient()

// Cache TTL: 2 hours for localStorage persistence
const STORAGE_TTL = 2 * 60 * 60 * 1000

export type Profile = {
  username: string | null
  email: string | null
  avatar_url: string | null
}

export function useProfile(userId: string | undefined) {
  // Check if we have cached data upfront
  const cachedData = userId ? getFromStorage<Profile>(`profile_${userId}`) : null
  
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, avatar_url')
        .eq('id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      // Persist to localStorage
      if (data) {
        persistToStorage(`profile_${userId}`, data, STORAGE_TTL)
      }
      
      return data
    },
    // Use localStorage as initial data (convert null to undefined for React Query)
    initialData: cachedData ?? undefined,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: !!userId,
    refetchOnWindowFocus: false,
    // Always refetch on mount for fresh data (but show cached instantly)
    refetchOnMount: 'always',
    refetchOnReconnect: false,
    retry: (failureCount, error: any) => {
      if (error?.status === 429) return false
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ userId, updates }: { 
      userId: string
      updates: { username?: string; avatar_url?: string }
    }) => {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...updates
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (data, variables) => {
      // Update cache immediately without refetching
      queryClient.setQueryData(['profile', variables.userId], data)
    }
  })
}