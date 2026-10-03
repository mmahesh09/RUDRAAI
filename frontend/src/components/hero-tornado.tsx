"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

// three.js only loads in the browser, after hydration
const Tornado = dynamic(() => import("@/components/originkit/ui/tornado"), { ssr: false });

type Tier = "mobile" | "tablet" | "desktop";

// The vortex recomputes every strand and dot on the CPU each frame,
// so smaller screens (usually weaker devices) get proportionally less work.
const PRESETS: Record<Tier, { lines: number; dots: number; comets: number; zoom: number }> = {
  mobile: { lines: 90, dots: 1500, comets: 5, zoom: 70 },
  tablet: { lines: 150, dots: 3500, comets: 7, zoom: 73 },
  desktop: { lines: 220, dots: 6000, comets: 10, zoom: 75 },
};

const TABLET_QUERY = "(min-width: 640px)";
const DESKTOP_QUERY = "(min-width: 1024px)";

function getTier(): Tier {
  if (window.matchMedia(DESKTOP_QUERY).matches) return "desktop";
  if (window.matchMedia(TABLET_QUERY).matches) return "tablet";
  return "mobile";
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Static glow shown while loading, for reduced motion, and when WebGL is unavailable. */
function StaticVortex() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-3/4 w-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(41,151,255,0.22),rgba(161,161,166,0.08)_45%,transparent_70%)] blur-2xl" />
    </div>
  );
}

export default function HeroTornado() {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [webgl, setWebgl] = useState(true);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    setWebgl(supportsWebGL());
    const update = () => setTier(getTier());
    // Wait for idle so the vortex never competes with the headline's first paint
    const idle = "requestIdleCallback" in window;
    const handle = idle ? window.requestIdleCallback(update) : window.setTimeout(update, 200);

    // Rebuild only when crossing a breakpoint, not on every resize
    const queries = [TABLET_QUERY, DESKTOP_QUERY].map((q) => window.matchMedia(q));
    queries.forEach((mq) => mq.addEventListener("change", update));
    return () => {
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      queries.forEach((mq) => mq.removeEventListener("change", update));
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show3D = tier !== null && webgl && !prefersReducedMotion;
  const preset = tier ? PRESETS[tier] : PRESETS.mobile;

  return (
    <div
      ref={ref}
      // Desktop: height follows the viewport (minus the hero top padding, bottom padding and baseline strip = 10.5rem)
      // so the whole vortex, base included, fits on one screen; width follows via aspect.
      className="relative mx-auto w-full max-w-[560px] aspect-[4/5] sm:aspect-square max-h-[70svh] lg:aspect-[4/5] lg:w-auto lg:max-w-none lg:max-h-none lg:h-[min(640px,calc(100svh-10.5rem))]"
      aria-hidden="true"
    >
      {/* Fallback only — rendered behind the canvas it would tint the black hero */}
      {!show3D && <StaticVortex />}
      {show3D && (
        // Soft-edge mask so the vortex blends into the hero instead of ending in a hard box
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_80%)]">
          <Tornado
            background="transparent"
            zoom={preset.zoom}
            paused={!inView}
            // supportsWebGL() can pass while context creation still fails (GPU blocklist, lost context)
            onError={() => setWebgl(false)}
            lineOptions={{ count: preset.lines, color: "#ffffff", glow: 8 }}
            dotOptions={{ count: preset.dots, size: 20, color: "#ffffff", glow: 9, flicker: 10 }}
            cometOptions={{ count: preset.comets, color: "#2997FF", glow: 7 }}
          />
        </div>
      )}
    </div>
  );
}
