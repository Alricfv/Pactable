'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabaseClient'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navigation = [
  { name: 'Try it Out!', href: '/dashboard' },
  { name: 'Features', href: '/' },
  { name: 'About', href: '/' },
  { name: 'Contact', href: '/' },
]

let authPromise: Promise<any>;


export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [navigationItems, setNavigationItems] = useState<typeof guestNavigation>([])
  const [showLoginLink, setShowLoginLink] = useState<boolean | null>(null)

  const guestNavigation = [
  { name: 'Try it Out!', href: '/' },
  { name: 'Features', href: '/' },
  { name: 'About', href: '/' },
  { name: 'Contact', href: '/' },
  ]

  const authNavigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Agreements', href: '/dashboard/agreements' },
  { name: 'Profile', href: '/dashboard/profile' },
  { name: 'Pricing', href: '/dashboard/pricing' },
  ]

  const navigation = user ? authNavigation : guestNavigation

  useEffect(() =>{
    if (!authPromise){
      authPromise = supabase.auth.getSession();
    }

    authPromise.then(({data: {session} }) => {
      const isAuthenticated = !!session?.user;
      setUser(session?.user)
      setNavigationItems(isAuthenticated ? authNavigation : guestNavigation);
      setShowLoginLink(!isAuthenticated);
    });

    const { data: {subscription} } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const isAuthenticated = !!session?.user;
        setUser(session?.user)
        setNavigationItems(isAuthenticated ? authNavigation : guestNavigation);
        setShowLoginLink(!isAuthenticated);
      }
    );

    return () => {
      subscription.unsubscribe
    }
  })

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }
  
  
  
  

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1">
          <a href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Pactable</span>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Pactable</h1>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              className="text-sm/6 font-semibold text-gray-900 dark:text-white"
            >
              {item.name}
            </a>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="/signin" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Pactable</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto dark:hidden"
              />
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto not-dark:hidden"
              />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}