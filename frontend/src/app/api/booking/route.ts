import { NextRequest, NextResponse, after } from "next/server";
import { randomBytes } from "crypto";
import { z } from "zod";
import { escapeHtml, getSupabase, sendEmail } from "@/lib/server-utils";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { calcomConfigured, createCalBooking, getEventTypeId, isSlotAvailable, SlotTakenError } from "@/lib/booking/calcom";
import { appendBooking, type BookingStatus } from "@/lib/booking/sheets";
import { isWeekendIST, slotLabel, SLOT_MINUTES } from "@/lib/booking/slots";

export const dynamic = "force-dynamic";

const bookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().min(1).max(100),
  role: z.string().trim().max(100).optional().default(""),
  isoTime: z.string().datetime({ offset: true }),
  goal: z.string().trim().min(20).max(2000),
  website: z.string().max(500).optional(), // honeypot — any value means a bot
});

// Per-instance limiter: 5 booking attempts per IP per hour. Serverless instances
// don't share memory, so this slows abuse rather than stopping it outright.
const attempts = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < 3600_000);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > 5;
}

function newBookingId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "RA-" + Array.from(randomBytes(6), (b) => alphabet[b % alphabet.length]).join("");
}

async function createZoomMeeting(topic: string, startIso: string): Promise<string | null> {
  const { ZOOM_ACCOUNT_ID: accountId, ZOOM_CLIENT_ID: clientId, ZOOM_CLIENT_SECRET: clientSecret } = process.env;
  if (!accountId || !clientId || !clientSecret) return null;
  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenRes = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
      { method: "POST", headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" } }
    );
    if (!tokenRes.ok) return null;
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const meetRes = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        topic, type: 2, start_time: startIso, duration: SLOT_MINUTES, timezone: "Asia/Kolkata",
        settings: { join_before_host: true, waiting_room: false, host_video: true, participant_video: true },
      }),
    });
    if (!meetRes.ok) return null;
    const meeting = (await meetRes.json()) as { join_url?: string };
    return meeting.join_url ?? null;
  } catch {
    return null;
  }
}

async function logToNotion(data: {
  name: string; email: string; company: string; role: string;
  timeSlot: string; goal: string; meetingLink: string | null; status: BookingStatus;
}): Promise<void> {
  const { NOTION_TOKEN: token, NOTION_DATABASE_ID: dbId } = process.env;
  if (!token || !dbId) return;
  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: data.name } }] },
    Email: { email: data.email },
    Company: { rich_text: [{ text: { content: data.company } }] },
    "Time Slot": { rich_text: [{ text: { content: data.timeSlot } }] },
    Goal: { rich_text: [{ text: { content: data.goal.slice(0, 2000) } }] },
    Status: { select: { name: data.status === "Confirmed" ? "New" : data.status } },
  };
  if (data.role) properties["Role"] = { rich_text: [{ text: { content: data.role } }] };
  if (data.meetingLink) properties["Zoom Link"] = { url: data.meetingLink };
  await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({ parent: { database_id: dbId }, properties }),
  });
}

// Invites the client to the portal and opens an audit project for them
async function autoOnboard({ email, name, company, bookingId }: {
  email: string; name: string; company: string; bookingId: string | null;
}) {
  const siteUrl = process.env.FRONTEND_URL ?? "";
  if (!siteUrl) return;

  const admin = createSupabaseAdminClient();
  const { data: usersData } = await admin.auth.admin.listUsers();
  let userId = usersData?.users?.find((u) => u.email === email)?.id ?? null;

  if (!userId) {
    const { data: invited } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/portal`,
    });
    userId = invited?.user?.id ?? null;
  }
  if (!userId) return;

  await admin.from("projects").insert({
    user_id: userId,
    booking_id: bookingId,
    title: `Automation Audit — ${company || name}`,
    status: "audit",
  });
  if (bookingId) {
    await admin.from("bookings").update({ user_id: userId }).eq("id", bookingId);
  }
}

// Inserts the booking; retries without the newer columns if the
// 2026-10 migration in backend/supabase/schema.sql hasn't been run yet.
async function saveToSupabase(row: Record<string, unknown>, extended: Record<string, unknown>): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  let { data, error } = await supabase.from("bookings").insert({ ...row, ...extended }).select("id").single();
  if (error) {
    console.warn("[booking] Supabase insert with extended columns failed, retrying base row:", error.message);
    ({ data, error } = await supabase.from("bookings").insert(row).select("id").single());
  }
  if (error) console.error("[booking] Supabase insert failed:", error.message);
  return data?.id ?? null;
}

function emailBody(p: { safeName: string; label: string; meetingLink: string | null; status: BookingStatus; bookingId: string }): string {
  const consultantName = escapeHtml(process.env.CONSULTANT_NAME ?? "The RudraAI Team");
  const link = p.meetingLink ? escapeHtml(p.meetingLink) : null;
  const confirmed = p.status === "Confirmed";
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222">
      <p style="font-family:monospace;font-size:12px;letter-spacing:.12em;color:#777;text-transform:uppercase">Booking ${p.bookingId}</p>
      <h2 style="margin:8px 0 16px">${confirmed ? `You're booked, ${p.safeName}.` : `Request received, ${p.safeName}.`}</h2>
      <p>${confirmed ? "Your free 15-minute automation audit is confirmed for:" : "You asked for this time for your free 15-minute automation audit:"}</p>
      <p style="font-size:18px;font-weight:600;border-left:3px solid #BF5AF2;padding:8px 14px">${escapeHtml(p.label)}</p>
      ${link
        ? `<p>Join link: <a href="${link}">${link}</a></p>`
        : `<p><em>${confirmed ? "Your video link will follow by email within the hour." : "We'll confirm the time and send a video link within a few hours."}</em></p>`}
      <p>Need a different time? Reply to this email.</p>
      <p style="margin-top:28px">${consultantName}<br><span style="color:#888">RudraAI — Automation Agency</span></p>
    </div>`;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many booking attempts. Please try again later." }, { status: 429 });
  }

  let parsed;
  try {
    parsed = bookingSchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed. Please check your input." }, { status: 400 });
  }

  const { name, email, company, role, isoTime, goal, website } = parsed.data;
  const bookingId = newBookingId();

  // Honeypot hit: look successful, do nothing
  if (website) {
    return NextResponse.json({ success: true, bookingId, status: "Confirmed", slotLabel: slotLabel(isoTime), meetingLink: null });
  }

  const start = new Date(isoTime);
  if (!isWeekendIST(isoTime) || start.getTime() < Date.now() + 30 * 60_000 || start.getUTCMinutes() % SLOT_MINUTES !== 0) {
    return NextResponse.json({ error: "Calls run on Saturdays and Sundays in 15-minute slots. Please pick another time." }, { status: 400 });
  }

  const label = slotLabel(isoTime);
  let status: BookingStatus = "Requested";
  let calUid = "";
  let meetingLink: string | null = null;

  // Live mode: reserve the slot in Cal.com first. A taken slot is a 409 so the page
  // can refresh availability; any other Cal.com failure degrades to a request.
  if (calcomConfigured() && (await getEventTypeId())) {
    try {
      if (!(await isSlotAvailable(isoTime))) throw new SlotTakenError("slot no longer listed");
      const cal = await createCalBooking({ start: isoTime, name, email, notes: goal, company });
      status = "Confirmed";
      calUid = cal.uid;
      meetingLink = cal.meetingUrl;
    } catch (err) {
      if (err instanceof SlotTakenError) {
        return NextResponse.json(
          { error: "Someone just booked that time. Pick another slot.", code: "SLOT_TAKEN" },
          { status: 409 }
        );
      }
      console.error("[booking] Cal.com failed, recording as request:", (err as Error).message);
    }
  }

  meetingLink ??= await createZoomMeeting(`Automation Audit — ${name} (${company})`, start.toISOString());

  const supabaseId = await saveToSupabase(
    { name, email, company, role, time_slot: label, goal, zoom_link: meetingLink, status: status.toLowerCase() },
    { booking_ref: bookingId, start_time: start.toISOString(), cal_uid: calUid || null }
  );

  // Side effects run after the response is sent; Vercel keeps the function alive for them.
  after(async () => {
    const results = await Promise.allSettled([
      appendBooking({
        bookingId, status, slotLabel: label, slotIso: start.toISOString(),
        name, email, company, role, goal, meetingLink: meetingLink ?? "", calUid, source: "Website",
      }),
      logToNotion({ name, email, company, role, timeSlot: label, goal, meetingLink, status }),
      autoOnboard({ email, name, company, bookingId: supabaseId }),
      (async () => {
        if (!process.env.RESEND_API_KEY) return;
        const safeName = escapeHtml(name);
        if (process.env.CONTACT_TO) {
          await sendEmail({
            to: process.env.CONTACT_TO,
            replyTo: email,
            subject: `${status === "Confirmed" ? "New booking" : "Booking request"}: ${name} (${company}) — ${label}`,
            html: `
              <h2>${status === "Confirmed" ? "New booking" : "Booking request — confirm manually"} · ${bookingId}</h2>
              <table cellpadding="6" style="border-collapse:collapse">
                <tr><td><strong>Name</strong></td><td>${safeName}</td></tr>
                <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
                <tr><td><strong>Company</strong></td><td>${escapeHtml(company)}</td></tr>
                <tr><td><strong>Role</strong></td><td>${escapeHtml(role || "—")}</td></tr>
                <tr><td><strong>Slot</strong></td><td>${escapeHtml(label)}</td></tr>
                ${meetingLink ? `<tr><td><strong>Meeting</strong></td><td>${escapeHtml(meetingLink)}</td></tr>` : ""}
              </table>
              <h3>Goal</h3>
              <p style="white-space:pre-wrap">${escapeHtml(goal)}</p>`,
          });
        }
        await sendEmail({
          to: email,
          subject: status === "Confirmed" ? "Your automation audit is confirmed — RudraAI" : "We received your booking request — RudraAI",
          html: emailBody({ safeName, label, meetingLink, status, bookingId }),
        });
      })(),
    ]);
    const names = ["sheets", "notion", "onboard", "email"];
    results.forEach((r, i) => {
      if (r.status === "rejected") console.error(`[booking ${bookingId}] ${names[i]} failed:`, (r.reason as Error)?.message);
    });
  });

  return NextResponse.json({ success: true, bookingId, status, slotLabel: label, meetingLink });
}
