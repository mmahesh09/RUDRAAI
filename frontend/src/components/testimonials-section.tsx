"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    quote:
      "RudraAI transformed our lead qualification process completely. What used to take our sales team 4 hours a day now happens automatically overnight. We went from 50 qualified leads/month to over 200 — same budget.",
    name: "Marcus Chen",
    role: "VP of Sales",
    company: "ScaleFlow SaaS",
    avatar: "/avatars/avatar-boy.png",
    industry: "SaaS",
    metrics: "4x lead volume",
    rating: 5,
  },
  {
    quote:
      "I was skeptical about automation — we tried other tools and they always broke. RudraAI built us a customer support AI that's been running flawlessly for 8 months. Our CSAT went up 40% and we cut support costs in half.",
    name: "Priya Nair",
    role: "Head of Operations",
    company: "ShopEase",
    avatar: "/avatars/avatar-girl.png",
    industry: "E-Commerce",
    metrics: "50% cost reduction",
    rating: 5,
  },
  {
    quote:
      "The free automation audit alone was worth it — they found 6 areas where we were wasting 30+ hours/week. We only automated 3 of them and already saved $120K annually. The ROI was realized within the first month.",
    name: "James Okafor",
    role: "COO",
    company: "MediSchedule Health",
    avatar: "/avatars/avatar-boy.png",
    industry: "Healthcare",
    metrics: "$120K saved/year",
    rating: 5,
  },
  {
    quote:
      "We had 12 different tools that didn't talk to each other. RudraAI stitched everything together with n8n in 3 weeks. Now our entire revenue operation runs on autopilot. It's like having a full-time ops person at 1/10th the cost.",
    name: "Sarah Lindqvist",
    role: "Founder & CEO",
    company: "Nordic Agency Co.",
    avatar: "/avatars/avatar-girl.png",
    industry: "Agency",
    metrics: "12 tools unified",
    rating: 5,
  },
  {
    quote:
      "The 48-hour deployment promise sounded too good to be true. They delivered our full lead automation workflow in 36 hours. It's been 6 months — not a single failure. Absolutely exceptional work.",
    name: "Ravi Mehta",
    role: "Growth Lead",
    company: "FinTech Ventures",
    avatar: "/avatars/avatar-boy.png",
    industry: "FinTech",
    metrics: "36h delivery",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  };

  const testimonial = testimonials[current];

  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-[#09090B]" />
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[rgba(139,92,246,0.04)] blur-3xl pointer-events-none" />

      <div ref={ref} className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <Badge className="mb-4">Client Stories</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white mb-4 leading-tight">
            Don't Take Our Word for It
          </h2>
          <p className="text-[#A1A1AA] font-body text-lg max-w-xl mx-auto">
            Real results from real businesses we've automated.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {/* Main testimonial card */}
          <div className="relative min-h-[320px] rounded-3xl neo-card p-8 md:p-10 overflow-hidden">
            <div className="absolute top-6 right-8 opacity-10">
              <Quote className="w-20 h-20 text-[#FF6B00] fill-[#FF6B00]" />
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FF6B00] text-[#FF6B00]" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg md:text-xl font-body text-white leading-relaxed mb-8">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-white/10"
                    />
                    <div>
                      <div className="font-subheading font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm font-body text-[#71717A]">
                        {testimonial.role} · {testimonial.company}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">
                      {testimonial.industry}
                    </Badge>
                    <div className="badge-orange text-[10px]">
                      {testimonial.metrics}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-white/20 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="transition-all duration-300"
                >
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? 24 : 6,
                      height: 6,
                      background: i === current ? "#FF6B00" : "rgba(255,255,255,0.2)",
                    }}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-white/20 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Avatar grid for all testimonials */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((t, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300"
              style={{ opacity: i === current ? 1 : 0.4 }}
            >
              <img
                src={t.avatar}
                alt={t.name}
                className="w-9 h-9 rounded-full border-2 transition-all duration-300"
                style={{ borderColor: i === current ? "#FF6B00" : "transparent" }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
