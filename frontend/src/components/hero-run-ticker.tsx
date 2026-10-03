"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Illustrative only — one step from each kind of system we build.
const STEPS = [
  { kind: "website", name: "deploy.production", duration: "38s" },
  { kind: "agent", name: "answer_customer_query", duration: "840ms" },
  { kind: "automation", name: "crm.sync_new_lead", duration: "210ms" },
  { kind: "automation", name: "slack.notify_sales", duration: "95ms" },
];

/** One-line "sample run" that steps through a workflow like an execution log. */
export default function HeroRunTicker() {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 1600);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  const current = STEPS[step];

  return (
    <div className="flex items-center gap-3 min-w-0 font-mono text-[11px] uppercase tracking-[0.12em]">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
      </span>
      <span className="text-[#A1A1AA] shrink-0">Sample run</span>
      <span className="text-[#3F3F46] shrink-0" aria-hidden="true">
        {String(step + 1).padStart(2, "0")}/{String(STEPS.length).padStart(2, "0")}
      </span>
      <span className="relative h-4 flex-1 min-w-0 overflow-hidden" aria-live="off">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={step}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-[#BF5AF2]">{current.kind}</span>
            <span className="normal-case tracking-normal text-[#D4D4D8] truncate">{current.name}</span>
            <span className="text-[#22C55E]">✓</span>
            <span className="text-[#A1A1AA]">{current.duration}</span>
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
