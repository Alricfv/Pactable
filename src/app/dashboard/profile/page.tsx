import { createClient } from '@/lib/supabaseServer'
import ProfileForm from './ProfileForm'

export default async function ProfilePage(){
    const supabase = createClient();
    
    // Get the actual User object from Supabase instead of using requireUser()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
        // Redirect to signin if no user
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-gray-400 mt-2">Please log in to view your profile.</p>
                <a href="/signin" className="mt-4 inline-block text-indigo-400 hover:underline">
                    Go to Sign In
                </a>
            </div>
        )
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('username, email, avatar_url')
        .eq('id', user.id)
        .single()
    
    return <ProfileForm user={user} profile={profile} />
}