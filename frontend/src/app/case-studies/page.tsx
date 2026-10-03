import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import PageHero from "@/components/site/page-hero";
import SectionHead from "@/components/site/section-head";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/case-studies";
import { researchCaseStudies } from "@/lib/research-case-studies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies — AI Agents & Automation in Practice",
  description:
    "How RudraAI's automations and AI agents work in practice — lead qualification, support agents, booking and more — plus public AI automation research with linked sources.",
  alternates: { canonical: "/case-studies" },
};

type Metric = { value: string; label: string };

function MetricRow({ metrics }: { metrics: readonly Metric[] }) {
  return (
    <dl className="grid grid-cols-3 border-t border-white/[0.08]">
      {metrics.map((m, i) => (
        <div key={m.label} className={`pt-4 ${i > 0 ? "border-l border-white/[0.08] pl-4" : ""}`}>
          <dt className="sr-only">{m.label}</dt>
          <dd className="font-heading text-2xl font-semibold tracking-[-0.03em] text-[#F5F5F7]">{m.value}</dd>
          <dd className="mt-1 text-[13px] leading-snug text-[#A1A1AA]">{m.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function CaseStudiesPage() {
  return (
    <main className="bg-black">
      <Navbar />
      <PageHero
        label="Case studies"
        title="How it works in practice."
        intro="What we built, why, and what changed afterwards. Each one walks through the problem, the workflow and the numbers."
      />

      <section className="pb-24 md:pb-32">
        <div className="container-wide">
          <ol className="border-b border-white/[0.08]">
            {caseStudies.map((study, i) => (
              <li key={study.slug} className="border-t border-white/[0.08]">
                <Link href={`/case-studies/${study.slug}`} className="group grid gap-8 py-12 lg:grid-cols-12 lg:gap-x-8 lg:py-16">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#0B0B0C] lg:col-span-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={study.image}
                      alt=""
                      className="h-full w-full object-cover opacity-75 transition-[opacity,transform] duration-700 group-hover:scale-[1.03] group-hover:opacity-95"
                    />
                  </div>
                  <div className="flex flex-col lg:col-span-7 lg:col-start-6">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
                      <span className="text-[#2997FF]">{String(i + 1).padStart(2, "0")}</span>&nbsp;&nbsp;{study.industry}
                    </p>
                    <h2 className="mt-4 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#F5F5F7] transition-colors group-hover:text-[#2997FF]">
                      {study.title}
                    </h2>
                    <p className="mt-4 max-w-[56ch] text-[15px] leading-[1.7] text-[#A1A1AA]">{study.description}</p>
                    <div className="mt-8">
                      <MetricRow metrics={study.metrics} />
                    </div>
                    <span className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-[#F5F5F7]">
                      Read the case study
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Public research — clearly separated from our own work */}
      <section className="section-padding border-t border-white/[0.08]">
        <div className="container-wide">
          <SectionHead
            label="Industry research"
            title="What others are learning."
            intro="Published AI automation results from other companies, summarised. Not our work — every source is linked so you can check the numbers yourself."
          />
          <ul className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {researchCaseStudies.map((study) => (
              <li key={study.slug}>
                <Link href={`/case-studies/research/${study.slug}`} className="group block">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
                    {study.company} · {study.sourceType}
                  </p>
                  <h3 className="mt-3 font-heading text-xl font-semibold leading-snug tracking-[-0.02em] text-[#F5F5F7] transition-colors group-hover:text-[#2997FF]">
                    {study.title}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-[#A1A1AA]">{study.description}</p>
                  <div className="mt-6">
                    <MetricRow metrics={study.metrics} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
