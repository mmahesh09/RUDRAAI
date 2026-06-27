import logger from "./logger";

const CALCOM_BASE = "https://api.cal.com/v2";
const API_VERSION = "2024-09-04";

function calHeaders() {
  return {
    Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
    "cal-api-version": API_VERSION,
    "Content-Type": "application/json",
  };
}

// In-memory cache — avoids an extra API call per booking
let cachedEventTypeId: number | null = null;

export async function getEventTypeId(): Promise<number | null> {
  if (cachedEventTypeId !== null) return cachedEventTypeId;

  const slug = process.env.CALCOM_EVENT_SLUG || "60min";

  try {
    const res = await fetch(`${CALCOM_BASE}/event-types`, { headers: calHeaders() });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      status?: string;
      data?: { eventTypes?: { id: number; slug: string }[] };
    };

    const et = data.data?.eventTypes?.find((e) => e.slug === slug);
    if (et) {
      cachedEventTypeId = et.id;
      return et.id;
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchCalSlots(
  startTime: string,
  endTime: string,
  eventTypeId: number
): Promise<{ status: string; data?: { slots: Record<string, { time: string }[]> } }> {
  const url = new URL(`${CALCOM_BASE}/slots/available`);
  url.searchParams.set("startTime", startTime);
  url.searchParams.set("endTime", endTime);
  url.searchParams.set("eventTypeId", String(eventTypeId));

  const res = await fetch(url.toString(), { headers: calHeaders() });
  if (!res.ok) {
    throw new Error(`Cal.com slots API returned ${res.status}`);
  }
  return res.json() as Promise<{ status: string; data?: { slots: Record<string, { time: string }[]> } }>;
}

export async function createCalBooking(params: {
  start: string;
  eventTypeId: number;
  name: string;
  email: string;
  timeZone?: string;
  notes?: string;
}): Promise<{ uid?: string; meetingUrl?: string } | null> {
  try {
    const res = await fetch(`${CALCOM_BASE}/bookings`, {
      method: "POST",
      headers: calHeaders(),
      body: JSON.stringify({
        start: params.start,
        eventTypeId: params.eventTypeId,
        attendee: {
          name: params.name,
          email: params.email,
          timeZone: params.timeZone || "Asia/Kolkata",
          language: "en",
        },
        metadata: params.notes ? { notes: params.notes } : {},
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      logger.error({ err }, "Cal.com booking failed");
      return null;
    }

    const data = (await res.json()) as {
      data?: { uid?: string; meetingUrl?: string };
    };
    return data.data ?? null;
  } catch (e) {
    logger.error({ err: (e as Error).message }, "Cal.com booking error");
    return null;
  }
}
