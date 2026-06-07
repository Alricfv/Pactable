'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { FeatureSection } from "@/components/FeatureSection"
import { EmailBuzz } from "@/components/EmailBuzz"
import { UseCasesSection } from "@/components/UseCasesSection"

export default function Home() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <main className="flex flex-col items-center justify-center min-h-[90vh] px-6 pt-28 pb-16 sm:pb-24">
        {/* Badge */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
            <span className="w-2 h-2 bg-orange-500 rounded-full" />
            Now in Beta
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-7xl font-bold text-center text-stone-900 mb-6 max-w-4xl leading-[1.1]">
          Agreements made{' '}
          <span className="text-orange-500">simple</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-center text-stone-600 max-w-2xl mb-10 leading-relaxed">
          Create clear agreements for housemates, freelancers, students, and everyday situations. No legal jargon required.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-16 w-full sm:w-auto px-4 sm:px-0">
          <Button asChild className="h-12 rounded-full px-8 text-base font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors w-full sm:min-w-[180px]">
            <Link href="/signup">
              Get started free
            </Link>
          </Button>
          <Button
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
            className="h-12 rounded-full px-8 text-base font-medium bg-white text-stone-700 border border-stone-300 hover:bg-stone-100 hover:border-stone-400 transition-colors w-full sm:min-w-[180px]"
            variant="outline"
          >
            See how it works
          </Button>
        </div>

        {/* Hero Screenshot */}
        <div className="max-w-5xl mx-auto w-full relative">
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-200 rounded-3xl -z-10" />
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-stone-200 rounded-3xl -z-10" />
          
          {/* Screenshot Container */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-2xl shadow-stone-300/50 bg-white">
            <img
              src="https://raw.githubusercontent.com/Alricfv/imageassets/refs/heads/main/Screenshot%202025-09-07%20201813.png"
              alt="Pactable dashboard"
              className="w-full"
              width={1200}
              height={800}
            />
          </div>
        </div>
      </main>

      <FeatureSection />
      <UseCasesSection />
      <EmailBuzz />
    </div>
  );
}
