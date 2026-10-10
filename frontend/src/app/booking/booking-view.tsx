"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarPlus, Loader2, Video } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";
import { NAV_OFFSET } from "@/components/smooth-scroll-provider";
import {
  BOOKING_TZ,
  formatDateKey,
  formatTimeIST,
  slotLabel,
  SLOT_MINUTES,
  type SlotsResponse,
} from "@/lib/booking/slots";

const POLL_MS = 20_000;
const EASE = [0.16, 1, 0.3, 1] as const;

type Step = "time" | "details" | "done";

interface BookingResult {
  bookingId: string;
  status: "Confirmed" | "Requested";
  slotLabel: string;
  meetingLink: string | null;
}

const COVERS = [
  "The manual work slowing you down",
  "What's worth automating — and what isn't",
  "Rough timeline and cost for anything worth building",
  "Clear next steps, whether or not we work together",
];

function istHour(iso: string): number {
  return Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: BOOKING_TZ }).format(new Date(iso)));
}

function groupByPeriod(slots: string[]): { label: string; slots: string[] }[] {
  return [
    { label: "Morning", slots: slots.filter((s) => istHour(s) < 12) },
    { label: "Afternoon", slots: slots.filter((s) => istHour(s) >= 12 && istHour(s) < 17) },
    { label: "Evening", slots: slots.filter((s) => istHour(s) >= 17) },
  ].filter((g) => g.slots.length > 0);
}

function googleCalendarUrl(iso: string, meetingLink: string | null): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = new Date(iso);
  const end = new Date(start.getTime() + SLOT_MINUTES * 60_000);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Automation audit — RudraAI",
    dates: `${fmt(start)}/${fmt(end)}`,
    details: meetingLink ? `Join: ${meetingLink}` : "Video link arrives by email.",
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// Live availability: polls while the tab is visible, refetches on focus
function useLiveSlots() {
  const [data, setData] = useState<SlotsResponse | null>(null);
  const [failed, setFailed] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const inflight = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    inflight.current?.abort();
    const ctrl = new AbortController();
    inflight.current = ctrl;
    setSyncing(true);
    try {
      const res = await fetch("/api/cal/slots?weeks=4", { signal: ctrl.signal, cache: "no-store" });
      if (!res.ok) throw new Error(String(res.status));
      setData((await res.json()) as SlotsResponse);
      setFailed(false);
    } catch (err) {
      if ((err as Error).name !== "AbortError") setFailed(true);
    } finally {
      if (inflight.current === ctrl) setSyncing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") refresh();
    }, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      inflight.current?.abort();
    };
  }, [refresh]);

  return { data, failed, syncing, refresh };
}

function useSecondsSince(iso: string | undefined): number | null {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  return iso ? Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000)) : null;
}

export default function BookingView() {
  const { data, failed, syncing, refresh } = useLiveSlots();
  const secondsAgo = useSecondsSince(data?.fetchedAt);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("time");
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", goal: "" });
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  const days = useMemo(() => data?.days ?? [], [data]);
  const live = data?.mode === "live";
  const openCount = days.reduce((n, d) => n + d.slots.length, 0);

  // Default to the first day with openings
  useEffect(() => {
    if (!selectedDate && days.length) {
      setSelectedDate((days.find((d) => d.slots.length) ?? days[0]).date);
    }
  }, [days, selectedDate]);

  // Real-time guard: if the chosen time vanishes from a fresh sync, release it
  useEffect(() => {
    if (!selectedIso || step === "done" || !data) return;
    if (!data.days.some((d) => d.slots.includes(selectedIso))) {
      setSelectedIso(null);
      setStep("time");
      setNotice(`${slotLabel(selectedIso)} was just booked by someone else. Choose another time.`);
    }
  }, [data, selectedIso, step]);

  // Steps swap in place; bring the scheduler (and any notice) into view on mobile
  const lenis = useLenis();
  const schedulerRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = schedulerRef.current;
    if (!el || el.getBoundingClientRect().top >= 0) return;
    if (lenis) lenis.scrollTo(el, { offset: NAV_OFFSET });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET });
  }, [step, notice, lenis]);

  const activeDay = days.find((d) => d.date === selectedDate);

  const chooseTime = (iso: string) => {
    setSelectedIso(iso);
    setNotice(null);
    setError(null);
    setStep("details");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIso) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, isoTime: selectedIso, website: honeypot }),
      });
      const body = (await res.json().catch(() => ({}))) as Partial<BookingResult> & { error?: string; code?: string };
      if (res.status === 409 && body.code === "SLOT_TAKEN") {
        setNotice(body.error ?? "That time was just taken. Choose another.");
        setSelectedIso(null);
        setStep("time");
        refresh();
        return;
      }
      if (!res.ok) throw new Error(body.error ?? "Something went wrong. Please try again.");
      setResult(body as BookingResult);
      setStep("done");
      refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const ticketStatus = result ? result.status : selectedIso ? "Holding" : "Draft";

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Navbar />

        <header className="relative pt-36 pb-14 md:pt-44 md:pb-20">
          <div className="container-wide">
            <LiveStatus live={live} failed={failed} syncing={syncing} secondsAgo={secondsAgo} openCount={data ? openCount : null} />
            <h1 className="mt-8 max-w-[14ch] font-heading font-semibold leading-[0.95] tracking-[-0.05em] text-[#F5F5F7] text-[clamp(2.75rem,7.5vw,6rem)] [text-wrap:balance]">
              Fifteen minutes. <span className="text-[#8A8A93]">Saturday or Sunday.</span>
            </h1>
            <p className="mt-8 max-w-[50ch] text-lg leading-[1.65] text-[#A1A1AA]">
              Tell us what&apos;s slowing your business down. No slides, no pitch — an honest read on what&apos;s worth
              building.
            </p>
          </div>
        </header>

        <section className="border-t border-white/[0.08] pb-28">
          <div className="container-wide grid gap-12 pt-12 lg:grid-cols-12 lg:gap-16">
            {/* Left pane: the live ticket */}
            <aside className="lg:col-span-5">
              <div className="space-y-10 lg:sticky lg:top-28">
                <Ticket
                  dateKey={selectedDate}
                  iso={selectedIso}
                  name={form.name}
                  company={form.company}
                  status={ticketStatus}
                  bookingId={result?.bookingId ?? null}
                  live={live}
                />
                <div className="hidden lg:block">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8A8A93]">On the call</p>
                  <ol className="mt-4 space-y-3">
                    {COVERS.map((c, i) => (
                      <li key={c} className="flex gap-4 text-[15px] leading-snug text-[#A1A1AA]">
                        <span className="pt-1 font-mono text-[11px] text-[#5A5A63]">{String(i + 1).padStart(2, "0")}</span>
                        {c}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </aside>

            {/* Right pane: scheduler */}
            <div ref={schedulerRef} className="min-w-0 lg:col-span-7">
              <AnimatePresence>
                {notice && (
                  <motion.div
                    role="alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mb-8 flex items-start justify-between gap-4 border-l-2 border-amber-400 bg-amber-400/[0.06] px-4 py-3 text-sm text-amber-200">
                      <span>{notice}</span>
                      <button onClick={() => setNotice(null)} className="font-mono text-[11px] uppercase tracking-wider text-amber-300/70 hover:text-amber-200">
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait" initial={false}>
                {step === "time" && (
                  <motion.div key="time" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.45, ease: EASE }}>
                    {data && !live && (
                      <p className="mb-8 border-l-2 border-[#BF5AF2] pl-4 text-sm leading-relaxed text-[#A1A1AA]">
                        The live calendar is offline. Pick a preferred time and we&apos;ll confirm it by email within a few hours.
                      </p>
                    )}

                    <StepLabel n="01" title="Pick a day" />
                    {!data ? (
                      <DaySkeleton />
                    ) : days.length === 0 ? (
                      <p className="mt-6 text-[#A1A1AA]">No weekend openings in the next four weeks. Email us and we&apos;ll find a time.</p>
                    ) : (
                      <div data-lenis-prevent-wheel className="-mx-5 mt-6 flex snap-x scroll-px-5 gap-2 overflow-x-auto px-5 pb-2 sm:scroll-px-0 [scrollbar-width:none] sm:mx-0 sm:px-0">
                        {days.map((d) => {
                          const active = d.date === selectedDate;
                          const empty = d.slots.length === 0;
                          return (
                            <button
                              key={d.date}
                              disabled={empty}
                              aria-pressed={active}
                              onClick={() => {
                                setSelectedDate(d.date);
                                setSelectedIso(null);
                              }}
                              className={cn(
                                "w-[92px] shrink-0 snap-start border px-3 pb-2.5 pt-3 text-left transition-colors duration-200",
                                active ? "border-[#BF5AF2] bg-[#BF5AF2]/[0.08]" : "border-white/[0.08] hover:border-white/25",
                                empty && "cursor-not-allowed opacity-35 hover:border-white/[0.08]"
                              )}
                            >
                              <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A8A93]">
                                {formatDateKey(d.date, { weekday: "short" })}
                              </span>
                              <span className="mt-1 block font-heading text-[32px] font-semibold leading-none tracking-[-0.04em] text-[#F5F5F7]">
                                {formatDateKey(d.date, { day: "numeric" })}
                              </span>
                              <span className="mt-1 block text-xs text-[#A1A1AA]">{formatDateKey(d.date, { month: "short" })}</span>
                              <span className={cn("mt-3 block font-mono text-[10px] tracking-wide", empty ? "text-[#5A5A63]" : "text-[#BF5AF2]")}>
                                {empty ? "Full" : `${d.slots.length} open`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-14">
                      <StepLabel n="02" title="Pick a time" aside="IST · 15 min" />
                      {activeDay && (
                        <div className="mt-6 space-y-8">
                          {groupByPeriod(activeDay.slots).map((group) => (
                            <div key={group.label}>
                              <p className="mb-3 text-sm text-[#8A8A93]">{group.label}</p>
                              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                <AnimatePresence initial={false}>
                                  {group.slots.map((iso) => (
                                    <motion.button
                                      key={iso}
                                      layout
                                      initial={{ opacity: 0, scale: 0.92 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
                                      transition={{ duration: 0.3, ease: EASE }}
                                      onClick={() => chooseTime(iso)}
                                      className="border border-white/[0.08] py-3 font-mono text-[13px] text-[#F5F5F7] transition-colors hover:border-[#BF5AF2] hover:bg-[#BF5AF2]/[0.06] focus-visible:border-[#BF5AF2] focus-visible:outline-none"
                                    >
                                      {formatTimeIST(iso)}
                                    </motion.button>
                                  ))}
                                </AnimatePresence>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === "details" && selectedIso && (
                  <motion.form
                    key="details"
                    onSubmit={submit}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="relative"
                  >
                    <button
                      type="button"
                      onClick={() => setStep("time")}
                      className="mb-10 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93] hover:text-[#F5F5F7]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> Change time
                    </button>

                    <StepLabel n="03" title="About you" />

                    {/* Honeypot */}
                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden opacity-0">
                      <label htmlFor="booking-website">Website</label>
                      <input id="booking-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                    </div>

                    <div className="mt-8 grid gap-8 sm:grid-cols-2 sm:gap-x-8">
                      <Field id="b-name" label="Full name" required minLength={2} autoComplete="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                      <Field id="b-email" label="Work email" type="email" required autoComplete="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                      <Field id="b-company" label="Company" required autoComplete="organization" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
                      <Field id="b-role" label="Role" optional autoComplete="organization-title" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
                    </div>

                    <div className="mt-8">
                      <div className="flex items-baseline justify-between">
                        <label htmlFor="b-goal" className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
                          What should we automate?
                        </label>
                        <span className={cn("font-mono text-[11px]", form.goal.trim().length >= 20 ? "text-[#10B981]" : "text-[#5A5A63]")}>
                          {form.goal.trim().length}/20
                        </span>
                      </div>
                      <textarea
                        id="b-goal"
                        required
                        minLength={20}
                        maxLength={2000}
                        rows={4}
                        value={form.goal}
                        onChange={(e) => setForm({ ...form, goal: e.target.value })}
                        placeholder="The process that eats the most hours, and the tools involved."
                        className="mt-3 w-full resize-none border-0 border-b border-white/15 bg-transparent pb-3 text-lg leading-relaxed text-[#F5F5F7] placeholder:text-[#4A4A52] focus:border-[#BF5AF2] focus:outline-none focus:ring-0"
                      />
                    </div>

                    {error && (
                      <p role="alert" className="mt-6 border-l-2 border-red-400 pl-4 text-sm text-red-300">
                        {error}
                      </p>
                    )}

                    <div className="mt-12 flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-[34ch] text-xs leading-relaxed text-[#8A8A93]">
                        {live ? "Your slot is reserved the moment you confirm." : "We'll confirm this time by email."} Details go only to our team.
                      </p>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="group inline-flex items-center gap-3 bg-[#F5F5F7] px-7 py-4 font-heading text-[15px] font-semibold text-black transition-colors hover:bg-white disabled:opacity-60"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Reserving
                          </>
                        ) : (
                          <>
                            {live ? "Confirm booking" : "Request this time"}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}

                {step === "done" && result && selectedIso && (
                  <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#BF5AF2]">{result.bookingId}</p>
                    <h2 className="mt-4 font-heading text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-[#F5F5F7]">
                      {result.status === "Confirmed" ? `You're booked, ${form.name.split(" ")[0]}.` : `Request sent, ${form.name.split(" ")[0]}.`}
                    </h2>
                    <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-[#A1A1AA]">
                      {result.status === "Confirmed"
                        ? `${result.slotLabel}. A confirmation is on its way to ${form.email}.`
                        : `We'll confirm ${result.slotLabel} at ${form.email} within a few hours.`}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-3">
                      {result.meetingLink && (
                        <a
                          href={result.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2.5 bg-[#F5F5F7] px-6 py-3.5 font-heading text-sm font-semibold text-black hover:bg-white"
                        >
                          <Video className="h-4 w-4" /> Meeting link
                        </a>
                      )}
                      {result.status === "Confirmed" && (
                        <a
                          href={googleCalendarUrl(selectedIso, result.meetingLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2.5 border border-white/15 px-6 py-3.5 font-heading text-sm font-semibold text-[#F5F5F7] hover:border-white/40"
                        >
                          <CalendarPlus className="h-4 w-4" /> Add to Google Calendar
                        </a>
                      )}
                    </div>

                    <p className="mt-14 border-t border-white/[0.08] pt-6 text-sm text-[#8A8A93]">Need another time? Reply to the confirmation email.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </MotionConfig>
  );
}

function LiveStatus({
  live, failed, syncing, secondsAgo, openCount,
}: { live: boolean; failed: boolean; syncing: boolean; secondsAgo: number | null; openCount: number | null }) {
  const label = failed
    ? "Reconnecting"
    : openCount === null
      ? "Loading availability"
      : live
        ? `Live · ${openCount} open ${openCount === 1 ? "slot" : "slots"}`
        : "Request mode";
  return (
    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-[#A1A1AA]" aria-live="polite">
      <span className="relative flex h-2 w-2">
        {live && !failed && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-60" />}
        <span className={cn("relative inline-flex h-2 w-2 rounded-full", failed ? "bg-amber-400" : live ? "bg-[#10B981]" : "bg-[#8A8A93]")} />
      </span>
      {label}
      {secondsAgo !== null && !failed && (
        <span className="text-[#5A5A63]">{syncing ? "· syncing" : `· synced ${secondsAgo < 5 ? "just now" : `${secondsAgo}s ago`}`}</span>
      )}
    </p>
  );
}

function StepLabel({ n, title, aside }: { n: string; title: string; aside?: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-3">
      <h2 className="flex items-baseline gap-4 font-heading text-xl font-semibold tracking-[-0.02em] text-[#F5F5F7]">
        <span className="font-mono text-[11px] font-normal tracking-[0.14em] text-[#BF5AF2]">{n}</span>
        {title}
      </h2>
      {aside && <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#5A5A63]">{aside}</span>}
    </div>
  );
}

function Field({
  id, label, value, onChange, optional, ...rest
}: {
  id: string; label: string; value: string; onChange: (v: string) => void; optional?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id">) {
  return (
    <div>
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#8A8A93]">
        {label} {optional && <span className="normal-case tracking-normal text-[#5A5A63]">(optional)</span>}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full border-0 border-b border-white/15 bg-transparent pb-3 text-lg text-[#F5F5F7] focus:border-[#BF5AF2] focus:outline-none focus:ring-0"
        {...rest}
      />
    </div>
  );
}

function Ticket({
  dateKey, iso, name, company, status, bookingId, live,
}: {
  dateKey: string | null; iso: string | null; name: string; company: string;
  status: "Draft" | "Holding" | "Confirmed" | "Requested"; bookingId: string | null; live: boolean;
}) {
  const dateText = dateKey ? formatDateKey(dateKey, { weekday: "short", month: "short", day: "numeric" }) : null;
  const rows: { k: string; label: string; value: string | null }[] = [
    { k: "01", label: "Date", value: dateText },
    { k: "02", label: "Time", value: iso ? `${formatTimeIST(iso)} IST` : null },
    { k: "03", label: "Format", value: "Video call · 15 min · Free" },
    { k: "04", label: "Attendee", value: name ? [name, company].filter(Boolean).join(" · ") : null },
  ];
  const stamped = status === "Confirmed" || status === "Requested";

  return (
    <div className="relative overflow-hidden border border-white/[0.1] bg-[#0B0B0E]">
      <div className="flex items-center justify-between border-b border-dashed border-white/[0.12] px-6 py-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#8A8A93]">Booking ticket</span>
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5A5A63]">{bookingId ?? (live ? "Live" : "Request")}</span>
      </div>

      <div className="px-6 pb-2 pt-6">
        <p className="font-heading text-2xl font-semibold tracking-[-0.03em] text-[#F5F5F7]">Free automation audit</p>
      </div>

      <dl className="px-6 pb-4">
        {rows.map((r) => (
          <div key={r.k} className="flex items-baseline gap-4 border-b border-white/[0.06] py-3.5 last:border-0">
            <dt className="w-24 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] text-[#5A5A63]">
              <span className="mr-2 text-[#3F3F46]">{r.k}</span>
              {r.label}
            </dt>
            <dd className="min-w-0 text-[15px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={r.value ?? "empty"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className={cn("block truncate", r.value ? "text-[#F5F5F7]" : "text-[#3F3F46]")}
                >
                  {r.value ?? "—"}
                </motion.span>
              </AnimatePresence>
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center justify-between border-t border-dashed border-white/[0.12] px-6 py-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#5A5A63]">Status</span>
        <span
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.16em]",
            status === "Confirmed" ? "text-[#10B981]" : status === "Requested" ? "text-amber-300" : status === "Holding" ? "text-[#BF5AF2]" : "text-[#5A5A63]"
          )}
        >
          {status}
        </span>
      </div>

      {/* Stamp lands when the booking is saved */}
      <AnimatePresence>
        {stamped && (
          <motion.div
            initial={{ opacity: 0, scale: 1.6, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.15 }}
            className={cn(
              "pointer-events-none absolute right-6 top-20 border-2 px-3 py-1 font-mono text-sm font-medium uppercase tracking-[0.2em]",
              status === "Confirmed" ? "border-[#10B981] text-[#10B981]" : "border-amber-300 text-amber-300"
            )}
            aria-hidden="true"
          >
            {status}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DaySkeleton() {
  return (
    <div className="mt-6 flex gap-2" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[118px] w-[92px] shrink-0 animate-pulse border border-white/[0.06] bg-white/[0.02]" />
      ))}
    </div>
  );
}
