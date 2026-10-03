import type { CSSProperties, ReactNode } from "react";

type PageHeroProps = {
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Optional row under the intro: actions, meta, filters */
  children?: ReactNode;
};

const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Opener for inner pages. Same language as the home hero (hairline frame, mono label,
 * left-aligned display type) but quieter: no vortex, no ticker. CSS-only entrance,
 * so the h1 is visible in server HTML.
 */
export default function PageHero({ label, title, intro, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-black pt-36 pb-20 md:pt-44 md:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10" aria-hidden="true">
        <div className="h-full border-x border-white/[0.06]" />
      </div>
      <div className="container-wide">
        <p style={delay(0.05)} className="hero-fade eyebrow">
          <span className="text-[#BF5AF2]" aria-hidden="true">●</span>&nbsp;&nbsp;{label}
        </p>
        <h1 className="mt-8 max-w-[18ch] font-heading font-semibold leading-[0.98] tracking-[-0.045em] text-[#F5F5F7] text-[clamp(2.25rem,8vw,6rem)] [text-wrap:balance]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span style={delay(0.15)} className="hero-rise inline-block">
              {title}
            </span>
          </span>
        </h1>
        {intro && (
          <p style={delay(0.45)} className="hero-fade mt-8 max-w-[52ch] text-lg leading-[1.65] text-[#A1A1AA]">
            {intro}
          </p>
        )}
        {children && (
          <div style={delay(0.6)} className="hero-fade mt-10">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
