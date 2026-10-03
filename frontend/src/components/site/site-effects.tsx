"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Particles } from "@/components/ui/particles";

/**
 * Site-wide particle field. Fixed behind everything (negative z-index), so it shows
 * through the transparent page sections and is covered by cards and panels.
 * Skipped for reduced motion; fewer particles on small screens.
 */
function ParticleField() {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setQuantity(window.innerWidth < 768 ? 45 : 110);
  }, []);

  if (!quantity) return null;
  return (
    <Particles
      className="pointer-events-none fixed inset-0 -z-10"
      quantity={quantity}
      staticity={60}
      ease={70}
      size={0.5}
      color="#F5F5F7"
    />
  );
}

/**
 * Site-wide craft layer: a particle field behind the page, a hairline scroll-progress rule, a static film-grain overlay,
 * and (fine pointers only, motion allowed) a trailing cursor ring that swells over links.
 */
export default function SiteEffects() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!fine || reduced || !dot || !ring) return;

    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    let hovering = false;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      const target = e.target as Element | null;
      const next = !!target?.closest?.("a, button, summary, [role='button'], input, textarea, select, label");
      if (next !== hovering) {
        hovering = next;
        ring.classList.toggle("is-hover", hovering);
        dot.classList.toggle("is-hover", hovering);
      }
    };
    const leave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const loop = () => {
      // The ring eases toward the pointer; the dot is pinned to it
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <ParticleField />
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-[#BF5AF2]"
      />
      <div className="grain pointer-events-none fixed inset-0 z-[65]" />
      <div ref={ringRef} className="cursor-ring pointer-events-none fixed left-0 top-0 z-[80] opacity-0" />
      <div ref={dotRef} className="cursor-dot pointer-events-none fixed left-0 top-0 z-[80] opacity-0" />
    </div>
  );
}

/**
 * Grid that only shows in a soft circle around the pointer. Drop inside any `relative`
 * section; it listens on its parent so it never blocks clicks.
 */
export function Spotlight({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
      el.style.opacity = "1";
    };
    const leave = () => (el.style.opacity = "0");
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`spotlight-grid pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ${className}`}
    />
  );
}
