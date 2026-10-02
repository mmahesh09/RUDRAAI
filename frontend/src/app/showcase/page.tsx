import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ShowcaseSection from "@/components/showcase-section";
import CTASection from "@/components/cta-section";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showcase — n8n Workflows & AI Agents We've Built",
  description:
    "See the n8n workflows and AI agents RudraAI has built — lead qualification, support agents, booking, email, WhatsApp nurturing, and invoice automation, node by node.",
  alternates: { canonical: "/showcase" },
  openGraph: { url: "/showcase" },
};

export default function ShowcasePage() {
  return (
    <main>
      <Navbar />
      <div className="relative pt-32 pb-4 text-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide">
          <Badge className="mb-4">Showcase</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-4 leading-tight">
            Automations We&apos;ve <span className="text-gradient-orange">Built</span>
          </h1>
          <p className="text-[#A1A1AA] font-body text-xl max-w-2xl mx-auto leading-relaxed">
            Real workflows, node by node — from trigger to outcome. Every build is
            custom, documented, and handed over for you to own.
          </p>
        </div>
      </div>
      <ShowcaseSection />
      <CTASection />
      <Footer />
    </main>
  );
}
