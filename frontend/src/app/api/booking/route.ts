import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { escapeHtml, getSupabase, appendToSheet, sendEmail } from "@/lib/server-utils";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

async function autoOnboard({
  email, name, company, timeSlot, bookingId,
}: {
  email: string; name: string; company: string; timeSlot: string; bookingId: string | null;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.FRONTEND_URL ?? "";
  if (!siteUrl) return;

  const admin = createSupabaseAdminClient();

  // Find or invite the user
  const { data: usersData } = await admin.auth.admin.listUsers();
  let userId: string | null = null;
  const existing = usersData?.users?.find((u) => u.email === email);

  if (existing) {
    userId = existing.id;
  } else {
    const { data: invited } = await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/portal`,
    });
    userId = invited?.user?.id ?? null;
  }

  if (!userId) return;

  // Create a project and link it to the booking + user
  await admin.from("projects").insert({
    user_id: userId,
    booking_id: bookingId,
    title: `Automation Audit — ${company || name}`,
    status: "audit",
  });

  // Update booking with user_id
  if (bookingId) {
    await admin.from("bookings").update({ user_id: userId }).eq("id", bookingId);
  }
}

const bookingSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim(),
  company: z.string().max(100).trim().optional().default(""),
  role: z.string().max(100).trim().optional(),
  timeSlot: z.string().min(3).max(80).trim(),
  isoTime: z.string().max(50).trim().optional(),
  goal: z.string().min(20).max(2000).trim(),
  website: z.string().max(0).optional(),
});

async function createZoomMeeting(topic: string, timeRef: string): Promise<string | null> {
  const { ZOOM_ACCOUNT_ID: accountId, ZOOM_CLIENT_ID: clientId, ZOOM_CLIENT_SECRET: clientSecret } = process.env;
  if (!accountId || !clientId || !clientSecret) return null;
  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenRes = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
      { method: "POST", headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" } }
    );
    if (!tokenRes.ok) return null;
    const { access_token } = await tokenRes.json() as { access_token: string };

    const cleaned = timeRef.replace(/ IST$/i, "").replace(" at ", " ");
    const parsed = new Date(`${cleaned} ${new Date().getFullYear()}`);
    const startTime = !isNaN(parsed.getTime())
      ? parsed.toISOString()
      : new Date(Date.now() + 86400000).toISOString();

    const meetRes = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        topic, type: 2, start_time: startTime, duration: 15,
        timezone: "Asia/Kolkata",
        settings: { join_before_host: true, waiting_room: false, host_video: true, participant_video: true },
      }),
    });
    if (!meetRes.ok) return null;
    const meeting = await meetRes.json() as { join_url?: string };
    return meeting.join_url ?? null;
  } catch {
    return null;
  }
}

async function logToNotion(data: {
  name: string; email: string; company: string; role?: string;
  timeSlot: string; goal: string; zoomLink: string | null;
}): Promise<void> {
  const { NOTION_TOKEN: token, NOTION_DATABASE_ID: dbId } = process.env;
  if (!token || !dbId) return;
  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: data.name } }] },
    Email: { email: data.email },
    Company: { rich_text: [{ text: { content: data.company } }] },
    "Time Slot": { rich_text: [{ text: { content: data.timeSlot } }] },
    Goal: { rich_text: [{ text: { content: data.goal.slice(0, 2000) } }] },
    Status: { select: { name: "New" } },
  };
  if (data.role) properties["Role"] = { rich_text: [{ text: { content: data.role } }] };
  if (data.zoomLink) properties["Zoom Link"] = { url: data.zoomLink };
  await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Notion-Version": "2022-06-28", "Content-Type": "application/json" },
    body: JSON.stringify({ parent: { database_id: dbId }, properties }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed. Please check your input." }, { status: 400 });
    }

    const { name, email, company, role, timeSlot, isoTime, goal, website } = parsed.data;

    if (website && website.length > 0) {
      return NextResponse.json({ success: true, message: "Booking confirmed." });
    }

    const safeName     = escapeHtml(name);
    const safeCompany  = escapeHtml(company);
    const safeRole     = role ? escapeHtml(role) : "—";
    const safeTimeSlot = escapeHtml(timeSlot);
    const safeGoal     = escapeHtml(goal).replace(/\n/g, "<br>");
    const consultantName = process.env.CONSULTANT_NAME ?? "The RudraAI Team";

    // Cal.com booking — fire-and-forget
    if (process.env.CALCOM_API_KEY && isoTime) {
      const slug = process.env.CALCOM_EVENT_SLUG ?? "15min";
      const calHeaders = {
        Authorization: `Bearer ${process.env.CALCOM_API_KEY}`,
        "cal-api-version": "2024-06-11",
        "Content-Type": "application/json",
      };
      fetch("https://api.cal.com/v2/event-types", { headers: calHeaders }).then(async (r) => {
        if (!r.ok) return;
        const data = await r.json() as { data?: { eventTypeGroups?: { eventTypes?: { id: number; slug: string }[] }[] } };
        let eventTypeId: number | undefined;
        for (const group of data.data?.eventTypeGroups ?? []) {
          const et = group.eventTypes?.find((e) => e.slug === slug);
          if (et) { eventTypeId = et.id; break; }
        }
        if (!eventTypeId) return;
        return fetch("https://api.cal.com/v2/bookings", {
          method: "POST",
          headers: calHeaders,
          body: JSON.stringify({
            start: isoTime, eventTypeId,
            attendee: { name, email, timeZone: "Asia/Kolkata", language: "en" },
            metadata: goal ? { notes: goal } : {},
          }),
        });
      }).catch(() => {});
    }

    const zoomLink = await createZoomMeeting(`Automation Audit — ${name} (${company})`, isoTime ?? timeSlot);
    logToNotion({ name, email, company, role, timeSlot, goal, zoomLink }).catch(() => {});

    const safeZoomLink = zoomLink ? escapeHtml(zoomLink) : null;
    const zoomSection = safeZoomLink
      ? `<div style="background:#e8f4ff;border-left:4px solid #2D8CFF;padding:12px 16px;margin:16px 0;border-radius:4px"><strong style="color:#2D8CFF">📹 Zoom Link:</strong><br><a href="${safeZoomLink}" style="color:#2D8CFF;word-break:break-all">${safeZoomLink}</a></div>`
      : `<p><em>I'll send your Zoom link to this email within 1 hour.</em></p>`;

    if (process.env.RESEND_API_KEY) {
      try {
        if (process.env.CONTACT_TO) {
          await sendEmail({
            to: process.env.CONTACT_TO,
            subject: `New Booking: ${safeName} (${safeCompany}) — ${safeTimeSlot}`,
            html: `
              <h2 style="color:#FF6B00">New Automation Audit Booking</h2>
              <table cellpadding="8" style="border-collapse:collapse">
                <tr><td><strong>Name</strong></td><td>${safeName}</td></tr>
                <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
                <tr><td><strong>Company</strong></td><td>${safeCompany}</td></tr>
                <tr><td><strong>Role</strong></td><td>${safeRole}</td></tr>
                <tr><td><strong>Time Slot</strong></td><td>${safeTimeSlot}</td></tr>
                ${safeZoomLink ? `<tr><td><strong>Zoom Link</strong></td><td><a href="${safeZoomLink}">${safeZoomLink}</a></td></tr>` : ""}
              </table>
              <h3>Automation Goal</h3>
              <p style="background:#f5f5f5;padding:12px;border-radius:6px">${safeGoal}</p>`,
          });
        }
        await sendEmail({
          to: email,
          subject: "Your Automation Audit is Confirmed — RudraAI",
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333">
              <h2 style="color:#FF6B00">You're booked, ${safeName}!</h2>
              <p>Your <strong>Free Automation Audit</strong> is confirmed for:</p>
              <div style="background:#fff8f0;border-left:4px solid #FF6B00;padding:12px 16px;margin:16px 0;border-radius:4px">
                <strong style="font-size:1.1em">${safeTimeSlot}</strong>
              </div>
              ${zoomSection}
              <p><strong>What happens next:</strong></p>
              <ol style="line-height:1.8">
                <li>Join the Zoom call at your booked time</li>
                <li>You'll receive a short pre-call questionnaire 24 hours before</li>
                <li>On the call, we'll map your workflows and identify your top automation opportunities</li>
              </ol>
              <p>Need to reschedule? Just reply to this email.</p>
              <br>
              <p>Looking forward to it!<br>
              <strong>${escapeHtml(consultantName)}</strong><br>
              <span style="color:#888">RudraAI — Automation Agency</span></p>
            </div>`,
        });
      } catch (emailErr) {
        console.error("[booking] Email send failed:", (emailErr as Error).message);
      }
    }

    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    appendToSheet("Sheet1!A:I", [submittedAt, name, email, company, role ?? "", timeSlot, goal, zoomLink ?? "", "New"]).catch(() => {});

    const supabase = getSupabase();
    let bookingId: string | null = null;
    if (supabase) {
      const { data: booking } = await supabase.from("bookings")
        .insert({ name, email, company, role, time_slot: timeSlot, goal, zoom_link: zoomLink })
        .select("id")
        .single();
      bookingId = booking?.id ?? null;
    }

    // Auto-onboard: invite the client to the portal and create their project
    autoOnboard({ email, name, company, timeSlot, bookingId }).catch(() => {});

    return NextResponse.json({ success: true, message: "Booking confirmed.", zoomLink });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to confirm booking. Please try again." }, { status: 500 });
  }
}
