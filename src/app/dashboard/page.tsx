import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const supabase = createClient();
    const {data: {user}} = await supabase.auth.getUser();

    if(!user){
        redirect('/signin');
    }

    const {data: agreements, error} = await supabase
        .from('agreements')
        .select(`
            id,
            title,
            created_at,
            agreement_participants!inner(*)
        `)
        .eq('agreement_participants.user_id', user.id)
        .order('created_at', {ascending: false});
    
    if (error){
        console.error("Error fetching agreements:", error);
    }
    
    return <DashboardClient agreements={agreements || []} />
}