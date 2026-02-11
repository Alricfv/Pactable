import { createClient } from '@/lib/supabaseServer'
import DashboardClient from './DashboardClient'
import { requireUser } from '@/lib/requestUser'

export const revalidate = 60 // Revalidate every 60 seconds

export default async function DashboardPage() {
    const supabase = createClient()
    const user = requireUser()

    // Cache agreements data
    const [createdAgreements, receivedAgreements] = await Promise.all([
        supabase
            .from('agreements')
            .select(`
                id, title, created_at, created_by, content,
                agreement_participants(user_id, status)
            `)
            .eq('created_by', user.id)
            .order('created_at', { ascending: false }),
        
        supabase
            .from('agreements')
            .select(`
                id, title, created_at, created_by, content,
                agreement_participants(user_id, status)
            `)
            .neq('created_by', user.id)
            .eq('agreement_participants.user_id', user.id)
            .order('created_at', { ascending: false })
    ])

    const allAgreements = [...(createdAgreements.data || []), ...(receivedAgreements.data || [])]
    
    return <DashboardClient agreements={allAgreements} userId={user.id} />
}