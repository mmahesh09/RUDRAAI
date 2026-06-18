"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CoachSchedulingCard } from "@/components/ui/coach-scheduling-card";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { apiPost } from "@/lib/api";

const BENEFITS = [
  "Get a complete audit of your current manual processes",
  "Receive a custom automation roadmap with ROI estimates",
  "Learn which tools best fit your tech stack",
  "Walk away with actionable next steps — even if we don't work together",
];

export default function BookingPage() {
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [step, setStep] = useState(1);
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", goal: "" });
  const [honeypot, setHoneypot] = useState("");

  const timeSlot = selectedSlot ? `${selectedSlot.day} at ${selectedSlot.time} IST` : null;

  const handleSlotSelect = (day: string, time: string) => {
    setSelectedSlot({ day, time });
    setTimeout(() => setStep(2), 400);
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeSlot || honeypot) return;
    setError(null);
    setLoading(true);
    try {
      await apiPost("/api/booking", { ...form, timeSlot, website: honeypot });
      setBooked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <div className="relative pt-32 pb-8 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="relative z-10 container-wide text-center">
          <Badge className="mb-4">Free Consultation</Badge>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-white mb-4 leading-tight">
            Book Your Free{" "}
            <span className="text-gradient-orange">Automation Audit</span>
          </h1>
          <p className="text-[#A1A1AA] font-body text-xl max-w-2xl mx-auto">
            60 minutes. No sales pitch. Walk away with a custom roadmap and ROI analysis for your business.
          </p>
        </div>
      </div>

      <section className="section-padding pt-8">
        <div className="container-wide">

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {[
              { n: 1, label: "Choose a time" },
              { n: 2, label: "Your details" },
            ].map((s, idx) => (
              <div key={s.n} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-sm font-heading font-bold transition-all duration-300",
                    step >= s.n ? "bg-[#FF6B00] text-white" : "bg-white/[0.08] text-[#71717A]"
                  )}
                >
                  {s.n}
                </div>
                <span className={cn("text-sm font-body hidden sm:block", step >= s.n ? "text-white" : "text-[#71717A]")}>
                  {s.label}
                </span>
                {idx < 1 && <div className="w-8 h-px bg-white/10 mx-1" />}
              </div>
            ))}
          </div>

          {booked ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto p-10 rounded-2xl neo-card text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-2xl font-heading font-black text-white mb-3">You&apos;re Booked!</h2>
              <p className="text-[#A1A1AA] font-body mb-2">
                Your Automation Audit is confirmed for{" "}
                <span className="text-white font-medium">{timeSlot}</span>.
              </p>
              <p className="text-sm font-body text-[#71717A] mb-6">
                Check your email for the calendar invite and Zoom link. We&apos;ll send a pre-call questionnaire 24 hours before.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-body">
                📧 Confirmation sent to {form.email}
              </div>
            </motion.div>
          ) : step === 1 ? (
            <div className="grid lg:grid-cols-5 gap-10 items-start">
              {/* Left — benefits */}
              <div className="lg:col-span-2 space-y-5">
                <div className="p-6 rounded-2xl neo-card">
                  <h3 className="font-heading font-bold text-white mb-4">What You&apos;ll Get</h3>
                  <div className="space-y-3">
                    {BENEFITS.map((b) => (
                      <div key={b} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-body text-[#A1A1AA] leading-snug">{b}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 pt-5 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 text-sm font-body text-[#A1A1AA]">
                      <Clock className="w-4 h-4 text-[#FF6B00]" />
                      <span>60 minutes · Free · No strings attached</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <p className="text-xs font-body text-[#71717A] italic">
                    &ldquo;The audit alone saved us 12 hours of research. Even before we hired them, the strategy call was invaluable.&rdquo;
                  </p>
                  <div className="text-xs font-body text-[#A1A1AA] mt-2">— James O., COO · MediSchedule</div>
                </div>
              </div>

              {/* Right — scheduling card */}
              <div className="lg:col-span-3">
                <CoachSchedulingCard
                  onTimeSlotSelect={handleSlotSelect}
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleBook} className="p-7 rounded-2xl neo-card space-y-4">
                {/* Honeypot — hidden from humans, catches bots */}
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                  <label htmlFor="booking-website">Website</label>
                  <input
                    id="booking-website"
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>
                {/* Selected slot summary */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-3">
                  <Clock className="w-4 h-4 text-[#FF6B00]" />
                  <span className="text-sm font-body text-white flex-1">
                    <strong>{timeSlot}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => { setStep(1); setSelectedSlot(null); }}
                    className="text-xs text-[#FF6B00] hover:text-[#FF8533] font-body"
                  >
                    Change
                  </button>
                </div>

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
                    <Label htmlFor="b-name">Full Name *</Label>
                    <Input
                      id="b-name"
                      placeholder="John Smith"
                      required
                      minLength={2}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-email">Work Email *</Label>
                    <Input
                      id="b-email"
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
                    <Label htmlFor="b-company">Company *</Label>
                    <Input
                      id="b-company"
                      placeholder="Acme Inc."
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="b-role">Your Role</Label>
                    <Input
                      id="b-role"
                      placeholder="CEO / Ops Manager"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="b-goal">
                    Main Automation Goal *{" "}
                    <span className="text-[#71717A] font-normal">(min. 20 chars)</span>
                  </Label>
                  <Textarea
                    id="b-goal"
                    placeholder="What processes do you most want to automate? What's the biggest time drain right now?"
                    rows={4}
                    required
                    minLength={20}
                    value={form.goal}
                    onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  />
                  <div className="flex justify-end">
                    <span className={`text-xs font-body transition-colors ${form.goal.length < 20 ? "text-[#71717A]" : "text-[#10B981]"}`}>
                      {form.goal.length}/20 min
                    </span>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Confirming…
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
