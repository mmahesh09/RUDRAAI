"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkflowAnimation from "@/components/workflow-animation";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const resolvedContainer = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0 } } }
    : containerVariants;

  const resolvedItem = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : itemVariants;

  return (
    <section className="relative min-h-screen flex items-center pt-28 md:pt-32 pb-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[rgba(255,107,0,0.04)] blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[rgba(139,92,246,0.05)] blur-3xl pointer-events-none" />

      <div className="container-wide relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={resolvedContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Announcement badge */}
            <motion.div variants={resolvedItem} className="flex items-center">
              <Link href="/blog" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,107,0,0.25)] bg-[rgba(255,107,0,0.07)] hover:border-[rgba(255,107,0,0.5)] transition-colors group">
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-[#FF6B00] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B00]" />
                </span>
                <AnimatedShinyText
                  shimmerWidth={180}
                  className="text-xs font-subheading font-medium text-[#A1A1AA] group-hover:text-white transition-colors"
                >
                  Read Our Latest Blog
                </AnimatedShinyText>
                <ArrowRight className="w-3 h-3 text-[#FF6B00] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Headline */}
            <motion.div variants={resolvedItem} className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white leading-[1.08] tracking-tight">
                Stop Hiring For{" "}
                <span className="relative">
                  <span className="text-gradient-orange">Repetitive</span>
                </span>
                <br />
                Work. Deploy{" "}
                <span className="relative inline-block">
                  AI Automations
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
                    className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] rounded-full origin-left"
                  />
                </span>
                <br />
                Instead.
              </h1>
            </motion.div>

            {/* Sub-headline */}
            <motion.p
              variants={resolvedItem}
              className="text-base sm:text-lg text-[#A1A1AA] font-body leading-relaxed max-w-xl"
            >
              We build intelligent n8n workflows and AI agents that run 24/7,
              eliminate human error, and scale with your business — so your team
              can focus on what actually moves the needle.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={resolvedItem}
              className="flex flex-wrap gap-3 items-center"
            >
              <Button asChild size="lg" className="h-12 px-7 text-base font-bold group">
                <Link href="/booking">
                  Book Free Automation Audit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Link href="/services" className="outline-button h-12 px-6 flex items-center gap-2 group">
                See How It Works
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={resolvedItem}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              {/* Avatars */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[
                    { src: "/avatars/avatar-boy.png", alt: "Happy client" },
                    { src: "/avatars/avatar-girl.png", alt: "Happy client" },
                    { src: "/avatars/avatar-boy.png", alt: "Happy client" },
                    { src: "/avatars/avatar-girl.png", alt: "Happy client" },
                  ].map((avatar, i) => (
                    <Image
                      key={i}
                      src={avatar.src}
                      alt={avatar.alt}
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-[#09090B] object-cover"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#FF6B00] text-[#FF6B00]" />
                    ))}
                    <span className="text-xs font-body text-white ml-1 font-medium">4.9</span>
                  </div>
                  <p className="text-xs text-[#71717A] font-body">8+ happy clients</p>
                </div>
              </div>

              <div className="w-px h-8 bg-white/10 hidden sm:block" />

              {/* Quick benefits */}
              <div className="flex flex-wrap gap-3">
                {["48h deployment", "99.9% uptime", "No code needed"].map((text) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span className="text-xs font-body text-[#A1A1AA]">{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Workflow Animation */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <WorkflowAnimation />
          </motion.div>
        </div>

        {/* Mobile workflow (below content) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-12 lg:hidden"
        >
          <WorkflowAnimation />
        </motion.div>
      </div>
    </section>
  );
}
