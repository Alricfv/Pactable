'use client'

import { usePathname } from 'next/navigation'

export function Footer() {
    const pathname = usePathname();
    const hiddenRoutes = ['/signin', '/signup', '/dashboard'];

    if (hiddenRoutes.includes(pathname)){
        return null
    }
    else{
        return(
            <footer
                className="border-t border-[#232323] py-4 text-center text-sm text-gray-400 bg-[#09090b]"
            >
                © {new Date().getFullYear()} Pactable. All rights reserved.
            </footer>
        )
    }
}