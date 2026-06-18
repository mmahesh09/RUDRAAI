"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const industries = [
  {
    id: "saas",
    icon: "💻",
    label: "SaaS",
    title: "Scale Your SaaS Operations",
    description:
      "Automate trial-to-paid conversion funnels, onboarding sequences, churn prevention alerts, and usage-based billing — all connected to your CRM and product analytics.",
    useCases: [
      "Lead-to-demo automation",
      "Onboarding email sequences",
      "Churn prediction & alerts",
      "Usage analytics reports",
      "Subscription lifecycle management",
    ],
    color: "#8B5CF6",
  },
  {
    id: "ecommerce",
    icon: "🛒",
    label: "E-Commerce",
    title: "Turn Orders Into Repeat Customers",
    description:
      "Connect your store to every touchpoint — abandoned cart recovery, post-purchase flows, review requests, inventory alerts, and supplier communication, all on autopilot.",
    useCases: [
      "Abandoned cart recovery",
      "Post-purchase upsells",
      "Inventory management",
      "Review collection",
      "Supplier order automation",
    ],
    color: "#F59E0B",
  },
  {
    id: "agencies",
    icon: "🏢",
    label: "Agencies",
    title: "Deliver More Without Hiring More",
    description:
      "Automate client reporting, proposal generation, project kickoffs, timesheet collection, and invoicing — so your team focuses on creative work, not admin.",
    useCases: [
      "Client reporting automation",
      "Proposal generation",
      "Project kickoff workflows",
      "Invoice & payment follow-up",
      "Social media scheduling",
    ],
    color: "#3B82F6",
  },
  {
    id: "healthcare",
    icon: "🏥",
    label: "Healthcare",
    title: "Streamline Patient Operations",
    description:
      "HIPAA-compliant automation for appointment scheduling, patient follow-ups, insurance verification, and staff communications — reducing admin burden by 60%+.",
    useCases: [
      "Appointment scheduling",
      "Patient reminders & follow-ups",
      "Insurance verification",
      "Staff shift management",
      "Referral tracking",
    ],
    color: "#10B981",
  },
  {
    id: "fintech",
    icon: "💳",
    label: "FinTech",
    title: "Automate Compliance & Operations",
    description:
      "KYC verification workflows, transaction monitoring alerts, compliance report generation, and customer communication — built to financial industry standards.",
    useCases: [
      "KYC/AML workflows",
      "Transaction monitoring",
      "Compliance reporting",
      "Customer communication",
      "Fraud alert routing",
    ],
    color: "#EC4899",
  },
  {
    id: "operations",
    icon: "⚙️",
    label: "Operations",
    title: "The Ops Team's Best Tool",
    description:
      "Cross-department automation that bridges every tool in your stack — from HR to finance to IT — creating seamless data flows without spreadsheet madness.",
    useCases: [
      "Employee onboarding",
      "Expense approval workflows",
      "IT ticket routing",
      "Data sync across tools",
      "SLA monitoring & alerts",
    ],
    color: "#FF6B00",
  },
];

export default function IndustriesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState("saas");

  const active = industries.find((i) => i.id === selected)!;

  return (
    <section id="industries" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0D0D14]" />
      <div className="absolute inset-0 grid-bg opacity-25" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div ref={ref} className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <Badge className="mb-4">Industries</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white mb-4 leading-tight">
            We Automate{" "}
            <span className="text-gradient-orange">Every Industry</span>
          </h2>
          <p className="text-[#A1A1AA] font-body text-lg max-w-2xl mx-auto">
            Deep domain expertise across verticals means we understand your specific workflow
            challenges — not just generic automation patterns.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
        >
          {/* Industry tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {industries.map((industry) => (
              <button
                key={industry.id}
                onClick={() => setSelected(industry.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-subheading font-medium transition-all duration-200",
                  selected === industry.id
                    ? "text-white border"
                    : "text-[#71717A] hover:text-[#A1A1AA] border border-transparent hover:border-white/08 hover:bg-white/03"
                )}
                style={
                  selected === industry.id
                    ? {
                        background: `${industry.color}12`,
                        borderColor: `${industry.color}35`,
                        color: industry.color,
                      }
                    : {}
                }
              >
                <span>{industry.icon}</span>
                {industry.label}
              </button>
            ))}
          </div>

          {/* Active industry content */}
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-6 items-center"
          >
            <div className="p-7 rounded-2xl neo-card" style={{ borderColor: `${active.color}20` }}>
              <div
                className="text-4xl mb-4 w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ background: `${active.color}12` }}
              >
                {active.icon}
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-3">
                {active.title}
              </h3>
              <p className="text-[#A1A1AA] font-body leading-relaxed mb-6">
                {active.description}
              </p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 cta-button text-sm"
              >
                Get Industry-Specific Audit
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-subheading font-medium text-[#71717A] uppercase tracking-wider mb-4">
                Common Use Cases
              </p>
              {active.useCases.map((useCase, i) => (
                <motion.div
                  key={useCase}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/03 border border-white/06 hover:border-white/10 transition-colors group"
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: active.color }}
                  />
                  <span className="text-sm font-body text-[#A1A1AA] group-hover:text-white transition-colors">
                    {useCase}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#71717A] group-hover:text-[#FF6B00] ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
