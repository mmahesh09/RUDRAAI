"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const perks = [
  "Free 60-minute strategy call",
  "Custom automation roadmap",
  "ROI estimate before you commit",
  "No pressure, no sales pitch",
];

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-[#09090B]" />

      <div ref={ref} className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B00]/15 via-[#FF6B00]/5 to-[#8B5CF6]/10" />
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="absolute inset-px rounded-3xl border border-[rgba(255,107,0,0.25)]" />

          {/* Glow effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[rgba(255,107,0,0.12)] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[rgba(139,92,246,0.08)] blur-3xl" />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6 leading-tight">
              Your Competitors Are Already
              <br />
              <span className="text-gradient-orange">Automating.</span> Are You?
            </h2>

            <p className="text-lg md:text-xl text-[#A1A1AA] font-body max-w-2xl mx-auto mb-8 leading-relaxed">
              Book a free 60-minute automation audit and walk away with a custom roadmap
              showing exactly where your business can save time and money — at no cost, no risk.
            </p>

            {/* Perks */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10">
              {perks.map((perk) => (
                <div key={perk} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span className="text-sm font-body text-[#A1A1AA]">{perk}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="xl">
                <Link href="/booking">
                  Book My Free Automation Audit
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Link
                href="/services#contact"
                className="outline-button h-14 px-8 text-base"
              >
                Talk to Me First
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
