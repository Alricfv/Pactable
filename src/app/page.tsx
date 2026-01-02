'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { FeatureSection } from "@/components/FeatureSection"
import { EmailBuzz } from "@/components/EmailBuzz"
import { UseCasesSection } from "@/components/UseCasesSection"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <main className="flex flex-col items-center justify-center min-h-[90vh] px-6 pt-32 pb-16 sm:pb-32">
        {/* Badge - subtle, grounded */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/50 text-neutral-400 text-xs font-medium">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            Now in Beta
          </span>
        </div>

        {/* Main Headline - refined typography */}
        <h1 className="text-5xl sm:text-7xl font-semibold text-center tracking-tighter text-white mb-8 max-w-4xl leading-[1.05]">
          Agreements made simple
        </h1>

        {/* Subheadline - balanced spacing */}
        <p className="text-lg sm:text-xl text-center text-neutral-400 max-w-2xl mb-12 leading-relaxed font-normal">
          Create clear agreements for housemates, freelancers, students, and everyday situations. No legal jargon required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-24 w-full sm:w-auto px-4 sm:px-0">
          <Button asChild className="h-12 rounded-lg px-8 text-base font-medium bg-white text-black hover:bg-neutral-200 transition-all duration-300 active:scale-95 w-full sm:min-w-[160px]">
            <Link href="/signup">
              Get started
            </Link>
          </Button>
          <Button
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
            className="h-12 rounded-lg px-8 text-base font-medium bg-neutral-900/50 text-white border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 transition-all duration-300 active:scale-95 w-full sm:min-w-[160px]"
            variant="outline"
          >
            Learn more
          </Button>
          <Button
            onClick={() => {
              document.getElementById('subscribe')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
            className="h-12 rounded-lg px-8 text-base font-medium bg-transparent text-neutral-500 hover:text-white transition-colors duration-300 w-full sm:w-auto"
            variant="ghost"
          >
            Stay updated
          </Button>
        </div>

        {/* Hero Screenshot - layered with background image */}
        <div className="max-w-5xl mx-auto w-full relative flex items-center justify-center py-12 sm:py-20">
          {/* Background Image Layer - Larger */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden border border-neutral-800/50 shadow-2xl">
            <img
              src="https://raw.githubusercontent.com/Alricfv/imageassets/54ddb56b769c9c0015c8db5b577b991effa7f1db/wallbaber.jpg"
              alt=""
              className="w-full h-full object-cover opacity-60"
            />
          </div>

          {/* Screenshot Container - Smaller and centered */}
          <div className="relative z-10 w-[85%] sm:w-[80%] rounded-xl overflow-hidden border border-neutral-800/50 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] bg-black">
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
