import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/site/reveal";
import { SITE } from "@/lib/site";

const PRINCIPLES = [
  { title: "You own everything", body: "Code, workflows, accounts and data live in your name. If we part ways, nothing stops working." },
  { title: "Written down", body: "Every build ships with plain-English documentation your team can actually follow." },
  { title: "Watched, not hoped", body: "Automations alert us when something fails, so problems get fixed before customers notice." },
  { title: "Honest scope", body: "If a spreadsheet or an off-the-shelf tool will do, we'll say so — even if it means a smaller job." },
];

/** §05 — who builds it: a statement on the left, the working principles as a ruled list. */
export default function FounderSection() {
  return (
    <section id="who" className="section-padding relative bg-black">
      <div className="container-wide grid gap-16 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-6">
          <Reveal className="border-t border-white/[0.08] pt-5">
            <p className="eyebrow">
              <span className="text-[#BF5AF2]">05&nbsp;&nbsp;</span>Who builds it
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-8 font-heading text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.03em] text-[#F5F5F7] [text-wrap:balance]">
              A small, engineer-led studio in {SITE.location.split(",")[0]}. The person you talk to on the first call
              <span className="text-[#A1A1AA]"> is the person who builds your system.</span>
            </p>
          </Reveal>
          <Reveal delay={0.12} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div>
              <p className="font-heading text-base font-semibold text-[#F5F5F7]">{SITE.consultant}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
                {SITE.name} · {SITE.location}
              </p>
            </div>
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 text-[15px] font-medium text-[#F5F5F7] underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-[#BF5AF2]"
            >
              Our story
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <ul className="lg:col-span-5 lg:col-start-8 ledger border-y border-white/[0.08] self-end">
          {PRINCIPLES.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.06} className="py-6">
              <h3 className="font-heading text-lg font-semibold tracking-[-0.02em] text-[#F5F5F7]">{p.title}</h3>
              <p className="mt-1.5 max-w-[44ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{p.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
