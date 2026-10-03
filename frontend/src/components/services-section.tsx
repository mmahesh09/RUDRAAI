import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/site/section-head";
import Reveal from "@/components/site/reveal";
import { SERVICES } from "@/lib/site";

/** Three services as full-width indexed rows — read like a spec sheet, not a card grid. */
export default function ServicesSection({ index = "02" }: { index?: string } = {}) {
  return (
    <section id="services" className="section-padding relative bg-black">
      <div className="container-wide">
        <SectionHead
          index={index}
          label="What we build"
          title={<span>Three things, <span className="text-[#BF5AF2]">built properly.</span></span>}
        />

        <ol className="mt-16 lg:mt-24 border-b border-white/[0.08]">
          {SERVICES.map((s, i) => (
            <Reveal as="li" key={s.slug} delay={i * 0.06} className="border-t border-white/[0.08]">
              <div className="grid gap-y-5 py-10 lg:grid-cols-12 lg:gap-x-8 lg:py-14">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93] lg:col-span-1 lg:pt-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="lg:col-span-5">
                  <h3 className="font-heading text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.035em] text-[#F5F5F7]">
                    {s.name}
                  </h3>
                  <p className="mt-4 max-w-[34ch] text-lg leading-snug text-[#F5F5F7]/90">{s.line}</p>
                </div>
                <div className="lg:col-span-4 lg:pt-3">
                  <ul className="flex flex-wrap gap-x-4 gap-y-2">
                    {s.deliverables.map((d) => (
                      <li key={d} className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#A1A1AA]">
                        <span className="text-[#BF5AF2]" aria-hidden="true">+ </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-start justify-between gap-4 lg:col-span-2 lg:flex-col lg:items-end lg:text-right">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">Typical timeline</p>
                    <p className="mt-1 font-heading text-xl font-semibold tracking-[-0.02em] text-[#F5F5F7]">{s.timeline}</p>
                  </div>
                  <Link
                    href={`/services#${s.slug}`}
                    aria-label={`More about ${s.name}`}
                    className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.18] text-[#F5F5F7] transition-colors hover:border-[#BF5AF2] hover:text-[#BF5AF2]"
                  >
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
