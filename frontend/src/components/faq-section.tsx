import { Plus } from "lucide-react";
import SectionHead from "@/components/site/section-head";
import Reveal from "@/components/site/reveal";
import { SITE } from "@/lib/site";

const FAQS = [
  {
    q: "How long does a project take?",
    a: "A single automation is usually live in 3–7 days. An AI agent takes 1–3 weeks, a website 2–4 weeks. You get a firm timeline in the written plan before anything starts.",
  },
  {
    q: "How much does it cost?",
    a: "Every project is quoted at a fixed price after the first call, based on what's actually being built. No hourly billing, no surprise invoices.",
  },
  {
    q: "Do I need to be technical?",
    a: "No. We handle the build and explain it in plain English. You get documentation and a short walkthrough, and we're a message away if something needs changing.",
  },
  {
    q: "Which tools can you connect?",
    a: "Most of them. n8n works with 400+ apps — Google Workspace, HubSpot, Slack, Notion, Airtable, Stripe, Shopify, WhatsApp and more — and anything else with an API or webhook.",
  },
  {
    q: "What happens if something breaks?",
    a: `Automations are set up to alert us when a step fails. For the first ${SITE.supportDays} days after launch, fixes are free. After that, ongoing support is optional.`,
  },
  {
    q: "Where does my data live?",
    a: "In your accounts. Workflows run on your own n8n instance or a cloud environment set up in your name, and you hold the logins. We're happy to sign an NDA before we start.",
  },
  {
    q: "What is the free call, exactly?",
    a: `${SITE.call.minutes} minutes on a ${SITE.call.days.replace(" & ", " or ")}. You describe the work that's slowing you down; we tell you what we'd build and roughly what it would take. No slides, no pressure.`,
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

/** §06 — FAQ as a ruled list of native disclosures (keyboard + screen-reader friendly, works without JS). */
export default function FaqSection() {
  return (
    <section id="faq" className="section-padding relative bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-12">
          <SectionHead index="06" label="Questions" title="Straight answers." />
        </div>
        <div className="lg:col-span-8 lg:col-start-5">
          <div className="ledger border-y border-white/[0.08]">
            {FAQS.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.03}>
                <details className="group py-1">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                    <span className="font-heading text-lg font-semibold tracking-[-0.02em] text-[#F5F5F7] sm:text-xl">{f.q}</span>
                    <Plus
                      className="h-5 w-5 flex-shrink-0 text-[#A1A1AA] transition-transform duration-300 group-open:rotate-45 group-open:text-[#2997FF]"
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
