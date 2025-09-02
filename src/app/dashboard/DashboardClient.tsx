'use client'

import { FileText, PlusCircle, MoreVertical, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';

type Participant ={
    id: string;
    status: string;
}

type Agreement = {
    id: string;
    title: string;
    created_at: string;
    created_by: string;
    content: string | null
    agreement_participants: Participant[]
};

const AgreementPreview = ({ title, content }: {title: string, content: string | null}) => {
    if (!content){
        return <FileText className="h-16 w-16 text-gray-500 group-hover:text-grey-50 transition" />;
    }

    const lines = content.split('\n').filter(line => line.trim() !== '');

    return (
        <div className="w-full h-full bg-white p-3 overflow-hidden text-black font-sans text-[4px] leading-tight">
            <h1 className="font-bold text-[6px] mb-2 truncate">
                {title}
            </h1>
            {lines.slice(0,20).map((line, index) => {
                if (line.startsWith('### ')){
                    return (
                    <p key={index} className="font-bold mt-2 mb-1 text-[5px] truncate">
                        {line.substring(4)}
                    </p>  
                )}
                if(line.startsWith('- ')){
                    return(
                        <p key={index} className="ml-1 truncate">
                            {line}
                        </p>
                )}
                return <p key={index} className="truncate">{line}</p>
            })}
        </div>
    );
};

export default function DashboardClient({agreements: initialAgreements, userId} : {agreements: Agreement[], userId: string }) {

    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();
    const [agreements, setAgreements] = useState(initialAgreements);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [agreementToDelete, setAgreementToDelete] = useState<Agreement | null>(null);
    
    const handleDeleteAgreement = async (agreementId: string) => {
        setError(null);
        const{ error: rpcError } = await supabase.rpc('delete_agreement',{
             agreement_id: agreementId 
        });

        if (rpcError){
            console.error('Failed to delete agreement:', rpcError);
            setError(`Error: ${rpcError.message}`);
        }
        else{
            setAgreements(currentAgreements => currentAgreements.filter(a => a.id !== agreementId));
        }
    }

    const handleOpenModal = (agreement: Agreement) =>{
        setAgreementToDelete(agreement);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAgreementToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (agreementToDelete) {
            handleDeleteAgreement(agreementToDelete.id);
        }
        handleCloseModal();
    }

    const createdAgreements = agreements.filter(a => a.created_by === userId);
    const receivedAgreements = agreements.filter(a => a.created_by !== userId);
    return(
        <>
            <ConfirmationModal
                isOpen={isModalOpen}
                onCancel={handleCloseModal}
                onConfirm={handleConfirmDelete}
                title={agreementToDelete?.title || ''}
            />

            <div className="w-full px-6 sm:px-10 space-y-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white">
                        Welcome to your Dashboard!
                    </h1>
                    <p className="mt-2 text-gray-300">
                        Let's agree on stuff shall we?
                    </p>
                </div>

                {error && <p className="text-center bg-red-50 text-red-500 p-3 rounded-md">{error}</p>}

                {agreements.length > 0 ? (
                    <div className="space-y-10">
                        <div>
                            <div className="flex justify-between items-center">
                                <h2 className="text-3xl font-semibold text-white mb-6">
                                    Your Agreements
                                </h2>
                                <a
                                    href="/dashboard/agreements/create"
                                    className="inline-flex items-center gap-2 bg-gray-50 text-gray-950 rounded-md px-6 py-3 font-semibold hover:bg-gray-100 transition text-base"
                                >
                                    <PlusCircle size={20} />
                                    <span> New Agreement </span>
                                </a>
                            </div>
                            <AgreementGrid agreements={createdAgreements} onDelete={handleOpenModal}/>
                        </div>
                        <div>
                            <h2 className="text-3xl font-semibold text-white mb-6">
                                Received Agreements
                            </h2>
                            <AgreementGrid agreements={receivedAgreements} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-[#0f0f0f] rounded-lg border border-dashed border-[#262626]">
                        <h3 className="text-xl font-semibold text-white">
                            Get on your first agreement ASAP!
                        </h3>
                        <p className="">
                            You haven't created / been added to agreements yet!
                        </p>
                        <a
                            href="/dashboard/agreements"
                            className="mt-6 inline-flex items-center gap-2 bg-gray-50 text-white rounded-md px-4 py-2 font-semibold hover:bg-gray-100 transition"
                        >
                            <PlusCircle size={18} className="text-gray-950" />
                            <span className="text-gray-950">Create your first agreement here!</span>
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}

function ConfirmationModal({isOpen, onCancel, onConfirm, title}:{isOpen: boolean; onCancel: () => void; onConfirm: ()=> void; title: string;}){
    if (!isOpen) 
        return null;

    return (
        <div className={`flex justify-center items-center p-4 fixed inset-0 bg-black bg-opacity-60 z-50 backdrop-blur-sm transition-opacity duration-500 
                        ${isOpen? 'opacity-100 pointer-events-auto' : 'opacit-0 pointer-events-none'}`}>
            <div className={`bg-[#000000] p-6 rounded-lg shadow-xl max-w-sm w-full border border-gray-700 
                            transform transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <h3 className="text-lg font-bold text-white">
                    Confirm Deletion 
                </h3>
                <p className="text-gray-100 my-4">
                    Are you sure you want to delete "{title}"? This action is permanent!
                </p>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-white text-gray-950 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 transition"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function AgreementGrid({ agreements, onDelete }: { agreements: Agreement[], onDelete?: (agreement: Agreement) => void}){
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {setIsClient(true); }, []);

    if (agreements.length === 0) {
        return(
            <p className="text-gray-500 px-10 sm:px-0">
                No agreements found.
            </p>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {agreements.map((agreement) => (
                <div key={agreement.id} className="group relative rounded-xl bg-gradient-to-br from-white/10 via-white/5 to-transparent transition-all duration-300 hover:from-white/20 hover:via-white/10">
                    <div className="relative h-full w-full rounded-[11px] bg-[#09090b] p-3">
                        <a
                            href={`/dashboard/agreements/view/${agreement.id}`}
                            className="block h-40 bg-[#0f0f0f] rounded-lg border-2 border-[#262626] hover:border-gray-500 transition overflow-hidden"
                        >
                            <AgreementPreview title={agreement.title} content={agreement.content}/>
                        </a>
                        <div className="mt-3">
                            <h3 className="text-md font-semibold text-white truncate">
                                {agreement.title}
                            </h3>
                            <div className="flex justify-between items-center">
                                <p>
                                    {isClient ? new Date(agreement.created_at).toLocaleDateString() : 'Loading...'}
                                </p>
                                {onDelete && (
                                    <button
                                        onClick={(e) => { 
                                            e.preventDefault();
                                            onDelete(agreement);
                                        }}
                                        className="flex items-center gap-1 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition text-xs"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}