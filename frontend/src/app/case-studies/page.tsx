import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { caseStudies } from "@/lib/case-studies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies — RudraAI | AI Automation Results",
  description:
    "See real results from RudraAI's AI automation projects — lead qualification, customer support AI, appointment booking, and more.",
};

export default function CaseStudiesPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <div className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide">
          <Badge className="mb-4">Proven Results</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-4 leading-tight">
            Case <span className="text-gradient-orange">Studies</span>
          </h1>
          <p className="text-[#A1A1AA] font-body text-xl max-w-2xl mx-auto leading-relaxed">
            Real automations we&apos;ve built for real businesses. Metrics verified,
            results measured.
          </p>
        </div>
      </div>

      {/* Case studies grid */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-6 mb-12">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group relative rounded-2xl neo-card overflow-hidden hover:border-white/12 transition-all duration-300 block"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative h-44 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-55 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111117] via-[#111117]/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="text-[10px]">{study.industry}</Badge>
                  </div>
                </div>

                <div className="relative z-10 p-5">
                  <h2 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-[#FF6B00] transition-colors">
                    {study.title}
                  </h2>
                  <p className="text-sm text-[#A1A1AA] font-body leading-relaxed mb-5">
                    {study.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {study.metrics.map((metric) => {
                      const Icon = metric.icon;
                      return (
                        <div key={metric.label} className="text-center p-2 rounded-lg bg-white/03 border border-white/05">
                          <div className="font-heading font-bold text-base" style={{ color: metric.color }}>
                            {metric.value}
                          </div>
                          <div className="text-[9px] text-[#71717A] font-body leading-tight mt-0.5">{metric.label}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {study.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] font-body text-[#71717A] px-2 py-0.5 rounded bg-white/05 border border-white/06">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[#A1A1AA] group-hover:text-[#FF6B00] transition-colors whitespace-nowrap">
                      Read more <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Summary stats */}
          <div className="border border-white/[0.06] rounded-2xl p-8 bg-[rgba(255,255,255,0.02)]">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold text-white mb-2">Results at a glance</h2>
              <p className="text-[#71717A] text-sm">Across all RudraAI automation engagements</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { value: "340%", label: "Avg lead volume increase", color: "#10B981" },
                { value: "80%", label: "Tasks automated end-to-end", color: "#8B5CF6" },
                { value: "45%", label: "Avg no-show reduction", color: "#EC4899" },
                { value: "28h", label: "Staff hours saved per week", color: "#3B82F6" },
              ].map(({ value, label, color }) => (
                <div key={label} className="text-center">
                  <p className="text-3xl font-heading font-black mb-1" style={{ color }}>{value}</p>
                  <p className="text-[#71717A] text-sm font-body">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="section-padding pt-0">
        <div className="container-wide">
          <div className="text-center bg-gradient-to-br from-[rgba(255,107,0,0.08)] to-transparent border border-[rgba(255,107,0,0.15)] rounded-2xl p-12">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mb-3">
              Ready to be our next case study?
            </h2>
            <p className="text-[#A1A1AA] font-body mb-8 max-w-xl mx-auto">
              Book a free 15-minute automation audit. We&apos;ll map your workflows and show you exactly what&apos;s possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white font-heading font-semibold shadow-[0_4px_20px_rgba(255,107,0,0.4)] hover:shadow-[0_6px_30px_rgba(255,107,0,0.6)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Book free audit <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-white/15 text-[#A1A1AA] font-heading font-semibold hover:text-white hover:border-white/30 transition-all duration-300"
              >
                View services <Clock className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <CTASection />
      <Footer />
    </main>
  );
}
