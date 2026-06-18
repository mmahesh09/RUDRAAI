import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CaseStudiesSection from "@/components/case-studies-section";
import CTASection from "@/components/cta-section";
import { Badge } from "@/components/ui/badge";
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
      <div className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide">
          <Badge className="mb-4">Proven Results</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-4 leading-tight">
            Case <span className="text-gradient-orange">Studies</span>
          </h1>
          <p className="text-[#A1A1AA] font-body text-xl max-w-2xl mx-auto leading-relaxed">
            Real automations we've built for real businesses. Metrics verified,
            results guaranteed.
          </p>
        </div>
      </div>
      <CaseStudiesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
