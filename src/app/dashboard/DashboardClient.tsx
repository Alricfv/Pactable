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
    agreement_participants: Participant[]
};

export default function DashboardClient({agreements} : {agreements: Agreement[] }) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return(
        <div>
            <div className="w-full px-6 sm:px-10">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white">
                        Welcome to your Dashboard!
                    </h1>
                    <p className="mt-2 text-gray-300">
                        Let's agree on stuff shall we?
                    </p>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-4xl font-semibold text-white">
                        Your Agreements
                    </h2>
                </div>

                {agreements.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {agreements.map((agreement) => (
                            <div key={agreement.id} className="group relative rounded-xl p-px bg-gradient-to-br from-white/10 via-white/5 to-transparent transition-all duration-300 hover:from-white/20 hover:via-white/10">
                                <div className="relative h-full w-full rounded-[11px] bg-[#09090b] p-3">
                                    <a
                                        href={`/dashboard/agreements/${agreement.id}`}
                                        className={`block h-40 bg-[#0f0f0f] rounded-lg border-2 border-[#262626] hover:border-grey-50 transition flex items-center justify-center `}
                                    >
                                        <FileText className="h-16 w-16 text-gray-500 group-hover:text-grey-50 transition" />
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
        
    );
}