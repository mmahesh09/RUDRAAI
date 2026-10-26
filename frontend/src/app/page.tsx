import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import ClientsSection from "@/components/clients-section";
import ProblemSection from "@/components/problem-section";
import ServicesSection from "@/components/services-section";
import FeaturesSection from "@/components/features-section";
import HowItWorksSection from "@/components/how-it-works-section";
import FaqSection from "@/components/faq-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";
import ScrollStatement from "@/components/site/scroll-statement";
import VelocityMarquee from "@/components/site/velocity-marquee";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "AI Services: Websites, AI Agents & Automation",
    description:
      "RudraAI is an AI services studio in Hyderabad building fast Next.js websites, custom AI agents and n8n workflow automations. Fixed price. Book a free call.",
    path: "/",
  }),
  title: { absolute: "AI Services: Websites, AI Agents & Automation | RudraAI" },
};

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      {/* The page reads as one run: clients → statement → problem → services → ticker → a live workflow → process → questions → close */}
      <ClientsSection />
      <ScrollStatement />
      <ProblemSection />
      <ServicesSection />
      <VelocityMarquee />
      <FeaturesSection />
      <HowItWorksSection />
      <FaqSection />
      <CTASection />
      <Footer />
    </main>
  );
}
