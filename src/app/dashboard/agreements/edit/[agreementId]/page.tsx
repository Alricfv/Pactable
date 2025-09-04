import { createClient } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';
import EditAgreementClient from './EditAgreementClient';

export default async function EditAgreementPage({ params } : { params: { agreementId : string}}){
    const supabase = createClient();
    const { data: {user} } = await supabase.auth.getUser();

    if (!user){
        redirect('/signin');
    }

    const {data: agreement, error } = await supabase
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

    if (error || !agreement){
        return(
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold">
                    Agreement Not Found
                </h1>
                <p className="text-gray-400 mt-2">
                    The agreement you are looking for doesn't exist or has been deleted.
                </p>
                <a
                    href="/dashboard"
                    className="mt-4 inline-block text-indigo-400 hover:underline"
                >
                    &larr; Go back to the Dashboard
                </a>
            </div>
        );
    }

    if (agreement.created_by !== user.id){
        return(
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold text-red-500">
                    Access Denied
                </h1>
                <p className="text-gray-400 mt-2">
                    You don't have permission to edit this agreement.
                </p>
                <a
                    href="/dashboard"
                    className="mt-4 inline-block text-indigo-400 hover:underline"
                >
                    &larr; Go back to the Dashboard
                </a>
            </div>
        );
    }

    return <EditAgreementClient agreement={agreement} userId={user.id}/>;
}