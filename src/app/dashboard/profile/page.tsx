import { createClient } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function ProfilePage(){
    const supabase = createClient();

    const {data: {user}} = await supabase.auth.getUser()

    if (!user) {
        redirect('/signin')
    }

    const {data: {session}} = await supabase.auth.getSession()

    const { data: profile } = await supabase
        .from('profiles')
        .select('username, email, avatar_url')
        .eq('id', user.id)
        .single()
    
    return <ProfileForm session={session!} profile={profile} />
}