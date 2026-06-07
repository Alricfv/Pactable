'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSessionContext } from '@/contexts/SessionContext'
import DashboardClient from './DashboardClient'

// Check if we have a cached session in localStorage
function hasCachedSession(): boolean {
    if (typeof window === 'undefined') return false
    try {
        const cached = localStorage.getItem('pactable_session_cache')
        if (!cached) return false
        const { session, timestamp } = JSON.parse(cached)
        // Check if cache is less than 1 hour old and has a session
        return session && (Date.now() - timestamp < 60 * 60 * 1000)
    } catch {
        return false
    }
}

export default function DashboardPage() {
    const { user, loading } = useSessionContext()
    const router = useRouter()
    const [hasCheckedCache, setHasCheckedCache] = useState(false)

    useEffect(() => {
        // Only redirect if:
        // 1. Loading is complete
        // 2. No user in context
        // 3. No cached session in localStorage (double-check)
        if (!loading && !user) {
            // Double-check localStorage before redirecting
            if (!hasCachedSession()) {
                router.replace('/signin')
            } else {
                // We have a cached session but context lost it - wait a bit
                // The session context should pick it up
                setHasCheckedCache(true)
            }
        }
    }, [user, loading, router])

    // Show loading while session is being resolved
    if (loading || (!user && hasCachedSession())) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!user) {
        return null // Will redirect
    }

    // Don't pass initialAgreements - let the hook fetch from cache or API
    return <DashboardClient userId={user.id} />
}