'use client'

import { createClient } from '@/lib/supabaseClient'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import templates from '@/lib/templates.json'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2, PlusCircle } from 'lucide-react'

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
                            onClick={() => setSelectedTemplate(template)}
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

    const supabase = createClient()
    const router = useRouter()
    const [title, setTitle] = useState(template.title)
    const [sections, setSections] = useState(template.sections.map(s => ({...s, originalId: s.id})))
    const [participants, setParticipants] = useState([''])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over } = event
        if (over && active.id !== over.id){
            setSections((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const handleUpdateSection = (id: string, newTitle: string, newTerms: string[]) => {
        setSections(sections.map(s => s.id === id ? {...s, title: newTitle, terms: newTerms } : s))
    }

    const handleAddSection = () => {
        const newId = `custom-${Date.now()}`
        setSections([...sections, { id: newId, originalId: newId, title: 'New Section', terms: ['Add your terms.']}])
    }

    const handleDeleteSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id))
    }

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

        const { data: {session}} = await supabase.auth.getSession();
        if(!session){
            setError("Your session has expired, please login again.")
            setLoading(false);
            setTimeout(() => router.push('/signin'), 2000)
            return;
        }

        const finalContent=sections.map(section =>
            `### ${section.title}\n\n${section.terms.map(term => `- ${term}`).join('\n')}`
        ).join(`\n\n\n`)

        const validParticipants = participants.filter(email => email.trim() !== '')

        const { data, error: rpcError } = await supabase.rpc('create_agreement_with_participants', {
            agreement_title: title,
            agreement_content: finalContent,
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
        <div className= "flex flex-col lg:flex-row gap-8 p-4">
            <div className="w-full lg:w-1/2">
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
                        <h2 className= "text-lg font-medium text-gray-200 mb-2">
                            Agreement Sections
                        </h2>
                        <DndContext
                            sensors={[]} 
                            collisionDetection={closestCenter} 
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sections}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {sections.map((section) => (
                                        <SortableSection
                                            key={section.id}
                                            section={section}
                                            onUpdate={handleUpdateSection}
                                            onDelete={handleDeleteSection}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                        <button 
                        type="button" 
                        onClick={handleAddSection} 
                        className="mt-4 flex items-center gap-2 text-indigo-400 hover:underline"
                        >
                            Add New Section
                        </button>
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
        </div>
    
    )
}
function SortableSection({ section, onUpdate, onDelete }: { section: any, onUpdate: Function, onDelete: Function }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(section.title)
  const [editedTerms, setEditedTerms] = useState(section.terms.join('\n'))

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const handleSave = () => {
    onUpdate(section.id, editedTitle, editedTerms.split('\n').filter((t:string) => t.trim() !== ''))
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="p-4 bg-[#1a1a1a] rounded-lg border border-indigo-500 space-y-3">
        <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="w-full bg-[#000000] rounded-md p-2 text-white font-semibold" />
        <textarea value={editedTerms} onChange={(e) => setEditedTerms(e.target.value)} rows={5} className="w-full bg-[#000000] rounded-md p-2 text-white text-sm" />
        <div className="flex gap-2">
          <button type="button" onClick={handleSave} className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm">Save</button>
          <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm">Cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-3 p-4 bg-[#0f0f0f] rounded-lg border border-[#262626]">
      <button type="button" {...attributes} {...listeners} className="cursor-grab text-gray-500 hover:text-white pt-1">
        <GripVertical size={20} />
      </button>
      <div className="flex-grow">
        <h3 className="font-semibold text-white">{section.title}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{section.terms.join(' ')}</p>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white"><Pencil size={16} /></button>
        <button type="button" onClick={() => onDelete(section.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
      </div>
    </div>
  )
}

