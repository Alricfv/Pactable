import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabaseClient'

export function useProfile(userId: string) {
  const supabase = createClient()
  
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, avatar_url')
        .eq('id', userId)
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error
      }
      
      return data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - profiles don't change often
    enabled: !!userId, // Only run query if userId exists
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const supabase = createClient()
  
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
      // Update cache immediately
      queryClient.setQueryData(['profile', variables.userId], data)
      // Invalidate to refetch and sync
      queryClient.invalidateQueries({ queryKey: ['profile', variables.userId] })
    }
  })
}