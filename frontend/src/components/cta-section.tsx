import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/site/reveal";
import { SITE } from "@/lib/site";
import Magnetic from "@/components/site/magnetic";
import { Spotlight } from "@/components/site/site-effects";

/** Closing move used across the site: oversized type, one action, the facts of the call. */
export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-black py-28 md:py-40">
      <Spotlight />
      {/* Hairline frame echoing the hero */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10" aria-hidden="true">
        <div className="h-full border-x border-white/[0.06]" />
      </div>

      <div className="container-wide relative">
        <Reveal className="rule-draw pt-5">
          <p className="eyebrow">Start here</p>
        </Reveal>

        <h2 className="mt-10 font-heading font-semibold leading-[0.95] tracking-[-0.045em] text-[#F5F5F7] text-[clamp(2.25rem,10vw,8rem)]">
          <Reveal as="span" variant="words" className="block">Fifteen minutes.</Reveal>
          <Reveal as="span" variant="words" delay={0.12} className="block">
            <span className="text-[#BF5AF2]">Saturday or Sunday.</span>
          </Reveal>
        </h2>

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-end md:gap-x-8">
          <Reveal delay={0.15} className="md:col-span-6">
            <p className="max-w-[46ch] text-lg leading-[1.6] text-[#A1A1AA]">
              Tell us what&apos;s slowing you down. Leave knowing what we&apos;d build and what it costs.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="flex flex-col gap-4 sm:flex-row sm:items-center md:col-span-6 md:justify-end">
            <Magnetic>
            <Link
              href="/booking"
              className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#8944AB] px-8 text-base font-semibold text-white transition-colors hover:bg-[#7A3A9A]"
            >
              Book a free call
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            </Magnetic>
            <a
              href={`mailto:${SITE.email}`}
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/[0.18] px-8 text-base font-medium text-[#F5F5F7] transition-colors hover:border-white/40"
            >
              Email us instead
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
