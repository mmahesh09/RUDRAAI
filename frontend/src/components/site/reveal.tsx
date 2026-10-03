"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { splitWords } from "@/lib/split-words";

type RevealProps = {
  as?: "div" | "span" | "li" | "section" | "p";
  /** "fade" lifts a block in; "line" slides its content up from behind a mask;
   *  "words" masks each word and staggers them up one after another */
  variant?: "fade" | "line" | "words";
  /** Start delay in seconds */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * Scroll-triggered reveal. Content is hidden only under `html.js` (see layout.tsx), so
 * server HTML is always readable; reduced motion is handled in globals.css.
 */
export default function Reveal({ as = "div", variant = "fade", delay = 0, className = "", style, children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Typed as "div" for the ref; the rendered tag is whatever `as` says
  const Tag = as as "div";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const base = variant === "line" ? "reveal-line" : variant === "words" ? "reveal-words" : "reveal";
  return (
    <Tag ref={ref} className={`${base} ${className}`} style={{ ...style, "--d": `${delay}s` } as CSSProperties}>
      {variant === "line" ? <span>{children}</span> : variant === "words" ? splitWords(children) : children}
    </Tag>
  );
}
