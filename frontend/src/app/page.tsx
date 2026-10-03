import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import ProblemSection from "@/components/problem-section";
import ServicesSection from "@/components/services-section";
import FeaturesSection from "@/components/features-section";
import HowItWorksSection from "@/components/how-it-works-section";
import FounderSection from "@/components/founder-section";
import FaqSection from "@/components/faq-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RudraAI",
  url: "https://www.rudraai.online",
  logo: "https://www.rudraai.online/logo.png",
  description: "AI services company that designs and builds websites, custom AI agents and AI workflow automations for businesses.",
  knowsAbout: ["Website design and development", "AI agents", "AI chatbots", "AI workflow automation", "n8n"],
  makesOffer: ["Website Creation", "AI Agents", "AI Automations"].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
  })),
  sameAs: ["https://twitter.com/GowriRudrai"],
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", url: "https://www.rudraai.online/services#contact" },
};

export default function HomePage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <Navbar />
      <Hero />
      {/* The page reads as one run: problem → services → a live workflow → process → people → questions → close */}
      <ProblemSection />
      <ServicesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FounderSection />
      <FaqSection />
      <CTASection />
      <Footer />
    </main>
  );
}
