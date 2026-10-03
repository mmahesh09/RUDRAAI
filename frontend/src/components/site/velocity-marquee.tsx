"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const ROW_A = ["Websites", "AI agents", "Automations", "Lead capture", "CRM sync", "Chat assistants"];
const ROW_B = ["n8n", "Next.js", "Supabase", "WhatsApp", "Slack", "Your CRM", "Your inbox"];

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** One ticker row. Drifts on its own; scrolling speeds it up, reverses it and leans the type. */
function Row({ items, base, outline }: { items: string[]; base: number; outline?: boolean }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-4, 0, 4], { clamp: false });
  const skew = useTransform(velocity, [-2500, 2500], [8, -8]);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    const b = boost.get();
    if (b < 0) dir.current = -1;
    else if (b > 0) dir.current = 1;
    const move = dir.current * base * (delta / 1000) * (1 + Math.abs(b));
    // Content is rendered twice; wrapping at -50% makes the loop seamless
    x.set(wrap(-50, 0, x.get() + move));
  });

  const translate = useTransform(x, (v) => `${v}%`);

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div style={{ x: translate, skewX: reduced ? 0 : skew }} className="flex flex-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex flex-nowrap" aria-hidden={copy === 1}>
            {items.map((item) => (
              <span
                key={item}
                className={`flex items-center font-heading font-semibold leading-none text-[clamp(2.5rem,7vw,6rem)] ${
                  outline ? "tracking-[-0.01em] text-transparent [-webkit-text-stroke:1px_rgba(245,245,247,0.35)]" : "tracking-[-0.04em] text-[#F5F5F7]"
                }`}
              >
                {item}
                <span className="mx-[0.45em] inline-block h-[0.14em] w-[0.14em] rotate-45 bg-[#BF5AF2]" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/** Interlude band between sections: what we build, then what we build it with. */
export default function VelocityMarquee() {
  return (
    <section aria-label="What we build and the tools we use" className="relative overflow-hidden border-y border-white/[0.08] bg-black py-10 md:py-14">
      <div className="marquee-fade flex flex-col gap-3 md:gap-5">
        <Row items={ROW_A} base={-2.2} />
        <Row items={ROW_B} base={1.6} outline />
      </div>
    </section>
  );
}
