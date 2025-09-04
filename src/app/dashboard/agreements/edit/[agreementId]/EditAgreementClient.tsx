'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Trash2, PlusCircle, AlertTriangle } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

type Profile = {
    username: string | null;
    avatar_url: string | null;
    email: string | null;
};

type Participant = {
    user_id: string;
    status: 'pending' | 'signed';
    profiles: Profile | null;
};

type Agreement = {
    id: string;
    title: string;
    content: string | null;
    created_at: string;
    created_by: string;
    agreement_participants: Participant[];
};

type Section = {
    id: string;
    originalId?: string;
    title: string;
    terms: string[];
};

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
    const words = text.split (' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++){
        const word = words[i];
        const width = font.widthOfTextAtSize(`${currentLine} ${word}`, fontSize);
        if (width < maxWidth) {
            currentLine += ` ${word}`;
        }
        else{
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}


export default function EditAgreementClient({ agreement, userId }: { agreement: Agreement; userId: string}){
    const supabase = createClient();
    const router = useRouter();
    const [title, setTitle] = useState(agreement.title);
    const [sections, setSections] = useState<Section[]>([]);
    const [participants, setParticipants] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

    useEffect(() => {
        if (agreement.content) {
            const parsedSections = agreement.content.split('\n\n\n').map((sectionStr, index) =>{
                const lines = sectionStr.split('\n');
                const title = lines.find(l => l.startsWith('### '))?.substring(4) || `Section ${index + 1}`;
                const terms = lines.filter(l => l.startsWith('- ')).map(l => l.substring(2));
                return {
                    id: `section-${Date.now()}-${index}`,
                    title,
                    terms
                };
            });
            setSections(parsedSections);
        }

        const participantEmails = agreement.agreement_participants
            .filter(p => p.profiles?.email)
            .map(p => p.profiles?.email || '');

        setParticipants(participantEmails);
    }, [agreement]);

    /*
    note for the code below, i gotta verify if these are the same settings as
    as the ones declared for the pdf creation file, priority is low tho lets
    get the mvp running
    */

    useEffect(() => {
        const generatePdf = async() => {
            const pdfDoc = await PDFDocument.create();
            let page = pdfDoc.addPage();
            const {width, height} = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const margin = 50;
            const contentWidth = width - (2 * margin);
            let y = height - margin;

            page.drawText(title, { x:50, y, font: boldFont, size: 24, color: rgb(0,0,0) });
            y -= 40;

            for (const section of sections) {
                if (y < 100) {
                    page = pdfDoc.addPage();
                    y = height - margin;
                }

                page.drawText(section.title, {x: 50, y, font: boldFont, size: 16, color: rgb(0,0,0) });
                y -= 25;

                for (const term of section.terms){
                    const fullTerm = `• ${term}`;
                    const wrappedLines = wrapText(fullTerm, font, 11, contentWidth - 10);
                    for (const line of wrappedLines){
                        if (y < margin) {
                            page = pdfDoc.addPage();
                            y = height - margin;
                        }
                        page.drawText(line, {x: margin + (line.startsWith('•') ? 0 : 8), y, font, size: 11, color: rgb(0,0,0) });
                        y -= 20;
                    }
                }
                y -= 10;
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob ([pdfBytes as unknown as BlobPart], { type: 'application/pdf'})
            const url = URL.createObjectURL(blob);
            setPdfUrl(`${url}#toolbar=0`);

            return () => URL.revokeObjectURL(url);
        };

        if (sections.length > 0) {
            generatePdf().catch(console.error);
        }
    }, [title, sections]);

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over } = event
        if (over && active.id !== over.id){
            setSections((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id)
                const newIndex = items.findIndex((item) => item.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            });
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

    const handleUpdateAgreement = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!userId){
            setError("Session error, Login again!");
            setLoading(false);
            return;
        }

        const finalContent = sections.map(section =>
            `### ${section.title}\n${section.terms.map(term => `- ${term}`).join('\n')}`
        ).join(`\n\n\n`);

        const validParticipants = participants.filter(email => email.trim() !== '');

        try {
            const {error: updateError} = await supabase
                .from('agreements')
                .update({title, content: finalContent})
                .eq('id', agreement.id);

            if (updateError) throw new Error(updateError.message);

            const {error: resetError} = await supabase
                .from('agreement_participants')
                .update({status: 'pending'})
                .eq('agreement_id', agreement.id);

            if (resetError) throw new Error(resetError.message)

            const currentParticipantEmails = agreement.agreement_participants
                .filter(p => p.profiles?.email)
                .map(p => p.profiles?.email || '');

            const emailsToRemove = currentParticipantEmails.filter(
                email => !validParticipants.includes(email)
            );

            if (emailsToRemove.length > 0) {
                for (const email of emailsToRemove) {
                    const profileQuery = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('email', email)
                        .single();

                    if (profileQuery.data){
                        await supabase
                            .from('agreement_participants')
                            .delete()
                            .eq('agreement_id', agreement.id)
                            .eq('user_id', profileQuery.data.id);
                    }
                }
            }

            const newEmails = validParticipants.filter(
                email => !currentParticipantEmails.includes(email)
            );

            if (newEmails.length > 0) {
                const {error: addParticipantsError} = await supabase.rpc('add_participants_to_agreement', {
                    p_agreement_id: agreement.id,
                    participant_emails: newEmails
                });

                if (addParticipantsError) throw new Error(addParticipantsError.message);
            }

            router.push(`/dashboard/agreements/view/${agreement.id}`);
            router.refresh();
        }
        catch(err: any){
            setError(`Failed to update agreement: ${err.message}`);
        }
        finally {
            setLoading(false);
        }
    };

    return(
        <div className="flex flex-col lg:flex-row gap-8 p-4">
            <div className="w-full lg:w-1/2">
                <a
                    href={`/dashboard/agreements/view/${agreement.id}`} 
                    className="text-white hover:underline mb-4 inline-block"
                >
                    &larr; Back to Agreements
                </a>
                <h1 className="text-3xl font-bold text-white">
                    Edit Agreement
                </h1>
                <div className="bg-amber-900/20 border border-amber-500 rounded-lg p-4 mt-4 mb-6">
                    <div className="flex items-center gap-2 text-amber-400">
                        <AlertTriangle size={20}/>
                        <p className="font-semibold">
                            Warning
                        </p>
                    </div>
                    <p className="text-sm text-amber-200 mt-1">
                        Editing this agreement will reset all the signature statuses of the participants to &quot;pending&quot;. Ask them to sign again!
                    </p>
                </div>

                <form onSubmit={handleUpdateAgreement} className="mt-6 space-y-6 max-w-3xl">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                            Agreement Title
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
                        <h2 className="text-lg font-medium text-gray-200 mb-2">
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
                            className="mt-4 flex items-center gap-2 text-white hover:underline"
                        >
                            <PlusCircle size={16}/> Add Section
                        </button>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">
                            Participants
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                            Add the participants&apos; email addresses, They must have an account!
                        </p>
                        <div className="space-y-2">
                            {participants.map((email, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input
                                        type="email"
                                        placeholder={`participant-${index + 1}@example.com`}
                                        value={email}
                                        onChange={(e) => handleParticipantChange(index, e.target.value)}
                                        className="block-w-full bg-[#000000] rounded-md border-[#262626] border p-2 text-white"
                                        required
                                    />
                                    {participants.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeParticipant(index)}
                                            className="w-9 h-9 flex items-center text-gray-950 justify-center rounded-md bg-red-500 hover:bg-red-600"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addParticipant}
                            className="mt-2 flex items-center text-lg text-white hover:underline"
                        >
                            <PlusCircle size={18}/><p className="ml-2">Add Participant</p>
                        </button>
                    </div>
                    <div className="space-y-3">
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-md px-4 py-3 font-semibold disabled:bg-indigo-400"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Agreement'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                </form>
            </div>
            <div className="w-full lg:w-1/2 h-[85vh] sticky top-24">
                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        width="100%"
                        height="100%"
                        style={{border: 'none', borderRadius: '8px'}} 
                        title="Agreement PDF Preview"
                    />
                ):(
                    <div className="w-full h-full flex items-center justify-center bg-[#0f0f0f] rounded-lg border border-[#262626]">
                        <p className="text-gray-500">
                            Updating the PDF...
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

function SortableSection({ section, onUpdate, onDelete }: { section: Section, onUpdate: Function, onDelete: Function }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(section.title);
    const [editedTerms, setEditedTerms] = useState(section.terms.join('\n'));

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const handleSave = () => {
        onUpdate(section.id, editedTitle, editedTerms.split('\n').filter((t: string) => t.trim() !== ''));
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div ref={setNodeRef} style={style} className="p-4 bg-[#1a1a1a] rounded-lg border border-indigo-500 space-y-3">
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full bg-[#000000] rounded-md p-2 text-white font-semibold"
                />
                <textarea
                    value={editedTerms}
                    onChange={(e) => setEditedTerms(e.target.value)}
                    rows={5}
                    className="w-full bg-[#000000] rounded-md p-2 text-white text-sm"
                />
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-start gap-3 p-4 bg-[#0f0f0f] rounded-lg border border-[#262626] transition hover:scale-[1.02] hover:shadow-[0_0_16px_2px_rgba(255,255,255,0.32)]"
        >
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="cursor-grab text-gray-500 hover:text-white pt-1"
            >
                <GripVertical size={20} />
            </button>
            <div className="flex-grow">
                <h3 className="font-semibold text-white">{section.title}</h3>
                <div className="mt-2 space-y-1">
                    {section.terms.map((term, index) => (
                        <p key={index} className="text-sm text-gray-400">• {term}</p>
                    ))}
                </div>
            </div>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-white"
                >
                    <Pencil size={16} />
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
    );
}