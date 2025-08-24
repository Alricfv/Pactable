'use client'

import { createClient } from '@/lib/supabaseClient'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateAgreementPage(){
    const supabase = createClient()
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [participants, setParticipants] = useState([''])
    const [error, setError] = useState<string | null>(null)

    const handleCreateAgreement = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log ({ title, content, participants })
    }

    return(
        <div>
            <h1 className="text-3xl font-bold text-white-50">New Agreement</h1>
            <form onSubmit={handleCreateAgreement} className="mt-6 space-y-4 max-w-2xl">
                <div>
                    <label htmlFor="title">

                    </label>

                </div>
            </form>
            
        </div>
    )
}
