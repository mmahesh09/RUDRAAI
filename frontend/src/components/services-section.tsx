"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Workflow,
  CheckCircle2,
  Zap,
  Shield,
  GitBranch,
  Clock,
  Plug,
  Server,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Plug, label: "500+ pre-built integrations", desc: "Connect any app in your stack — CRM, email, databases, payments, and more." },
  { icon: Shield, label: "Error handling & retry logic", desc: "Workflows that self-heal: automatic retries, fallback paths, and failure alerts." },
  { icon: Server, label: "Self-hosted or cloud deploy", desc: "Full control over your data with self-hosted n8n, or managed cloud — your choice." },
  { icon: GitBranch, label: "Version control & rollback", desc: "Every workflow change is tracked. Roll back to any previous version instantly." },
  { icon: Clock, label: "Webhooks, cron & event triggers", desc: "Run automations on a schedule, on demand, or in real-time from any event." },
  { icon: RefreshCw, label: "Real-time monitoring & alerts", desc: "Live execution logs, failure notifications, and health dashboards built in." },
  { icon: Zap, label: "Custom code nodes (JS / Python)", desc: "Break free from no-code limits — add any custom logic right inside your workflow." },
  { icon: CheckCircle2, label: "Multi-environment support", desc: "Separate dev, staging, and production environments for safe, reliable deployments." },
];

const useCases = [
  { category: "CRM & Sales", items: ["Lead capture → CRM entry → follow-up email", "Deal stage changes trigger Slack alerts", "Auto-qualify leads with AI scoring"] },
  { category: "Finance & Ops", items: ["Invoice generation & payment reminders", "Expense sync across tools", "Monthly report auto-generation"] },
  { category: "Marketing", items: ["New signup → onboarding sequence", "Content publish → social share", "Form submit → segmented nurture"] },
  { category: "Data & Reporting", items: ["Cross-platform data sync & dedup", "Scheduled KPI dashboards to Slack/email", "Google Sheets ↔ database pipelines"] },
];

const steps = [
  { number: "01", title: "Discovery", desc: "We map your current workflow, find the friction points, and define the automation scope together." },
  { number: "02", title: "Build & Test", desc: "Full workflow is built and stress-tested in a staging environment before it ever touches production data." },
  { number: "03", title: "Deploy", desc: "Launched to production with monitoring enabled. You get full access and documentation from day one." },
  { number: "04", title: "Maintain & Optimize", desc: "Ongoing support, updates as your tools change, and proactive suggestions for new automation opportunities." },
];

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div ref={ref} className="container-wide relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4">Core Service</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white mb-4 leading-tight">
            Production-Grade{" "}
            <span className="text-gradient-orange">n8n Workflow Automation</span>
          </h2>
          <p className="text-[#A1A1AA] font-body text-lg max-w-2xl mx-auto leading-relaxed">
            I design, build, and deploy n8n workflows that connect your entire business stack —
            so repetitive work runs itself, 24/7, without you touching it.
          </p>
        </motion.div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative p-8 lg:p-10 rounded-3xl neo-card mb-10 overflow-hidden"
        >
          <div className="absolute inset-0 rounded-3xl" style={{ background: "radial-gradient(ellipse at top left, #FF6B0010, transparent 60%)" }} />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "#FF6B0015", border: "1px solid #FF6B0030" }}>
                  <Workflow className="w-7 h-7 text-[#FF6B00]" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">n8n Workflow Automation</h3>
                  <p className="text-sm text-[#FF6B00] font-subheading">End-to-end automation specialist</p>
                </div>
              </div>

              <p className="text-[#A1A1AA] font-body leading-relaxed text-base mb-6">
                n8n is the most powerful open-source automation platform available — and I specialize
                exclusively in it. Every workflow I build is production-ready: documented, monitored,
                version-controlled, and built to scale with your business.
              </p>

              <p className="text-[#A1A1AA] font-body leading-relaxed text-base mb-8">
                Whether you're connecting a CRM to your inbox, auto-generating reports, or building
                a multi-step AI-powered pipeline — I scope, build, and hand over systems you fully
                own and understand.
              </p>

              <Button asChild size="lg">
                <Link href="/booking">
                  Book a Free Strategy Call
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Right — use cases */}
            <div className="grid sm:grid-cols-2 gap-4">
              {useCases.map((uc, i) => (
                <motion.div
                  key={uc.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/08"
                >
                  <p className="text-xs font-subheading font-bold text-[#FF6B00] uppercase tracking-wide mb-3">{uc.category}</p>
                  <ul className="space-y-2">
                    {uc.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs font-body text-[#71717A] leading-relaxed">
                        <CheckCircle2 className="w-3 h-3 text-[#FF6B00] mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <h3 className="text-xl font-heading font-bold text-white text-center mb-8">What Every Workflow Includes</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.35 + i * 0.05 }}
                  className="p-5 rounded-2xl neo-card group hover:border-[#FF6B00]/20 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: "#FF6B0015", border: "1px solid #FF6B0025" }}>
                    <Icon className="w-4 h-4 text-[#FF6B00]" />
                  </div>
                  <p className="text-sm font-subheading font-semibold text-white mb-1.5 leading-tight">{f.label}</p>
                  <p className="text-xs font-body text-[#71717A] leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12"
        >
          <h3 className="text-xl font-heading font-bold text-white text-center mb-8">How It Works</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                className="relative p-6 rounded-2xl neo-card"
              >
                <div className="text-4xl font-heading font-black text-[#FF6B00]/20 mb-3 leading-none">{step.number}</div>
                <h4 className="text-base font-heading font-bold text-white mb-2">{step.title}</h4>
                <p className="text-sm font-body text-[#71717A] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center"
        >
          <p className="text-[#71717A] font-body text-sm mb-4">Ready to automate your first workflow?</p>
          <Button asChild size="lg">
            <Link href="/booking">
              Get Your Free Automation Strategy Call
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
