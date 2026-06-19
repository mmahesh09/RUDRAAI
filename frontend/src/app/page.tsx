import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import { CustomersSectionDemo } from "@/components/ui/customers-section";
import StatsSection from "@/components/stats-section";
import ServicesSection from "@/components/services-section";
import FeaturesSection from "@/components/features-section";
import HowItWorksSection from "@/components/how-it-works-section";
import FounderSection from "@/components/founder-section";
import QuoteSection from "@/components/quote-section";
import FaqSection from "@/components/faq-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <CustomersSectionDemo />
      <StatsSection />
      <ServicesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FounderSection />
      <QuoteSection />
      <FaqSection />
      <CTASection />
      <Footer />
    </main>
  );
}
