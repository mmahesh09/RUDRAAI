"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import SectionHead from "@/components/site/section-head";

/**
 * §03 — the signature moment. One real-shaped workflow (lead qualification) pinned on
 * screen while scroll steps through its run, lighting each node as it "executes".
 * Without JS, on small screens, or with reduced motion: the whole run is shown lit.
 */

const NODE_W = 168;
const NODE_H = 54;

type Node = { id: string; x: number; y: number; label: string; sub: string; step: number };

const NODES: Node[] = [
  { id: "form", x: 8, y: 168, label: "Website form", sub: "Enquiry submitted", step: 0 },
  { id: "ai", x: 208, y: 168, label: "AI model", sub: "Reads + scores intent", step: 1 },
  { id: "if", x: 408, y: 168, label: "Score ≥ 7?", sub: "Branch", step: 2 },
  { id: "crm", x: 608, y: 40, label: "CRM", sub: "Create contact", step: 3 },
  { id: "mail", x: 608, y: 110, label: "Email", sub: "Personal reply", step: 3 },
  { id: "slack", x: 608, y: 180, label: "Slack", sub: "Alert sales", step: 3 },
  { id: "nurture", x: 608, y: 296, label: "Email sequence", sub: "Nurture over 2 weeks", step: 4 },
];

const EDGES: { from: string; to: string; label?: "yes" | "no"; vertical?: boolean }[] = [
  { from: "form", to: "ai" },
  { from: "ai", to: "if" },
  { from: "if", to: "crm", label: "yes" },
  { from: "crm", to: "mail", vertical: true },
  { from: "mail", to: "slack", vertical: true },
  { from: "if", to: "nurture", label: "no" },
];

const STEPS = [
  { title: "Something happens", body: "A visitor fills in your contact form." },
  { title: "AI reads it", body: "A model scores how ready they are to buy." },
  { title: "The workflow decides", body: "A simple rule you control splits the path." },
  { title: "Hot leads get people", body: "CRM, reply and Slack alert in under ten seconds." },
  { title: "Everyone else is looked after", body: "A short email sequence, so nobody falls through." },
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;

function edgePath(e: (typeof EDGES)[number]) {
  const a = byId(e.from);
  const b = byId(e.to);
  if (e.vertical) {
    const cx = a.x + NODE_W / 2;
    return `M${cx},${a.y + NODE_H} L${cx},${b.y}`;
  }
  const x1 = a.x + NODE_W;
  const y1 = a.y + NODE_H / 2;
  const x2 = b.x;
  const y2 = b.y + NODE_H / 2;
  return `M${x1},${y1} C${x1 + 30},${y1} ${x2 - 30},${y2} ${x2},${y2}`;
}

function Canvas({ active }: { active: number }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0B0C]">
      <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.12em]">
        <span className="text-[#A1A1AA]">lead_qualification.json</span>
        <span className="flex items-center gap-2 text-[#A1A1AA]">
          <span className={`h-1.5 w-1.5 rounded-full ${active >= 4 ? "bg-[#22C55E]" : "bg-[#BF5AF2]"}`} aria-hidden="true" />
          {active >= 4 ? "Run complete" : `Step ${active + 1} of 5`}
        </span>
      </div>
      <svg viewBox="0 0 784 372" className="block w-full" role="img" aria-label="Workflow: website form, AI scoring, a branch, then CRM, email and Slack for hot leads or an email sequence for others">
        <defs>
          <pattern id="run-dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="rgba(255,255,255,0.07)" />
          </pattern>
        </defs>
        <rect width="784" height="372" fill="url(#run-dots)" />

        {EDGES.map((e) => {
          const lit = byId(e.to).step <= active;
          const color = e.label === "no" ? "#A1A1AA" : "#BF5AF2";
          return (
            <g key={`${e.from}-${e.to}`}>
              <path
                d={edgePath(e)}
                fill="none"
                stroke={lit ? color : "rgba(255,255,255,0.12)"}
                strokeWidth="1.5"
                style={{ transition: "stroke 0.5s ease" }}
              />
              {e.label && (
                <text
                  x={(byId(e.from).x + NODE_W + byId(e.to).x) / 2}
                  y={(byId(e.from).y + byId(e.to).y + NODE_H) / 2 - 10}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--font-mono), monospace"
                  letterSpacing="0.1em"
                  fill={lit ? color : "rgba(255,255,255,0.3)"}
                >
                  {e.label.toUpperCase()}
                </text>
              )}
            </g>
          );
        })}

        {NODES.map((n) => {
          const lit = n.step <= active;
          const current = n.step === active;
          return (
            <g key={n.id} style={{ transition: "opacity 0.5s ease", opacity: lit ? 1 : 0.35 }}>
              <rect
                x={n.x}
                y={n.y}
                width={NODE_W}
                height={NODE_H}
                rx="10"
                fill="#000"
                stroke={current ? "#BF5AF2" : lit ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)"}
                strokeWidth={current ? 1.5 : 1}
                style={{ transition: "stroke 0.5s ease" }}
              />
              <circle cx={n.x + 22} cy={n.y + NODE_H / 2} r="4" fill={lit ? (current ? "#BF5AF2" : "#22C55E") : "rgba(255,255,255,0.2)"} />
              <text x={n.x + 38} y={n.y + 23} fontSize="12" fontWeight="600" fill="#F5F5F7" fontFamily="var(--font-display), system-ui, sans-serif">
                {n.label}
              </text>
              <text x={n.x + 38} y={n.y + 40} fontSize="10.5" fill="#A1A1AA" fontFamily="system-ui, sans-serif">
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function FeaturesSection() {
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  // Server/no-JS render shows the full run lit
  const [active, setActive] = useState(STEPS.length - 1);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setPinned(mq.matches && !prefersReducedMotion);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [prefersReducedMotion]);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (!pinned) return;
    setActive(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
  });

  useEffect(() => {
    if (!pinned) setActive(STEPS.length - 1);
    else setActive(Math.min(STEPS.length - 1, Math.floor(scrollYProgress.get() * STEPS.length)));
  }, [pinned, scrollYProgress]);

  return (
    <section id="how-a-run-works" className="relative bg-black pt-24 md:pt-32 lg:pt-40">
      <div className="container-wide">
        <SectionHead
          index="03"
          label="Inside one workflow"
          title={<span>Watch a lead get handled <span className="text-[#BF5AF2]">— hands-free.</span></span>}
          intro="Scroll to run it."
        />
      </div>

      {/* Tall track gives the pinned stage room to step through the run */}
      <div ref={trackRef} className={pinned ? "relative h-[320vh]" : "relative"}>
        <div className={pinned ? "sticky top-0 flex h-screen items-center" : "py-16"}>
          <div className="container-wide grid w-full items-center gap-10 lg:grid-cols-12 lg:gap-x-8">
            <ol className="lg:col-span-4 ledger border-y border-white/[0.08]">
              {STEPS.map((s, i) => {
                const state = !pinned ? "done" : i < active ? "done" : i === active ? "current" : "next";
                return (
                  <li key={s.title} className="py-5" aria-current={pinned && state === "current" ? "step" : undefined}>
                    <div className="flex items-baseline gap-4">
                      <span className={`font-mono text-[11px] tracking-[0.14em] ${state === "current" ? "text-[#BF5AF2]" : "text-[#8A8A93]"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className={`font-heading text-lg font-semibold tracking-[-0.02em] transition-colors duration-500 ${state === "next" ? "text-[#8A8A93]" : "text-[#F5F5F7]"}`}>
                          {s.title}
                        </p>
                        <p
                          className={`mt-1.5 max-w-[40ch] text-[15px] leading-relaxed text-[#A1A1AA] ${
                            pinned && state !== "current" ? "lg:hidden" : ""
                          }`}
                        >
                          {s.body}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="lg:col-span-8">
              <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <div className="min-w-[560px]">
                  <Canvas active={active} />
                </div>
              </div>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-[#8A8A93]">
                Illustrative example · built in n8n · runs on your own account
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
