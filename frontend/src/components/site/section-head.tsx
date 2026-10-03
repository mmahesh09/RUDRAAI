import type { ReactNode } from "react";
import Reveal from "@/components/site/reveal";

type SectionHeadProps = {
  /** Index shown before the label, e.g. "02" */
  index?: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Render the title as h1 (page openers) instead of h2 */
  as?: "h1" | "h2";
  className?: string;
};

/**
 * Section opener used across the site: mono index + label on a hairline,
 * a left-aligned display heading, optional intro set in a narrow measure.
 */
export default function SectionHead({ index, label, title, intro, as: H = "h2", className = "" }: SectionHeadProps) {
  return (
    <div className={`grid gap-y-6 lg:grid-cols-12 lg:gap-x-8 ${className}`}>
      <Reveal className="lg:col-span-12 border-t border-white/[0.08] pt-5">
        <p className="eyebrow">
          {index && <span className="text-[#BF5AF2]">{index}&nbsp;&nbsp;</span>}
          {label}
        </p>
      </Reveal>
      <H
        className={`lg:col-span-8 font-heading font-semibold leading-[1.02] tracking-[-0.035em] text-[#F5F5F7] [text-wrap:balance] ${
          H === "h1" ? "text-[clamp(2.5rem,6vw,5rem)]" : "text-[clamp(2rem,4.6vw,3.75rem)]"
        }`}
      >
        <Reveal as="span" variant="line" delay={0.05}>
          {title}
        </Reveal>
      </H>
      {intro && (
        <Reveal delay={0.15} className="lg:col-span-4 lg:self-end">
          <p className="max-w-[46ch] text-base leading-[1.7] text-[#A1A1AA]">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
