import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { caseStudies, getCaseStudyBySlug } from "@/lib/case-studies";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) return {};
  return {
    title: `${study.title} — RudraAI Case Study`,
    description: study.description,
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: {
      title: study.title,
      description: study.description,
      images: [{ url: study.image, width: 1200, height: 630 }],
      type: "article",
    },
  };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudyBySlug(slug);
  if (!study) notFound();

  return (
    <main className="bg-black">
      <Navbar />

      <article>
        <header className="container-wide pt-32 md:pt-40">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#A1A1AA] transition-colors hover:text-[#F5F5F7]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All case studies
          </Link>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
            <span className="text-[#2997FF]">{study.industry}</span>&nbsp;&nbsp;·&nbsp;&nbsp;{study.timeline}
          </p>
          <h1 className="mt-5 max-w-[20ch] font-heading text-[clamp(2.25rem,5.5vw,4.5rem)] font-semibold leading-[1.0] tracking-[-0.045em] text-[#F5F5F7] [text-wrap:balance]">
            {study.title}
          </h1>
          <p className="mt-6 max-w-[56ch] text-xl leading-[1.6] text-[#A1A1AA]">{study.description}</p>
        </header>

        {/* Outcome band */}
        <dl className="container-wide mt-16 grid grid-cols-1 border-y border-white/[0.08] sm:grid-cols-3">
          {study.metrics.map((m, i) => (
            <div key={m.label} className={`py-8 ${i > 0 ? "border-t border-white/[0.08] sm:border-t-0 sm:border-l sm:pl-8" : ""}`}>
              <dt className="sr-only">{m.label}</dt>
              <dd className="font-heading text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-none tracking-[-0.045em] text-[#F5F5F7]">{m.value}</dd>
              <dd className="mt-2 text-[15px] text-[#A1A1AA]">{m.label}</dd>
            </div>
          ))}
        </dl>

        <div className="container-wide mt-16">
          <div className="overflow-hidden rounded-2xl bg-[#0B0B0C]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={study.image} alt="" className="aspect-[16/7] w-full object-cover" />
          </div>
        </div>

        <div className="container-wide grid gap-12 py-16 md:py-24 lg:grid-cols-12 lg:gap-x-8">
          <aside className="lg:col-span-3">
            <dl className="ledger border-y border-white/[0.08] lg:sticky lg:top-24">
              <div className="py-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">Timeline</dt>
                <dd className="mt-1 text-[15px] text-[#F5F5F7]">{study.timeline}</dd>
              </div>
              <div className="py-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">Stack</dt>
                <dd className="mt-1 text-[15px] leading-relaxed text-[#F5F5F7]">{study.tags.join(", ")}</dd>
              </div>
              <div className="py-4">
                <Link
                  href="/booking"
                  className="group inline-flex items-center gap-2 text-[15px] font-medium text-[#F5F5F7] underline decoration-white/30 underline-offset-[6px] hover:decoration-[#2997FF]"
                >
                  Build something similar
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </div>
            </dl>
          </aside>
          <div className="prose-blog max-w-[68ch] lg:col-span-8 lg:col-start-5" dangerouslySetInnerHTML={{ __html: study.content }} />
        </div>
      </article>

      <CTASection />
      <Footer />
    </main>
  );
}
