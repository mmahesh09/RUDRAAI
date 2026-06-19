"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ServicesSection from "@/components/services-section";
import CTASection from "@/components/cta-section";
import { Badge } from "@/components/ui/badge";
import { AnimatedRoadmap } from "@/components/ui/hero-section-5";
import { motion } from "framer-motion";

const milestones = [
  {
    id: 1,
    name: "Free Automation Audit",
    status: "complete" as const,
    position: { top: "72%", left: "4%" },
  },
  {
    id: 2,
    name: "Custom Roadmap",
    status: "complete" as const,
    position: { top: "18%", left: "18%" },
  },
  {
    id: 3,
    name: "Build & Integrate",
    status: "in-progress" as const,
    position: { top: "48%", left: "48%" },
  },
  {
    id: 4,
    name: "Launch in 48h",
    status: "pending" as const,
    position: { top: "8%", right: "12%" },
  },
];

export default function ServicesPage() {
  return (
    <main>
      <Navbar />
      <div className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide">
          <Badge className="mb-4">What We Build</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-4 leading-tight">
            AI Automation <span className="text-gradient-orange">Services</span>
          </h1>
          <p className="text-[#A1A1AA] font-body text-xl max-w-2xl mx-auto leading-relaxed">
            End-to-end automation solutions tailored to your business — from strategy
            to deployment and ongoing support.
          </p>
        </div>
      </div>

      <ServicesSection />

      {/* Our Deployment Process */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0 bg-[#0D0D14]" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative z-10 container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge className="mb-4">Our Process</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white mb-4">
              From Audit to <span className="text-gradient-orange">Live in 48 Hours</span>
            </h2>
            <p className="text-[#A1A1AA] font-body text-lg max-w-xl mx-auto">
              A proven, fast-track deployment path that gets your automation running before your competitors even finish planning.
            </p>
          </motion.div>

          <AnimatedRoadmap
            milestones={milestones}
            aria-label="RudraAI deployment process milestones"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
            {[
              { step: "01", title: "Free Audit", desc: "We map your workflows and find automation opportunities — free, no obligation." },
              { step: "02", title: "Custom Roadmap", desc: "You get a tailored plan with estimated ROI, tool stack, and timeline." },
              { step: "03", title: "Build & Integrate", desc: "I build your n8n workflows and AI agents, integrated directly with your existing tools." },
              { step: "04", title: "Launch in 48h", desc: "Go live in under 48 hours. We monitor, support, and iterate post-launch." },
            ].map((s) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: parseInt(s.step) * 0.1 }}
                className="p-5 rounded-2xl neo-card"
              >
                <div className="text-3xl font-heading font-black text-[#FF6B00]/30 mb-2">{s.step}</div>
                <h3 className="font-heading font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm font-body text-[#71717A] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </main>
  );
}
