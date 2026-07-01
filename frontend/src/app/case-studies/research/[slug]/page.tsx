import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { researchCaseStudies, getResearchCaseStudyBySlug } from "@/lib/research-case-studies";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return researchCaseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getResearchCaseStudyBySlug(slug);
  if (!study) return {};
  return {
    title: `${study.title} — RudraAI Research`,
    description: study.description,
    openGraph: {
      title: study.title,
      description: study.description,
      images: [{ url: study.image, width: 1200, height: 630 }],
      type: "article",
    },
  };
}

export default async function ResearchCaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const study = getResearchCaseStudyBySlug(slug);
  if (!study) notFound();

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <div className="relative pt-32 pb-0 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-1.5 text-sm font-body text-[#71717A] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Case Studies
          </Link>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge style={{ color: study.accentColor, background: `${study.accentColor}15`, borderColor: `${study.accentColor}30` }}>
              Industry Research
            </Badge>
            <Badge variant="secondary">{study.category}</Badge>
            <span className="text-sm font-body text-[#71717A]">{study.publishedContext}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white leading-tight mb-6 max-w-4xl">
            {study.title}
          </h1>

          <p className="text-[#A1A1AA] font-body text-lg max-w-3xl mb-10 leading-relaxed">
            {study.description}
          </p>
        </div>
      </div>

      {/* Hero image */}
      <div className="relative w-full overflow-hidden" style={{ maxHeight: "460px" }}>
        <img
          src={study.image}
          alt={`${study.company} — ${study.category}`}
          className="w-full object-cover opacity-50"
          style={{ maxHeight: "460px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D14] via-[#0D0D14]/20 to-transparent" />
      </div>

      {/* Metrics bar */}
      <div className="bg-[rgba(255,255,255,0.02)] border-y border-white/[0.06]">
        <div className="container-wide py-8">
          <div className="grid grid-cols-3 gap-6">
            {study.metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: m.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-black text-white">{m.value}</p>
                    <p className="text-sm text-[#71717A] font-body">{m.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-[1fr_300px] gap-12 max-w-5xl mx-auto">
            {/* Main content */}
            <div
              className="prose-blog"
              dangerouslySetInnerHTML={{ __html: study.content }}
            />

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-white font-heading font-semibold text-sm mb-4">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <span key={tag} className="text-xs font-body text-[#A1A1AA] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="text-white font-heading font-semibold text-sm mb-3">Sources</h3>
                <ul className="space-y-3">
                  {study.sources.map((source) => (
                    <li key={source.url}>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start gap-1.5 text-xs font-body text-[#A1A1AA] hover:text-white transition-colors leading-relaxed"
                      >
                        <ExternalLink className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#71717A] group-hover:text-[#FF6B00] transition-colors" />
                        {source.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-[rgba(255,107,0,0.12)] to-transparent border border-[rgba(255,107,0,0.2)] rounded-2xl p-5">
                <h3 className="text-white font-heading font-semibold text-sm mb-2">Want this for your business?</h3>
                <p className="text-[#A1A1AA] text-xs font-body mb-4 leading-relaxed">Book a free 15-minute automation audit and see what these patterns look like applied to your workflows.</p>
                <Link
                  href="/booking"
                  className="block text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white text-sm font-medium shadow-[0_4px_20px_rgba(255,107,0,0.3)]"
                >
                  Book free audit
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
