"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Heart, Users, Workflow, Code2, MessageSquare, BarChart3, Bot, Filter, PlugZap, Mail, Search, FileText } from "lucide-react";

const values = [
  { icon: Zap, title: "Speed Over Perfection", description: "Ship fast, learn fast. I favor 80% solutions that deliver value in days over perfect solutions that take months.", color: "#FF6B00" },
  { icon: Target, title: "Outcome-Driven", description: "I measure success in hours saved and revenue generated — not features shipped or lines of code written.", color: "#10B981" },
  { icon: Heart, title: "Client Partnership", description: "I treat your business like my own. Your bottlenecks become my obsession, your wins become my motivation.", color: "#EC4899" },
  { icon: Users, title: "Transparent by Default", description: "No black boxes. You see every workflow, every cost, every decision. I build systems you understand and own.", color: "#8B5CF6" },
];

const skills = [
  { icon: Workflow, label: "n8n", desc: "Advanced workflow design, custom nodes, self-hosted deployments", color: "#FF6B00" },
  { icon: Code2, label: "AI & LLMs", desc: "GPT-4o, Claude, Gemini — integrated directly into production workflows", color: "#8B5CF6" },
  { icon: MessageSquare, label: "API Integrations", desc: "REST, webhooks, OAuth — connecting any tool in your stack", color: "#3B82F6" },
  { icon: BarChart3, label: "Data Pipelines", desc: "Automated reporting, data sync, transformation, and enrichment", color: "#10B981" },
];

const offerings = [
  {
    icon: Workflow,
    title: "n8n Workflow Automation",
    color: "#FF6B00",
    description:
      "The core of everything we do. We design production-grade n8n workflows that connect your entire stack and run 24/7 — with retries, error handling, and alerting built in.",
    points: ["Custom multi-step workflows", "Self-hosted or cloud n8n", "Error handling & retry logic", "Monitoring and failure alerts"],
  },
  {
    icon: Bot,
    title: "AI Agents & Assistants",
    color: "#8B5CF6",
    description:
      "We embed LLMs like GPT-4o, Claude, and Gemini directly into your operations — agents that read, decide, draft, and act instead of just chatting.",
    points: ["Chatbots & support assistants", "Document & email summarization", "Smart routing and classification", "Human-in-the-loop approvals"],
  },
  {
    icon: Filter,
    title: "Lead Qualification & Enrichment",
    color: "#10B981",
    description:
      "Stop chasing cold leads by hand. We automatically capture, enrich, score, and route every inbound lead so your team only touches the ones worth their time.",
    points: ["Auto-capture from forms & ads", "Data enrichment from public sources", "Lead scoring rules", "Instant routing to sales"],
  },
  {
    icon: PlugZap,
    title: "CRM & Tool Integrations",
    color: "#3B82F6",
    description:
      "We connect the tools you already pay for — CRM, sheets, Slack, calendars, payment, and support — so data flows between them automatically with no copy-paste.",
    points: ["Two-way CRM sync", "Slack & email notifications", "Calendar & booking automation", "Any REST / webhook / OAuth API"],
  },
  {
    icon: Mail,
    title: "Email & Outreach Sequences",
    color: "#EC4899",
    description:
      "Personalized, event-driven email and outreach that fires at exactly the right moment — onboarding, follow-ups, nurture, and re-engagement — fully hands-off.",
    points: ["Triggered onboarding flows", "Follow-up & nurture sequences", "AI-personalized copy", "Deliverability-friendly sending"],
  },
  {
    icon: Search,
    title: "Content & SEO Automation",
    color: "#F59E0B",
    description:
      "We automate the repetitive parts of content — research, drafting, formatting, and publishing — so you ship more without hiring a full content team.",
    points: ["Automated content research", "AI drafting & rewriting", "Auto-formatting & publishing", "SEO metadata generation"],
  },
];

export default function AboutView() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide text-center">
          <Badge className="mb-4">The Story</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-6 leading-tight">
            I'm an Automation{" "}
            <span className="text-gradient-orange">Obsessive</span>
          </h1>
          <p className="text-[#A1A1AA] font-body text-xl max-w-3xl mx-auto leading-relaxed">
            RudraAI is a focused automation agency built on n8n. No bloated agency overhead,
            no black-box software — just expert-level workflows and AI agents, built right the first time.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">The Founder</Badge>
              <h2 className="text-3xl font-heading font-black text-white mb-4">
                Hi, I'm Mahesh Babu
              </h2>
              <p className="text-[#A1A1AA] font-body leading-relaxed mb-4 text-lg">
                I started RudraAI in 2026 because I kept watching smart business owners spend hours
                every single day on work that could — and should — be running automatically.
                Copy-pasting between tools, chasing leads by hand, sending the same emails over and
                over. That time is the most expensive thing a growing business owns, and it was being
                thrown away on tasks a machine does better.
              </p>
              <p className="text-[#A1A1AA] font-body leading-relaxed mb-4">
                My specialty is n8n — the most powerful open-source automation platform available.
                I use it to build workflows that connect your entire business stack, handle errors
                gracefully, and run 24/7 without any babysitting. On top of that I layer in modern AI:
                LLMs that read, summarize, decide, and draft, so your automations don't just move data
                around — they actually think.
              </p>
              <p className="text-[#A1A1AA] font-body leading-relaxed mb-4">
                I'm intentionally lean. When you work with RudraAI you talk to the person building your
                system — not an account manager, not a junior contractor, not a ticket queue. That means
                faster decisions, deeper understanding of your operations, and no cost padding for offices
                and middle management you don't need.
              </p>
              <p className="text-[#A1A1AA] font-body leading-relaxed">
                Every system I build is documented, version-controlled, and fully handed over to you.
                I don't create dependency — I create ownership. You'll understand every workflow
                I deliver, you'll be able to see exactly what it does, and you'll own it completely.
              </p>
            </div>

            <div className="space-y-4">
              {skills.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-4 p-4 rounded-xl neo-card"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <div>
                      <p className="font-subheading font-bold text-white text-sm mb-0.5">{s.label}</p>
                      <p className="text-xs font-body text-[#71717A] leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-[#0D0D14]">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: "2026", label: "Founded" },
              { value: "n8n", label: "Core Platform" },
              { value: "24/7", label: "Workflows Run" },
              { value: "1:1", label: "Direct With Founder" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-2xl neo-card text-center"
              >
                <div className="text-3xl font-heading font-black text-[#FF6B00] mb-1">{s.value}</div>
                <div className="text-sm font-body text-[#71717A]">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container-wide max-w-3xl mx-auto text-center">
          <Badge className="mb-4">Mission</Badge>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white mb-6">
            Why I Built RudraAI
          </h2>
          <p className="text-[#A1A1AA] font-body leading-relaxed mb-4 text-lg">
            Every business — from solo operators to growing startups — deserves access to
            the same automation superpowers that tech giants build in-house with entire engineering teams.
          </p>
          <p className="text-[#A1A1AA] font-body leading-relaxed mb-4">
            But most automation agencies charge enterprise rates, lock you into open-ended retainers,
            and deliver black-box systems you can't maintain yourself. The moment you stop paying, the
            automation stops working — and you're back where you started. I built RudraAI to be the
            opposite: transparent, fast, affordable, and built to last long after the project ends.
          </p>
          <p className="text-[#A1A1AA] font-body leading-relaxed">
            My goal is simple — understand your exact operations, build the right automation,
            and hand it over so your business runs smarter whether I'm around or not. Software should
            work for you around the clock so you can spend your time on the things only a human can do.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="section-padding bg-[#0D0D14]">
        <div className="container-wide">
          <div className="text-center mb-12">
            <Badge className="mb-4">What We Offer</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white mb-4">
              Automation, End to End
            </h2>
            <p className="text-[#A1A1AA] font-body text-lg max-w-2xl mx-auto leading-relaxed">
              From a single time-saving workflow to a fully automated back office, here's how
              RudraAI puts your busywork on autopilot.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offerings.map((o, i) => {
              const Icon = o.icon;
              return (
                <motion.div
                  key={o.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="p-6 rounded-2xl neo-card flex flex-col"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${o.color}15`, border: `1px solid ${o.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: o.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-lg mb-2">{o.title}</h3>
                  <p className="text-sm font-body text-[#A1A1AA] leading-relaxed mb-4">{o.description}</p>
                  <ul className="mt-auto space-y-1.5">
                    {o.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs font-body text-[#71717A]">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: o.color }}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Plus row — additional deliverables */}
          <div className="grid sm:grid-cols-2 gap-5 mt-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-6 rounded-2xl neo-card flex items-start gap-4"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#3B82F615", border: "1px solid #3B82F630" }}
              >
                <FileText className="w-5 h-5" style={{ color: "#3B82F6" }} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">Onboarding & Proposal Automation</h3>
                <p className="text-sm font-body text-[#A1A1AA] leading-relaxed">
                  New-client intake, contract and proposal generation, welcome sequences, and task
                  creation — the moment a deal closes, the paperwork and setup handle themselves.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.06 }}
              className="p-6 rounded-2xl neo-card flex items-start gap-4"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#10B98115", border: "1px solid #10B98130" }}
              >
                <BarChart3 className="w-5 h-5" style={{ color: "#10B981" }} />
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">Reporting & Data Pipelines</h3>
                <p className="text-sm font-body text-[#A1A1AA] leading-relaxed">
                  Automated dashboards, scheduled reports, and data sync across your tools — so the
                  numbers you need are always fresh, accurate, and delivered without anyone lifting a finger.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <Badge className="mb-4">My Values</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
              How I Think & Work
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="p-6 rounded-2xl neo-card"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${v.color}15`, border: `1px solid ${v.color}30` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: v.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-sm font-body text-[#71717A] leading-relaxed">{v.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
