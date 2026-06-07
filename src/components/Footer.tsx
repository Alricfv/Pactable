import Link from 'next/link'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-stone-100 border-t border-stone-200">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">P</span>
                            </div>
                            <span className="text-lg font-bold text-stone-900">Pactable</span>
                        </Link>
                        <nav className="flex gap-6 text-sm">
                            <Link href="/#features" className="text-stone-500 hover:text-stone-900 transition-colors">
                                Features
                            </Link>
                            <Link href="/#use-cases" className="text-stone-500 hover:text-stone-900 transition-colors">
                                Use Cases
                            </Link>
                            <Link href="/signup" className="text-stone-500 hover:text-stone-900 transition-colors">
                                Sign up
                            </Link>
                            <Link href="/signin" className="text-stone-500 hover:text-stone-900 transition-colors">
                                Sign in
                            </Link>
                        </nav>
                    </div>
                    <p className="text-sm text-stone-400">
                        © {currentYear} Pactable. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}