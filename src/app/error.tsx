"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSessionContext } from "@/contexts/SessionContext";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { user } = useSessionContext();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-xl w-full rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-white/80">Oops</p>
        <h1 className="mt-4 text-3xl font-semibold">Sorry, an unexpected bug has occurred.</h1>
        <p className="mt-4 text-base text-white/80">
          {user ? `You're still signed in as ${user.email}.` : "Your session is still active."}
        </p>
        <p className="mt-2 text-sm text-white/60">
          Our team has been notified. You can try the last action again or jump back to your dashboard.
        </p>
        {error.digest && (
          <p className="mt-4 text-xs font-mono text-white/50">Reference ID: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} className="w-full sm:w-auto">
            Try again
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
