import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import IndustriesSection from "@/components/industries-section";
import CTASection from "@/components/cta-section";
import PageHero from "@/components/site/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries — AI Automation for SaaS, E-commerce, Clinics & More",
  description:
    "Where AI agents and automation help first in SaaS, e-commerce, agencies, clinics, finance and operations teams — with concrete starting points for each.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <main className="bg-black">
      <Navbar />
      <PageHero
        label="Industries"
        title="Different businesses, the same busywork."
        intro="The tools change from sector to sector, but the repetitive work looks remarkably similar. Here's where we'd usually start in yours."
      />
      <IndustriesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
