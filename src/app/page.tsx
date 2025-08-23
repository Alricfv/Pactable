'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button"
import { FeatureSection } from "@/components/FeatureSection"
import { EmailBuzz } from "@/components/EmailBuzz"

export default function Home() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 blur-[10px]">
        {/* First polygon */}
        <div
          className="absolute left-1/4 top-0 w-[400px] h-[400px] opacity-20 blur-2xl"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, #6366f1 0%, transparent 100%)",
            clipPath: "polygon(20% 0%, 80% 10%, 100% 60%, 60% 100%, 0% 80%, 0% 20%)",
          }}
        />
        {/* Second polygon (northwest, closer to center) */}
        <div
          className="absolute left-[18%] top-[8%] w-[320px] h-[320px] opacity-10 blur-2xl"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, #6366f1 0%, transparent 100%)",
            clipPath: "polygon(40% 0%, 100% 30%, 80% 100%, 0% 80%, 0% 20%)",
          }}
        />
        <div
          className="absolute left-[5%] top-[2%] w-[300px] h-[300px] opacity-10 blur-2xl"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, #6366f1 0%, transparent 100%)",
            clipPath: "polygon(30% 0%, 100% 20%, 90% 100%, 0% 80%, 0% 20%)",
          }}
        />
        {/* Fourth polygon (west, more spread out) */}
        <div
          className="absolute left-[2%] top-[30%] w-[260px] h-[260px] opacity-10 blur-2xl"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, #6366f1 0%, transparent 100%)",
            clipPath: "polygon(50% 0%, 100% 40%, 80% 100%, 0% 80%, 0% 20%)",
          }}
        />
        {/* Fifth polygon (southeast) */}
        <div
          className="absolute right-1/4 bottom-0 w-[400px] h-[400px] opacity-10 blur-2xl"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, #6366f1 0%, transparent 100%)",
            clipPath: "polygon(80% 100%, 20% 90%, 0% 40%, 40% 0%, 100% 20%, 100% 80%)",
          }}
        />
        <div
          className="absolute right-[18%] bottom-[8%] w-[320px] h-[320px] opacity-10 blur-2xl"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, #6366f1 0%, transparent 100%)",
            clipPath: "polygon(60% 100%, 0% 70%, 20% 0%, 100% 20%, 100% 80%, 80% 100%)",
          }}
        />
        <div
          className="absolute right-[20%] top-[3%] w-[340px] h-[340px] opacity-10 blur-2xl"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, #6366f1 0%, transparent 100%)",
            clipPath: "polygon(60% 100%, 0% 70%, 20% 0%, 100% 20%, 100% 80%, 80% 100%)",
          }}
        />
        <div
          className="absolute right-[10%] top-[10%] w-[260px] h-[260px] opacity-10 blur-2xl"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, #6366f1 0%, transparent 100%)",
            clipPath: "polygon(60% 100%, 0% 70%, 20% 0%, 100% 20%, 100% 80%, 80% 100%)",
          }}
        />
      </div>
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
