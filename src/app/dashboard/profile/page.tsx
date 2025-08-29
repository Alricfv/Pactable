import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function ProfilePage(){
    const cookieStore = cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string){
                    return cookieStore.get(name)?.value
                }
            }
        }
    )

    const {
        data: {session},
    } = await supabase.auth.getSession()

    if (!session) {
        redirect('/signin')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('username, email, avatar_url')
        .eq('id', session.user.id)
        .single()
    
    return <ProfileForm session={session} profile={profile} />
}