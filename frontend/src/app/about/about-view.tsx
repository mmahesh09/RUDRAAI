import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import PageHero from "@/components/site/page-hero";
import SectionHead from "@/components/site/section-head";
import Reveal from "@/components/site/reveal";
import { SITE } from "@/lib/site";

// Margin notes beside the story — facts, not claims
const NOTES = [
  { k: "Founded", v: "2026" },
  { k: "Based in", v: SITE.location },
  { k: "Works with", v: "Small and growing teams, worldwide" },
  { k: "You talk to", v: "The person who builds it" },
];


const VALUES = [
  { title: "Useful beats impressive", body: "A plain workflow that saves five hours a week beats a clever demo." },
  { title: "No black boxes", body: "Every workflow is readable and documented." },
  { title: "Ownership, not dependency", body: "Built in your accounts. It runs without us." },
];

export default function AboutView() {
  return (
    <main className="bg-black">
      <Navbar />
      <PageHero
        label="About"
        title={<span>An engineer&apos;s studio, <span className="text-[#BF5AF2]">not an agency.</span></span>}
        intro={`A small practice in ${SITE.location.split(",")[0]} building websites, AI agents and automations.`}
      />

      {/* Story — a single editorial column with margin notes */}
      <section className="border-t border-white/[0.08] py-24 md:py-32">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <Reveal className="lg:col-span-3">
            <dl className="ledger border-y border-white/[0.08] lg:sticky lg:top-24">
              {NOTES.map((n) => (
                <div key={n.k} className="py-4">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">{n.k}</dt>
                  <dd className="mt-1 text-[15px] text-[#F5F5F7]">{n.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="lg:col-span-7 lg:col-start-5">
            <Reveal>
              <p className="font-heading text-[clamp(1.5rem,2.6vw,2.125rem)] font-medium leading-[1.3] tracking-[-0.025em] text-[#F5F5F7]">
                {SITE.name} started with a simple frustration: watching capable people lose hours every day to work a
                computer should be doing.
              </p>
            </Reveal>
            <div className="mt-10 space-y-6 text-[17px] leading-[1.8] text-[#A1A1AA]">
              <Reveal>
                <p>
                  So we build the systems that take it away — on n8n, with AI models where they genuinely help. We stay
                  small: you talk to the engineer building your system, not an account manager.
                </p>
              </Reveal>
              <Reveal>
                <p className="text-[#F5F5F7]">
                  Everything is documented, lives in your accounts, and keeps running whether we&apos;re around or not.
                </p>
              </Reveal>
            </div>
            <Reveal className="mt-10">
              <p className="font-heading text-base font-semibold text-[#F5F5F7]">{SITE.consultant}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">Founder, {SITE.name}</p>
            </Reveal>
          </div>
        </div>
      </section>


      {/* Values */}
      <section className="section-padding border-t border-white/[0.08]">
        <div className="container-wide grid gap-12 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-12">
            <SectionHead index="01" label="How we think" title={<span>Three rules <span className="text-[#BF5AF2]">we don&apos;t bend.</span></span>} />
          </div>
          <ol className="ledger border-y border-white/[0.08] lg:col-span-8 lg:col-start-5">
            {VALUES.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.05} className="grid gap-2 py-7 sm:grid-cols-12 sm:gap-x-6">
                <span className="font-mono text-[11px] tracking-[0.14em] text-[#BF5AF2] sm:col-span-1 sm:pt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="sm:col-span-11">
                  <h3 className="font-heading text-xl font-semibold tracking-[-0.02em] text-[#F5F5F7]">{v.title}</h3>
                  <p className="mt-1.5 max-w-[56ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Reveal className="lg:col-span-8 lg:col-start-5">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-[15px] font-medium text-[#F5F5F7] underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-[#BF5AF2]"
            >
              See what we build
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
