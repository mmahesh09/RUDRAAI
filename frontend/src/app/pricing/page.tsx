import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CTASection from "@/components/cta-section";
import { Pricing } from "@/components/ui/pricing-table";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

const zapIcon = (
  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)]">
    <Zap className="w-6 h-6 text-[#FF6B00]" />
  </div>
);

export const metadata = {
  title: "AI Automation Pricing & Packages",
  description:
    "Transparent pricing for n8n workflow automation and AI agent development — from single workflows to full enterprise automation programs.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <main>
      <Navbar />

      <div className="relative pt-32 pb-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide text-center">
          <Badge className="mb-4">Transparent Pricing</Badge>
          <p className="text-[#A1A1AA] font-body text-lg max-w-2xl mx-auto">
            No hidden fees. No per-seat nonsense. Pay for the outcomes you get.
          </p>
        </div>
      </div>

      <section className="relative">
        <div className="absolute inset-0 bg-[#09090B]" />
        <div className="relative z-10">
          <Pricing
            icon={zapIcon}
            title="Simple, Outcome-Based Pricing"
            subtitle="From your first automation to a full AI-powered operation — we have a plan that fits."
            tiers={[
              {
                name: "Starter",
                description: "Perfect for small businesses looking to eliminate one major bottleneck.",
                price: 50,
                billingPeriod: "/ project",
                buttonText: "Get Started",
                buttonHref: "/booking",
                features: [
                  { text: "1 custom n8n automation workflow" },
                  { text: "Up to 3 integrations (Slack, Gmail, CRM, etc.)" },
                  { text: "3–7 day deployment" },
                  { text: "30-day post-launch support" },
                  { text: "Full workflow documentation" },
                ],
                featuresTitle: "What's included",
              },
              {
                name: "Growth",
                description: "For teams ready to automate multiple workflows and see compound ROI.",
                price: 100,
                billingPeriod: "/ project",
                buttonText: "Book a Call",
                buttonHref: "/booking",
                isPrimary: true,
                features: [
                  { text: "3 custom automation workflows" },
                  { text: "Unlimited integrations" },
                  { text: "AI agent development (GPT-4o, Claude)" },
                  { text: "Priority Slack support (4h response)" },
                  { text: "Monthly strategy & ROI reviews" },
                  { text: "Workflow monitoring & alerts" },
                ],
                featuresTitle: "What's included",
              },
              {
                name: "Scale",
                description: "Full-stack AI automation for growing companies with complex operations.",
                price: 200,
                billingPeriod: "/ project",
                buttonText: "Talk to Sales",
                buttonHref: "/booking",
                features: [
                  { text: "5 custom automation workflows" },
                  { text: "Dedicated automation engineer" },
                  { text: "Custom AI agent development" },
                  { text: "24/7 monitoring with SLA" },
                  { text: "Quarterly automation audits" },
                  { text: "White-glove onboarding" },
                  { text: "Custom reporting dashboards" },
                ],
                featuresTitle: "What's included",
              },
            ]}
            footerTitle="Not sure which plan fits?"
            footerDescription="Book a free 60-minute automation audit. We'll map your exact needs and recommend the right path — no sales pressure."
            footerButtonText="Book Free Audit"
            footerButtonHref="/booking"
          />
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
