"use client";

import { useRef, type CSSProperties } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import HeroTornado from "@/components/hero-tornado";
import HeroRunTicker from "@/components/hero-run-ticker";
import Magnetic from "@/components/site/magnetic";

// The three services, each revealed from behind a mask — then the promise underneath
const SERVICES = ["Websites.", "AI agents.", "Automations."];

const PROOF = ["Fast delivery", "Real-time support", "No tech skills needed"];

// Entrance animations are CSS (.hero-rise / .hero-fade in globals.css) so the copy
// is visible in the server HTML; this just sets each element's start delay.
const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-out parallax: the vortex sinks and dims slower than the copy lifts away
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const vortexY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const vortexOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-black lg:min-h-[100svh] flex flex-col pt-24 sm:pt-28 lg:pt-24 pb-6"
    >
      {/* Hairline frame — the visible grid the layout sits on */}
      <div className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10" aria-hidden="true">
        <div className="h-full border-x border-white/[0.06]" />
      </div>

      <div className="container-wide w-full flex-1 flex flex-col">
        <div className="flex-1 grid lg:grid-cols-12 items-center gap-y-6">
          {/* Copy */}
          <motion.div
            style={{ y: prefersReducedMotion ? 0 : copyY }}
            className="relative z-10 lg:col-span-7 flex flex-col"
          >
            {/* Eyebrow: index label + latest-post link */}
            <div style={delay(0.1)} className="hero-fade font-mono flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.14em]">
              <span className="text-[#A1A1AA]">
                <span className="text-[#BF5AF2]" aria-hidden="true">●</span>&nbsp;&nbsp;AI services company
              </span>
              <span className="hidden sm:block h-px w-8 bg-white/15" aria-hidden="true" />
              <Link href="/blog" className="group inline-flex items-center gap-1.5 text-[#A1A1AA] hover:text-white transition-colors">
                Latest from the blog
                <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            <h1 className="mt-6 lg:mt-7 font-heading font-bold tracking-[-0.035em] leading-[0.98]">
              <span className="sr-only">{SERVICES.join(" ")} Built to work for your business.</span>
              {/* Each line rises out of its mask one character at a time */}
              <span aria-hidden="true" className="block text-[clamp(2.25rem,11vw,4.25rem)] lg:text-[clamp(3rem,min(5.2vw,10.5svh),5.5rem)]">
                {SERVICES.map((text, i) => (
                  <span key={text} className="block overflow-hidden pb-[0.06em] text-white">
                    {text.split("").map((ch, j) => (
                      <span key={j} style={delay(0.25 + i * 0.12 + j * 0.028)} className="hero-rise hero-char">
                        {ch === " " ? " " : ch}
                      </span>
                    ))}
                  </span>
                ))}
              </span>
              <span aria-hidden="true" className="mt-3 block overflow-hidden pb-[0.08em] font-subheading font-medium tracking-[-0.01em] text-[clamp(1.25rem,4.6vw,1.75rem)] lg:text-[clamp(1.35rem,min(2vw,4.2svh),2rem)]">
                <span style={delay(0.25 + SERVICES.length * 0.12 + 0.15)} className="hero-rise inline-block">
                  <span className="text-shine">Built to work for your business.</span>
                </span>
              </span>
            </h1>

            <p
              style={delay(0.75)}
              className="hero-fade mt-6 lg:mt-7 max-w-[44ch] text-[15px] sm:text-base leading-[1.7] text-[#A1A1AA] font-body"
            >
              Websites, AI agents and automations that take the repetitive work
              off your team.
            </p>

            <div style={delay(0.9)} className="hero-fade mt-8 flex flex-col min-[420px]:flex-row min-[420px]:items-center gap-x-8 gap-y-4">
              <Magnetic strength={0.25}>
              <Link
                href="/booking"
                className="group inline-flex h-12 items-center justify-between gap-4 rounded-full bg-[#8944AB] pl-6 pr-1.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#7A3A9A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#BF5AF2]"
              >
                Book a free call
                <span className="font-mono inline-flex h-9 items-center gap-2 rounded-full bg-black px-3.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
                  15 min · Sat–Sun
                  <ArrowRight className="h-3.5 w-3.5 text-[#BF5AF2] transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </Link>
              </Magnetic>
              <Link
                href="/services"
                className="group relative inline-flex w-fit items-center gap-2 py-1 text-[15px] font-medium text-white"
              >
                See how it works
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-[0.35] bg-white/40 transition-transform duration-500 ease-out group-hover:scale-x-100 group-hover:bg-[#BF5AF2]" />
              </Link>
            </div>
          </motion.div>

          {/* Vortex — overlaps the copy column slightly on desktop.
              Outer layer owns the scroll-linked y/opacity; inner layer owns the CSS
              entrance, so the two never fight over the same property. */}
          <motion.div
            style={{
              y: prefersReducedMotion ? 0 : vortexY,
              opacity: prefersReducedMotion ? 1 : vortexOpacity,
            }}
            className="relative lg:col-span-5 lg:-ml-20 -mx-5 sm:mx-0"
          >
            <div style={delay(0.4)} className="hero-fade-scale flex items-center justify-center">
              <HeroTornado />
            </div>
          </motion.div>
        </div>

        {/* Baseline strip: live-feeling run log + proof points */}
        <div
          style={delay(1.2)}
          className="hero-fade mt-6 lg:mt-0 flex flex-col gap-3 border-t border-white/[0.08] pt-4 md:flex-row md:items-center md:justify-between md:gap-8"
        >
          <div className="min-w-0 md:max-w-[50%] flex-1">
            <HeroRunTicker />
          </div>
          <ul className="font-mono flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] uppercase tracking-[0.12em] text-[#A1A1AA]">
            {PROOF.map((item, i) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-[#3F3F46]" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
