"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Mail, MapPin, Phone, Twitter, Linkedin, Github, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("@/components/globe"), { ssr: false });

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Case Studies", href: "/case-studies" },
    { label: "Industries", href: "/industries" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
  Resources: [
    { label: "Book Free Audit", href: "/booking" },
    { label: "Contact Us", href: "/contact" },
    { label: "Automation Guide", href: "/blog" },
    { label: "n8n Templates", href: "/blog" },
    { label: "ROI Calculator", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/privacy#cookies" },
    { label: "GDPR Compliance", href: "/privacy#gdpr" },
    { label: "Pricing", href: "/pricing" },
  ],
};

const social = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer ref={ref} className="relative overflow-hidden">
      {/* Newsletter + Globe Section */}
      <div className="relative bg-[#09090B] border-t border-white/06">
        <div className="absolute inset-0 grid-bg opacity-20" />

        {/* Globe promotional banner */}
        <div className="container-wide relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="relative rounded-3xl mb-16"
            style={{ overflow: "visible" }}
          >
            {/* Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F1A] via-[#12101E] to-[#0A0A14] rounded-3xl" />
            <div className="absolute inset-0 border border-[rgba(139,92,246,0.2)] rounded-3xl" />
            <div className="absolute inset-px rounded-3xl">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.4)] to-transparent" />
            </div>
            <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-[rgba(139,92,246,0.05)] blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[rgba(255,107,0,0.04)] blur-3xl" />

            <div className="relative z-10 grid md:grid-cols-2 items-center gap-0">
              {/* Left content */}
              <div className="p-10 md:p-14">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.08)] mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-xs font-subheading font-medium text-purple-400">
                    Serving clients globally
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-4 leading-tight">
                  Experience Superior{" "}
                  <span
                    style={{
                      background: "linear-gradient(135deg, #8B5CF6 0%, #FF6B00 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    AI Automation
                  </span>
                </h2>
                <p className="text-[#A1A1AA] font-body leading-relaxed mb-8 max-w-md">
                  RudraAI is headquartered in Hyderabad, India, serving ambitious teams
                  across India and globally. Your automations run around the clock — no
                  borders, no downtime.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="default">
                    <Link href="/booking">
                      Start Today
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Link href="/case-studies" className="outline-button h-11 px-6">
                    See Results
                  </Link>
                </div>

                {/* Quick stats */}
                <div className="flex gap-8 mt-8 pt-8 border-t border-white/06">
                  {[
                    { value: "India+", label: "Global Remote" },
                    { value: "15+", label: "Automations" },
                    { value: "99.9%", label: "Uptime" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="text-xl font-heading font-bold text-[#FF6B00]">{s.value}</div>
                      <div className="text-xs font-body text-[#71717A]">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Globe */}
              <div className="relative flex items-center justify-center p-6 md:p-10">
                <div className="absolute inset-0 bg-gradient-to-l from-[rgba(255,107,0,0.03)] to-transparent rounded-r-3xl" />
                <div
                  className="relative w-full max-w-[380px]"
                  style={{
                    filter: "drop-shadow(0 0 40px rgba(139,92,246,0.25)) drop-shadow(0 0 80px rgba(255,107,0,0.1))",
                  }}
                >
                  <Globe className="opacity-90" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto text-center mb-16"
          >
            <h3 className="text-2xl font-heading font-bold text-white mb-2">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-sm font-body text-[#71717A] mb-6">
              Weekly automation tips, n8n tutorials, and AI news — curated for operators.
            </p>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-body"
              >
                ✓ You're in! Check your inbox.
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717A]" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
                <Button type="submit" className="px-5 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            )}
            {/* Avatar group */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((l, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-[#09090B] flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ background: ["#FF6B00", "#8B5CF6", "#10B981", "#3B82F6"][i] }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <span className="text-xs font-body text-[#71717A]">Be among our first readers</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative bg-[#050508] border-t border-white/06">
        <div className="container-wide py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.4)]">
                  <Zap className="w-5 h-5 text-white fill-white" />
                </div>
                <span className="font-heading font-black text-xl text-white">
                  Rudra<span className="text-[#FF6B00]">AI</span>
                </span>
              </Link>
              <p className="text-sm font-body text-[#71717A] leading-relaxed mb-6 max-w-xs">
                The premier AI automation agency for startups and SMBs. We build
                n8n workflows and AI agents that actually work in production.
              </p>

              {/* Contact info */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm font-body text-[#71717A]">
                  <MapPin className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                  <span> India · Remote-First</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-body text-[#71717A]">
                  <Mail className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                  <a href="mailto:hello@rudraai.io" className="hover:text-white transition-colors">
                    hello@rudraai.io
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-sm font-body text-[#71717A]">
                  <Phone className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                  <a href="tel:+919876543210" className="hover:text-white transition-colors">
                    +91 98765 43210
                  </a>
                </div>
              </div>

              {/* Social links */}
              <div className="flex gap-2 mt-6">
                {social.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-lg border border-white/08 flex items-center justify-center text-[#71717A] hover:text-white hover:border-[rgba(255,107,0,0.4)] hover:bg-[rgba(255,107,0,0.08)] transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-subheading font-semibold text-white text-sm mb-4">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-body text-[#71717A] hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/06 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-body text-[#71717A]">
              © {new Date().getFullYear()} RudraAI. All rights reserved. Built with ⚡ in India.
            </p>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/08 border border-green-500/15">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-body text-green-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
