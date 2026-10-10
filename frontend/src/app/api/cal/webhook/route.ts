import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { getSupabase } from "@/lib/server-utils";
import { appendBooking, hasCalUid, updateByCalUid, type BookingStatus } from "@/lib/booking/sheets";
import { slotLabel } from "@/lib/booking/slots";

export const dynamic = "force-dynamic";

// POST /api/cal/webhook — Cal.com → Google Sheets + Supabase, in real time.
// Subscribe in Cal.com → Settings → Developer → Webhooks to BOOKING_CREATED,
// BOOKING_CANCELLED and BOOKING_RESCHEDULED, with CALCOM_WEBHOOK_SECRET as the secret.

interface CalWebhook {
  triggerEvent?: string;
  payload?: {
    uid?: string;
    rescheduleUid?: string;
    startTime?: string;
    attendees?: { name?: string; email?: string }[];
    responses?: { notes?: { value?: string } };
    metadata?: { company?: string; goal?: string; videoCallUrl?: string };
    videoCallData?: { url?: string };
  };
}

function validSignature(raw: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(raw).digest("hex"));
  const given = Buffer.from(header.trim());
  return expected.length === given.length && timingSafeEqual(expected, given);
}

async function setSupabaseStatus(calUid: string, status: BookingStatus, extra: Record<string, unknown> = {}) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.from("bookings").update({ status: status.toLowerCase(), ...extra }).eq("cal_uid", calUid);
  if (error) console.warn("[cal webhook] Supabase status update failed:", error.message);
}

export async function POST(req: NextRequest) {
  const secret = process.env.CALCOM_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const raw = await req.text();
  if (!validSignature(raw, req.headers.get("x-cal-signature-256"), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: CalWebhook;
  try {
    event = JSON.parse(raw) as CalWebhook;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const p = event.payload ?? {};
  const uid = p.uid;
  if (!uid) return NextResponse.json({ ok: true, ignored: "no uid" });

  const meetingLink = p.videoCallData?.url ?? p.metadata?.videoCallUrl ?? "";
  const startIso = p.startTime ? new Date(p.startTime).toISOString() : "";

  try {
    switch (event.triggerEvent) {
      case "BOOKING_CREATED": {
        // Website bookings are already logged by /api/booking; this catches bookings
        // made directly on cal.com so the sheet stays complete.
        if (await hasCalUid(uid)) break;
        const attendee = p.attendees?.[0] ?? {};
        await appendBooking({
          bookingId: `CAL-${uid.slice(0, 8).toUpperCase()}`,
          status: "Confirmed",
          slotLabel: startIso ? slotLabel(startIso) : "",
          slotIso: startIso,
          name: attendee.name ?? "",
          email: attendee.email ?? "",
          company: p.metadata?.company ?? "",
          role: "",
          goal: p.metadata?.goal ?? p.responses?.notes?.value ?? "",
          meetingLink,
          calUid: uid,
          source: "Cal.com",
        });
        break;
      }
      case "BOOKING_CANCELLED": {
        await updateByCalUid(uid, { status: "Cancelled" });
        await setSupabaseStatus(uid, "Cancelled");
        break;
      }
      case "BOOKING_RESCHEDULED": {
        // The new booking carries the old uid in rescheduleUid; move the row onto the new uid
        const original = p.rescheduleUid ?? uid;
        await updateByCalUid(original, {
          status: "Rescheduled",
          slotLabel: startIso ? slotLabel(startIso) : undefined,
          slotIso: startIso || undefined,
          newCalUid: uid,
          meetingLink: meetingLink || undefined,
        });
        await setSupabaseStatus(original, "Rescheduled", {
          cal_uid: uid,
          ...(startIso ? { start_time: startIso, time_slot: slotLabel(startIso) } : {}),
        });
        break;
      }
      default:
        return NextResponse.json({ ok: true, ignored: event.triggerEvent ?? "unknown" });
    }
  } catch (err) {
    // 500 makes Cal.com retry the delivery
    console.error("[cal webhook] sync failed:", (err as Error).message);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
