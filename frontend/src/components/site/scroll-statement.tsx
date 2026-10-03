"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

const STATEMENT =
  "Every business loses hours to copy-paste, follow-ups and the same five answers. We build the systems that give those hours back.";
// Words that land in the accent once lit
const ACCENT = new Set(["give", "those", "hours", "back."]);

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${ACCENT.has(word) ? "text-[#BF5AF2]" : ""}`}>
      {word}
    </motion.span>
  );
}

/** A single statement whose words light up one by one as it scrolls through the viewport. */
export default function ScrollStatement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = STATEMENT.split(" ");

  return (
    <section aria-label="Why we exist" className="relative bg-black py-28 md:py-40">
      <div className="container-wide grid lg:grid-cols-12 lg:gap-x-8">
        <p className="eyebrow lg:col-span-3 mb-8 lg:mb-0 lg:pt-4">
          <span className="text-[#BF5AF2]">00&nbsp;&nbsp;</span>Why we exist
        </p>
        <p
          ref={ref}
          className="lg:col-span-9 font-heading font-semibold leading-[1.08] tracking-[-0.035em] text-[#F5F5F7] text-[clamp(1.85rem,4.4vw,3.75rem)] [text-wrap:pretty]"
        >
          {words.map((w, i) =>
            reduced ? (
              <span key={i} className={ACCENT.has(w) ? "text-[#BF5AF2]" : ""}>{w} </span>
            ) : (
              <span key={i}>
                <Word word={w} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />{" "}
              </span>
            )
          )}
        </p>
      </div>
    </section>
  );
}
