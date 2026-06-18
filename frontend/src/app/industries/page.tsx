import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import IndustriesSection from "@/components/industries-section";
import CTASection from "@/components/cta-section";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries — RudraAI | AI Automation by Vertical",
  description:
    "RudraAI serves SaaS, e-commerce, agencies, healthcare, FinTech, and operations teams with specialized AI automation workflows.",
};

export default function IndustriesPage() {
  return (
    <main>
      <Navbar />
      <div className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide">
          <Badge className="mb-4">By Vertical</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-4 leading-tight">
            Your Industry, <span className="text-gradient-orange">Automated</span>
          </h1>
          <p className="text-[#A1A1AA] font-body text-xl max-w-2xl mx-auto leading-relaxed">
            Deep expertise across verticals — we speak your industry's language and
            know your exact workflow challenges.
          </p>
        </div>
      </div>
      <IndustriesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
