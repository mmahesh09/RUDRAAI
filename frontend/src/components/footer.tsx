"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const Globe = dynamic(() => import("@/components/globe"), { ssr: false });

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
  Resources: [
    { label: "Book Free Audit", href: "/booking" },
    { label: "Contact Us", href: "/contact" },
    { label: "Automation Guide", href: "/automation-guide" },
    { label: "Pricing", href: "/pricing" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/privacy#cookies" },
    { label: "DPDP Act 2023", href: "/privacy#dpdp" },
  ],
};

// Custom X (Twitter) icon — the bird logo was retired
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L2.25 2.25h6.961l4.263 5.632 4.77-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Custom Instagram icon — not in lucide-react
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const social = [
  { icon: XIcon, label: "X (Twitter)", href: "https://x.com/GowriRudrai" },
  { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/rudrai.in?igsh=NmF3azZuNWJlenk4" },
  { icon: LinkedInIcon, label: "LinkedIn", href: "https://www.linkedin.com/company/rudraai" },
];

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

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
                    { value: "3–7d", label: "Deployment" },
                    { value: "30d", label: "Support" },
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
              </div>

              {/* Social links */}
              <div className="flex gap-2 mt-6">
                {social.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
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
