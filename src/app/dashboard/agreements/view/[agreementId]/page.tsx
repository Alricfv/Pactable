'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionContext } from '@/contexts/SessionContext'
import { createClient } from '@/lib/supabaseClient'
import ViewAgreementClient from '../ViewAgreementClient'
import type { Participant } from '../ViewAgreementClient'

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

export default function ViewAgreementPage({ params }: { params: { agreementId: string } }) {
    const { user, loading: authLoading } = useSessionContext()
    const router = useRouter()
    const [agreement, setAgreement] = useState<any>(null)
    const [creatorProfile, setCreatorProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!authLoading && !user && !hasCachedSession()) {
            router.replace('/signin')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        if (!user) return

        const fetchAgreement = async () => {
            const supabase = createClient()
            const { data, error: fetchError } = await supabase
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
                .single()

            if (fetchError || !data) {
                setError('not_found')
                setLoading(false)
                return
            }

            const isUserParticipant = data.agreement_participants.some(
                (p: Participant) => p.user_id === user.id
            )

            if (!isUserParticipant) {
                setError('access_denied')
                setLoading(false)
                return
            }

            // Fetch creator profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('username, email, avatar_url')
                .eq('id', data.created_by)
                .single()

            setAgreement(data)
            setCreatorProfile(profile)
            setLoading(false)
        }

        fetchAgreement()
    }, [user, params.agreementId])

    if (authLoading || loading || (!user && hasCachedSession())) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!user) return null

    if (error === 'not_found') {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold">Agreement Not Found</h1>
                <p className="text-gray-400 mt-2">
                    The agreement you are looking for doesn&apos;t exist or has been deleted.
                </p>
                <a href="/dashboard" className="mt-4 inline-block text-indigo-400 hover:underline">
                    &larr; Go back to the Dashboard
                </a>
            </div>
        )
    }

    if (error === 'access_denied') {
        return (
            <div className="text-center p-10">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p className="text-gray-400 mt-2">
                    You don&apos;t have permission to view this agreement.
                </p>
                <a href="/dashboard" className="mt-4 inline-block text-indigo-400 hover:underline">
                    &larr; Go back to the Dashboard
                </a>
            </div>
        )
    }

    return <ViewAgreementClient agreement={agreement} userId={user.id} creatorProfile={creatorProfile} />
}