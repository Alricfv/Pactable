'use client'

import { createClient } from '@/lib/supabaseClient'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Template, TemplateSection } from './page.tsx'
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2, PlusCircle, Download } from 'lucide-react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'




export default function CreateAgreementPage({templates}: {templates: Template[]}){
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

    if (!selectedTemplate) {
        return(
            <div className="max-w-5xl mx-auto px-2 py-32">
                <h1 className="text-5xl font-bold text-white text-center">
                    Choose a Template
                </h1>
                <p className="mt-2 mb-12 text-gray-400 text-center">
                    Select a base template for your agreement!
                </p>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
    const [pdfUrl, setPdfUrl] = useState<string>('')
    const [signatureName, setSignatureName] = useState('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [logoPosition, setLogoPosition] = useState<'top-left' | 'top-right' | 'above-title'>('top-right');
    const fileInputRef = useRef<HTMLInputElement>(null);
    

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const objectUrl = URL.createObjectURL(file);
            setLogoUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    };

    const handleLogoClick = () => {
        fileInputRef.current?.click();
    };

    const removeLogo = () => {
        setLogoFile(null);
        setLogoUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        const generatePdf = async () => {
            const pdfDoc = await PDFDocument.create()
            let page = pdfDoc.addPage()
            const { width, height } = page.getSize()
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
            const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
            const margin = 50;
            const contentWidth = width - (2 * margin);
            let y = height - margin;

            if (logoUrl){
                try{
                    const logoBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
                    let logoImage;

                    if (logoFile?.type.includes('png')){
                        logoImage = await pdfDoc.embedPng(logoBytes);
                    }

                    else {
                        logoImage = await pdfDoc.embedJpg(logoBytes);
                    }

                    const logoWidth = 100;
                    const logoHeight = logoWidth / (logoImage.width / logoImage.height);

                    let logoX, logoY;
                    switch (logoPosition){
                        case 'top-left':
                            logoX = margin;
                            logoY = height - margin - logoHeight;
                            break;
                        case 'top-right':
                            logoX = width - margin - logoWidth;
                            logoY = height - margin - logoHeight;
                            break;
                        case 'above-title':
                            logoX = (width - logoWidth) / 2;
                            logoY = height - margin - logoHeight;
                            y = logoY - 30; // adjust y position for title
                            break;
                    }

                    page.drawImage(logoImage, {
                        x: logoX,
                        y: logoY,
                        width: logoWidth,
                        height: logoHeight
                    });
                } catch (err){
                    console.error('Error embedding logo:', err);
                }
            }

            const maxTitleWidth = width - 2 * margin;
            const titleLines = wrapText(title, boldFont, 30, maxTitleWidth);
            for (const line of titleLines){
                const lineWidth = boldFont.widthOfTextAtSize(line, 30);
                const centerX = (width - lineWidth) / 2;
                page.drawText(line, {x: centerX, y, font: boldFont, size: 30, color: rgb(0,0,0) });
                y -= 40;
            }

            for (const section of sections){
                if (y<100){
                    page = pdfDoc.addPage();
                    y = height - margin
                }
                
                page.drawText(section.title, { x:50, y, font: boldFont, size: 16, color: rgb(0, 0, 0)})

                const titleWidth = boldFont.widthOfTextAtSize(section.title, 16);
                const underlineY = y - 3;
                page.drawLine({
                    start: { x: 50, y: underlineY },
                    end: { x: 50 + titleWidth, y: underlineY },
                    thickness: 1,
                    color: rgb(0,0,0)
                })

                y -= 25

                for (const term of section.terms){
                    const fullTerm= `• ${term}`
                    const wrappedLines = wrapText(fullTerm, font, 11, contentWidth - 10);

                    for (const line of wrappedLines){
                        if(y < margin){
                            page = pdfDoc.addPage();
                            y = height - margin;
                        }
                    
                    page.drawText(line, { x: margin + (line.startsWith('•') ? 0 : 8), y, font, size: 11, color: rgb(0, 0, 0)});
                    y -= 20
                    }

            
            }
            y -= 10;
            }

            const pdfBytes = await pdfDoc.save()
            //ok dunno why typescript is so stubborn on this 
            const blob = new Blob ([pdfBytes as unknown as BlobPart], { type: 'application/pdf'})
            const url = URL.createObjectURL(blob)
            setPdfUrl(`${url}#toolbar=0`)

            return () => URL.revokeObjectURL(url)
        }
        generatePdf().catch(console.error);
    }, [title, sections, logoUrl, logoPosition]);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over } = event
        if (over && active.id !== over.id){
            setSections((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    };

    const handleUpdateSection = (id: string, newTitle: string, newTerms: string[]) => {
        setSections(sections.map(s => s.id === id ? {...s, title: newTitle, terms: newTerms } : s))
    };

    const handleAddSection = () => {
        const newId = `custom-${Date.now()}`
        setSections([...sections, { id: newId, originalId: newId, title: 'New Section', terms: ['Add your terms.']}])
    };

    const handleDeleteSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id))
    };

    const handleParticipantChange= (index: number, value: string) => {
        const newParticipants= [...participants]
        newParticipants[index] = value
        setParticipants(newParticipants)
    };

    const addParticipant = () => {
        setParticipants([...participants, '']);
    };

    const removeParticipant = (index: number) => {
        if (participants.length > 1) {
            setParticipants(participants.filter((_, i) => i !== index))
        }
    };

    const handleCreateAgreement = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const {data: {user}} = await supabase.auth.getUser();

        if(!user){
            setError("Your session has expired, please login again.")
            setLoading(false);
            setTimeout(() => router.push('/signin'), 2000)
            return;
        };

        const finalContent=sections.map(section =>
            `### ${section.title}\n\n${section.terms.map(term => `- ${term}`).join('\n')}`
        ).join(`\n\n\n`)

        const creatorEmail = user.email;
        const otherParticipantEmails = participants.filter(email => email.trim() !== '');

        const allParticipantEmails = [...new Set([creatorEmail, ...otherParticipantEmails])];

        const { data, error: rpcError } = await supabase.rpc('create_agreement_with_participants', {
            agreement_title: title,
            agreement_content: finalContent,
            participant_emails: allParticipantEmails
        });

        if (rpcError){
            setError(`Failed to create agreement: ${rpcError.message}`)
            console.error(rpcError)
        }
        
        else{
            console.log('Another successful agreement! ID:', data)
            router.push('/dashboard')
        }
        setLoading(false)
    }
    return(
        <div className= "flex flex-col lg:flex-row gap-8 p-4">
            <div className="w-full lg:w-1/2 py-32 px-16">
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
                            sensors={sensors} 
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
                           <PlusCircle size={16}/> Add New Section
                        </button>
                    </div>
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">
                            Company Logo (Optional)
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleLogoChange}
                            accept="image/png,image/jpeg,image/jpg"
                            className="hidden"
                        />
                        
                        {logoUrl ? (
                            <div className="relative w-40 h-24 mb-4 bg-white rounded-md p-2 flex items-center justify-center">
                                <img 
                                    src={logoUrl} 
                                    alt="Company Logo" 
                                    className="max-w-full max-h-full object-contain" 
                                />
                                <button 
                                    type="button"
                                    onClick={removeLogo}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <button
                            type="button"
                            onClick={handleLogoClick}
                            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#262626] text-gray-300 px-4 py-2 rounded-md hover:border-gray-500"
                            >
                            <PlusCircle size={16} />
                            Upload Logo
                            </button>
                        )}
                        
                        {logoUrl && (
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Logo Position
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                    type="button"
                                    onClick={() => setLogoPosition('top-left')}
                                    className={`p-2 border rounded-md ${logoPosition === 'top-left' ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-700'}`}
                                    >
                                    Top Left
                                    </button>
                                    <button
                                    type="button"
                                    onClick={() => setLogoPosition('top-right')}
                                    className={`p-2 border rounded-md ${logoPosition === 'top-right' ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-700'}`}
                                    >
                                    Top Right
                                    </button>
                                    <button
                                    type="button"
                                    onClick={() => setLogoPosition('above-title')}
                                    className={`p-2 border rounded-md ${logoPosition === 'above-title' ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-700'}`}
                                    >
                                    Above Title
                                    </button>
                                </div>
                            </div>
                        )}
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
                                <div key={index} className="flex items-center gap-2">    
                                    <input
                                        key={index}
                                        type="email"
                                        placeholder={`participant-${index + 1}@example.com`}
                                        value={email}
                                        onChange={(e) => handleParticipantChange(index, e.target.value)}
                                        className="block w-full bg-[#000000] rounded-md border-[#262626] border p-2 text-white"
                                        required
                                    />
                                    {participants.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeParticipant(index)} 
                                            className=" w-9 h-9 flex items-center text-gray-950 justify-center rounded-md bg-red-500 hover:bg-red-600"
                                        >
                                            <Trash2 size={16}  />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addParticipant} className="mt-2 text-sm text-indigo-400 hover:underline">
                            + Add another participant
                        </button>
                    </div>
                    <div className="space-y-3">
                        <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-4 py-3 font-semibold hover:bg-indigo-600 disabled:bg-indigo-400" disabled={loading}>
                            {loading ? 'Creating...' :'Create and Send Agreement'}
                        </button>
                        <a
                            href={pdfUrl}
                            download={`${title.replace(/\s/g, '_')}.pdf`}
                            className="w-full flex items-center justify-center gap-2 bg-gray-600 text-white rounded-md px-4 py-3 font-semibold hover:bg-gray-500"
                        >
                            <Download size={16}/>Download PDF
                        </a>
                    </div>
                    {error && <p className="text-red-500 text-center  mt-2">{error}</p>}
                </form>
            </div>
            <div className="w-full lg:w-5/12 h-[85vh] sticky top-24 pt-16">
                {pdfUrl ? (
                    <div className="w-full h-full bg-[#0f0f0f] rounded-lg border border-[#262626] p-2">
                        <iframe 
                            src={`${pdfUrl}#zoom=fit&view=FitH`} 
                            width="100%" 
                            height="100%" 
                            style={{
                                border: 'none', 
                                borderRadius: '6px',
                            }} 
                            title="Agreement PDF Preview" 
                        />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#0f0f0f] rounded-lg border border-[#262626] mt-32">
                        <p className="text-gray-400">Updating the PDF</p>
                    </div>
                )}
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
    <div 
        ref={setNodeRef} 
        style={style} 
        className="relative flex items-start gap-3 p-4 bg-[#0f0f0f] rounded-lg border border-[#262626] transition hover:scale-[1.02] hover:shadow-[0_0_16px_2px_rgba(255,255,255,0.32)]"
    >
        
        <div className="flex items-start gap-3">
            <button 
                type="button" {...attributes} {...listeners} 
                className="cursor-grab text-gray-500 hover:text-white pt-1 mr-2"
                style={{ zIndex: 1}}
            >
                <GripVertical size={20} />
            </button>
            <div className="flex-grow pr-32">
                <h3 className="font-semibold text-white">{section.title}</h3>
                <div>
                    {section.terms.map((term: string, idx: number) => (
                        <p key={idx} className="text-sm text-gray-400">• {term}</p>
                    ))}
                </div>
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <button 
                    type="button" 
                    onClick={() => setIsEditing(true)} 
                    className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-700 text-gray-50 hover:text-white"
                >
                    <span>Edit</span> <Pencil size={16} />
                </button>
                <button 
                    type="button" 
                    onClick={() => onDelete(section.id)} 
                    className="w-7 h-7 flex items-center text-gray-950 justify-center rounded-md bg-red-200 hover:bg-red-600"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    </div>
  )
}

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
    const words = text.split(' ');
    let line = '';
    const lines: string[] = [];

    for (const word of words){
        const testLine = line + word + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && line.length > 0) {
            lines.push(line.trim());
            line = word + ' ';
        }
        else{
            line = testLine;
        }
    }
    if (line.length > 0){
        lines.push(line.trim());
    }
    return lines;
}