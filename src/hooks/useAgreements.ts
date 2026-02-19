import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabaseClient'
import { getFromStorage, persistToStorage } from '@/lib/requestThrottle'

const supabase = createClient()

// Cache TTL: 30 minutes for localStorage persistence
const STORAGE_TTL = 30 * 60 * 1000

export function useAgreements(userId: string | undefined, initialData?: any[]) {
  // Check localStorage cache upfront
  const cachedData = userId ? getFromStorage<any[]>(`agreements_${userId}`) : null
  
  return useQuery({
    queryKey: ['agreements', userId],
    queryFn: async () => {
      if (!userId) return []
      
      const [created, received] = await Promise.all([
        supabase
          .from('agreements')
          .select(`
            id, title, created_at, created_by, content,
            agreement_participants(user_id, status)
          `)
          .eq('created_by', userId)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('agreements')
          .select(`
            id, title, created_at, created_by, content,
            agreement_participants(user_id, status)
          `)
          .neq('created_by', userId)
          .eq('agreement_participants.user_id', userId)
          .order('created_at', { ascending: false })
      ])
      
      const result = [...(created.data || []), ...(received.data || [])]
      
      // Persist to localStorage for offline/instant loading
      persistToStorage(`agreements_${userId}`, result, STORAGE_TTL)
      
      return result
    },
    // Use initialData if provided, otherwise use localStorage cache
    initialData: initialData !== undefined ? initialData : (cachedData ?? undefined),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    enabled: !!userId,
    refetchOnWindowFocus: false,
    // Always refetch on mount to get fresh data (but show cached instantly)
    refetchOnMount: 'always',
    refetchOnReconnect: false,
    retry: (failureCount, error: any) => {
      if (error?.status === 429) return false
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}

export function useDeleteAgreement() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (agreementId: string) => {
      const { error } = await supabase.rpc('delete_agreement', {
        agreement_id: agreementId
      })
      if (error) throw error
      return agreementId
    },
    onSuccess: (deletedId) => {
      // Update all agreements caches immediately
      queryClient.setQueriesData({ queryKey: ['agreements'] }, (old: any[] | undefined) => 
        old?.filter(a => a.id !== deletedId) || []
      )
    }
  })
}