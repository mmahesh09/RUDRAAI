"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SectionHead from "@/components/site/section-head";
import { apiPost } from "@/lib/api";
import { SITE } from "@/lib/site";

const budgetOptions = [
  { value: "", label: "Not sure yet" },
  { value: "under1k", label: "Under $1,000" },
  { value: "1k-5k", label: "$1,000 – $5,000" },
  { value: "5k-15k", label: "$5,000 – $15,000" },
  { value: "15k+", label: "$15,000+" },
];

const MIN_MESSAGE = 20;

export default function ServicesContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", budget: "", message: "" });
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setError(null);
    setLoading(true);

    try {
      await apiPost("/api/contact", { ...form, website: honeypot });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Your message didn't send. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const remaining = Math.max(0, MIN_MESSAGE - form.message.trim().length);

  return (
    <section id="contact" className="section-padding scroll-mt-24 bg-black">
      <div className="container-wide">
        <SectionHead
          label="Write to us"
          title={<span>Prefer to <span className="text-[#BF5AF2]">write it down?</span></span>}
        />

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-x-8">
          {/* Facts */}
          <dl className="ledger border-y border-white/[0.08] lg:col-span-4 self-start">
            {[
              { k: "Email", v: <a href={`mailto:${SITE.email}`} className="underline decoration-white/30 underline-offset-4 hover:decoration-[#BF5AF2]">{SITE.email}</a> },
              { k: "Based in", v: `${SITE.location} · working worldwide` },
              { k: "Rather talk?", v: <a href="/booking" className="underline decoration-white/30 underline-offset-4 hover:decoration-[#BF5AF2]">Book a free {SITE.call.minutes}-minute call</a> },
              { k: "Your details", v: "Used only to reply to you. Never shared or sold." },
            ].map((row) => (
              <div key={row.k} className="py-5">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">{row.k}</dt>
                <dd className="mt-1.5 text-[15px] text-[#F5F5F7]">{row.v}</dd>
              </div>
            ))}
          </dl>

          {/* Form */}
          <div className="lg:col-span-7 lg:col-start-6">
            {submitted ? (
              <div className="border-t border-white/[0.08] pt-10" role="status">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#22C55E]/15 text-[#22C55E]">
                  <Check className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-heading text-3xl font-semibold tracking-[-0.03em] text-[#F5F5F7]">Message sent.</h3>
                <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.7] text-[#A1A1AA]">
                  Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}. We&apos;ll reply to <span className="text-[#F5F5F7]">{form.email}</span> once
                  we&apos;ve read it properly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot — hidden from humans, bots fill it */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                  <label htmlFor="services-contact-website">Website</label>
                  <input
                    id="services-contact-website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {error && (
                  <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    <p className="text-[15px]">{error}</p>
                  </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label htmlFor="services-name">Name</Label>
                    <Input
                      id="services-name"
                      autoComplete="name"
                      required
                      minLength={2}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="services-email">Work email</Label>
                    <Input
                      id="services-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2.5">
                    <Label htmlFor="services-company">
                      Company <span className="normal-case tracking-normal text-[#8A8A93]">(optional)</span>
                    </Label>
                    <Input
                      id="services-company"
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label htmlFor="services-budget">Project budget</Label>
                    <select
                      id="services-budget"
                      className="flex h-11 w-full rounded-xl border border-white/[0.12] bg-[#0B0B0C] px-4 text-base text-[#F5F5F7] transition-colors focus-visible:border-[#BF5AF2] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BF5AF2]"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    >
                      {budgetOptions.map((o) => (
                        <option key={o.value} value={o.value} className="bg-[#161617]">
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="services-message">What would you like to hand off?</Label>
                  <Textarea
                    id="services-message"
                    placeholder="The task, the tools you use today, and roughly how often it happens."
                    rows={6}
                    required
                    minLength={MIN_MESSAGE}
                    aria-describedby="services-message-hint"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  <p id="services-message-hint" className="text-[13px] text-[#8A8A93]" aria-live="polite">
                    {remaining > 0 ? `${remaining} more characters needed` : "Looks good"}
                  </p>
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
