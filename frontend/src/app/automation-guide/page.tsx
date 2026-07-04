import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Clock, DollarSign, AlertCircle } from "lucide-react";

export const metadata = {
  title: "The Automation Guide — RudraAI",
  description:
    "A practical guide to automating your business with n8n and AI. Learn what to automate first, which tools to use, and how to measure ROI.",
  alternates: { canonical: "/automation-guide" },
};

const sections = [
  {
    number: "01",
    title: "What is business automation?",
    content: `Automation means making a computer do a task that a human currently does by hand — sending an email, updating a spreadsheet, qualifying a lead, scheduling a meeting.

Most businesses are losing 10–30 hours per week on work like this. It's not the important work. It's the copy-paste, the follow-up, the data entry.

n8n is the tool we use. It's a visual workflow builder that connects 400+ apps — Gmail, Slack, Notion, HubSpot, Cal.com, WhatsApp, and hundreds more — and lets you define exactly what should happen when something occurs.`,
  },
  {
    number: "02",
    title: "The 3 questions to ask before automating anything",
    content: `Before touching a single workflow, answer these three questions:

1. Does this happen more than 5 times a week?
If it's a one-off task, it's not worth automating. Automation pays off through repetition.

2. Is the process consistent and predictable?
Automation works best when the same input always produces the same output. If every case is unique, a human makes a better decision.

3. What happens if it breaks?
High-stakes tasks (moving money, deleting data) need more testing and fallbacks. Low-stakes tasks (sending a notification, logging a row) are safe to automate quickly.`,
  },
  {
    number: "03",
    title: "The 5 automations most businesses need first",
    content: `In order of ROI, here are the workflows that make the biggest difference fastest:

1. Lead capture → CRM
Every contact form submission, inbound DM, or email inquiry automatically logged in Notion or your CRM, tagged with source and timestamp. Nothing falls through the cracks.

2. Meeting booked → Preparation
When a call is booked, an AI automatically pulls the prospect's LinkedIn, website, and any prior emails and creates a briefing doc. You walk into every call prepared.

3. Proposal generation
Send us a lead's name, company, and goal — we generate a branded HTML proposal via AI and email it within 60 seconds.

4. Invoice → Follow-up sequence
When an invoice is issued, start a follow-up email sequence that pauses automatically the moment payment lands.

5. New client → Onboarding
When a contract is signed, automatically: create the project in Notion, send a welcome email with a checklist, add them to Slack, and schedule the kickoff call.`,
  },
  {
    number: "04",
    title: "How to measure automation ROI",
    content: `Use this simple formula:

Monthly ROI = (Hours saved × Your hourly rate × 4.3 weeks) − Monthly automation cost

Example:
A 2-hour/day manual lead qualification process at ₹1,000/hr:
Hours saved = 2 × 5 days × 4.3 weeks = 43 hours/month
Value = 43 × ₹1,000 = ₹43,000/month
Automation cost = ₹8,300/month (our Growth plan)
Net ROI = ₹34,700/month

The free automation audit we offer includes this exact calculation for your top 3 processes.`,
  },
  {
    number: "05",
    title: "Common automation mistakes",
    content: `1. Automating a broken process
Automation makes bad processes faster and more consistent. Fix the process first, then automate it.

2. Skipping error handling
What happens if Slack is down? If your CRM API rate-limits? Every production workflow needs fallbacks. We build these into every automation.

3. Not monitoring after launch
Workflows can break when APIs change, tokens expire, or data formats shift. We include 30 days of monitoring on every project — and alert you before a silent failure costs you a client.

4. Automating too much too fast
Start with one workflow. Learn from it. Then add more. Trying to automate everything at once usually results in nothing working well.

5. Ignoring data quality
Garbage in, garbage out. If your CRM has inconsistent data, your automation will propagate that mess. A data audit often precedes a successful automation project.`,
  },
  {
    number: "06",
    title: "The tools we use",
    content: `n8n — workflow orchestration engine (self-hostable, open source)
OpenRouter — AI model access (Claude, GPT-4, Llama via one API)
Ollama — local AI model runner (free, private, runs on your machine)
Notion — internal knowledge base and CRM
Cal.com — open-source booking and scheduling
Gmail / SMTP — email delivery
Slack — team notifications
Supabase / PostgreSQL — structured data storage
Vercel — frontend hosting

We don't lock you into proprietary tools. Everything we build can be handed over and maintained by your own team.`,
  },
];

const quickWins = [
  "Contact form → Notion CRM (2 hours to build)",
  "New booking → Slack alert (1 hour to build)",
  "Invoice sent → Follow-up email sequence (3 hours to build)",
  "Support email → AI draft reply (4 hours to build)",
  "New blog post → Social media draft (2 hours to build)",
];

export default function AutomationGuidePage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide text-center">
          <Badge className="mb-4">Practical Guide</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-5 leading-tight">
            The Business{" "}
            <span className="text-gradient-orange">Automation</span> Guide
          </h1>
          <p className="text-[#A1A1AA] font-body text-xl max-w-2xl mx-auto">
            What to automate first, which tools to use, and how to measure whether it's actually working.
            Written from building 10+ real automations for real businesses.
          </p>
        </div>
      </div>

      <section className="section-padding pt-4">
        <div className="container-wide max-w-4xl mx-auto">

          {/* Quick wins box */}
          <div className="mb-16 p-6 rounded-2xl bg-gradient-to-br from-[rgba(255,107,0,0.1)] to-[rgba(255,107,0,0.03)] border border-[rgba(255,107,0,0.2)]">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#FF6B00]" />
              <h3 className="font-heading font-bold text-white">Quick wins — automate these this week</h3>
            </div>
            <div className="space-y-2">
              {quickWins.map((win) => (
                <div key={win} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-body text-[#A1A1AA]">{win}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-16">
            {sections.map((section) => (
              <div key={section.number} className="group">
                <div className="flex items-start gap-5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-xs font-mono font-bold text-[#FF6B00]">{section.number}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-heading font-black text-white leading-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="ml-15 pl-[60px]">
                  {section.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-[#A1A1AA] font-body leading-relaxed mb-4 text-base whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
                <div className="border-b border-white/06 mt-12" />
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-2xl bg-white/[0.03] border border-white/08 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-[#FF6B00]" />
              <DollarSign className="w-5 h-5 text-[#10B981]" />
              <AlertCircle className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="font-heading font-bold text-white text-xl mb-3">
              Want someone to do this for you?
            </h3>
            <p className="text-[#A1A1AA] font-body mb-6 max-w-lg mx-auto">
              Book a free 60-minute automation audit. I'll map your top 3 manual processes,
              calculate the ROI, and tell you exactly what to automate first — at no cost.
            </p>
            <Button asChild size="lg">
              <Link href="/booking">
                Book Free Audit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
