"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap, Shield, Clock, BarChart2, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "speed",
    icon: Zap,
    title: "Deploy in 48 Hours",
    description:
      "Our battle-tested automation templates and expert team deliver production-ready workflows in 48 hours, not weeks.",
    color: "#FF6B00",
  },
  {
    id: "reliability",
    icon: Shield,
    title: "99.9% Uptime SLA",
    description:
      "Every automation we build includes monitoring, error handling, and automatic retries. Sleep soundly knowing your workflows never stop.",
    color: "#10B981",
  },
  {
    id: "savings",
    icon: Clock,
    title: "Save 20+ Hours/Week",
    description:
      "Our clients reclaim an average of 20+ hours per week from manual work — equivalent to hiring a part-time employee, for a fraction of the cost.",
    color: "#8B5CF6",
  },
  {
    id: "analytics",
    icon: BarChart2,
    title: "Full Observability",
    description:
      "Real-time dashboards show every automation execution, success rate, and time saved — always know exactly what's running.",
    color: "#3B82F6",
  },
  {
    id: "custom",
    icon: Code2,
    title: "Fully Custom Builds",
    description:
      "No cookie-cutter templates. Every automation is purpose-built for your exact business logic, data structure, and tech stack.",
    color: "#F59E0B",
  },
  {
    id: "support",
    icon: CheckCircle2,
    title: "Ongoing Support",
    description:
      "We don't disappear after delivery. Monthly maintenance, updates, and a dedicated Slack channel keep you covered.",
    color: "#EC4899",
  },
];

function DashboardMockup() {
  return (
    <div className="relative w-full rounded-2xl neo-card border border-white/08 overflow-hidden">
      {/* Window bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/03 border-b border-white/06">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-[11px] text-[#71717A] font-body">RudraAI Dashboard</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-400 font-body">Live</span>
        </div>
      </div>

      <div className="p-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Active Flows", value: "24", delta: "+3", color: "#FF6B00" },
            { label: "Runs Today", value: "1,847", delta: "+12%", color: "#10B981" },
            { label: "Time Saved", value: "147h", delta: "this week", color: "#8B5CF6" },
          ].map((s) => (
            <div key={s.label} className="p-3 rounded-xl bg-white/03 border border-white/06">
              <div className="text-[10px] text-[#71717A] font-body mb-1">{s.label}</div>
              <div className="text-lg font-heading font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-[10px] text-[#71717A] font-body">{s.delta}</div>
            </div>
          ))}
        </div>

        {/* Active automations list */}
        <div className="space-y-2 mb-4">
          <div className="text-xs font-subheading font-medium text-[#71717A] mb-2">Active Automations</div>
          {[
            { name: "Lead Qualification Bot", status: "running", runs: "342 runs", color: "#10B981" },
            { name: "Customer Support AI", status: "running", runs: "128 runs", color: "#10B981" },
            { name: "Invoice Processing", status: "running", runs: "89 runs", color: "#10B981" },
            { name: "Social Media Scheduler", status: "paused", runs: "0 runs", color: "#F59E0B" },
          ].map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/02 border border-white/05"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                <span className="text-xs font-body text-white">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-body text-[#71717A]">{item.runs}</span>
                <span
                  className="text-[10px] font-body px-1.5 py-0.5 rounded"
                  style={{
                    color: item.color,
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}30`,
                  }}
                >
                  {item.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini chart */}
        <div className="p-3 rounded-xl bg-white/02 border border-white/05">
          <div className="text-[10px] font-body text-[#71717A] mb-2">Execution Volume (7 days)</div>
          <div className="flex items-end gap-1 h-12">
            {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
                className="flex-1 rounded-sm origin-bottom"
                style={{
                  height: `${h}%`,
                  background: i === 5 ? "#FF6B00" : "rgba(255,107,0,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section id="features" className="py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0D0D14]" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div ref={ref} className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -inset-4 bg-[rgba(255,107,0,0.05)] rounded-3xl blur-2xl" />
            <DashboardMockup />
          </motion.div>

          {/* Right — Features list */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 lg:order-2"
          >
            <Badge className="mb-4">Why RudraAI</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white mb-4 leading-tight">
              Built for Scale,{" "}
              <span className="text-gradient-orange">Not Just Demos</span>
            </h2>
            <p className="text-[#A1A1AA] font-body mb-8 leading-relaxed">
              Most automation agencies deliver one-off scripts that break under pressure.
              We build production systems engineered to handle thousands of executions daily.
            </p>

            <div className="space-y-3">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                const isActive = activeFeature === i;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    onClick={() => setActiveFeature(i)}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300",
                      isActive
                        ? "bg-white/05 border border-white/10"
                        : "hover:bg-white/03 border border-transparent"
                    )}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300"
                      style={{
                        background: isActive ? `${feature.color}20` : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isActive ? feature.color + "40" : "transparent"}`,
                      }}
                    >
                      <Icon
                        className="w-4 h-4 transition-colors duration-300"
                        style={{ color: isActive ? feature.color : "#71717A" }}
                      />
                    </div>
                    <div>
                      <h4
                        className="font-subheading font-semibold text-sm mb-0.5 transition-colors duration-300"
                        style={{ color: isActive ? "#FFFFFF" : "#A1A1AA" }}
                      >
                        {feature.title}
                      </h4>
                      <AnimatePresence>
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs font-body text-[#71717A] leading-relaxed"
                          >
                            {feature.description}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
