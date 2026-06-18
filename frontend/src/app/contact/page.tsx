"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageSquare, Zap, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { apiPost } from "@/lib/api";

const contactInfo = [
  { icon: Mail, label: "Email", value: "hello@rudraai.io", href: "mailto:hello@rudraai.io" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
  { icon: MapPin, label: "Location", value: "Hyderabad, India · Remote Worldwide", href: null },
  { icon: MessageSquare, label: "Response Time", value: "Within 4 business hours", href: null },
];

const budgetOptions = [
  { value: "", label: "Select budget range" },
  { value: "under1k", label: "Under $1,000" },
  { value: "1k-5k", label: "$1,000 – $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k+", label: "$15,000+" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", message: "" });
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side honeypot check — silently stop if filled
    if (honeypot) return;
    setError(null);
    setLoading(true);

    try {
      await apiPost("/api/contact", { ...form, website: honeypot });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide text-center">
          <Badge className="mb-4">Get in Touch</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white mb-4 leading-tight">
            Let&apos;s Build Something{" "}
            <span className="text-gradient-orange">Powerful</span>
          </h1>
          <p className="text-[#A1A1AA] font-body text-xl max-w-2xl mx-auto">
            Tell us about your business and automation goals. We&apos;ll come back within 4 hours
            with an initial assessment.
          </p>
        </div>
      </div>

      <section className="section-padding pt-8">
        <div className="container-wide">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Left — Contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl neo-card">
                <h3 className="font-heading font-bold text-white mb-5">Contact Information</h3>
                <div className="space-y-4">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    const content = (
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.2)] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-[#FF6B00]" />
                        </div>
                        <div>
                          <div className="text-xs font-body text-[#71717A] mb-0.5">{item.label}</div>
                          <div className="text-sm font-body text-white">{item.value}</div>
                        </div>
                      </div>
                    );
                    return item.href ? (
                      <a key={item.label} href={item.href} className="block hover:opacity-80 transition-opacity">
                        {content}
                      </a>
                    ) : (
                      <div key={item.label}>{content}</div>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[rgba(255,107,0,0.1)] to-[rgba(139,92,246,0.05)] border border-[rgba(255,107,0,0.2)]">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-[#FF6B00]" />
                  <h4 className="font-heading font-bold text-white">Want a free audit first?</h4>
                </div>
                <p className="text-sm font-body text-[#A1A1AA] mb-4">
                  Book a 60-minute strategy call where we map your workflows and calculate automation ROI — completely free.
                </p>
                <Button asChild className="w-full">
                  <a href="/booking">Book Free Audit Call</a>
                </Button>
              </div>

              {/* Trust signals */}
              <div className="p-5 rounded-2xl bg-white/02 border border-white/06 space-y-3">
                {[
                  { icon: "🔒", text: "Your data is never shared or sold" },
                  { icon: "⚡", text: "Response guaranteed within 4 hours" },
                  { icon: "🤝", text: "No spam, no pushy sales calls" },
                ].map((t) => (
                  <div key={t.text} className="flex items-center gap-2.5">
                    <span className="text-base">{t.icon}</span>
                    <span className="text-xs font-body text-[#71717A]">{t.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3">
              <div className="p-7 rounded-2xl neo-card">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                      <Send className="w-7 h-7 text-green-400" />
                    </div>
                    <h3 className="font-heading font-bold text-white text-xl mb-2">Message Sent!</h3>
                    <p className="text-[#A1A1AA] font-body mb-1">
                      We&apos;ll review your project details and get back to you within 4 business hours.
                    </p>
                    <p className="text-sm font-body text-[#71717A]">
                      Check your inbox — we&apos;ve sent a confirmation to <span className="text-white">{form.email}</span>
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Honeypot — hidden from humans, bots fill it */}
                    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                      <label htmlFor="contact-website">Website</label>
                      <input
                        id="contact-website"
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <h3 className="font-heading font-bold text-white text-xl mb-1">Tell Us About Your Project</h3>
                    <p className="text-sm font-body text-[#71717A] mb-6">
                      Fill in the details below and our team will get back to you shortly.
                    </p>

                    {/* Error banner */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400"
                      >
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm font-body">{error}</p>
                      </motion.div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="John Smith"
                          required
                          minLength={2}
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email">Work Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@company.com"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          placeholder="Acme Inc."
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="budget">Monthly Budget</Label>
                        <select
                          id="budget"
                          className="flex h-11 w-full rounded-xl bg-[rgba(255,255,255,0.05)] border border-white/10 px-4 py-2 text-sm font-body text-white focus:outline-none focus:border-[rgba(255,107,0,0.5)] transition-all"
                          value={form.budget}
                          onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        >
                          {budgetOptions.map((o) => (
                            <option key={o.value} value={o.value} className="bg-[#111117]">
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message">
                        Describe Your Automation Needs *{" "}
                        <span className="text-[#71717A] font-normal">(min. 20 characters)</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your current manual processes, what tools you use, and what you'd like to automate..."
                        rows={5}
                        required
                        minLength={20}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                      <div className="flex justify-end">
                        <span className={`text-xs font-body transition-colors ${form.message.length < 20 ? "text-[#71717A]" : "text-[#10B981]"}`}>
                          {form.message.length}/20 min
                        </span>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs font-body text-[#71717A] text-center">
                      We respond within 4 business hours. No spam, ever.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hyderabad Map */}
      <section className="section-padding pt-0">
        <div className="container-wide">
          <div className="rounded-2xl overflow-hidden border border-white/08">
            <div className="flex items-center gap-3 px-5 py-4 bg-white/[0.03] border-b border-white/08">
              <MapPin className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-sm font-subheading font-semibold text-white">Our Location — Hyderabad, India</span>
              <span className="ml-auto text-xs font-body text-[#71717A]">Remote-first · Available worldwide</span>
            </div>
            <iframe
              title="RudraAI Office — Hyderabad"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.25891933734!2d78.24323045!3d17.41262753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin"
              width="100%"
              height="380"
              style={{ border: 0, display: "block", filter: "invert(90%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
