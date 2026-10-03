"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import PageHero from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send, Loader2, AlertCircle, MessageSquare } from "lucide-react";
import { useState } from "react";
import { apiPost } from "@/lib/api";
import Link from "next/link";

export default function FeedbackView() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    setError(null);
    setLoading(true);

    try {
      await apiPost("/api/contact", {
        ...form,
        company: rating ? `Feedback rating: ${rating}/5` : "Feedback",
        website: honeypot,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black">
      <Navbar />
      <PageHero
        label="Feedback"
        title="Tell us how we're doing."
        intro="Working with us, or just have thoughts on the site? Good or bad, we read every note and reply when there's something to answer."
      />

      <section className="border-t border-white/[0.08] pb-24 pt-16 md:pb-32">
        <div className="container-wide">
          <div className="max-w-2xl">
            <div>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-5">
                    <Send className="w-7 h-7 text-green-400" />
                  </div>
                  <h2 className="font-heading font-semibold tracking-[-0.03em] text-[#F5F5F7] text-3xl mb-2">Thank you.</h2>
                  <p className="text-[#A1A1AA] font-body mb-1">
                    Your feedback has been received. We genuinely appreciate you taking the time.
                  </p>
                  <p className="text-sm font-body text-[#8A8A93]">
                    Looking to start a new project instead?{" "}
                    <Link href="/services#contact" className="text-[#BF5AF2] hover:underline">
                      Contact us on the Services page
                    </Link>
                    .
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot */}
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
                    <label htmlFor="feedback-website">Website</label>
                    <input
                      id="feedback-website"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-5 h-5 text-[#BF5AF2]" />
                    <h2 className="font-heading font-semibold tracking-[-0.02em] text-[#F5F5F7] text-2xl">What&apos;s on your mind?</h2>
                  </div>
                  <p className="text-sm font-body text-[#8A8A93] mb-6">
                    Takes less than a minute. No pitch, just listening.
                  </p>

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

                  {/* Rating */}
                  <div className="space-y-1.5">
                    <Label>Overall Experience</Label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          aria-label={`Rate ${star} out of 5 stars`}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-0.5"
                        >
                          <Star
                            className="w-7 h-7 transition-colors"
                            style={{
                              fill: star <= (hoverRating || rating) ? "#BF5AF2" : "transparent",
                              color: star <= (hoverRating || rating) ? "#BF5AF2" : "#3F3F46",
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="feedback-name">Full Name *</Label>
                      <Input
                        id="feedback-name"
                        placeholder="John Smith"
                        required
                        minLength={2}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="feedback-email">Email *</Label>
                      <Input
                        id="feedback-email"
                        type="email"
                        placeholder="john@company.com"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="feedback-message">
                      Your Feedback *{" "}
                      <span className="text-[#8A8A93] font-normal">(min. 20 characters)</span>
                    </Label>
                    <Textarea
                      id="feedback-message"
                      placeholder="What's working well? What could be better? We'd love to hear it."
                      rows={5}
                      required
                      minLength={20}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                    <div className="flex justify-end">
                      <span className={`text-xs font-body transition-colors ${form.message.length < 20 ? "text-[#8A8A93]" : "text-[#10B981]"}`}>
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
                        Send Feedback
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs font-body text-[#8A8A93] text-center">
                    Have a new project in mind instead?{" "}
                    <Link href="/services#contact" className="text-[#BF5AF2] hover:underline">
                      Reach out via Services
                    </Link>
                    .
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
