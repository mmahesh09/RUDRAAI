"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { showcaseProjects, type ShowcaseProject } from "@/lib/showcase";

// The screenshot stops before the page's footer whitespace (~74% of its height)
const SCROLL_END = "-74%";

/** A browser window whose page scrolls as you scroll ours — the site, shown as it really is. */
function BrowserFrame({ project, pinned }: { project: ShowcaseProject; pinned: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const y = useTransform(scrollYProgress, [0.05, 0.95], ["0%", SCROLL_END]);
  const host = project.url.replace(/^https?:\/\//, "");

  const frame = (
    <div className="w-full overflow-hidden rounded-xl border border-white/[0.12] bg-[#0B0B0C] shadow-[0_40px_120px_-40px_rgba(191,90,242,0.35)]">
      <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="mx-auto flex h-7 min-w-0 max-w-[60%] flex-1 items-center justify-center gap-2 rounded-md bg-white/[0.05] px-3 font-mono text-[11px] tracking-[0.04em] text-[#A1A1AA]">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#22C55E]" aria-hidden="true" />
          <span className="truncate">{host}</span>
        </span>
        <span className="w-[42px]" aria-hidden="true" />
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F4F1EC]">
        <motion.div style={{ y: pinned ? y : "0%" }} className="will-change-transform">
          <Image
            src={project.images.full.src}
            width={project.images.full.width}
            height={project.images.full.height}
            alt={`The ${project.client} homepage, from hero to footer`}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="block h-auto w-full"
            priority
          />
        </motion.div>
      </div>
    </div>
  );

  if (!pinned) return frame;

  return (
    <div ref={trackRef} className="relative h-[260vh]">
      <div className="sticky top-0 flex h-screen items-center">{frame}</div>
    </div>
  );
}

function Project({ project, index }: { project: ShowcaseProject; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPinned(mq.matches && !prefersReducedMotion);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [prefersReducedMotion]);

  const facts = [
    { k: "Client", v: project.client },
    { k: "Sector", v: project.sector },
    { k: "Scope", v: project.scope.join(" · ") },
    { k: "Built with", v: project.stack.join(" · ") },
    { k: "Year", v: project.year },
  ];

  return (
    <article id={project.slug} className="scroll-mt-16">
      {/* Case — marginalia on the left stays put while the site scrolls on the right */}
      <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <div className={pinned ? "sticky top-28" : ""}>
            <p className="eyebrow">
              <span className="text-[#BF5AF2]">Case {String(index + 1).padStart(2, "0")}&nbsp;&nbsp;</span>Live website
            </p>
            <h2 className="mt-6 font-heading text-[clamp(2.5rem,5vw,4.25rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-[#F5F5F7] [overflow-wrap:anywhere]">
              {project.client}
            </h2>
            <p className="mt-5 max-w-[34ch] text-lg leading-snug text-[#F5F5F7]/90">{project.line}</p>

            <dl className="ledger mt-10 border-y border-white/[0.08]">
              {facts.map((f) => (
                <div key={f.k} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93] pt-0.5">{f.k}</dt>
                  <dd className="text-[15px] text-[#F5F5F7]">{f.v}</dd>
                </div>
              ))}
            </dl>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-[#8944AB] pl-6 pr-2 text-[15px] font-semibold text-white transition-colors hover:bg-[#7A3A9A]"
            >
              Visit the live site
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black">
                <ArrowUpRight className="h-4 w-4 text-[#BF5AF2] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </a>
            {pinned && (
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">Scroll to walk the page ↓</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-8">
          <BrowserFrame project={project} pinned={pinned} />
        </div>
      </div>

    </article>
  );
}

export default function ShowcaseSection() {
  const next = String(showcaseProjects.length + 1).padStart(2, "0");

  return (
    <section className="bg-black pb-24 md:pb-32">
      {showcaseProjects.map((p, i) => (
        <Project key={p.slug} project={p} index={i} />
      ))}

      {/* The open slot — the page closes on the next case, not a generic banner */}
      <div className="container-wide mt-32 lg:mt-44">
        <Link
          href="/booking"
          className="group grid gap-6 border-y border-white/[0.08] py-12 transition-colors hover:border-[#BF5AF2]/50 md:grid-cols-12 md:items-end md:gap-x-8 md:py-16"
        >
          <p className="eyebrow md:col-span-12">
            <span className="text-[#BF5AF2]">Case {next}&nbsp;&nbsp;</span>Slot open
          </p>
          <p className="font-heading text-[clamp(2.5rem,8vw,7rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-[#F5F5F7] md:col-span-9">
            Your business<span className="text-[#BF5AF2]">.</span>
          </p>
          <span className="inline-flex items-center gap-3 text-[15px] font-medium text-[#F5F5F7] md:col-span-3 md:justify-end">
            Book a free call
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.18] transition-colors group-hover:border-[#BF5AF2] group-hover:bg-[#BF5AF2]">
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </span>
        </Link>
      </div>
    </section>
  );
}
