"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Free Automation Audit",
    description:
      "We spend 60 minutes with you mapping your current workflows, identifying the highest-ROI automation opportunities, and calculating your potential time/cost savings. No sales pitch — pure strategy.",
    duration: "60 min call",
    color: "#FF6B00",
  },
  {
    step: "02",
    title: "Custom Blueprint",
    description:
      "Our engineers design a detailed automation architecture tailored to your stack and goals. You get a visual workflow map, tech spec, timeline, and fixed-price quote — all before we write a single line.",
    duration: "48h turnaround",
    color: "#8B5CF6",
  },
  {
    step: "03",
    title: "Build & Deploy",
    description:
      "We build, test, and deploy your automations in a staging environment first. After your sign-off, we go live — with full monitoring, error alerts, and a 30-day free maintenance window.",
    duration: "Live in 1–2 weeks",
    color: "#10B981",
  },
  {
    step: "04",
    title: "Scale & Optimize",
    description:
      "Monthly reviews keep your automations running at peak efficiency. We add new workflows as your business grows and handle any changes to third-party APIs or business logic.",
    duration: "Ongoing support",
    color: "#3B82F6",
  },
];

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="process" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0D0D14]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div ref={ref} className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <Badge className="mb-4">The Process</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white mb-4 leading-tight">
            From Audit to{" "}
            <span className="text-gradient-orange">Automation Live</span>
            <br />
            in Under 2 Weeks
          </h2>
          <p className="text-[#A1A1AA] font-body text-lg max-w-2xl mx-auto">
            A proven 4-step process that gets your business automated fast — without disrupting your operations.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block lg:hidden" />
          <div className="absolute left-1/2 -translate-x-1/2 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-white/08 to-transparent hidden lg:block" />

          <div className="grid md:grid-cols-2 gap-5 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group relative flex gap-5 p-6 rounded-2xl neo-card hover:border-white/12 transition-all duration-300"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at top left, ${step.color}08, transparent)` }}
                />

                {/* Step number */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-heading font-black text-lg transition-all duration-300"
                    style={{
                      background: `${step.color}15`,
                      border: `1px solid ${step.color}30`,
                      color: step.color,
                    }}
                  >
                    {step.step}
                  </div>
                </div>

                <div className="relative z-10 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading font-bold text-white text-lg group-hover:text-[#FF6B00] transition-colors">
                      {step.title}
                    </h3>
                    <span
                      className="text-[10px] font-body px-2 py-1 rounded-full flex-shrink-0 ml-2"
                      style={{
                        color: step.color,
                        background: `${step.color}12`,
                        border: `1px solid ${step.color}25`,
                      }}
                    >
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-sm text-[#A1A1AA] font-body leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button asChild size="lg">
            <Link href="/booking">
              Start Your Free Audit Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <p className="mt-3 text-sm text-[#71717A] font-body">
            No credit card required. No commitment.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
