import Link from 'next/link'

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-black border-t border-neutral-900">
            <div className="mx-auto max-w-6xl px-6 py-12">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-lg font-medium text-white hover:text-neutral-300 transition-colors">
                            Pactable
                        </Link>
                        <nav className="flex gap-6 text-sm">
                            <Link href="/#features" className="text-neutral-500 hover:text-white transition-colors">
                                Features
                            </Link>
                            <Link href="/signup" className="text-neutral-500 hover:text-white transition-colors">
                                Sign up
                            </Link>
                            <Link href="/signin" className="text-neutral-500 hover:text-white transition-colors">
                                Sign in
                            </Link>
                        </nav>
                    </div>
                    <p className="text-sm text-neutral-600">
                        © {currentYear} Pactable
                    </p>
                </div>
            </div>
        </footer>
    )
}