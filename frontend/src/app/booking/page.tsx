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
  Video,
  FileText,
  CalendarCheck,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { apiPost, apiGet } from "@/lib/api";

const CALCOM_LINK = process.env.NEXT_PUBLIC_CALCOM_LINK;

const BENEFITS = [
  "Get a complete audit of your current manual processes",
  "Receive a custom automation roadmap with ROI estimates",
  "Learn which tools best fit your tech stack",
  "Walk away with actionable next steps — even if we don't work together",
];

// ── Cal.com slot types (mirrors what coach-scheduling-card expects) ────────────
interface TimeSlot {
  time: string;
  available: boolean;
}
interface DaySchedule {
  date: string;
  dayName: string;
  dayNumber: number;
  slots: TimeSlot[];
  hasAvailability: boolean;
}

// Convert Cal.com API response to DaySchedule[] and build a (date→time→ISO) map.
// Only Saturday (6) and Sunday (0) are included — bookings are weekend-only.
function convertCalSlots(
  calSlots: Record<string, { time: string }[]>
): { schedule: DaySchedule[]; slotMap: Record<string, Record<string, string>> } {
  const shortMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const slotMap: Record<string, Record<string, string>> = {};

  const schedule = Object.entries(calSlots)
    .filter(([dateStr]) => {
      const [year, month, day] = dateStr.split("-").map(Number);
      const dow = new Date(year, month - 1, day).getDay();
      return dow === 0 || dow === 6; // weekend-only
    })
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateStr, slots]) => {
      // dateStr is "YYYY-MM-DD" — treat as local date to avoid UTC-shift
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      const shortDate = `${shortMonths[date.getMonth()]} ${date.getDate()}`;
      const dayName = dayNames[date.getDay()];

      slotMap[shortDate] = {};
      const timeSlots = slots.map(({ time }) => {
        const dt = new Date(time);
        const displayTime = dt
          .toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
          })
          .toUpperCase()
          .replace(/\./g, ":")
          .replace("AM", " AM")
          .replace("PM", " PM")
          .trim();
        slotMap[shortDate][displayTime] = time;
        return { time: displayTime, available: true };
      });

      return {
        date: shortDate,
        dayName,
        dayNumber: date.getDate(),
        hasAvailability: timeSlots.length > 0,
        slots: timeSlots,
      };
    });

  return { schedule, slotMap };
}

function getWeekBounds(weekOffset: number): { startTime: string; endTime: string } {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { startTime: monday.toISOString(), endTime: sunday.toISOString() };
}

export default function BookingPage() {
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null);
  const [selectedSlotISO, setSelectedSlotISO] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [booked, setBooked] = useState(false);
  const [zoomLink, setZoomLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", goal: "" });
  const [honeypot, setHoneypot] = useState("");
  const [calUsed, setCalUsed] = useState(false);
  const calInitialized = useRef(false);

  // Real Cal.com slots (fetched from backend proxy)
  const [calSchedule, setCalSchedule] = useState<DaySchedule[] | null>(null);
  const [calSlotMap, setCalSlotMap] = useState<Record<string, Record<string, string>>>({});
  const [calWeekOffset, setCalWeekOffset] = useState(0);
  const [calSlotsLoading, setCalSlotsLoading] = useState(false);

  const timeSlot = selectedSlot ? `${selectedSlot.day} at ${selectedSlot.time} IST` : null;

  // Fetch real slots from backend — silently falls back if Cal.com not configured
  const fetchCalSlots = useCallback(async (weekOffset: number) => {
    setCalSlotsLoading(true);
    try {
      const { startTime, endTime } = getWeekBounds(weekOffset);
      const data = await apiGet<{
        status: string;
        data?: { slots: Record<string, { time: string }[]> };
      }>(`/api/cal/slots?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`);

      if (data.status === "success" && data.data?.slots) {
        const { schedule, slotMap } = convertCalSlots(data.data.slots);
        if (schedule.length > 0) {
          setCalSchedule(schedule);
          setCalSlotMap(slotMap);
        }
        // If no slots for this week, leave calSchedule null → falls back to generated slots
      }
    } catch {
      // Cal.com not configured or unreachable — fall back to generated schedule
      setCalSchedule(null);
    } finally {
      setCalSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Try to fetch real slots only when NOT using Cal.com embed
    if (!CALCOM_LINK) {
      fetchCalSlots(0);
    }
  }, [fetchCalSlots]);

  const handleWeekChange = (direction: "prev" | "next") => {
    const next = direction === "next" ? calWeekOffset + 1 : calWeekOffset - 1;
    if (next < 0) return;
    setCalWeekOffset(next);
    fetchCalSlots(next);
  };

  // Initialize Cal.com inline embed (only when CALCOM_LINK is set)
  useEffect(() => {
    if (!CALCOM_LINK || calInitialized.current) return;
    calInitialized.current = true;

    type CalApi = ((...args: unknown[]) => void) & {
      loaded?: boolean;
      ns?: Record<string, CalApi & { q?: unknown[] }>;
      q?: unknown[];
    };

    const win = window as Window & typeof globalThis & { Cal?: CalApi };

    function initCalEmbed(Cal: CalApi) {
      Cal("init", "booking-inline", { origin: "https://app.cal.com" });
      Cal.ns!["booking-inline"]("inline", {
        elementOrSelector: "#cal-booking-inline",
        calLink: CALCOM_LINK,
        layout: "month_view",
      });
      Cal.ns!["booking-inline"]("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
        styles: { branding: { brandColor: "#FF6B00" } },
      });
      Cal.ns!["booking-inline"]("on", {
        action: "bookingSuccessful",
        callback: (e: unknown) => {
          const event = e as { detail?: { data?: { attendees?: { name: string; email: string }[]; startTime?: string } } };
          const data = event?.detail?.data;
          const attendee = data?.attendees?.[0];
          if (attendee) {
            setForm((prev) => ({
              ...prev,
              name: attendee.name || prev.name,
              email: attendee.email || prev.email,
            }));
            if (data?.startTime) {
              const dt = new Date(data.startTime);
              setSelectedSlot({
                day: dt.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" }),
                time: dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
              });
              setSelectedSlotISO(data.startTime);
            }
            setCalUsed(true);
            setTimeout(() => setStep(2), 600);
          }
        },
      });
    }

    if (win.Cal) {
      initCalEmbed(win.Cal);
      return;
    }

    const bootstrapScript = document.createElement("script");
    bootstrapScript.textContent = `(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");`;
    document.head.appendChild(bootstrapScript);

    const pollInterval = setInterval(() => {
      if (win.Cal?.loaded) {
        clearInterval(pollInterval);
        initCalEmbed(win.Cal);
      }
    }, 200);

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  const handleSlotSelect = (day: string, time: string) => {
    setSelectedSlot({ day, time });
    // Resolve ISO time from real Cal.com data if available
    const iso = calSlotMap[day]?.[time] ?? null;
    setSelectedSlotISO(iso);
    setTimeout(() => setStep(2), 400);
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeSlot || honeypot) return;
    setError(null);
    setLoading(true);
    try {
      const res = await apiPost<{ success: boolean; zoomLink?: string }>("/api/booking", {
        ...form,
        timeSlot,
        ...(selectedSlotISO ? { isoTime: selectedSlotISO } : {}),
        website: honeypot,
      });
      setZoomLink(res.zoomLink ?? null);
      setBooked(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to confirm booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const usingRealSlots = calSchedule !== null && !CALCOM_LINK;

  const stepLabels = CALCOM_LINK
    ? [{ n: 1, label: "Schedule your call" }, { n: 2, label: "More about you" }]
    : [{ n: 1, label: "Choose a time" }, { n: 2, label: "Your details" }];

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
            15 minutes. No sales pitch. Walk away with a custom roadmap and ROI analysis for your business.
          </p>
          {/* Integration badges */}
          <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
            {(CALCOM_LINK || usingRealSlots) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-body">
                <CalendarCheck className="w-3.5 h-3.5" /> Cal.com Live Slots
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-body">
              <Video className="w-3.5 h-3.5" /> Zoom Meeting Link
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-body">
              <FileText className="w-3.5 h-3.5" /> Notion Onboarding
            </span>
          </div>
        </div>
      </div>

      <section className="section-padding pt-8">
        <div className="container-wide">

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {stepLabels.map((s, idx) => (
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
              className="max-w-2xl mx-auto space-y-5"
            >
              {/* Main confirmation card */}
              <div className="p-10 rounded-2xl neo-card text-center">
                <div className="w-20 h-20 rounded-3xl bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-heading font-black text-white mb-1">Hi {form.name},</h2>
                <p className="text-[#A1A1AA] font-body mb-2">
                  Your Automation Audit is confirmed for{" "}
                  <span className="text-white font-medium">{timeSlot}</span>.
                </p>
                <p className="text-sm font-body text-[#71717A] mb-6">
                  Check your email for the Zoom link and calendar invite. We&apos;ll send a pre-call questionnaire 24 hours before.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-body">
                  📧 Confirmation sent to {form.email}
                </div>
              </div>

              {/* Integration status row */}
              <div className="grid sm:grid-cols-3 gap-3">
                {(CALCOM_LINK || calUsed || usingRealSlots) && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/05 border border-blue-500/15">
                    <CalendarCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-heading font-semibold text-blue-400">Cal.com</p>
                      <p className="text-xs font-body text-[#71717A]">Slot reserved</p>
                    </div>
                  </div>
                )}
                {zoomLink ? (
                  <a
                    href={zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 hover:bg-sky-500/15 transition-colors"
                  >
                    <Video className="w-5 h-5 text-sky-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-heading font-semibold text-sky-400">Zoom — Join Meeting</p>
                      <p className="text-xs font-body text-sky-300 underline truncate max-w-[160px]">{zoomLink}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-sky-500/05 border border-sky-500/15">
                    <Video className="w-5 h-5 text-sky-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-heading font-semibold text-sky-400">Zoom</p>
                      <p className="text-xs font-body text-[#71717A]">Link sent to email</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/05 border border-purple-500/15">
                  <FileText className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-heading font-semibold text-purple-400">Notion</p>
                    <p className="text-xs font-body text-[#71717A]">Onboarding logged</p>
                  </div>
                </div>
              </div>

              {/* Client onboarding summary */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <h3 className="font-heading font-semibold text-white mb-4 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center">
                    <FileText className="w-3 h-3 text-purple-400" />
                  </span>
                  Onboarding Summary
                </h3>
                <div className="space-y-0 text-sm font-body">
                  {[
                    { label: "Name", value: form.name },
                    { label: "Email", value: form.email },
                    { label: "Company", value: form.company },
                    ...(form.role ? [{ label: "Role", value: form.role }] : []),
                    { label: "Booked slot", value: timeSlot || "—" },
                    { label: "Status", value: "✓ Confirmed", highlight: true },
                  ].map(({ label, value, highlight }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.05] last:border-0">
                      <span className="text-[#71717A]">{label}</span>
                      <span className={highlight ? "text-[#10B981] font-semibold" : "text-white"}>{value}</span>
                    </div>
                  ))}
                </div>
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
                      <span>15 minutes · Free · No strings attached</span>
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

              {/* Right — scheduling */}
              <div className="lg:col-span-3">
                {CALCOM_LINK ? (
                  <div
                    id="cal-booking-inline"
                    className="rounded-2xl overflow-hidden border border-white/[0.08]"
                    style={{ minHeight: "650px" }}
                  />
                ) : (
                  <div className="relative">
                    {calSlotsLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
                        <Loader2 className="w-6 h-6 animate-spin text-[#FF6B00]" />
                      </div>
                    )}
                    <CoachSchedulingCard
                      onTimeSlotSelect={handleSlotSelect}
                      onWeekChange={handleWeekChange}
                      {...(calSchedule !== null ? { weekSchedule: calSchedule } : {})}
                      className="w-full"
                    />
                    {usingRealSlots && (
                      <p className="text-center text-xs text-[#71717A] font-body mt-2">
                        Live availability from Cal.com · All times IST
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleBook} className="p-7 rounded-2xl neo-card space-y-4">
                {/* Honeypot */}
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
                {timeSlot && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-3">
                    <Clock className="w-4 h-4 text-[#FF6B00]" />
                    <span className="text-sm font-body text-white flex-1">
                      <strong>{timeSlot}</strong>
                    </span>
                    {!calUsed && (
                      <button
                        type="button"
                        onClick={() => { setStep(1); setSelectedSlot(null); setSelectedSlotISO(null); }}
                        className="text-xs text-[#FF6B00] hover:text-[#FF8533] font-body"
                      >
                        Change
                      </button>
                    )}
                  </div>
                )}

                {/* Cal.com used notice */}
                {(calUsed || (usingRealSlots && selectedSlotISO)) && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-body">
                    <CalendarCheck className="w-3.5 h-3.5 flex-shrink-0" />
                    {calUsed
                      ? "Slot reserved via Cal.com — fill in the details below to complete your booking."
                      : "Live Cal.com slot selected — your booking will be confirmed automatically."}
                  </div>
                )}

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


