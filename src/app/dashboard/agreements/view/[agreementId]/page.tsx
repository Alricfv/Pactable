import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import ViewAgreementClient from '../ViewAgreementClient';
import type { Participant } from '../ViewAgreementClient';

export default async function ViewAgreementPage({ params } : { params: { agreementId : string} }){
    const supabase = createClient();
    const { data: {user} } = await supabase.auth.getUser();

    if (!user){
        redirect('/signin');
    }

    const { data: agreement, error } = await supabase
        .from('agreements')
        .select(`
            *,
            agreement_participants(
                *,
                profiles (
                    username,
                    avatar_url,
                    email
                )
            ) 
        `)
        .eq('id', params.agreementId)
        .single();

    if( error || !agreement){
        return(
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold">
                    Agreement Not Found
                </h1>
                <p>
                    The agreement you are looking for doesn&apos;t exist or has been deleted.
                </p>
                <a 
                    href="/dashboard" 
                    className="mt-4 inline-block text-indigo-400 text-underline hover:text-indigo-300"
                >
                    &larr; Go back to the Dashboard
                </a>
            </div>
        );
    }

    const isUserParticipant = agreement.agreement_participants.some((p: Participant) => p.user_id === user.id);

    if (!isUserParticipant){
        return(
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold text-red-500"> 
                    Access Denied
                </h1>
                <p className="text-gray-400 mt-2">
                    You don&apos;t have permission to view this agreement.
                </p>
                <a 
                    href="/dashboard" 
                    className="mt-4 inline-block text-indigo-400 text-underline hover:text-indigo-300"
                >
                    &larr; Go back to the Dashboard
                </a>
            </div>
        )
    }

    return <ViewAgreementClient agreement={agreement} userId={user.id} />;
}