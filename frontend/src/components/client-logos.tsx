import type { ReactNode } from "react";

/** Rankwise mark, rebuilt from their site so it stays sharp at any size */
function RankwiseLogo() {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#9333EA] font-mono text-[12px] font-semibold text-white"
      >
        R
      </span>
      <span className="font-heading text-[19px] font-bold tracking-[-0.045em] text-[#FAFAFA]">
        Rank<span className="text-[#BF5AF2]">wise</span>
      </span>
    </span>
  );
}

// Only real clients with shipped work — each links to its case on /showcase
export const CLIENTS: { name: string; href: string; logo: ReactNode }[] = [
  { name: "Rankwise", href: "/showcase#rankwise", logo: <RankwiseLogo /> },
];
