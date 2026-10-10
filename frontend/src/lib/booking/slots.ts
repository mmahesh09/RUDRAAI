// Shared booking time helpers — safe to import from client and server code.
// Every call runs Saturday/Sunday only, 15 minutes, and is shown in IST.

export const BOOKING_TZ = "Asia/Kolkata";
export const SLOT_MINUTES = 15;

export interface SlotDay {
  date: string; // YYYY-MM-DD in IST
  slots: string[]; // ISO start times
}

export interface SlotsResponse {
  mode: "live" | "request";
  days: SlotDay[];
  fetchedAt: string;
}

// YYYY-MM-DD of an instant, as seen in IST
export function istDateKey(iso: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: BOOKING_TZ }).format(new Date(iso));
}

// 0 = Sunday … 6 = Saturday, for a YYYY-MM-DD key (calendar date, no timezone shift)
export function dayOfWeek(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isWeekendKey(dateKey: string): boolean {
  const dow = dayOfWeek(dateKey);
  return dow === 0 || dow === 6;
}

export function isWeekendIST(iso: string): boolean {
  const d = new Date(iso);
  return !isNaN(d.getTime()) && isWeekendKey(istDateKey(d));
}

export function formatTimeIST(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: BOOKING_TZ,
  });
}

export function formatDateKey(dateKey: string, opts: Intl.DateTimeFormatOptions): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });
}

// "Sat, Oct 17 at 10:30 AM IST" — the human label stored everywhere a booking is logged
export function slotLabel(iso: string): string {
  return `${formatDateKey(istDateKey(iso), { weekday: "short", month: "short", day: "numeric" })} at ${formatTimeIST(iso)} IST`;
}

// Weekend dates (IST) for the next `weeks` weeks, starting today
export function upcomingWeekendKeys(weeks: number, from = new Date()): string[] {
  const keys: string[] = [];
  const [y, m, d] = istDateKey(from).split("-").map(Number);
  for (let i = 0; i < weeks * 7; i++) {
    const key = new Date(Date.UTC(y, m - 1, d + i)).toISOString().slice(0, 10);
    if (isWeekendKey(key)) keys.push(key);
  }
  return keys;
}

// Fallback "request" grid when Cal.com is unreachable: 10:00–13:00 and 15:00–18:00 IST
export function requestModeDays(weeks: number, now = new Date()): SlotDay[] {
  const hours = [10, 11, 12, 15, 16, 17];
  return upcomingWeekendKeys(weeks, now).map((date) => ({
    date,
    slots: hours
      .flatMap((h) => [0, 15, 30, 45].map((min) => `${date}T${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:00+05:30`))
      .map((s) => new Date(s).toISOString())
      .filter((iso) => new Date(iso).getTime() > now.getTime() + 2 * 3600_000),
  }));
}
