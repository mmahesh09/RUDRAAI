import SectionHead from "@/components/site/section-head";
import Reveal from "@/components/site/reveal";

// Illustrative examples of the work we take off people's plates — not client data.
const ROWS = [
  { task: "New enquiry from the website", today: "Sits in an inbox until someone notices", after: "Answered in seconds, logged in the CRM, sales pinged" },
  { task: "“Do you deliver to…?” questions", today: "Same five answers typed out every day", after: "An assistant trained on your FAQs replies, day or night" },
  { task: "Invoices and payment reminders", today: "Built by hand, chased by hand", after: "Generated on completion, reminders sent on schedule" },
  { task: "Weekly numbers for the team", today: "An afternoon of copy-paste into a sheet", after: "A report lands in Slack every Monday at 9:00" },
];

/** §01 — the manual work, as a ledger: what it costs today, what replaces it. */
export default function ProblemSection() {
  return (
    <section id="problem" className="section-padding relative bg-black">
      <div className="container-wide">
        <SectionHead
          index="01"
          label="The work that eats your week"
          title="Your team is still doing a computer's job."
          intro="None of it is hard. It's just constant — and every hour spent on it is an hour not spent on customers."
        />

        <div className="mt-16 lg:mt-24" role="table" aria-label="Manual work and what replaces it">
          <div role="row" className="hidden md:grid grid-cols-12 gap-x-8 pb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
            <span role="columnheader" className="col-span-4">The task</span>
            <span role="columnheader" className="col-span-4">Today</span>
            <span role="columnheader" className="col-span-4 text-[#2997FF]">After</span>
          </div>
          <div role="rowgroup" className="border-b border-white/[0.08]">
            {ROWS.map((r, i) => (
              <Reveal key={r.task} delay={i * 0.05}>
                <div role="row" className="grid gap-y-3 border-t border-white/[0.08] py-7 md:grid-cols-12 md:gap-x-8 md:py-8">
                  <p role="cell" className="md:col-span-4 font-heading text-xl font-semibold tracking-[-0.02em] text-[#F5F5F7]">
                    {r.task}
                  </p>
                  <p role="cell" className="md:col-span-4 text-[15px] leading-relaxed text-[#8A8A93] line-through decoration-white/20">
                    <span className="sr-only">Today: </span>
                    {r.today}
                  </p>
                  <p role="cell" className="md:col-span-4 text-[15px] leading-relaxed text-[#F5F5F7]">
                    <span className="sr-only">After: </span>
                    {r.after}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
