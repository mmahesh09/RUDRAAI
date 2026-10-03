"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Keep in sync with PIPELINE in workflow-scene-3d.tsx. Duplicated so the
// fallback never pulls three.js into the page bundle.
const STEPS = [
  { label: "Trigger", color: "#2997FF" },
  { label: "AI Agent", color: "#A1A1A6" },
  { label: "Logic", color: "#3B82F6" },
  { label: "Action", color: "#10B981" },
  { label: "Notify", color: "#EC4899" },
];

const WorkflowScene3D = dynamic(() => import("@/components/workflow-scene-3d"), {
  ssr: false,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function StaticPipeline() {
  return (
    <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" aria-label="Typical workflow">
      {STEPS.map((step, i) => (
        <li key={step.label} className="flex items-center gap-2 sm:gap-3">
          <span
            className="px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-subheading font-medium text-white"
            style={{ borderColor: `${step.color}66`, backgroundColor: `${step.color}1F` }}
          >
            {step.label}
          </span>
          {i < STEPS.length - 1 && (
            <ArrowRight className="w-4 h-4 text-[#8A8A93]" aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  );
}

/**
 * 3D workflow pipeline on desktop. Small screens, reduced-motion users, and
 * devices without WebGL get the static 2D pipeline (also shown while 3D loads).
 */
export default function ShowcaseHeroVisual() {
  const prefersReducedMotion = useReducedMotion();
  const [use3D, setUse3D] = useState(false);
  const [inView, setInView] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setUse3D(false);
      return;
    }
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setUse3D(mq.matches && supportsWebGL());
    // Wait for idle so the 3D chunk never competes with first paint
    if ("requestIdleCallback" in window) window.requestIdleCallback(update);
    else setTimeout(update, 200);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative mx-auto mt-10 max-w-4xl lg:h-[260px] flex items-center justify-center">
      {use3D ? (
        <>
          <div className="absolute inset-0">
            <WorkflowScene3D active={inView} />
          </div>
          <div className="sr-only">
            <StaticPipeline />
          </div>
        </>
      ) : (
        <StaticPipeline />
      )}
    </div>
  );
}
