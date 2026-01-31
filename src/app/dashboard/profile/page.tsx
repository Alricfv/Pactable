import { createClient } from '@/lib/supabaseServer'
import ProfileForm from './ProfileForm'
import { requireUser } from '@/lib/requestUser'

export default async function ProfilePage(){
    const supabase = createClient();
    const user = requireUser()

    const { data: profile } = await supabase
        .from('profiles')
        .select('username, email, avatar_url')
        .eq('id', user.id)
        .single()
    
    return <ProfileForm user={user} profile={profile} />
}