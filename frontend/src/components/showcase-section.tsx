"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Bot, GitBranch, Play, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  showcaseBuilds,
  showcaseCategories,
  type ShowcaseStepKind,
} from "@/lib/showcase";

const stepIcons: Record<ShowcaseStepKind, typeof Zap> = {
  trigger: Play,
  ai: Bot,
  logic: GitBranch,
  action: Zap,
};

export default function ShowcaseSection() {
  const [active, setActive] = useState<(typeof showcaseCategories)[number]>("All");
  const builds =
    active === "All" ? showcaseBuilds : showcaseBuilds.filter((b) => b.category === active);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25" />

      <div className="container-wide relative z-10">
        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12" role="group" aria-label="Filter builds by category">
          {showcaseCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-subheading font-medium border transition-colors",
                active === cat
                  ? "bg-[#FF6B00] border-[#FF6B00] text-white"
                  : "border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/25"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {builds.map((build) => (
              <motion.article
                key={build.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="group rounded-2xl neo-card p-6 hover:border-white/12 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[11px] font-subheading font-semibold uppercase tracking-wider"
                    style={{ color: build.accentColor }}
                  >
                    {build.category}
                  </span>
                  <span className="text-[11px] font-body text-[#A1A1AA]">
                    {build.steps.length} nodes
                  </span>
                </div>

                <h2 className="text-xl font-heading font-bold text-white mb-2">{build.title}</h2>
                <p className="text-sm text-[#A1A1AA] font-body leading-relaxed mb-6">
                  {build.summary}
                </p>

                {/* Workflow pipeline */}
                <ol className="relative space-y-2 mb-6" aria-label={`${build.title} workflow steps`}>
                  {build.steps.map((step, i) => {
                    const Icon = stepIcons[step.kind];
                    return (
                      <li key={i} className="relative flex items-center gap-3">
                        {i < build.steps.length - 1 && (
                          <span
                            className="absolute left-[17px] top-9 h-3 w-px bg-white/10"
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                          style={{
                            borderColor: `${build.accentColor}40`,
                            backgroundColor: `${build.accentColor}14`,
                          }}
                        >
                          <Icon className="h-4 w-4" style={{ color: build.accentColor }} aria-hidden="true" />
                        </span>
                        <span className="flex-1 min-w-0 flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2">
                          <span className="text-sm text-white font-body truncate">{step.label}</span>
                          <span className="text-[11px] text-[#A1A1AA] font-body shrink-0">{step.tool}</span>
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {build.stack.map((tool) => (
                    <span
                      key={tool}
                      className="text-[10px] font-body text-[#A1A1AA] px-2 py-0.5 rounded bg-white/05 border border-white/06"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/case-studies/${build.caseStudySlug}`}
                  className="inline-flex items-center gap-1 text-sm font-subheading font-medium text-[#A1A1AA] group-hover:text-[#FF6B00] transition-colors"
                >
                  See the full case study
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
