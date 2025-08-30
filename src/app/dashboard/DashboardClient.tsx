'use client'

import { FileText, PlusCircle, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function DashboardClient({agreements, userId} : {agreements: Agreement[], userId: string }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const createdAgreements = agreements.filter(a => a.created_by === userId);
    const receivedAgreements = agreements.filter(a => a.created_by !== userId);
    return(
        <>
            <div className="w-full px-6 sm:px-10 space-y-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white">
                        Welcome to your Dashboard!
                    </h1>
                    <p className="mt-2 text-gray-300">
                        Let's agree on stuff shall we?
                    </p>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-4xl font-semibold text-white">
                            Your Agreements
                        </h2>
                    </div>

                    {createdAgreements.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {createdAgreements.map((agreement) => (
                                <div key={agreement.id} className="group relative rounded-xl p-px bg-gradient-to-br from-white/10 via-white/5 to-transparent transition-all duration-300 hover:from-white/20 hover:via-white/10">
                                    <div className="relative h-full w-full rounded-[11px] bg-[#09090b] p-3">
                                        <a
                                            href={`/dashboard/agreements/${agreement.id}`}
                                            className={`block h-40 bg-[#0f0f0f] rounded-lg border-2 border-[#262626] hover:border-grey-50 transition flex items-center justify-center `}
                                        >
                                            <AgreementPreview title={agreement.title} content={agreement.content}/>
                                        </a>
                                        <div className="mt-3">
                                            <h3 className="text-md font-semibold text-white truncate">
                                                {agreement.title}
                                            </h3>
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-gray-400">
                                                    {isClient ? new Date(agreement.created_at).toLocaleDateString() : 'Loading...'}
                                                </p>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); alert('Options Menu!'); }}
                                                    className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ): (
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
            </div>
            <div>
                <div className="flex justify-between py-10 items-center ">
                    <h2 className="text-4xl font-semibold text-white px-10">
                        Received Agreements
                    </h2>
                </div>
                {receivedAgreements.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {receivedAgreements.map((agreement) =>(
                            <div key={agreement.id} className="group relative rounded-xl p-px bg-gradient-to-br from-white/10 via-white/5 to-transparent transition-all duration-300 hover:from-white/20 hover:via-white/10">
                                <div className="relative h-full w-full rounded-[11px] bg-[#09090b] p-3">
                                    <a
                                        href={`/dashboard/agreements/${agreement.id}`}
                                        className="block h-40 bg-[#0f0f0f] rounded-lg border-2 border-[#262626] hover:border-grey-50 transition flex items-center justify-center"
                                    >
                                        <AgreementPreview title={agreement.title} content={agreement.content} />
                                    </a>
                                    <div className="mt-3">
                                        <h3 className="text-md font-semibold text-white truncate">
                                            {agreement.title}
                                        </h3>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-400">
                                                {isClient ? new Date(agreement.created_at).toLocaleDateString(): ''}
                                            </p>
                                            <button
                                                onClick={(e) => {e.preventDefault(); alert('Options Menu!'); }}
                                                className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <MoreVertical size={18}/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ):(
                    <p className="px-10">
                        No agreements have been sent to you just yet.
                    </p>
                )}
            </div>
        </>
    );
}