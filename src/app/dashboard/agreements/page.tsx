'use client'

import { createClient } from '@/lib/supabaseClient'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import templates from '@/lib/templates.json'

type TemplateSection = {
    id: string;
    title: string;
    terms: string[];
};

type Template= {
    id: string;
    title: string;
    description: string;
    sections: TemplateSection[];
};

export default function CreateAgreementPage(){
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

    const handleSelectTemplate = (template: Template) => {
        setSelectedTemplate(template)
    }

    if (!selectedTemplate) {
        return(
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Choose a Template
                </h1>
                <p className="mt-2 text-gray-400">
                    Select a base template for your agreement!
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) =>(
                        <button
                            key={template.id}
                            onClick={() => handleSelectTemplate(template)}
                            className="block p-6 bg-[#0f0f0f] rounded-lg border border-[#262626] hover:border-indigo-500 text-left transition"
                        >
                            <h2 className="text-xl font-semibold text-white">
                                {template.title}
                            </h2>
                            <p className="mt-2 text-sm text-gray-400">
                                {template.description}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return <AgreementForm template={selectedTemplate} onBack={() => setSelectedTemplate(null)} />    
}

function AgreementForm({template, onBack}: {template: Template; onBack: () => void}) {

    const formatContentFromTemplate = (sections: TemplateSection[]) => {
        return sections.map(section =>
            `### ${section.title}\n\n${section.terms.map(term => `- ${term}`).join('\n')}`
        ).join ('\n\n\n');
    }

    const supabase = createClient()
    const router = useRouter()
    const [title, setTitle] = useState(template.title)
    const [content, setContent] = useState(formatContentFromTemplate(template.sections))
    const [participants, setParticipants] = useState([''])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleParticipantChange= (index: number, value: string) => {
        const newParticipants= [...participants]
        newParticipants[index] = value
        setParticipants(newParticipants)
    }

    const addParticipant = () => {
        setParticipants([...participants, '']);
    }

    const handleCreateAgreement = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const validParticipants = participants.filter(email => email.trim() !== '')

        const { data, error: rpcError } = await supabase.rpc('create_agreement_with_participants', {
            agreement_title: title,
            agreement_content: content,
            participant_emails: validParticipants
        })

        if (rpcError){
            setError(`Failed to create agreement: ${rpcError.message}`)
            console.error(rpcError)
        }
        
        else{
            console.log('Another successful agreement! ID:', data)
            router.push('/dashboard/agreements')
        }
        setLoading(false)
    }

    return(
        <div className= "p-6 rounded-lg border border-[#262626] bg-[#0f0f0f]">
            <button onClick={onBack} className="text-indigo-400 hover:underline mb-4">
                &larr; Back to templates
            </button>
            <h1 className="text-3xl font-bold text-white">
                Create Agreement
            </h1>
            <form onSubmit={handleCreateAgreement} className="mt-6 space-y-6 max-w-3xl">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full bg-[#000000] rounded-md border-[#262626] border p-2 text-white"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-300">
                        Agreement Terms
                    </label>
                    <textarea
                        id="content"
                        rows={12}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 block w-full bg-[#000000] rounded-md border-[#262626] border p-2 text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">
                        Participants
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                        Add the email addresses of all agreement participants. They must have an account!
                    </p>
                    <div className="space-y-2">
                        {participants.map((email, index) =>(
                            <input
                                key={index}
                                type="email"
                                placeholder={`participant-${index + 1}@example.com`}
                                value={email}
                                onChange={(e) => handleParticipantChange(index, e.target.value)}
                                className="block w-full bg-[#000000] rounded-md border-[#262626] border p-2 text-white"
                                required
                            />
                        ))}
                    </div>
                    <button type="button" onClick={addParticipant} className="mt-2 text-sm text-indigo-400 hover:underline">
                        + Add another participant
                    </button>
                </div>
                <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-4 py-3 font-semibold hover:bg-indigo-600 disabled:bg-indigo-400" disabled={loading}>
                    {loading ? 'Creating...' :'Create and Send Agreement'}
                </button>
                {error && <p className="text-red-500 text-center  mt-2">{error}</p>}
            </form>
        </div>
    )
}
