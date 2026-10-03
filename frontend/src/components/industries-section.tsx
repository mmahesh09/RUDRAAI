import Reveal from "@/components/site/reveal";

// Typical starting points per sector — examples of what we'd build, not claims about past clients.
const INDUSTRIES = [
  {
    id: "saas",
    label: "SaaS",
    line: "Turn trials into customers without adding headcount.",
    examples: ["Lead-to-demo routing", "Onboarding email sequences", "Usage alerts for at-risk accounts", "Weekly product metrics to Slack"],
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    line: "Every order handled the same careful way, automatically.",
    examples: ["Abandoned-cart follow-ups", "Order and delivery questions answered by an agent", "Review requests after delivery", "Low-stock alerts to suppliers"],
  },
  {
    id: "agencies",
    label: "Agencies",
    line: "More client work, less admin around it.",
    examples: ["Client reports built and sent on schedule", "Proposal drafts from a short brief", "Project kick-off checklists", "Invoice and payment reminders"],
  },
  {
    id: "healthcare",
    label: "Clinics & healthcare",
    line: "Less time on the phone, fewer missed appointments.",
    examples: ["Online booking with reminders", "Answers to common patient questions", "Follow-up messages after visits", "Referral tracking"],
    note: "Patient data needs care. We scope privacy and compliance requirements with you before building anything.",
  },
  {
    id: "finance",
    label: "Finance & fintech",
    line: "Routine checks and reports, done on time, every time.",
    examples: ["Document collection for onboarding", "Scheduled reconciliation reports", "Alert routing to the right person", "Customer status updates"],
    note: "Regulated workflows are built to fit the compliance process you already have.",
  },
  {
    id: "operations",
    label: "Operations teams",
    line: "The glue between every tool your company uses.",
    examples: ["New-hire onboarding across tools", "Expense approval flows", "IT request routing", "Data kept in sync between systems"],
  },
];

/** Sector index: one ruled row per industry, every example visible (no tabs hiding content). */
export default function IndustriesSection() {
  return (
    <section id="industries" className="bg-black pb-24 md:pb-32">
      <div className="container-wide">
        <ol className="border-b border-white/[0.08]">
          {INDUSTRIES.map((ind, i) => (
            <Reveal as="li" key={ind.id} delay={0.04} className="border-t border-white/[0.08]">
              <div id={ind.id} className="grid scroll-mt-20 gap-6 py-12 lg:grid-cols-12 lg:gap-x-8">
                <p className="font-mono text-[11px] tracking-[0.14em] text-[#BF5AF2] lg:col-span-1 lg:pt-3">{String(i + 1).padStart(2, "0")}</p>
                <div className="lg:col-span-5">
                  <h2 className="font-heading text-[clamp(1.75rem,3.2vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[#F5F5F7]">
                    {ind.label}
                  </h2>
                  <p className="mt-3 max-w-[34ch] text-lg leading-snug text-[#A1A1AA]">{ind.line}</p>
                </div>
                <div className="lg:col-span-5 lg:col-start-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">Where we&apos;d start</p>
                  <ul className="mt-3 ledger border-y border-white/[0.08]">
                    {ind.examples.map((e) => (
                      <li key={e} className="py-3 text-[15px] text-[#F5F5F7]">
                        {e}
                      </li>
                    ))}
                  </ul>
                  {ind.note && <p className="mt-4 text-[14px] leading-relaxed text-[#A1A1AA]">{ind.note}</p>}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
