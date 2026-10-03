import SectionHead from "@/components/site/section-head";
import Reveal from "@/components/site/reveal";
import { SITE } from "@/lib/site";

const STEPS = [
  {
    when: `${SITE.call.minutes} min`,
    title: "A short call",
    body: "Tell us what eats your week. We tell you what's worth building.",
  },
  {
    when: "2–3 days",
    title: "A written plan",
    body: "Scope, timeline and a fixed price. Nothing starts until you say yes.",
  },
  {
    when: "Days to weeks",
    title: "Build and test",
    body: "Tested on sample data, shown to you, then switched on.",
  },
  {
    when: `${SITE.supportDays} days`,
    title: "Handover and support",
    body: "Logins, docs and a walkthrough. Free fixes for the first month.",
  },
];

/** §04 — process as a horizontal ruled ledger; each step carries its own duration. */
export default function HowItWorksSection({ index = "04" }: { index?: string } = {}) {
  return (
    <section id="process" className="section-padding relative bg-black">
      <div className="container-wide">
        <SectionHead
          index={index}
          label="How we work"
          title={<span>From first call to <span className="text-[#BF5AF2]">running system.</span></span>}
        />

        <ol className="mt-16 grid border-t border-white/[0.08] md:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={i * 0.08}
              className="border-b border-white/[0.08] py-8 md:px-6 md:[&:nth-child(odd)]:pl-0 lg:border-b-0 lg:border-r lg:[&:last-child]:border-r-0 lg:[&:nth-child(odd)]:pl-6 lg:first:pl-0"
            >
              <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em]">
                <span className="text-[#BF5AF2]">Step {String(i + 1).padStart(2, "0")}</span>
                <span className="text-[#A1A1AA]">{s.when}</span>
              </div>
              <h3 className="mt-10 font-heading text-2xl font-semibold tracking-[-0.025em] text-[#F5F5F7] lg:mt-16">{s.title}</h3>
              <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
