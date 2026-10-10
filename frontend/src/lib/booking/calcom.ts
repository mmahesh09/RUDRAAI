import { BOOKING_TZ, istDateKey, isWeekendIST, type SlotDay } from "./slots";

// Cal.com v2 client — server only. The API key never reaches the browser.
const CALCOM_BASE = "https://api.cal.com/v2";

export function calcomConfigured(): boolean {
  return Boolean(process.env.CALCOM_API_KEY);
}

function calHeaders(version: string): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
    "cal-api-version": version,
    "Content-Type": "application/json",
  };
}

type EventTypeLite = { id: number; slug: string };

let cachedEventTypeId: number | null = null;

// Resolution order: CALCOM_EVENT_TYPE_ID (no lookup) → slug match across both
// response shapes Cal.com has shipped (flat `data[]` and grouped `eventTypeGroups`).
export async function getEventTypeId(): Promise<number | null> {
  const pinned = Number(process.env.CALCOM_EVENT_TYPE_ID);
  if (Number.isInteger(pinned) && pinned > 0) return pinned;
  if (cachedEventTypeId !== null) return cachedEventTypeId;

  const slug = process.env.CALCOM_EVENT_SLUG || "15min";

  for (const version of ["2024-06-14", "2024-06-11"]) {
    try {
      const res = await fetch(`${CALCOM_BASE}/event-types`, { headers: calHeaders(version), cache: "no-store" });
      if (!res.ok) continue;
      const body = (await res.json()) as {
        data?: EventTypeLite[] | { eventTypeGroups?: { eventTypes?: EventTypeLite[] }[] };
      };
      const list: EventTypeLite[] = Array.isArray(body.data)
        ? body.data
        : (body.data?.eventTypeGroups ?? []).flatMap((g) => g.eventTypes ?? []);
      const match = list.find((e) => e.slug === slug);
      if (match) {
        cachedEventTypeId = match.id;
        return match.id;
      }
    } catch {
      // try the next API version
    }
  }
  console.error(`[cal.com] event type "${slug}" not found — set CALCOM_EVENT_TYPE_ID or fix CALCOM_EVENT_SLUG`);
  return null;
}

// Available weekend slots between two IST dates (inclusive), grouped by IST date.
export async function fetchWeekendSlots(startDate: string, endDate: string): Promise<SlotDay[]> {
  const eventTypeId = await getEventTypeId();
  if (!eventTypeId) throw new Error("Cal.com event type not found");

  const url = new URL(`${CALCOM_BASE}/slots`);
  url.searchParams.set("eventTypeId", String(eventTypeId));
  url.searchParams.set("start", startDate);
  url.searchParams.set("end", endDate);
  url.searchParams.set("timeZone", BOOKING_TZ);

  const res = await fetch(url, { headers: calHeaders("2024-09-04"), cache: "no-store" });
  if (!res.ok) throw new Error(`Cal.com slots API returned ${res.status}`);

  const body = (await res.json()) as {
    data?: Record<string, { start?: string; time?: string }[]> & { slots?: Record<string, { time: string }[]> };
  };
  const raw = body.data?.slots ?? body.data ?? {};

  const byDate = new Map<string, string[]>();
  for (const entries of Object.values(raw)) {
    for (const entry of entries as { start?: string; time?: string }[]) {
      const start = entry.start ?? entry.time;
      if (!start || !isWeekendIST(start)) continue;
      const iso = new Date(start).toISOString();
      const key = istDateKey(iso);
      byDate.set(key, [...(byDate.get(key) ?? []), iso]);
    }
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, slots]) => ({ date, slots: slots.sort() }));
}

export async function isSlotAvailable(iso: string): Promise<boolean> {
  const key = istDateKey(iso);
  const days = await fetchWeekendSlots(key, key);
  const target = new Date(iso).getTime();
  return days.some((d) => d.slots.some((s) => new Date(s).getTime() === target));
}

export interface CalBooking {
  uid: string;
  meetingUrl: string | null;
}

export class SlotTakenError extends Error {}

export async function createCalBooking(params: {
  start: string;
  name: string;
  email: string;
  notes: string;
  company: string;
}): Promise<CalBooking> {
  const eventTypeId = await getEventTypeId();
  if (!eventTypeId) throw new Error("Cal.com event type not found");

  const res = await fetch(`${CALCOM_BASE}/bookings`, {
    method: "POST",
    headers: calHeaders("2024-08-13"),
    cache: "no-store",
    body: JSON.stringify({
      start: new Date(params.start).toISOString(),
      eventTypeId,
      attendee: { name: params.name, email: params.email, timeZone: BOOKING_TZ, language: "en" },
      metadata: { company: params.company.slice(0, 500), goal: params.notes.slice(0, 500) },
    }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    data?: { uid?: string; meetingUrl?: string; location?: string };
    error?: { message?: string };
  };

  if (!res.ok || !body.data?.uid) {
    const message = body.error?.message ?? `status ${res.status}`;
    console.error("[cal.com] booking failed:", message);
    // Cal.com answers 400/409 when the slot was taken or is no longer bookable
    if (res.status === 400 || res.status === 409) throw new SlotTakenError(message);
    throw new Error(`Cal.com booking failed: ${message}`);
  }

  const location = body.data.location ?? "";
  return {
    uid: body.data.uid,
    meetingUrl: body.data.meetingUrl ?? (/^https?:\/\//.test(location) ? location : null),
  };
}
