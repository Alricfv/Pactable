import { createClient } from '@/lib/supabaseServer';
import DashboardClient from './DashboardClient';
import { requireUser } from '@/lib/requestUser';

export default async function DashboardPage() {
    const supabase = createClient();
    const user = requireUser();

    const {data: createdAgreements, error: createdError} = await supabase
        .from('agreements')
        .select(`
            id,
            title,
            created_at,
            created_by,
            content,
            agreement_participants(user_id, status)
        `)
        .eq('created_by', user.id)
        .order('created_at', {ascending: false});
    
    const {data: receivedAgreements, error} = await supabase
        .from('agreements')
        .select(`
            id,
            title,
            created_at,
            created_by,
            content,
            agreement_participants(user_id, status)
        `)
        .neq('created_by', user.id)
        .eq('agreement_participants.user_id', user.id)
        .order('created_at', {ascending: false});

        if (error){
            console.error("Error fetching agreements:", error);
        }

        

        const allAgreements= [...(createdAgreements || []), ...(receivedAgreements || [])]
    
    return <DashboardClient agreements={allAgreements || []} userId={user.id} />
}