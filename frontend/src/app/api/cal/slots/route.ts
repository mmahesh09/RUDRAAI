import { NextRequest, NextResponse } from "next/server";
import { calcomConfigured, fetchWeekendSlots } from "@/lib/booking/calcom";
import { requestModeDays, upcomingWeekendKeys, type SlotsResponse } from "@/lib/booking/slots";

export const dynamic = "force-dynamic";

// GET /api/cal/slots?weeks=4
// Live weekend availability from Cal.com (IST). The booking page polls this, so it
// is never cached. When Cal.com is down or unconfigured it answers in "request" mode:
// a fixed weekend grid whose bookings are logged as requests, not confirmed calls.
export async function GET(req: NextRequest) {
  const weeks = Math.min(Math.max(Number(req.nextUrl.searchParams.get("weeks")) || 4, 1), 8);
  const headers = { "Cache-Control": "no-store" };

  if (calcomConfigured()) {
    const keys = upcomingWeekendKeys(weeks);
    if (keys.length) {
      try {
        const days = await fetchWeekendSlots(keys[0], keys[keys.length - 1]);
        const body: SlotsResponse = { mode: "live", days, fetchedAt: new Date().toISOString() };
        return NextResponse.json(body, { headers });
      } catch (err) {
        console.error("[slots] Cal.com unavailable, serving request mode:", (err as Error).message);
      }
    }
  }

  const body: SlotsResponse = { mode: "request", days: requestModeDays(weeks), fetchedAt: new Date().toISOString() };
  return NextResponse.json(body, { headers });
}
