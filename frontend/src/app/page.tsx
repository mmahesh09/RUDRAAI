import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import { CustomersSectionDemo } from "@/components/ui/customers-section";
import ServicesSection from "@/components/services-section";
import FeaturesSection from "@/components/features-section";
import HowItWorksSection from "@/components/how-it-works-section";
import TestimonialsSection from "@/components/testimonials-section";
import FounderSection from "@/components/founder-section";
import QuoteSection from "@/components/quote-section";
import FaqSection from "@/components/faq-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RudraAI",
  url: "https://rudraai.io",
  logo: "https://rudraai.io/logo.png",
  description: "AI automation agency building n8n workflows and AI agents for businesses.",
  sameAs: ["https://twitter.com/GowriRudrai"],
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: "https://rudraai.io/contact" },
};

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Navbar />
      <Hero />
      <CustomersSectionDemo />
      <ServicesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FounderSection />
      <QuoteSection />
      <FaqSection />
      <CTASection />
      <Footer />
    </main>
  );
}
