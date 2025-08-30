'use client'

import { FileText, PlusCircle } from 'lucide-react';

type Agreement = {
    id: string;
    title: string;
    created_at: string;
    status: string;
};

export default function DashboardClient({agreements} : {agreements: Agreement[] }) {
    return(
        <div className="max-w-5xl mx-auto p-4">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-white">
                    Welcome to your Dashboard!
                </h1>
                <p className="mt-2 text-gray-300">
                    Let's agree on stuff shall we?
                </p>
            </div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Your Agreements</h2>
                <a
                    href="/dashboard/agreements"
                    className="flex items-center gap-2 bg-indigo-600 text-white rounded-md px-4 py-2 font-semibold hover:bg-indigo-700 transition"
                >
                    <PlusCircle size={18} />
                    New Agreement
                </a>
            </div>

        </div>
    )
}