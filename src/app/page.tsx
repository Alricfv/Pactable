'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { FeatureSection } from "@/components/FeatureSection"
import { EmailBuzz } from "@/components/EmailBuzz"
import { UseCasesSection } from "@/components/UseCasesSection"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <div className="bg-black min-h-screen">
      <main className="flex flex-col items-center justify-center min-h-[90vh] px-6">
        {/* Badge - subtle */}
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 text-neutral-400 text-sm">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            Now in Beta
          </span>
        </div>

        {/* Main Headline - clean, large, white */}
        <h1 className="text-5xl sm:text-7xl font-medium text-center tracking-tight text-white mb-6 max-w-4xl leading-[1.1]">
          Agreements made simple
        </h1>

        {/* Subheadline - muted */}
        <p className="text-lg sm:text-xl text-center text-neutral-400 max-w-2xl mb-12 leading-relaxed">
          Create clear agreements for housemates, freelancers, students, and everyday situations. No legal jargon required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link href="/signup">
            <Button className="h-12 rounded-lg px-8 text-base font-medium bg-white text-black hover:bg-neutral-200 transition-colors">
              Get started
            </Button>
          </Link>
          <Button
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
            className="h-12 rounded-lg px-8 text-base font-medium bg-transparent text-white border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700 transition-colors"
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
            className="h-12 rounded-lg px-8 text-base font-medium bg-transparent text-neutral-400 hover:text-white transition-colors"
            variant="ghost"
          >
            Stay updated
          </Button>
        </div>

        {/* Hero Screenshot - clean frame */}
        <div className="max-w-5xl mx-auto w-full">
          <div className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
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
