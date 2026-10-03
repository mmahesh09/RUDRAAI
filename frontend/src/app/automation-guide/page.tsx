import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import PageHero from "@/components/site/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Automation Guide — What to Automate First and How to Measure It",
  description:
    "A practical guide to automating a small business with n8n and AI: what to automate first, the mistakes to avoid, the tools we use, and a simple way to work out if it pays off.",
  alternates: { canonical: "/automation-guide" },
};

type Block = { kind: "p"; text: string } | { kind: "list"; items: { title: string; body: string }[] } | { kind: "formula"; lines: string[] };

const SECTIONS: { id: string; title: string; blocks: Block[] }[] = [
  {
    id: "what",
    title: "What automation actually is",
    blocks: [
      { kind: "p", text: "Automation means a computer doing a task a person currently does by hand: sending an email, updating a spreadsheet, logging a lead, booking a meeting." },
      { kind: "p", text: "For most small teams it isn't the important work that piles up — it's the copy-paste, the follow-ups and the data entry around it. That's what automation is for." },
      { kind: "p", text: "We mostly use n8n: a visual workflow builder that connects 400+ apps — Gmail, Slack, Notion, HubSpot, Cal.com, WhatsApp and more — and lets you define exactly what happens, step by step, when something occurs." },
    ],
  },
  {
    id: "questions",
    title: "Three questions before you automate anything",
    blocks: [
      {
        kind: "list",
        items: [
          { title: "Does it happen more than a few times a week?", body: "A one-off task isn't worth automating. The payoff comes from repetition." },
          { title: "Is it predictable?", body: "Automation works best when the same input should always lead to the same result. If every case needs judgement, keep a person in the loop." },
          { title: "What happens if it breaks?", body: "Tasks that move money or delete data need more testing and fallbacks. Notifications and logging are safe to automate quickly." },
        ],
      },
    ],
  },
  {
    id: "first",
    title: "Five automations most businesses need first",
    blocks: [
      {
        kind: "list",
        items: [
          { title: "Lead capture → CRM", body: "Every form, DM or email enquiry logged automatically, tagged with where it came from. Nothing falls through the cracks." },
          { title: "Meeting booked → briefing", body: "When a call is booked, an AI pulls together the prospect's website and past emails into a one-page brief, so you walk in prepared." },
          { title: "Brief → proposal draft", body: "A short form with the client's goal produces a first-draft proposal in your format, ready for you to edit and send." },
          { title: "Invoice → follow-ups", body: "Reminders go out on a schedule and stop automatically the moment payment lands." },
          { title: "New client → onboarding", body: "Contract signed: project created, welcome email sent with a checklist, team channel set up, kick-off call scheduled." },
        ],
      },
    ],
  },
  {
    id: "roi",
    title: "Working out whether it pays off",
    blocks: [
      { kind: "p", text: "A simple way to estimate it:" },
      {
        kind: "formula",
        lines: [
          "Monthly value = hours saved per week × hourly cost × 4.3",
          "Net = monthly value − running cost of the automation",
        ],
      },
      { kind: "p", text: "Example: two hours a day of manual lead handling at ₹1,000/hour is about 43 hours a month — roughly ₹43,000 of time. If the automation costs a fraction of that to build and run, it pays for itself quickly. If it doesn't, it isn't worth building yet." },
      { kind: "p", text: "On the free call we'll do this rough maths with you for the tasks you mention." },
    ],
  },
  {
    id: "mistakes",
    title: "Common mistakes",
    blocks: [
      {
        kind: "list",
        items: [
          { title: "Automating a broken process", body: "Automation makes a process faster, not better. Fix the steps first, then automate them." },
          { title: "Skipping error handling", body: "What happens when an app is down or rate-limits you? Every real workflow needs retries and a fallback path." },
          { title: "Not watching it after launch", body: "Workflows break when APIs change or logins expire. Set up alerts so failures are noticed, not discovered weeks later." },
          { title: "Doing too much at once", body: "Start with one workflow, learn from it, then add the next. Automating everything at once usually means nothing works well." },
          { title: "Ignoring data quality", body: "Messy data in means messy data everywhere, faster. Sometimes a clean-up comes before the automation." },
        ],
      },
    ],
  },
  {
    id: "tools",
    title: "The tools we use",
    blocks: [
      {
        kind: "list",
        items: [
          { title: "n8n", body: "Workflow engine — open source and self-hostable." },
          { title: "OpenRouter + Ollama", body: "Access to models like Claude, GPT and Llama, or local models that keep data on your machine." },
          { title: "Notion, Cal.com, Slack, Gmail", body: "Where the work actually happens for most small teams." },
          { title: "Supabase / PostgreSQL", body: "Structured data when a spreadsheet stops being enough." },
          { title: "Next.js + Vercel", body: "Websites and lightweight internal tools." },
        ],
      },
      { kind: "p", text: "Nothing here locks you in. Everything we build can be handed over and maintained by your own team." },
    ],
  },
];

const QUICK_WINS = [
  { task: "Contact form → CRM", effort: "~2 hours" },
  { task: "New booking → Slack alert", effort: "~1 hour" },
  { task: "Invoice sent → reminder sequence", effort: "~3 hours" },
  { task: "Support email → AI draft reply", effort: "~4 hours" },
  { task: "New blog post → social drafts", effort: "~2 hours" },
];

function BlockView({ block }: { block: Block }) {
  if (block.kind === "p") return <p className="text-[17px] leading-[1.8] text-[#A1A1AA]">{block.text}</p>;
  if (block.kind === "formula")
    return (
      <div className="rounded-xl border border-white/[0.08] bg-[#0B0B0C] px-5 py-4 font-mono text-[13px] leading-[1.9] text-[#F5F5F7]">
        {block.lines.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
    );
  return (
    <ol className="ledger border-y border-white/[0.08]">
      {block.items.map((item, i) => (
        <li key={item.title} className="grid grid-cols-[2.5rem_1fr] py-5">
          <span className="pt-1 font-mono text-[11px] tracking-[0.14em] text-[#8A8A93]">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="font-heading text-lg font-semibold tracking-[-0.02em] text-[#F5F5F7]">{item.title}</h3>
            <p className="mt-1 text-[15px] leading-[1.7] text-[#A1A1AA]">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function AutomationGuidePage() {
  return (
    <main className="bg-black">
      <Navbar />
      <PageHero
        label="Guide"
        title="What to automate first — and how to tell if it's working."
        intro="A short, practical guide for small teams. No jargon, no hype — just the questions, examples and maths we use with clients."
      />

      <div className="container-wide grid gap-12 border-t border-white/[0.08] py-16 md:py-24 lg:grid-cols-12 lg:gap-x-8">
        {/* Sidebar: contents + quick wins */}
        <aside className="lg:col-span-3">
          <div className="lg:sticky lg:top-24 space-y-10">
            <nav aria-label="Guide contents">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">Contents</p>
              <ol className="mt-3 space-y-2.5">
                {SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex gap-3 text-[14px] leading-snug text-[#A1A1AA] transition-colors hover:text-[#F5F5F7]">
                      <span className="font-mono text-[11px] text-[#8A8A93] pt-0.5">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#2997FF]">Quick wins</p>
              <ul className="mt-3 ledger border-y border-white/[0.08]">
                {QUICK_WINS.map((w) => (
                  <li key={w.task} className="flex items-baseline justify-between gap-3 py-2.5">
                    <span className="text-[14px] text-[#F5F5F7]">{w.task}</span>
                    <span className="shrink-0 font-mono text-[11px] text-[#8A8A93]">{w.effort}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Reading column */}
        <article className="max-w-[68ch] space-y-20 lg:col-span-8 lg:col-start-5">
          {SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#2997FF]">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#F5F5F7]">
                {s.title}
              </h2>
              <div className="mt-6 space-y-5">
                {s.blocks.map((b, j) => (
                  <BlockView key={j} block={b} />
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>

      <CTASection />
      <Footer />
    </main>
  );
}
