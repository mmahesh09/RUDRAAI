import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/site/reveal";
import { SITE } from "@/lib/site";

/** Closing move used across the site: oversized type, one action, the facts of the call. */
export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-black py-28 md:py-40">
      {/* Hairline frame echoing the hero */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-hidden="true">
        <div className="h-full border-x border-white/[0.06]" />
      </div>

      <div className="container-wide relative">
        <Reveal className="border-t border-white/[0.08] pt-5">
          <p className="eyebrow">Start here</p>
        </Reveal>

        <h2 className="mt-10 font-heading font-semibold leading-[0.95] tracking-[-0.045em] text-[#F5F5F7] text-[clamp(2.75rem,9vw,8rem)]">
          <Reveal as="span" variant="line">Fifteen minutes.</Reveal>
          <Reveal as="span" variant="line" delay={0.08}>
            <span className="text-[#2997FF]">Saturday or Sunday.</span>
          </Reveal>
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-end md:gap-x-8">
          <Reveal delay={0.15} className="md:col-span-6">
            <p className="max-w-[46ch] text-lg leading-[1.6] text-[#A1A1AA]">
              Tell us what's slowing your business down. You'll leave the call knowing what we'd build, roughly what it
              costs, and whether it's worth doing at all.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="flex flex-col gap-4 sm:flex-row sm:items-center md:col-span-6 md:justify-end">
            <Link
              href="/booking"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#0071E3] px-8 text-base font-semibold text-white transition-colors hover:bg-[#0077ED]"
            >
              Book a free call
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/[0.18] px-8 text-base font-medium text-[#F5F5F7] transition-colors hover:border-white/40"
            >
              Email us instead
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <p className="mt-16 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
            Free · {SITE.call.short} · Video call · No obligation
          </p>
        </Reveal>
      </div>
    </section>
  );
}
