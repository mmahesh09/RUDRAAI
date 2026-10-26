import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Rankwise mark, rebuilt from their site so it stays sharp at any size */
function RankwiseLogo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#9333EA] font-mono text-[15px] font-semibold text-white"
      >
        R
      </span>
      <span className="font-heading text-[24px] font-bold tracking-[-0.045em] text-[#FAFAFA]">
        Rank<span className="text-[#BF5AF2]">wise</span>
      </span>
    </span>
  );
}

// Only real clients with shipped work — each links to its case on /showcase
const CLIENTS = [{ name: "Rankwise", href: "/showcase#rankwise", sector: "SEO & AI search", logo: <RankwiseLogo /> }];

export default function ClientsSection() {
  return (
    <section aria-label="Clients" className="bg-black">
      <div className="container-wide grid items-center gap-y-8 pt-14 md:pt-20 lg:grid-cols-12 lg:gap-x-8">
        <p className="eyebrow lg:col-span-3">Clients</p>
        <ul className="flex flex-wrap items-center gap-x-14 gap-y-8 lg:col-span-6">
          {CLIENTS.map((c) => (
            <li key={c.name}>
              <Link href={c.href} className="group flex flex-col gap-2 transition-opacity hover:opacity-80">
                {c.logo}
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#8A8A93]">{c.sector}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/showcase"
          className="group inline-flex w-fit items-center gap-2 text-[15px] font-medium text-[#F5F5F7] lg:col-span-3 lg:justify-self-end"
        >
          See the work
          <ArrowRight className="h-4 w-4 text-[#BF5AF2] transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
