"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[100svh] bg-black flex items-center px-4">
      <div className="container-wide">
        <p className="eyebrow mb-8"><span className="text-[#BF5AF2]">500</span>&nbsp;&nbsp;Error</p>
        <h1 className="max-w-[14ch] font-heading font-semibold leading-[0.95] tracking-[-0.05em] text-[#F5F5F7] text-[clamp(3rem,8vw,6.5rem)] mb-8">Something went wrong.</h1>
        <p className="max-w-[46ch] text-lg leading-[1.65] text-[#A1A1AA] mb-10">This page hit an unexpected error and we&apos;ve been notified. Try again, or head back to the homepage.</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={reset}
            className="inline-flex h-12 items-center rounded-full bg-[#8944AB] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#7A3A9A]"
          >
            Try again
          </button>
          <Link href="/" className="inline-flex h-12 items-center rounded-full border border-white/[0.18] px-6 text-[15px] font-medium text-[#F5F5F7] transition-colors hover:border-white/40">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
