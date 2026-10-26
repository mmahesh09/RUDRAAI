"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { CLIENTS } from "@/components/client-logos";
import type { TestimonialItem } from "@/lib/testimonials";

const EASE = [0.22, 1, 0.36, 1] as const;

/** One quote at a time: an index rail on the left, the quote revealed word by word, and a faint ticker of client names beneath. */
export function Testimonial({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = useReducedMotion();
  const count = testimonials.length;
  if (!count) return null;

  const current = testimonials[activeIndex];
  const client = CLIENTS.find((c) => c.name === current.client);
  const goPrev = () => setActiveIndex((i) => (i - 1 + count) % count);
  const goNext = () => setActiveIndex((i) => (i + 1) % count);
  const pad = (n: number) => String(n).padStart(2, "0");
  // Long quotes set smaller and reveal faster so they never take seconds to read in
  const long = current.quote.length > 220;
  const stagger = long ? 0.015 : 0.05;

  return (
    <div className="relative overflow-hidden pb-24">
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Left — index rail */}
        <div className="flex items-end gap-4 md:w-40 md:shrink-0 md:flex-col md:items-start md:justify-between md:border-r md:border-white/[0.08] md:py-12 md:pr-8">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeIndex}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="font-heading text-[clamp(3.5rem,7vw,5.5rem)] font-semibold leading-none tracking-[-0.05em] text-[#F5F5F7]"
            >
              {pad(activeIndex + 1)}
            </motion.span>
          </AnimatePresence>
          <div className="flex w-full flex-col gap-3 pb-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">/ {pad(count)}</span>
            <span className="relative block h-px w-full max-w-[120px] bg-white/[0.12]">
              <motion.span
                className="absolute inset-y-0 left-0 bg-[#BF5AF2]"
                animate={{ width: `${((activeIndex + 1) / count) * 100}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </span>
          </div>
        </div>

        {/* Center — main content */}
        <div className="flex-1 md:py-12 md:pl-16">
          {/* Company badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={reduced ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? undefined : { opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              {client ? (
                <Link
                  href={client.href}
                  aria-label={`${client.name}: see the work`}
                  className="inline-flex rounded-full border border-white/[0.12] px-3.5 py-1.5 transition-colors hover:border-[#BF5AF2]/60"
                >
                  {client.logo}
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] px-3 py-1 font-mono text-[12px] text-[#A1A1AA]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#BF5AF2]" />
                  {current.client}
                </span>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Quote — words rise in one by one */}
          <figure aria-live="polite">
            {current.rating && (
              <p className="mb-5 flex gap-1" aria-label={`Rated ${current.rating} out of 5`}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    aria-hidden="true"
                    className={`h-4 w-4 ${i < current.rating! ? "fill-[#BF5AF2] text-[#BF5AF2]" : "text-white/20"}`}
                  />
                ))}
              </p>
            )}
            <div className="relative mb-12 min-h-[140px] [perspective:800px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={activeIndex}
                  className={`font-heading font-medium tracking-[-0.03em] text-[#F5F5F7] ${
                    long ? "text-[clamp(1.25rem,2.4vw,1.85rem)] leading-[1.3]" : "text-[clamp(1.75rem,4vw,3rem)] leading-[1.15]"
                  }`}
                  initial={reduced ? false : "hidden"}
                  animate="visible"
                  exit={reduced ? undefined : "exit"}
                >
                  {current.quote.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      className="mr-[0.28em] inline-block"
                      variants={{
                        hidden: { opacity: 0, y: 20, rotateX: 90 },
                        visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.5, delay: i * stagger, ease: EASE } },
                        exit: { opacity: 0, y: -10, transition: { duration: 0.2, delay: Math.min(i * 0.02, 0.3) } },
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Author row */}
            <div className="flex flex-wrap items-end justify-between gap-6">
              <AnimatePresence mode="wait">
                <motion.figcaption
                  key={activeIndex}
                  initial={reduced ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="flex items-center gap-4"
                >
                  <motion.span
                    aria-hidden="true"
                    className="block h-px w-8 bg-[#BF5AF2]"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    style={{ originX: 0 }}
                  />
                  <span className="flex flex-col">
                    <cite className="text-[16px] font-semibold not-italic text-[#F5F5F7]">{current.name}</cite>
                    <span className="text-[14px] text-[#A1A1AA]">{current.role}</span>
                  </span>
                </motion.figcaption>
              </AnimatePresence>

              {/* Navigation — fill slides in from the side it points to */}
              {count > 1 && (
                <div className="flex items-center gap-4">
                  {[
                    { onClick: goPrev, label: "Previous testimonial", Icon: ArrowLeft, from: "-translate-x-full" },
                    { onClick: goNext, label: "Next testimonial", Icon: ArrowRight, from: "translate-x-full" },
                  ].map(({ onClick, label, Icon, from }) => (
                    <motion.button
                      key={label}
                      type="button"
                      onClick={onClick}
                      aria-label={label}
                      whileTap={{ scale: 0.95 }}
                      className="group relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/[0.18]"
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 ${from} bg-[#BF5AF2] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0`}
                      />
                      <Icon className="relative z-10 h-[18px] w-[18px] text-[#F5F5F7]" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </figure>
        </div>
      </div>

      {/* Bottom ticker — client names drifting past, barely there */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 overflow-hidden opacity-[0.08]" aria-hidden="true">
        <motion.div
          className="flex whitespace-nowrap font-heading text-6xl font-bold tracking-tight text-[#F5F5F7]"
          animate={reduced ? undefined : { x: [0, -1000] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8">
              {testimonials.map((t) => t.client).join(" • ")} •
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
