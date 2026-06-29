import { NextRequest, NextResponse } from "next/server";

const CALCOM_BASE = "https://api.cal.com/v2";
const ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

function calHeaders(version = "2024-06-11") {
  return {
    Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
    "cal-api-version": version,
    "Content-Type": "application/json",
  };
}

async function getEventTypeId(): Promise<number | null> {
  const slug = process.env.CALCOM_EVENT_SLUG || "15min";
  const res = await fetch(`${CALCOM_BASE}/event-types`, {
    headers: calHeaders("2024-06-11"),
    next: { revalidate: 300 }, // cache event type ID for 5 min
  });
  if (!res.ok) return null;

  const data = (await res.json()) as {
    data?: { eventTypeGroups?: { eventTypes?: { id: number; slug: string }[] }[] };
  };

  for (const group of data.data?.eventTypeGroups ?? []) {
    const et = group.eventTypes?.find((e) => e.slug === slug);
    if (et) return et.id;
  }
  return null;
}

export async function GET(req: NextRequest) {
  if (!process.env.CALCOM_API_KEY) {
    return NextResponse.json({ error: "Cal.com not configured" }, { status: 503 });
  }

  const { searchParams } = req.nextUrl;
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");

  if (!startTime || !endTime) {
    return NextResponse.json({ error: "startTime and endTime are required" }, { status: 400 });
  }
  if (!ISO_8601.test(startTime) || !ISO_8601.test(endTime)) {
    return NextResponse.json({ error: "startTime and endTime must be ISO-8601 strings" }, { status: 400 });
  }

  try {
    const eventTypeId = await getEventTypeId();
    if (!eventTypeId) {
      return NextResponse.json({ error: "Event type not found — check CALCOM_EVENT_SLUG" }, { status: 404 });
    }

    const url = new URL(`${CALCOM_BASE}/slots/available`);
    url.searchParams.set("startTime", startTime);
    url.searchParams.set("endTime", endTime);
    url.searchParams.set("eventTypeId", String(eventTypeId));

    const slotsRes = await fetch(url.toString(), { headers: calHeaders() });
    if (!slotsRes.ok) {
      return NextResponse.json({ error: "Failed to fetch available slots" }, { status: 502 });
    }

    const data = await slotsRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch available slots" }, { status: 500 });
  }
}
