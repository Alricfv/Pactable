'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabaseClient'
import { usePathname, useRouter } from 'next/navigation'
import { UserCircle } from 'lucide-react';

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
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const isProtectedRoute = pathname.startsWith('/dashboard')
  const navigation = isProtectedRoute ? dashboardNavigation : publicNavigation

  useEffect(() => {
    if (isProtectedRoute) {
      const fetchUserProfile = async () => {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('avatar_url')
            .eq('id', user.id)
            .single()
          setProfile(profileData)
        }
        setLoading(false)
      }
      fetchUserProfile()
    } else {
      setLoading(false)
      setProfile(null)
    }
  }, [pathname, isProtectedRoute])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 mx-auto max-w-[95%] px-6 pt-6">
      <nav aria-label="Global" className="flex items-center justify-between p-4 bg-black border border-neutral-800 rounded-xl">
        <div className="flex lg:flex-1">
          <a href={isProtectedRoute ? "/dashboard" : "/"} className="-m-1.5 p-1.5">
            <span className="sr-only">Pactable</span>
            <h1 className="text-2xl font-bold text-white">Pactable</h1>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-neutral-400"
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
              className="text-sm/6 font-medium text-neutral-400 hover:text-white transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {isProtectedRoute ? (
            loading ? (
              <div className="h-10 w-10 bg-neutral-800 rounded-full animate-pulse" />
            ) : (
              <div className="relative group">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="User Profile"
                    className="h-10 w-10 rounded-full object-cover cursor-pointer border-2 border-neutral-800 group-hover:border-white transition"
                  />
                ) : (
                  <UserCircle className="h-10 w-10 text-neutral-400 cursor-pointer group-hover:text-white transition" />
                )}
                <div className="absolute right-0 mt-2 w-48 bg-black border border-neutral-800 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                  <a
                    href="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white"
                  >
                    View Profile
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-neutral-900"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )
          ) : (
            <a
              href="/signin"
              className="text-sm/6 font-semibold text-white"
            >
              Log In <span aria-hidden="true">&rarr;</span>
            </a>
          )}
        </div>
      </nav>

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black p-6 sm:max-w-sm border-l border-neutral-800">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Pactable</span>
              <h1 className="text-2xl font-bold text-white">Pactable</h1>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-neutral-400"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-neutral-800">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-neutral-400 hover:text-white hover:bg-neutral-900"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="py-6">
                <a
                  href="/signin"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-neutral-900"
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