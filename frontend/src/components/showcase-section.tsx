"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { showcaseBuilds, showcaseCategories, type ShowcaseStepKind } from "@/lib/showcase";

// One colour means one thing: blue marks the AI step, everything else stays neutral.
const KIND_LABEL: Record<ShowcaseStepKind, string> = {
  trigger: "Trigger",
  ai: "AI",
  logic: "Logic",
  action: "Action",
};

export default function ShowcaseSection() {
  const [active, setActive] = useState<(typeof showcaseCategories)[number]>("All");
  const builds = active === "All" ? showcaseBuilds : showcaseBuilds.filter((b) => b.category === active);

  return (
    <section className="bg-black pb-24 md:pb-32">
      <div className="container-wide">
        {/* Segmented filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-white/[0.08] py-4">
          <div className="flex flex-wrap gap-1" role="group" aria-label="Filter builds by category">
            {showcaseCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                aria-pressed={active === cat}
                className={cn(
                  "h-9 rounded-full px-4 text-[13px] font-medium transition-colors",
                  active === cat ? "bg-[#F5F5F7] text-black" : "text-[#A1A1AA] hover:text-[#F5F5F7]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]" aria-live="polite">
            {builds.length} {builds.length === 1 ? "build" : "builds"}
          </p>
        </div>

        <ol>
          {builds.map((build, i) => (
            <li key={build.id} className="border-b border-white/[0.08]">
              <article className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-x-8 lg:py-16">
                <div className="lg:col-span-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
                    <span className="text-[#2997FF]">{String(i + 1).padStart(2, "0")}</span>&nbsp;&nbsp;{build.category}
                  </p>
                  <h2 className="mt-4 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#F5F5F7]">
                    {build.title}
                  </h2>
                  <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{build.summary}</p>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#A1A1AA]">
                    {build.stack.join(" · ")}
                  </p>
                  <Link
                    href={`/case-studies/${build.caseStudySlug}`}
                    className="group mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-[#F5F5F7] underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-[#2997FF]"
                  >
                    Read the case study
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>

                {/* Pipeline — reads top to bottom like an execution log */}
                <ol className="lg:col-span-6 lg:col-start-7 self-center" aria-label={`${build.title}: workflow steps`}>
                  {build.steps.map((step, j) => (
                    <li key={j} className="relative flex items-stretch gap-4">
                      <div className="flex w-3 flex-col items-center" aria-hidden="true">
                        <span
                          className={cn(
                            "mt-[22px] h-2.5 w-2.5 shrink-0 rounded-full border",
                            step.kind === "ai" ? "border-[#2997FF] bg-[#2997FF]" : "border-white/40 bg-black"
                          )}
                        />
                        {j < build.steps.length - 1 && <span className="w-px flex-1 bg-white/[0.12]" />}
                      </div>
                      <div className="flex flex-1 items-center justify-between gap-4 border-b border-white/[0.06] py-3.5">
                        <span className="text-[15px] text-[#F5F5F7]">{step.label}</span>
                        <span className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em]">
                          <span className="text-[#A1A1AA]">{step.tool}</span>
                          <span className={step.kind === "ai" ? "text-[#2997FF]" : "text-[#8A8A93]"}>{KIND_LABEL[step.kind]}</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
