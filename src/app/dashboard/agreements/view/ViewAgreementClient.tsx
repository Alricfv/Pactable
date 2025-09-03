'use client';

import { createClient } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, UserCircle, Pencil, Lock } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb} from 'pdf-lib';

type Profile = {
    username: string | null;
    avatar_url: string | null; //gotta remove these at some point, just a lil fail safe Fraud dept looool
    email: string | null;
};

export type Participant = {
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

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = font.widthOfTextAtSize(`${currentLine} ${word}`, fontSize);
        if (width < maxWidth) {
            currentLine += ` ${word}`;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

export default function ViewAgreementClient({ agreement: initialAgreement, userId } : { agreement: Agreement, userId: string}){
    const [agreement, setAgreement] = useState(initialAgreement);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const supabase = createClient();
    const currentUserParticipant = agreement.agreement_participants.find(p => p.user_id === userId);
    const hasSigned = currentUserParticipant?.status === 'signed';
    const isCreator = agreement.created_by === userId;

    useEffect(() => {
        const generatePdf = async () => {
            if (!agreement.content) return;

            
            const sections = agreement.content.split('\n\n\n').map((sectionStr, index) => {
                const lines = sectionStr.split('\n');
                const title = lines.find(l => l.startsWith('### '))?.substring(4) || `Section ${index + 1}`;
                const terms = lines.filter(l => l.startsWith('- ')).map(l => l.substring(2));
                return { title, terms };
            });

            const pdfDoc = await PDFDocument.create();
            let page = pdfDoc.addPage();
            const { width, height } = page.getSize();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const margin = 50;
            const contentWidth = width - (2 * margin);
            let y = height - margin;

            page.drawText(agreement.title, { x: 50, y, font: boldFont, size: 24, color: rgb(0, 0, 0) });
            y -= 40;

            for (const section of sections) {
                if (y < 100) {
                    page = pdfDoc.addPage();
                    y = height - margin;
                }
                page.drawText(section.title, { x: 50, y, font: boldFont, size: 16, color: rgb(0, 0, 0) });
                y -= 25;

                for (const term of section.terms) {
                    const fullTerm = `• ${term}`;
                    const wrappedLines = wrapText(fullTerm, font, 11, contentWidth - 10);
                    for (const line of wrappedLines) {
                        if (y < margin) {
                            page = pdfDoc.addPage();
                            y = height - margin;
                        }
                        page.drawText(line, { x: margin + (line.startsWith('•') ? 0 : 8), y, font, size: 11, color: rgb(0, 0, 0) });
                        y -= 20;
                    }
                }
                y -= 10;
            }

            const pdfBytes = await pdfDoc.save();
            const uint8Array = new Uint8Array(pdfBytes);
            const blob = new Blob([uint8Array], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setPdfUrl(`${url}#toolbar=0`);

            return() => URL.revokeObjectURL(url);
        };

        generatePdf().catch(console.error);
    }, [agreement.content, agreement.title]);

    const handleSignAgreement = async () => {
        if (hasSigned)
            return;

        setLoading(true);
        setError(null);

        const { error: updateError } = await supabase
            .from('agreement_participants')
            .update({ status: 'signed'})
            .eq('agreement_id', agreement.id)
            .eq('user_id', userId);

        if (updateError){
            setError(`Failed to sign agreement: ${updateError.message}`);
        }

        else{
            const updatedParticipants = agreement.agreement_participants.map(p =>
                p.user_id === userId ? { ...p, status: 'signed' as const } : p
            );
            setAgreement({...agreement, agreement_participants: updatedParticipants});
        }
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
            <h1 className="text-white font-semibold mb-10 text-5xl text-center">
                Agreement Review
            </h1>
            
            <div className= "grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 h-100% w-100% bg-[#0f0f0f] py-6 px-6 rounded-lg flex items-center justify-center border border-[#262626]">
                    {pdfUrl ? (
                        <iframe src={pdfUrl}  className="w-full  aspect-[8.5/11] rounded-lg" style={{ border: 'none'}} title="Agreement PDF Review"/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#2e2e2e] rounded-lg border border-[#262626]">
                            <p className="text-gray-400">Agreement preview coming up!</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-[#0f0f0f] p-6 rounded-lg border border-[#262626]">
                        <h2 className="text-2xl font-semibold text-white mb-6">
                            Participants
                        </h2>
                        <div className="space-y-4 mb-8">
                            {agreement.agreement_participants.map(p => (
                                <div key={p.user_id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        {p.profiles?.avatar_url ? (
                                            <img src={p.profiles.avatar_url } alt="avatar" className="h-10 w-10 rounded-full"/>
                                        ) : (
                                            <UserCircle className="h-10 w-10 text-gray-500"/>
                                        )}
                                        <div>
                                            <p className="font-medium text-white">
                                                {p.profiles?.username || p.profiles?.email}
                                                {p.user_id === userId && <span className="text-sm text-gray-400 ml-2">(You)</span>}
                                            </p>
                                        </div>
                                    </div>
                                    {p.status === 'signed' ? (
                                        <div className="flex items-center gap-2 text-green-400">
                                            <CheckCircle size={18}/>
                                            <span>Signed</span>
                                        </div>
                                    ):(
                                        <div className="flex items-center gap-2 text-yellow-400">
                                            <Clock size={18}/>
                                            <span>Pending</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={handleSignAgreement}
                            disabled={hasSigned || loading}
                            className="w-full px-4 py-3 rounded-md font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ background: hasSigned ? '#16a34a' : '#4f46e5', color: 'white'}}
                        >
                            {loading ? 'Signing...' : hasSigned ? 'Agreement Signed': 'Sign Agreement'}
                        </button>
                        {isCreator ? (
                            <a
                                href={`/dashboard/agreements/edit/${agreement.id}`}
                                className="w-full px-4 py-3 rounded-md font-semibold text-white transition mt-4 flex items-center justify-center gap-2"
                                style={{ background: '#2563eb', color: 'white'}}
                            >
                                <Pencil size={18} />
                                Edit Agreement
                            </a>
                        ):(
                            <div className="w-full px-4 py-3 rounded-md font-semibold text-gray-400 bg-gray-800 flex items-center justify-center gap-2 mt-4 cursor-not-allowed">
                                <Lock size={18} />
                                You can't make changes to this agreement
                            </div>
                        )}
                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}