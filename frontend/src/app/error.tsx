"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl font-heading font-black text-[#FF6B00] mb-4">500</div>
        <h1 className="text-2xl font-heading font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-[#71717A] font-body mb-8">An unexpected error occurred. Our team has been notified.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl bg-[#FF6B00] text-white text-sm font-subheading font-semibold hover:bg-[#e55f00] transition-colors"
          >
            Try again
          </button>
          <Link href="/" className="px-5 py-2.5 rounded-xl border border-white/10 text-[#A1A1AA] text-sm font-subheading hover:text-white transition-colors">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
