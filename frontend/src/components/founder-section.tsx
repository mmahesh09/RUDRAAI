"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FounderSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-[#09090B]" />
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[rgba(255,107,0,0.04)] blur-3xl pointer-events-none" />

      <div ref={ref} className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Photo side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative w-full max-w-sm mx-auto lg:mx-0">
              {/* Glow ring */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[rgba(255,107,0,0.2)] to-[rgba(139,92,246,0.1)] blur-xl" />

              {/* Photo frame */}
              <div className="relative rounded-2xl overflow-hidden border border-[rgba(255,107,0,0.25)] bg-[#111117] aspect-[4/5]">
                {/* Placeholder — replace src with your real photo */}
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#111117] to-[#0F0F1A]">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] flex items-center justify-center shadow-[0_0_40px_rgba(255,107,0,0.4)]">
                    <Code2 className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-[#71717A] text-sm font-body text-center px-6">
                    Add your photo here —<br />replace this placeholder in the component
                  </p>
                </div>

                {/* Name plate */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#09090B] to-transparent">
                  <p className="font-heading font-bold text-white text-lg">Mahesh Babu</p>
                  <p className="text-[#A1A1AA] text-sm font-body">Founder, RudraAI · Hyderabad</p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-[rgba(255,107,0,0.3)] shadow-xl">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FF6B00] fill-[#FF6B00]" />
                  <span className="text-sm font-subheading font-semibold text-white">Built by a dev, for business</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Story side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            <Badge className="self-start">Who Builds RudraAI</Badge>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white leading-tight">
              Hi, I'm Mahesh —{" "}
              <span className="text-gradient-orange">a software engineer</span>{" "}
              from Hyderabad.
            </h2>

            <div className="space-y-4 text-[#A1A1AA] font-body leading-relaxed text-lg">
              <p>
                I got tired of watching businesses lose hours every day to manual work
                that AI can handle in seconds.
              </p>
              <p>
                Spreadsheets updated by hand. Leads slipping through the cracks. Emails
                sent one by one. The same copy-paste tasks, repeated forever — by smart
                people who should be doing better things.
              </p>
              <p>
                So I built RudraAI to fix that.{" "}
                <span className="text-white font-medium">One workflow at a time.</span>
              </p>
              <p>
                I build every automation myself using n8n, with AI where it actually helps.
                No team of junior devs. No outsourcing. Just clean, reliable workflows
                that work in production — and keep working.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild variant="outline" size="lg">
                <Link href="/about">More About RudraAI</Link>
              </Button>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 h-11 px-2 text-sm font-subheading font-medium text-[#A1A1AA] hover:text-white transition-colors"
              >
                Or book a call
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
