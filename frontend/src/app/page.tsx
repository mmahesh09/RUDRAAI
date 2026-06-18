import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import { CustomersSectionDemo } from "@/components/ui/customers-section";
import StatsSection from "@/components/stats-section";
import ServicesSection from "@/components/services-section";
import FeaturesSection from "@/components/features-section";
import CaseStudiesSection from "@/components/case-studies-section";
import IndustriesSection from "@/components/industries-section";
import HowItWorksSection from "@/components/how-it-works-section";
import TestimonialsSection from "@/components/testimonials-section";
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
      <CaseStudiesSection />
      <HowItWorksSection />
      <IndustriesSection />
      <TestimonialsSection />
      <QuoteSection />
      <FaqSection />
      <CTASection />
      <Footer />
    </main>
  );
}
