"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, Heart, Users, Workflow, Code2, MessageSquare, BarChart3 } from "lucide-react";

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

const journey = [
  { year: "2022", event: "Started building automation scripts for personal SaaS projects — got obsessed." },
  { year: "2023", event: "Discovered n8n. Automated a full client onboarding flow in a weekend. Never looked back." },
  { year: "2024", event: "Started taking freelance automation projects. Shipped 10+ production workflows for clients." },
  { year: "2025", event: "Founded RudraAI to formalize the work and help more businesses unlock automation at scale." },
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
            RudraAI is a one-person automation agency. No bloated agency overhead.
            Just focused, expert-level n8n work — built right the first time.
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
                I started RudraAI because I kept watching smart business owners spend hours
                every day on work that could — and should — be running automatically.
              </p>
              <p className="text-[#A1A1AA] font-body leading-relaxed mb-4">
                My specialty is n8n: the most powerful open-source automation platform available.
                I use it to build workflows that connect your entire business stack, handle errors
                gracefully, and run 24/7 without any babysitting.
              </p>
              <p className="text-[#A1A1AA] font-body leading-relaxed">
                Every system I build is documented, version-controlled, and fully handed over to you.
                I don't create dependency — I create ownership. You'll understand every workflow
                I deliver, and you'll own it completely.
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
              { value: "0", label: "Clients Served" },
              { value: "0", label: "Automations Live" },
              { value: "--", label: "Avg Client Rating" },
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
            the same automation superpowers that tech giants build in-house.
          </p>
          <p className="text-[#A1A1AA] font-body leading-relaxed mb-4">
            But most automation agencies charge enterprise rates, lock you into retainers,
            and deliver black-box systems you can't maintain yourself. I built RudraAI to
            be the opposite: transparent, fast, affordable, and built to last.
          </p>
          <p className="text-[#A1A1AA] font-body leading-relaxed">
            My goal is simple — understand your exact operations, build the right automation,
            and hand it over so your business runs smarter whether I'm around or not.
          </p>
        </div>
      </section>

      {/* Journey */}
      <section className="section-padding bg-[#0D0D14]">
        <div className="container-wide">
          <div className="text-center mb-12">
            <Badge className="mb-4">The Journey</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
              How I Got Here
            </h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {journey.map((j, i) => (
              <motion.div
                key={j.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-6 p-5 rounded-2xl neo-card"
              >
                <div className="text-xl font-heading font-black text-[#FF6B00] w-12 flex-shrink-0">{j.year}</div>
                <p className="text-sm font-body text-[#A1A1AA] leading-relaxed">{j.event}</p>
              </motion.div>
            ))}
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
