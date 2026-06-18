"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, ShieldCheck, TrendingUp, Rocket, DollarSign, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const stats: { Icon: LucideIcon; value: string; label: string; color: string }[] = [
  { Icon: Zap,         value: "0",   label: "Automations Deployed",  color: "#FF6B00" },
  { Icon: ShieldCheck, value: "--", label: "Uptime Guarantee",      color: "#10B981" },
  { Icon: TrendingUp,  value: "--",    label: "Avg Productivity Gain", color: "#8B5CF6" },
  { Icon: Rocket,      value: "--",   label: "Deploy Time",           color: "#3B82F6" },
  { Icon: DollarSign,  value: "--", label: "Client Cost Savings",   color: "#F59E0B" },
  { Icon: Building2,   value: "0",    label: "Happy Clients",         color: "#EC4899" },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#09090B] via-[#0D0D14] to-[#09090B]" />

      <div ref={ref} className="container-wide relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.Icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative group flex flex-col items-center text-center p-5 rounded-2xl neo-card hover:border-white/10 transition-all duration-300"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at center, ${stat.color}10, transparent)` }}
                />

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${stat.color}15`,
                    border: `1px solid ${stat.color}30`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} strokeWidth={1.75} />
                </div>

                <div
                  className="text-3xl font-heading font-black mb-1"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-xs font-body text-[#71717A] leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
