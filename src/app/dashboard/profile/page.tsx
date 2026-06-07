'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionContext } from '@/contexts/SessionContext'
import { useProfile, type Profile } from '@/hooks/useProfile'
import ProfileForm from './ProfileForm'

// Check if we have a cached session in localStorage
function hasCachedSession(): boolean {
    if (typeof window === 'undefined') return false
    try {
        const cached = localStorage.getItem('pactable_session_cache')
        if (!cached) return false
        const { session, timestamp } = JSON.parse(cached)
        return session && (Date.now() - timestamp < 60 * 60 * 1000)
    } catch {
        return false
    }
}

export default function ProfilePage() {
    const { user, loading: authLoading } = useSessionContext()
    const router = useRouter()
    const { data: profile, isLoading: profileLoading } = useProfile(user?.id)

    useEffect(() => {
        if (!authLoading && !user && !hasCachedSession()) {
            router.replace('/signin')
        }
    }, [user, authLoading, router])

    if (authLoading || profileLoading || (!user && hasCachedSession())) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return <ProfileForm user={{ id: user.id, email: user.email || '' }} profile={profile ?? null} />
}