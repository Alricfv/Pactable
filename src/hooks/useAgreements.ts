import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabaseClient'

export function useAgreements(userId: string) {
  const supabase = createClient()
  
  return useQuery({
    queryKey: ['agreements', userId],
    queryFn: async () => {
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
      
      return [...(created.data || []), ...(received.data || [])]
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useDeleteAgreement() {
  const queryClient = useQueryClient()
  const supabase = createClient()
  
  return useMutation({
    mutationFn: async (agreementId: string) => {
      const { error } = await supabase.rpc('delete_agreement', {
        agreement_id: agreementId
      })
      if (error) throw error
      return agreementId
    },
    onSuccess: (deletedId) => {
      // Update cache immediately
      queryClient.setQueryData(['agreements'], (old: any[]) => 
        old?.filter(a => a.id !== deletedId) || []
      )
    }
  })
}