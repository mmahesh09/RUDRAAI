"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DotPattern } from "@/components/ui/dot-pattern-1";

export default function QuoteSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#0D0D14]" />

      <div ref={ref} className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-5xl"
        >
          <div className="relative flex flex-col items-center border border-[rgba(255,107,0,0.25)] rounded-3xl overflow-hidden">
            <DotPattern width={5} height={5} className="fill-white/[0.035]" />

            {/* Corner accents */}
            <div className="absolute -left-1 -top-1 h-3 w-3 bg-[#FF6B00]" />
            <div className="absolute -bottom-1 -left-1 h-3 w-3 bg-[#FF6B00]" />
            <div className="absolute -right-1 -top-1 h-3 w-3 bg-[#FF6B00]" />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-[#FF6B00]" />

            <div className="relative z-20 mx-auto w-full px-8 py-12 md:px-16 md:py-20">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
                className="text-sm font-subheading text-[#FF6B00] uppercase tracking-widest mb-6"
              >
                On automation
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.35 }}
                className="text-3xl md:text-5xl lg:text-6xl tracking-tight leading-tight"
              >
                <div className="flex flex-wrap gap-2 md:gap-3 mb-1">
                  <span className="font-heading font-black text-white">&ldquo;The first rule of</span>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3 mb-1">
                  <span className="font-heading font-thin text-[#A1A1AA]">any technology</span>
                  <span className="font-heading font-black text-white">used in</span>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3 mb-1">
                  <span className="font-heading font-thin text-[#A1A1AA]">a business is that</span>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3 mb-1">
                  <span className="font-heading font-black text-[#FF6B00]">automation</span>
                  <span className="font-heading font-thin text-[#A1A1AA]">applied to</span>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3 mb-1">
                  <span className="font-heading font-thin text-[#A1A1AA]">an efficient operation</span>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <span className="font-heading font-black text-white">will magnify</span>
                  <span className="font-heading font-thin text-[#A1A1AA]">the efficiency.&rdquo;</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="mt-8 flex items-center gap-3"
              >
                <div className="w-8 h-px bg-[#FF6B00]" />
                <span className="text-sm font-body text-[#71717A]">Bill Gates, Co-founder of Microsoft</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
