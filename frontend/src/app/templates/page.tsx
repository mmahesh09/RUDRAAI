import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  MessageSquare,
  Star,
  Calendar,
  UserPlus,
  FileText,
  Mail,
  Database,
  Bell,
  PenLine,
  Rocket,
  ArrowRight,
  Zap,
} from "lucide-react";

export const metadata = {
  title: "n8n Automation Templates — RudraAI",
  description:
    "10 production-ready n8n automation templates powering the RudraAI website — AI chat, lead qualification, CRM sync, onboarding, and more.",
};

const templates = [
  {
    number: "01",
    icon: MessageSquare,
    name: "AI Chat Agent",
    tag: "Homepage Assistant",
    description:
      "A floating AI chat widget that answers visitor questions about services and pricing. Runs on OpenRouter (Llama 3.3) with Ollama as a local fallback. Keeps conversation history, suggests starter prompts, and rate-limits to prevent abuse.",
    tools: ["OpenRouter", "Ollama", "n8n Webhook", "Llama 3.3"],
    color: "from-[rgba(255,107,0,0.15)] to-[rgba(255,107,0,0.05)]",
    border: "border-[rgba(255,107,0,0.25)]",
    iconBg: "bg-[rgba(255,107,0,0.15)]",
    iconColor: "text-[#FF6B00]",
    category: "AI",
  },
  {
    number: "02",
    icon: Star,
    name: "Lead Qualification Agent",
    tag: "Scores & Categorizes",
    description:
      "Every contact form submission is scored 1–10 by an AI (HOT/WARM/COLD) based on budget, message clarity, and company context. Saves the scored lead to Notion and fires a Slack alert with the recommended plan.",
    tools: ["OpenRouter", "Notion", "Slack", "n8n Webhook"],
    color: "from-[rgba(139,92,246,0.15)] to-[rgba(139,92,246,0.05)]",
    border: "border-[rgba(139,92,246,0.25)]",
    iconBg: "bg-[rgba(139,92,246,0.15)]",
    iconColor: "text-purple-400",
    category: "Lead Ops",
  },
  {
    number: "03",
    icon: Calendar,
    name: "Cal.com Booking Automation",
    tag: "Meeting Scheduling",
    description:
      "Listens for Cal.com booking webhooks and instantly logs the meeting in Notion, sends a branded confirmation email with prep questions, and pings Slack. Zero manual steps between 'booked' and 'ready'.",
    tools: ["Cal.com", "Notion", "SMTP Email", "Slack"],
    color: "from-[rgba(16,185,129,0.15)] to-[rgba(16,185,129,0.05)]",
    border: "border-[rgba(16,185,129,0.25)]",
    iconBg: "bg-[rgba(16,185,129,0.15)]",
    iconColor: "text-emerald-400",
    category: "Scheduling",
  },
  {
    number: "04",
    icon: UserPlus,
    name: "Contact Form → CRM",
    tag: "Lead Capture",
    description:
      "Contact form submissions hit this workflow first — it creates a Notion CRM record tagged with source and timestamp, then chains into the Lead Qualification workflow automatically. Single source of truth from the first touchpoint.",
    tools: ["Notion", "n8n Webhook", "Chain to Workflow 02"],
    color: "from-[rgba(59,130,246,0.15)] to-[rgba(59,130,246,0.05)]",
    border: "border-[rgba(59,130,246,0.25)]",
    iconBg: "bg-[rgba(59,130,246,0.15)]",
    iconColor: "text-blue-400",
    category: "Lead Ops",
  },
  {
    number: "05",
    icon: FileText,
    name: "Proposal Generator",
    tag: "AI-Powered",
    description:
      "Accepts lead details and uses OpenRouter to write a fully branded HTML automation proposal tailored to the client's stated needs and budget. Emails it directly to the prospect within seconds of the trigger.",
    tools: ["OpenRouter", "SMTP Email", "n8n Webhook", "Llama 3.3"],
    color: "from-[rgba(245,158,11,0.15)] to-[rgba(245,158,11,0.05)]",
    border: "border-[rgba(245,158,11,0.25)]",
    iconBg: "bg-[rgba(245,158,11,0.15)]",
    iconColor: "text-amber-400",
    category: "AI",
  },
  {
    number: "06",
    icon: Mail,
    name: "Email Follow-up Sequence",
    tag: "5-Day Nurture",
    description:
      "A time-gated 3-email nurture sequence triggered by any lead event. Day 1 asks a qualifying question. Day 3 shares the top 3 automations clients love. Day 5 closes with a soft CTA. All using n8n's built-in Wait nodes.",
    tools: ["SMTP Email", "n8n Wait", "n8n Webhook"],
    color: "from-[rgba(239,68,68,0.15)] to-[rgba(239,68,68,0.05)]",
    border: "border-[rgba(239,68,68,0.25)]",
    iconBg: "bg-[rgba(239,68,68,0.15)]",
    iconColor: "text-red-400",
    category: "Email",
  },
  {
    number: "07",
    icon: Database,
    name: "RAG Knowledge Base Chatbot",
    tag: "Context-Aware",
    description:
      "A Retrieval-Augmented Generation chatbot that searches a built-in knowledge base before calling the LLM. Retrieves the most relevant context about services, pricing, and process, then answers accurately without hallucinating.",
    tools: ["OpenRouter", "Ollama", "n8n Code Node", "RAG"],
    color: "from-[rgba(6,182,212,0.15)] to-[rgba(6,182,212,0.05)]",
    border: "border-[rgba(6,182,212,0.25)]",
    iconBg: "bg-[rgba(6,182,212,0.15)]",
    iconColor: "text-cyan-400",
    category: "AI",
  },
  {
    number: "08",
    icon: Bell,
    name: "Slack / Discord Notifications",
    tag: "Team Alerts",
    description:
      "A universal notification hub. Any other workflow can POST to this webhook with a type (lead, booking, proposal, onboarding) and it formats and delivers a rich message to both Slack and Discord simultaneously.",
    tools: ["Slack Webhook", "Discord Webhook", "n8n Webhook"],
    color: "from-[rgba(99,102,241,0.15)] to-[rgba(99,102,241,0.05)]",
    border: "border-[rgba(99,102,241,0.25)]",
    iconBg: "bg-[rgba(99,102,241,0.15)]",
    iconColor: "text-indigo-400",
    category: "Notifications",
  },
  {
    number: "09",
    icon: PenLine,
    name: "SEO Content Generator",
    tag: "Blog & Landing Pages",
    description:
      "Accepts a topic and target keyword, generates a fully SEO-optimized blog post or landing page draft with H1, H2s, meta description, and CTAs — saved automatically to a Notion content calendar as a Draft.",
    tools: ["OpenRouter", "Notion", "n8n Webhook", "Llama 3.3"],
    color: "from-[rgba(236,72,153,0.15)] to-[rgba(236,72,153,0.05)]",
    border: "border-[rgba(236,72,153,0.25)]",
    iconBg: "bg-[rgba(236,72,153,0.15)]",
    iconColor: "text-pink-400",
    category: "Content",
  },
  {
    number: "10",
    icon: Rocket,
    name: "Client Onboarding Automation",
    tag: "Project Kickoff",
    description:
      "Triggered when a new client is confirmed. Auto-generates a project ID, creates the project page in Notion with kickoff and delivery dates, sends a branded welcome email with a checklist, alerts Slack, and sends a Day 2 access reminder.",
    tools: ["Notion", "SMTP Email", "Slack", "n8n Wait"],
    color: "from-[rgba(255,107,0,0.15)] to-[rgba(139,92,246,0.05)]",
    border: "border-[rgba(255,107,0,0.2)]",
    iconBg: "bg-[rgba(255,107,0,0.15)]",
    iconColor: "text-[#FF6B00]",
    category: "Onboarding",
  },
];

const categories = ["All", "AI", "Lead Ops", "Scheduling", "Email", "Notifications", "Content", "Onboarding"];

export default function TemplatesPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <div className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide text-center">
          <Badge className="mb-4">Internal Automation Stack</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-4 leading-tight">
            10 n8n Templates{" "}
            <span className="text-gradient-orange">Powering This Site</span>
          </h1>
          <p className="text-[#A1A1AA] font-body text-xl max-w-2xl mx-auto mb-6">
            Every automation here runs behind the scenes on this website — from the chat widget
            you see to the lead scoring that happens when you submit a form.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)]">
              <Zap className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-sm font-subheading font-semibold text-[#FF6B00]">OpenRouter Primary</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10">
              <span className="text-sm font-subheading font-semibold text-[#A1A1AA]">Ollama Fallback</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10">
              <span className="text-sm font-subheading font-semibold text-[#A1A1AA]">n8n via Docker</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/10">
              <span className="text-sm font-subheading font-semibold text-[#A1A1AA]">Notion CRM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <section className="section-padding pt-8">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {templates.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.number}
                  className={`relative rounded-2xl bg-gradient-to-br ${t.color} border ${t.border} p-6 flex flex-col gap-4 group hover:scale-[1.01] transition-transform duration-200`}
                >
                  {/* Number badge */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-[#71717A]">{t.number}</span>
                  </div>

                  {/* Icon + title */}
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${t.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${t.iconColor}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-heading font-bold text-white text-lg leading-tight">{t.name}</h3>
                      </div>
                      <span className={`text-xs font-subheading font-semibold ${t.iconColor} uppercase tracking-wider`}>
                        {t.tag}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[#A1A1AA] font-body text-sm leading-relaxed">{t.description}</p>

                  {/* Tool tags */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {t.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-xs font-subheading font-medium px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/08 text-[#71717A]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-2xl bg-gradient-to-br from-[rgba(255,107,0,0.1)] to-[rgba(139,92,246,0.05)] border border-[rgba(255,107,0,0.2)] p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] flex items-center justify-center mx-auto mb-5">
              <Zap className="w-7 h-7 text-[#FF6B00]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mb-3">
              Want these automations for your business?
            </h2>
            <p className="text-[#A1A1AA] font-body max-w-xl mx-auto mb-8">
              We'll build and deploy the same stack customised for your tools, brand, and workflows.
              From $50 for a single automation to a full 5-workflow system at $200.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/booking">
                  Book Free Audit Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/pricing">See Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
