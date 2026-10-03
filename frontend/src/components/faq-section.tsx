import { Plus } from "lucide-react";
import SectionHead from "@/components/site/section-head";
import Reveal from "@/components/site/reveal";
import { SITE } from "@/lib/site";

const FAQS = [
  {
    q: "How long does a project take?",
    a: "Automations: 3–7 days. AI agents: 1–3 weeks. Websites: 2–4 weeks.",
  },
  {
    q: "How much does it cost?",
    a: "A fixed price, quoted after the first call. No hourly billing.",
  },
  {
    q: "Do I need to be technical?",
    a: "No. We build it and walk you through it in plain English.",
  },
  {
    q: "What happens if something breaks?",
    a: `We're alerted the moment a step fails. Fixes are free for the first ${SITE.supportDays} days.`,
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

/** §05 — FAQ as a ruled list of native disclosures (keyboard + screen-reader friendly, works without JS). */
export default function FaqSection() {
  return (
    <section id="faq" className="section-padding relative bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-12">
          <SectionHead index="05" label="Questions" title={<span>Straight <span className="text-[#BF5AF2]">answers.</span></span>} />
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <div className="ledger border-y border-white/[0.08]">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.03}>
                <details className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                    <span className="font-heading text-lg font-semibold tracking-[-0.02em] text-[#F5F5F7] sm:text-xl">{f.q}</span>
                    <Plus
                      className="h-5 w-5 flex-shrink-0 text-[#A1A1AA] transition-transform duration-300 group-open:rotate-45 group-open:text-[#BF5AF2]"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="max-w-[62ch] pb-6 text-[15px] leading-[1.75] text-[#A1A1AA]">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
