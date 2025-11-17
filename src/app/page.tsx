'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { FeatureSection } from "@/components/FeatureSection"
import { EmailBuzz } from "@/components/EmailBuzz"

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center min-h-[40vh] sm:min-h-[80vh]">
        <h1 className="text-5xl py-2 font-semibold text-center tracking-tight text-balance text-black dark:text-white sm:text-6xl mb-[2px] sm:mb-6">
          Solving disputes before they happen
        </h1>
        <h2 className="text-xl font-semibold text-center py-6 tracking-tight text-balance text-black dark:text-white sm:text-2xl mb-[2px] sm:mb-6 sm:py-1">
          Create simple agreements fast - Perfect for event planning, Loans, freelance work and more.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 my-5  sm:max-w-none">
          <Link href="/signup">
            <Button className="h-18 rounded-md px-12 text-xl font-bold">
              Try it Out!
            </Button>
          </Link>
          <Button
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
            className ="h-18 rounded-md px-12 text-xl font-bold" 
            variant = "outline" 
          >
            <a href="#features">How it Works</a>
          </Button>
        </div>

        {/* Hero Screenshot */}
        <div className="mt-12 mb-8 max-w-5xl mx-auto px-4">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-white/10 rounded-xl blur-lg opacity-40" />
            <img
              src="https://raw.githubusercontent.com/Alricfv/imageassets/refs/heads/main/Screenshot%202025-09-07%20201813.png"
              alt="Pactable dashboard showing agreement creation and management interface"
              className="relative w-full rounded-2xl shadow-2xl ring-1 ring-white/10 border border-gray-800"
              width={1200}
              height={800}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </div>
        </div>
      </main>
      <FeatureSection />
      <EmailBuzz />
    </>
  );
}
