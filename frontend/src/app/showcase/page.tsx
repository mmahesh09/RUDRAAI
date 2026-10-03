import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ShowcaseSection from "@/components/showcase-section";
import ShowcaseHeroVisual from "@/components/showcase-hero-visual";
import CTASection from "@/components/cta-section";
import PageHero from "@/components/site/page-hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showcase — Workflows & AI Agents, Step by Step",
  description:
    "See the n8n workflows and AI agents RudraAI has built — lead qualification, support agents, booking, email, WhatsApp nurturing, and invoice automation, node by node.",
  alternates: { canonical: "/showcase" },
  openGraph: { url: "/showcase" },
};

export default function ShowcasePage() {
  return (
    <main className="bg-black">
      <Navbar />
      <PageHero
        label="Showcase"
        title="What we've built, step by step."
        intro="Each of these is a real-shaped workflow: what starts it, what the AI decides, and what happens next. Every build is custom, documented, and handed over for you to own."
      />
      <div className="container-wide pb-16">
        <ShowcaseHeroVisual />
      </div>
      <ShowcaseSection />
      <CTASection />
      <Footer />
    </main>
  );
}
