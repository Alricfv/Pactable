'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';



export default function DashboardPage() {
    const router = useRouter();
    const supabase = createClient();
    useEffect(() => {
        const checkAuth = async() => {
            const {data: {session}} = await supabase.auth.getSession();
            if (!session){
                router.push('/');
            }
        };
        checkAuth();
    }, [router]);

    return(
        <div>
            <h1 className="text-3xl font-bold text-white">
                Dashboard
            </h1>
            <p className="mt-2 text-gray-400">
                Welcome to your dashboard.
            </p>
        </div>
    )
}