'use client';

import Image from 'next/image';
import { createClient } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { CheckCircle, Clock, UserCircle, Pencil, Lock, Download } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { type Contract, PARTY_ROLE_LABELS } from '@/lib/contracts';

type Profile = {
    username: string | null;
    avatar_url: string | null;
    email: string | null;
};

export type Participant = {
    user_id: string;
    status: 'pending' | 'signed';
    profiles: Profile | null;
    signature_text?: string;
    signed_date?: string;
};

export type Agreement = {
    id: string;
    title: string;
    content: string | null;
    created_at: string;
    created_by: string;
    agreement_participants: Participant[];
};

// Parse JSON contract content
function parseContract(content: string | null): Contract | null {
    if (!content) return null;
    try {
        const parsed = JSON.parse(content);
        if (parsed.title && parsed.articles) return parsed as Contract;
        return null;
    } catch { return null; }
}

// Helper to find a signed participant matching a contract party by email
function findSignedParticipant(party: Contract['parties'][0], participants: Participant[]): Participant | undefined {
    if (!party.email) return undefined;
    return participants.find(
        p => p.status === 'signed' && p.profiles?.email?.toLowerCase() === party.email.toLowerCase()
    );
}

// Contract Preview - matches create page's LiveContractPreview exactly
function ContractPreview({ contract, participants }: { contract: Contract; participants: Participant[] }) {
    return (
        <div className="bg-white border-2 border-gray-300 rounded-xl shadow-md flex flex-col h-[calc(100vh-220px)] sticky top-[180px]">
            <div className="px-6 py-3 border-b-2 border-gray-300 flex items-center justify-between bg-gray-50 rounded-t-xl">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Agreement Document</span>
                <span className="text-xs text-gray-400">PDF</span>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6 font-serif text-[13px] leading-relaxed text-gray-800">
                <h1 className="text-center font-bold text-base mb-1 tracking-wide uppercase">{contract.title || 'Untitled Contract'}</h1>
                {contract.preamble.date && <p className="text-center text-xs text-gray-400 mb-4">Date: {contract.preamble.date}</p>}
                <hr className="my-4 border-gray-300" />
                <div className="pl-5 py-2"><p className="text-[12px]">{contract.preamble.introText}</p></div>
                <div className="pl-5 py-2">
                    <h2 className="font-bold text-[13px] uppercase mt-4 mb-2">Parties</h2>
                    {contract.parties.length === 0 ? (
                        <p className="text-gray-300 italic text-[12px]">No parties added yet...</p>
                    ) : (
                        contract.parties.map((party, i) => (
                            <div key={party.id} className="mb-2">
                                <p className="text-[12px]">
                                    <span className="font-semibold">{i + 1}.</span>{' '}
                                    {party.name || <span className="text-gray-300">[Name]</span>}
                                    {party.type === 'company' && party.companyName && ` (${party.companyName})`}
                                    {party.email && <span className="text-gray-400"> — {party.email}</span>}
                                </p>
                            </div>
                        ))
                    )}
                </div>
                {contract.recitals.enabled && contract.recitals.items.length > 0 && (
                    <div className="pl-5 py-2">
                        <h2 className="font-bold text-[13px] uppercase mt-4 mb-2">Recitals</h2>
                        {contract.recitals.items.map((item, i) => (
                            <p key={i} className="text-[12px] mb-1">{String.fromCharCode(65 + i)}. {item}</p>
                        ))}
                    </div>
                )}
                {contract.definitions.enabled && contract.definitions.terms.length > 0 && (
                    <div className="pl-5 py-2">
                        <h2 className="font-bold text-[13px] uppercase mt-4 mb-2">Definitions</h2>
                        {contract.definitions.terms.map((def, i) => (
                            <p key={i} className="text-[12px] mb-1">
                                <span className="font-semibold">&quot;{def.term || '...'}&quot;</span>{' '}
                                {def.definition || <span className="text-gray-300">[definition]</span>}
                            </p>
                        ))}
                    </div>
                )}
                {contract.articles.length === 0 ? (
                    <div className="pl-5 py-2">
                        <p className="text-gray-300 italic text-[12px] mt-4">No articles defined yet...</p>
                    </div>
                ) : (
                    contract.articles.map((article) => (
                        <div key={article.id} className="pl-5 py-2">
                            <h2 className="font-bold text-[13px] uppercase mt-4 mb-2">
                                Article {article.number}: {article.title || '...'}
                            </h2>
                            {article.clauses.map((clause) => (
                                <div key={clause.id} className="mb-2">
                                    <p className="font-semibold text-[12px]">{clause.number} {clause.title}</p>
                                    {clause.terms.map((term) => (
                                        <p key={term.id} className="text-[12px] ml-4">
                                            {term.text || <span className="text-gray-300">[clause text]</span>}
                                        </p>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))
                )}
                <div className="pl-5 py-2">
                    <hr className="my-4 border-gray-200" />
                    <h2 className="font-bold text-[13px] uppercase mb-3">Signatures</h2>
                    {contract.parties.length === 0 ? (
                        <p className="text-gray-300 italic text-[12px]">No signature lines yet...</p>
                    ) : (
                        contract.parties.map((party) => {
                            const signedParticipant = findSignedParticipant(party, participants);
                            return (
                                <div key={party.id} className="mb-4">
                                    <p className="text-[11px] font-semibold uppercase text-gray-500">{PARTY_ROLE_LABELS[party.role]}</p>
                                    {signedParticipant?.signature_text ? (
                                        <>
                                            <p className="text-[15px] mt-2" style={{ fontFamily: 'cursive' }}>{signedParticipant.signature_text}</p>
                                            <div className="border-b border-gray-300 w-48" />
                                        </>
                                    ) : (
                                        <div className="mt-2 border-b border-gray-300 w-48" />
                                    )}
                                    <p className="text-[11px] mt-1">{party.name || '________________________'}</p>
                                    <p className="text-[11px] text-gray-400">
                                        Date: {signedParticipant?.signed_date
                                            ? new Date(signedParticipant.signed_date).toLocaleDateString()
                                            : '________________________'}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

// Plain text preview for old agreements
function PlainTextPreview({ content, title }: { content: string; title: string }) {
    return (
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm flex flex-col h-[calc(100vh-220px)] sticky top-[180px]">
            <div className="px-6 py-3 border-b border-gray-300 flex items-center justify-between bg-gray-50 rounded-t-xl">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Agreement Document</span>
                <span className="text-xs text-gray-400">PDF</span>
            </div>
            <div className="flex-1 overflow-y-auto px-8 py-6 font-serif text-[13px] leading-relaxed text-gray-800">
                <h1 className="text-center font-bold text-base mb-4 tracking-wide uppercase">{title}</h1>
                <hr className="my-4 border-gray-200" />
                <div className="whitespace-pre-wrap text-[12px] pl-5">{content}</div>
            </div>
        </div>
    );
}

export default function ViewAgreementClient({ agreement: initialAgreement, userId, creatorProfile: initialCreatorProfile }: { agreement: Agreement, userId: string, creatorProfile?: Profile | null }) {
    const [agreement, setAgreement] = useState(initialAgreement);
    const [signatureName, setSignatureName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const currentUserParticipant = agreement.agreement_participants.find(p => p.user_id === userId);
    const hasSigned = currentUserParticipant?.status === 'signed';
    const isCreator = agreement.created_by === userId;
    const [creatorProfile, setCreatorProfile] = useState<Profile | null>(initialCreatorProfile ?? null);
    const [hasConsented, setHasConsented] = useState(false);
    
    // Parse contract content (JSON or plain text)
    const contract = parseContract(agreement.content);

    useEffect(() => {
        if (initialCreatorProfile) return;
        const fetchCreatorProfile = async () => {
            if (!agreement.created_by) return;
            const { data, error } = await supabase
                .from('profiles')
                .select('username, email, avatar_url')
                .eq('id', agreement.created_by)
                .single();
            if (data && !error) setCreatorProfile(data);
        };
        fetchCreatorProfile();
    }, [agreement.created_by, supabase, initialCreatorProfile]);

    // PDF generation - matches create page exactly with proper indentation
    const generatePDF = async (): Promise<Uint8Array> => {
        if (!contract) throw new Error('No contract');
        
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
        const pageWidth = 612;
        const pageHeight = 792;
        const margin = 72;
        const lineHeight = 14;
        let page = pdfDoc.addPage([pageWidth, pageHeight]);
        let y = pageHeight - margin;

        const addText = (text: string, options: { bold?: boolean; size?: number; indent?: number } = {}) => {
            const { bold = false, size = 11, indent = 0 } = options;
            const usedFont = bold ? boldFont : font;
            const maxWidth = pageWidth - margin * 2 - indent;
            const words = text.split(' ');
            let line = '';
            for (const word of words) {
                const testLine = line + (line ? ' ' : '') + word;
                const width = usedFont.widthOfTextAtSize(testLine, size);
                if (width > maxWidth && line) {
                    if (y < margin + lineHeight) {
                        page = pdfDoc.addPage([pageWidth, pageHeight]);
                        y = pageHeight - margin;
                    }
                    page.drawText(line, { x: margin + indent, y, size, font: usedFont, color: rgb(0, 0, 0) });
                    y -= lineHeight;
                    line = word;
                } else {
                    line = testLine;
                }
            }
            if (line) {
                if (y < margin + lineHeight) {
                    page = pdfDoc.addPage([pageWidth, pageHeight]);
                    y = pageHeight - margin;
                }
                page.drawText(line, { x: margin + indent, y, size, font: usedFont, color: rgb(0, 0, 0) });
                y -= lineHeight;
            }
        };

        const addSpace = (lines = 1) => {
            y -= lineHeight * lines;
            if (y < margin) {
                page = pdfDoc.addPage([pageWidth, pageHeight]);
                y = pageHeight - margin;
            }
        };

        // Title
        addText(contract.title.toUpperCase(), { bold: true, size: 14 });
        addSpace();
        if (contract.preamble.date) {
            addText(`Date: ${contract.preamble.date}`, { size: 10 });
        }
        addSpace(2);

        // Preamble
        addText(contract.preamble.introText);
        addSpace();

        // Parties
        addText('PARTIES:', { bold: true, size: 12 });
        addSpace();
        contract.parties.forEach((party, i) => {
            const partyText = `${i + 1}. ${party.name || '[Name]'}${party.type === 'company' && party.companyName ? ` (${party.companyName})` : ''} ("${PARTY_ROLE_LABELS[party.role]}")`;
            addText(partyText);
            if (party.email) {
                addText(`   Email: ${party.email}`, { indent: 20 });
            }
        });
        addSpace();

        // Recitals
        if (contract.recitals.enabled && contract.recitals.items.length > 0) {
            addText('RECITALS', { bold: true, size: 12 });
            addSpace();
            contract.recitals.items.forEach((item, i) => {
                addText(`${String.fromCharCode(65 + i)}. ${item}`);
            });
            addSpace();
            addText('NOW, THEREFORE, in consideration of the mutual covenants and agreements set forth herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:');
            addSpace();
        }

        // Definitions
        if (contract.definitions.enabled && contract.definitions.terms.length > 0) {
            addText('DEFINITIONS', { bold: true, size: 12 });
            addSpace();
            contract.definitions.terms.forEach(def => {
                addText(`"${def.term}" ${def.definition}`);
                addSpace(0.5);
            });
            addSpace();
        }

        // Articles
        for (const article of contract.articles) {
            addText(`ARTICLE ${article.number}: ${article.title.toUpperCase()}`, { bold: true, size: 12 });
            addSpace();
            for (const clause of article.clauses) {
                addText(`${clause.number} ${clause.title}`, { bold: true, indent: 20 });
                for (const term of clause.terms) {
                    addText(term.text, { indent: 20 });
                }
                addSpace(0.5);
            }
            addSpace();
        }

        // Signature Block
        addText('IN WITNESS WHEREOF', { bold: true, size: 12 });
        addSpace();
        addText('The parties have executed this Agreement as of the date first written above.');
        addSpace(3);

        for (const party of contract.parties) {
            const signedParticipant = findSignedParticipant(party, agreement.agreement_participants);
            addText(`${PARTY_ROLE_LABELS[party.role].toUpperCase()}:`, { bold: true });
            addSpace(2);
            if (signedParticipant?.signature_text) {
                addText(signedParticipant.signature_text, { size: 14 });
            }
            addText('_________________________________');
            addText(`Name: ${party.name || '________________________'}`);
            addText(`Date: ${signedParticipant?.signed_date ? new Date(signedParticipant.signed_date).toLocaleDateString() : '________________________'}`);
            addSpace(2);
        }

        return pdfDoc.save();
    };

    const handleDownloadPDF = async () => {
        if (!contract) {
            // Fallback for old plain text agreements
            try {
                const pdfDoc = await PDFDocument.create();
                let page = pdfDoc.addPage();
                const { height } = page.getSize();
                const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
                const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
                const margin = 72;
                let y = height - margin;
                page.drawText(agreement.title || 'Untitled', { x: margin, y, font: boldFont, size: 16, color: rgb(0, 0, 0) });
                y -= 40;
                const content = agreement.content || '';
                for (const line of content.split('\n')) {
                    if (y < margin) { page = pdfDoc.addPage(); y = height - margin; }
                    page.drawText(line, { x: margin, y, font, size: 11, color: rgb(0, 0, 0) });
                    y -= 14;
                }
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${agreement.title || 'agreement'}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error('Failed to generate PDF:', err);
                setError('Failed to generate PDF');
            }
            return;
        }
        try {
            const pdfBytes = await generatePDF();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${contract.title || 'agreement'}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to generate PDF:', err);
            setError('Failed to generate PDF');
        }
    };
    const handleSignAgreement = async () => {
        if (!signatureName.trim()) {
            setError("Please type your name to sign");
            return;
        }

        if (!hasConsented) {
            setError("You must agree to the terms before signing.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Remove redundant session check here
            const { error: updateError } = await supabase
                .from('agreement_participants')
                .update({
                    status: 'signed',
                    signature_text: signatureName,
                    signed_date: new Date().toISOString()
                })
                .eq('agreement_id', agreement.id)
                .eq('user_id', userId);

            if (updateError) {
                setError(`Failed to sign agreement: ${updateError.message}`);
                return;
            }

            const updatedParticipants = agreement.agreement_participants.map(p =>
                p.user_id === userId ? { ...p, status: 'signed' as const, signature_text: signatureName, signed_date: new Date().toISOString() } : p
            );
            setAgreement({ ...agreement, agreement_participants: updatedParticipants });
        }
        catch (err: any) {
            setError(`Failed to sign agreement: ${err.message}`);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Header */}
            <div className="bg-white border-b-2 border-gray-300 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Agreement Review</h1>
                            <p className="text-sm text-gray-500 mt-1">{agreement.title}</p>
                        </div>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition font-medium shadow-md border-2 border-gray-700"
                        >
                            <Download size={18} />
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content - Same layout as create page */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left side - Participants panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl border-2 border-gray-300 shadow-md">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Participants</h2>
                            <div className="space-y-4">
                                {/* Creator */}
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <UserCircle className="h-10 w-10 text-indigo-500" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {creatorProfile?.username || creatorProfile?.email || 'Owner'}
                                                {agreement.created_by === userId && <span className="text-sm text-gray-500 ml-2">(You)</span>}
                                            </p>
                                            <p className="text-xs text-gray-500">Agreement Creator</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-indigo-200">Creator</span>
                                </div>

                                {/* Other participants */}
                                {agreement.agreement_participants
                                    .filter(p => p.user_id !== agreement.created_by)
                                    .map(p => (
                                        <div key={p.user_id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex items-center gap-3">
                                                {p.profiles?.avatar_url ? (
                                                    <Image src={p.profiles.avatar_url} alt="avatar" width={40} height={40} className="h-10 w-10 rounded-full border border-gray-300" />
                                                ) : (
                                                    <UserCircle className="h-10 w-10 text-gray-400" />
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {p.profiles?.username || p.profiles?.email || 'Participant'}
                                                        {p.user_id === userId && <span className="text-sm text-gray-500 ml-2">(You)</span>}
                                                    </p>
                                                    <p className="text-xs text-gray-500">Signatory</p>
                                                </div>
                                            </div>
                                            {p.status === 'signed' ? (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <CheckCircle size={16} />
                                                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded border border-green-200">Signed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-yellow-600">
                                                    <Clock size={16} />
                                                    <span className="text-xs font-medium bg-yellow-100 text-yellow-700 px-2 py-1 rounded border border-yellow-300">Pending</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Signing section */}
                        {!hasSigned && currentUserParticipant && (
                            <div className="bg-white p-6 rounded-xl border-2 border-gray-300 shadow-md">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sign Agreement</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Signature</label>
                                        <input
                                            type="text"
                                            placeholder="Type your full name"
                                            value={signatureName}
                                            onChange={(e) => setSignatureName(e.target.value)}
                                            className="block w-full bg-white rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            style={{ fontFamily: 'cursive', fontSize: '18px' }}
                                        />
                                        {signatureName && (
                                            <div className="mt-3 p-4 bg-gray-50 rounded-lg border-2 border-gray-300">
                                                <p className="text-xs text-gray-500 mb-1">Signature Preview</p>
                                                <p className="text-2xl text-gray-900" style={{ fontFamily: 'cursive' }}>{signatureName}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <input
                                            id="consent-checkbox"
                                            type="checkbox"
                                            checked={hasConsented}
                                            onChange={(e) => setHasConsented(e.target.checked)}
                                            className="h-5 w-5 mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <label htmlFor="consent-checkbox" className="text-sm text-gray-600">
                                            I agree to use an electronic signature and to be legally bound by the terms of this agreement.
                                        </label>
                                    </div>
                                    <button
                                        onClick={handleSignAgreement}
                                        disabled={loading || !hasConsented || !signatureName.trim()}
                                        className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Signing...' : 'Sign Agreement'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {hasSigned && (
                            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-300 shadow-md">
                                <div className="flex items-center gap-3 text-green-700">
                                    <CheckCircle size={24} />
                                    <div>
                                        <p className="font-semibold">You have signed this agreement</p>
                                        {currentUserParticipant?.signed_date && (
                                            <p className="text-sm text-green-600">
                                                Signed on {new Date(currentUserParticipant.signed_date).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="space-y-3">
                            {isCreator ? (
                                <a
                                    href={`/dashboard/agreements/edit/${agreement.id}`}
                                    className="w-full px-4 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-md border-2 border-blue-700"
                                >
                                    <Pencil size={18} />
                                    Edit Agreement
                                </a>
                            ) : (
                                <div className="w-full px-4 py-3 rounded-lg font-medium text-gray-500 bg-gray-100 flex items-center justify-center gap-2 cursor-not-allowed border-2 border-gray-300">
                                    <Lock size={18} />
                                    You can&apos;t edit this agreement
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg shadow-md">
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Right side - Document Preview (same as create page) */}
                    <div className="lg:col-span-3">
                        {contract ? (
                            <ContractPreview contract={contract} participants={agreement.agreement_participants} />
                        ) : agreement.content ? (
                            <PlainTextPreview content={agreement.content} title={agreement.title} />
                        ) : (
                            <div className="bg-white border border-gray-300 rounded-xl shadow-sm flex flex-col h-[calc(100vh-220px)] sticky top-[180px] items-center justify-center">
                                <p className="text-gray-400">No content available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}