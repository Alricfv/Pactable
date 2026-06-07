'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabaseClient'
import { usePathname, useRouter } from 'next/navigation'
import { UserCircle } from 'lucide-react';
import { useSessionContext } from '@/contexts/SessionContext'
import { useProfile, type Profile } from '@/hooks/useProfile'

const dashboardNavigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Agreements', href: '/dashboard/agreements/create' },
  { name: 'Profile', href: '/dashboard/profile' },
  { name: 'Pricing', href: '/dashboard/pricing' },
]

const publicNavigation = [
  { name: 'Features', href: '#features' },
  { name: 'Use Cases', href: '#use-cases' },
  { name: 'Pricing', href: '/dashboard/pricing' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isProtectedRoute = pathname.startsWith('/dashboard')
  const navigation = isProtectedRoute ? dashboardNavigation : publicNavigation
  const { user, loading: sessionLoading } = useSessionContext()
  
  // Only fetch profile on protected routes when we have a user
  const shouldFetchProfile = isProtectedRoute && !!user?.id
  const { data: profile, isLoading: profileLoading } = useProfile(shouldFetchProfile ? user.id : undefined)
  
  const loading = isProtectedRoute ? (sessionLoading || profileLoading) : false

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 mx-auto max-w-6xl px-4 pt-4">
      <nav aria-label="Global" className="flex items-center justify-between px-6 py-4 bg-white border border-stone-300 rounded-full shadow-sm">
        <div className="flex lg:flex-1">
          <a href={isProtectedRoute ? "/dashboard" : "/"} className="-m-1.5 p-1.5 flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-stone-900">Pactable</span>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-full p-2.5 text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isProtectedRoute ? (
            loading ? (
              <div className="h-10 w-10 bg-stone-200 rounded-full animate-pulse" />
            ) : (
              <div className="relative group">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt="User Profile"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover cursor-pointer border-2 border-stone-300 hover:border-orange-500 transition-colors"
                  />
                ) : (
                  <UserCircle className="h-10 w-10 text-stone-400 cursor-pointer hover:text-orange-500 transition-colors" />
                )}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-300 rounded-xl shadow-lg py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                  <a
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  >
                    View Profile
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )
          ) : (
            <a
              href="/signin"
              className="text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 px-5 py-2.5 rounded-full transition-colors"
            >
              Get Started
            </a>
          )}
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50 bg-stone-900/20" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm shadow-xl">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-stone-900">Pactable</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-full p-2.5 text-stone-500 hover:bg-stone-100"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-8 flow-root">
            <div className="-my-6 divide-y divide-stone-200">
              <div className="space-y-1 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-medium text-stone-700 hover:bg-stone-100"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="/signin"
                  className="block rounded-xl px-4 py-3 text-base font-semibold text-white bg-stone-900 text-center hover:bg-stone-800"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}