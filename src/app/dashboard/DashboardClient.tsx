'use client'

import { FileText, PlusCircle, MoreVertical, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useAgreements, useDeleteAgreement } from '@/hooks/useAgreements'

type Participant ={
    user_id: string;
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

    // Try parsing as JSON contract
    try {
        const parsed = JSON.parse(content);
        if (parsed.title && parsed.articles) {
            return (
                <div className="w-full h-full bg-white p-3 overflow-hidden text-black font-sans text-[4px] leading-tight">
                    <h1 className="font-bold text-[6px] mb-1 truncate text-center uppercase">
                        {parsed.title}
                    </h1>
                    {parsed.preamble?.date && (
                        <p className="text-[3px] text-gray-400 text-center mb-1">Date: {parsed.preamble.date}</p>
                    )}
                    <hr className="my-1 border-gray-200" />
                    {parsed.preamble?.introText && (
                        <p className="truncate text-[3.5px] mb-1">{parsed.preamble.introText}</p>
                    )}
                    {parsed.parties?.length > 0 && (
                        <div className="mb-1">
                            <p className="font-bold text-[4px] mb-0.5">PARTIES</p>
                            {parsed.parties.slice(0, 3).map((party: any, i: number) => (
                                <p key={i} className="truncate text-[3.5px]">
                                    {i + 1}. {party.name || '[Name]'}{party.companyName ? ` (${party.companyName})` : ''}
                                </p>
                            ))}
                        </div>
                    )}
                    {parsed.articles?.slice(0, 4).map((article: any, i: number) => (
                        <div key={i} className="mb-0.5">
                            <p className="font-bold text-[4px] truncate">
                                Art. {article.number}: {article.title}
                            </p>
                            {article.clauses?.slice(0, 2).map((clause: any, j: number) => (
                                <p key={j} className="truncate text-[3.5px] ml-1">
                                    {clause.number} {clause.title}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>
            );
        }
    } catch {
        // Not JSON, fall through to plain text preview
    }

    const lines = content.split('\n').filter(line => line.trim() !== '');

    return (
        <div className="w-full h-full bg-white p-3 overflow-hidden text-black font-sans text-[4px] leading-tight">
            <h1 className="font-bold text-[6px] mb-2 truncate text-center">
                {title}
            </h1>
            {lines.slice(0,20).map((line, index) => {
                if (line.startsWith('### ')){
                    return (
                    <p key={index} className="font-bold mt-2 mb-1 text-[5px] border-b truncate">
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

export default function DashboardClient({ 
  agreements: initialAgreements, 
  userId 
}: { 
  agreements?: Agreement[]
  userId: string 
}) {
  const [error, setError] = useState<string | null>(null);
  // Use server data as initial, otherwise let hook fetch
  const { data: agreements, isLoading } = useAgreements(userId, initialAgreements)
  const deleteMutation = useDeleteAgreement()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agreementToDelete, setAgreementToDelete] = useState<Agreement | null>(null);
  
  const handleDeleteAgreement = async (agreementId: string) => {
    setError(null);
    
    try {
      await deleteMutation.mutateAsync(agreementId)
      setIsModalOpen(false)
      setAgreementToDelete(null)
    } catch (error: any) {
      console.error('Failed to delete agreement:', error);
      setError(`Error: ${error.message}`);
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

  const agreementsList = agreements ?? [];
  const createdAgreements = agreementsList.filter(a => a.created_by === userId);
  const receivedAgreements = agreementsList.filter(a => a.created_by !== userId);

  if (isLoading) {
    return (
      <div className="w-full px-6 sm:px-10 min-h-screen py-32 bg-white">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900">
            Welcome to your Dashboard!
          </h1>
          <p className="mt-2 text-gray-600">
            Let&apos;s agree on stuff shall we?
          </p>
        </div>
        <div className="flex justify-center">
          <div className="h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return(
      <>
          <ConfirmationModal
              isOpen={isModalOpen}
              onCancel={handleCloseModal}
              onConfirm={handleConfirmDelete}
              title={agreementToDelete?.title || ''}
          />

          <div className="w-full px-6 sm:px-10 min-h-screen py-32 bg-white">
              <div className="text-center mb-12">
                  <h1 className="text-5xl font-bold text-gray-900">
                      Welcome to your Dashboard!
                  </h1>
                  <p className="mt-2 text-gray-600">
                      Let&apos;s agree on stuff shall we?
                  </p>
              </div>

              {error && <p className="text-center bg-red-50 text-red-600 p-3 rounded-md mb-6">{error}</p>}

              {agreementsList.length > 0 ? (
                  <div className="space-y-10">
                      <div>
                          <div className="flex justify-between items-center">
                              <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                                  Your Agreements
                              </h2>
                              <a
                                  href="/dashboard/agreements/create"
                                  className="inline-flex items-center gap-2 mb-4 bg-gray-900 text-white rounded-md px-6 py-3 font-semibold hover:bg-gray-800 transition text-base"
                              >
                                  <PlusCircle size={20} />
                                  <span> New Agreement </span>
                              </a>
                          </div>
                          <AgreementGrid agreements={createdAgreements} onDelete={handleOpenModal}/>
                      </div>
                      <div>
                          <h2 className="text-3xl font-semibold text-gray-900 mb-2">
                              Received Agreements
                          </h2>
                          <AgreementGrid agreements={receivedAgreements} />
                      </div>
                  </div>
              ) : (
                  <div className="text-center py-16 px-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                      <h3 className="text-xl font-semibold text-gray-900">
                          Get on your first agreement ASAP!
                      </h3>
                      <p className="text-gray-600">
                          You haven&apos;t created / been added to agreements yet!
                      </p>
                      <a
                          href="/dashboard/agreements/create"
                          className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white rounded-md px-4 py-2 font-semibold hover:bg-gray-800 transition"
                      >
                          <PlusCircle size={18} />
                          <span>Create your first agreement here!</span>
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
            <div className={`bg-white p-6 rounded-lg shadow-xl max-w-sm w-full border border-gray-200 
                            transform transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <h3 className="text-lg font-bold text-gray-900">
                    Confirm Deletion 
                </h3>
                <p className="text-gray-600 my-4">
                    Are you sure you want to delete &quot;{title}&quot;? This action is permanent!
                </p>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200"
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
                <div key={agreement.id} className="group relative rounded-xl bg-white border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-300">
                    <div className="relative h-full w-full rounded-[11px] p-3">
                        <a
                            href={`/dashboard/agreements/view/${agreement.id}`}
                            className="block h-40 bg-gray-50 rounded-lg border border-gray-300 hover:border-gray-400 transition overflow-hidden"
                        >
                            <AgreementPreview title={agreement.title} content={agreement.content}/>
                        </a>
                        <div className="mt-3">
                            <h3 className="text-md font-semibold text-gray-900 truncate">
                                {agreement.title}
                            </h3>
                            <div className="flex justify-between items-center">
                                <p className="text-gray-500 text-sm">
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