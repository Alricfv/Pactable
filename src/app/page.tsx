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
          Create simple agreements fast.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 my-5  sm:max-w-none">
          <Link href="/signup">
            <Button className="h-18 rounded-md px-12 text-xl font-bold">
              Try it Out!
            </Button>
          </Link>
          <Button className ="h-18 rounded-md px-12 text-xl font-bold" variant = "outline" >
            Learn more
          </Button>
        </div>
      </main>
      <FeatureSection />
      <EmailBuzz />
    </>

  );
}
