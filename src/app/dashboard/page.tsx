import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

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
            status,
            agreement_participants!inner(user_id)
        `)
        .eq('agreement_participants.user_id', user.id)
        .order('created_at', {ascending: false});
    
    if (error){
        console.error("Error fetching agreements:", error);
    }
    return(
        <div>
            <h1 className="text-5xl font-bold text-white text-center">
                Welcome to your Dashboard!
            </h1>
            <p className="mt-2 text-gray-300 text-center">
                Let's agree on stuff shall we?
            </p>
        </div>
    )
}