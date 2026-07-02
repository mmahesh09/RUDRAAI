import { Router, Request, Response } from "express";
import { z } from "zod";
import { getEventTypeId, createCalBooking } from "../lib/calcom";
import { escapeHtml, sendEmail, emailReady } from "../lib/email";
import { appendToSheet } from "../lib/sheets";
import { supabase } from "../lib/supabase";
import logger from "../lib/logger";

export const bookingRouter = Router();

const bookingSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim(),
  company: z.string().max(100).trim().optional().default(""),
  role: z.string().max(100).trim().optional(),
  timeSlot: z.string().min(3).max(80).trim(),
  isoTime: z.string().max(50).trim().optional(),
  goal: z.string().min(20).max(2000).trim(),
  website: z.string().max(0).optional(), // honeypot
});

// ── Zoom: Server-to-Server OAuth meeting creation ─────────────────────────────
async function createZoomMeeting(topic: string, timeSlot: string): Promise<string | null> {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) return null;

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenRes = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!tokenRes.ok) return null;
    const { access_token } = (await tokenRes.json()) as { access_token: string };

    // Parse the time slot (e.g. "Jun 24 at 2:00 PM IST") into an ISO start time
    const cleanedSlot = timeSlot.replace(" IST", "").replace(" at ", " ");
    const parsedDate = new Date(`${cleanedSlot} ${new Date().getFullYear()}`);
    const startTime = !isNaN(parsedDate.getTime())
      ? parsedDate.toISOString()
      : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const meetingRes = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        type: 2, // Scheduled
        start_time: startTime,
        duration: 15,
        timezone: "Asia/Kolkata",
        settings: {
          join_before_host: true,
          waiting_room: false,
          host_video: true,
          participant_video: true,
        },
      }),
    });

    if (!meetingRes.ok) return null;
    const meeting = (await meetingRes.json()) as { join_url?: string };
    return meeting.join_url ?? null;
  } catch (e) {
    logger.error({ err: (e as Error).message }, "Zoom meeting creation failed");
    return null;
  }
}

// ── Notion: log booking as a new page in the onboarding database ──────────────
async function logToNotion(data: {
  name: string;
  email: string;
  company: string;
  role?: string;
  timeSlot: string;
  goal: string;
  zoomLink: string | null;
}): Promise<void> {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;

  if (!token || !dbId) return;

  try {
    const properties: Record<string, unknown> = {
      Name: { title: [{ text: { content: data.name } }] },
      Email: { email: data.email },
      Company: { rich_text: [{ text: { content: data.company } }] },
      "Time Slot": { rich_text: [{ text: { content: data.timeSlot } }] },
      Goal: { rich_text: [{ text: { content: data.goal.slice(0, 2000) } }] },
      Status: { select: { name: "New" } },
    };

    if (data.role) {
      properties["Role"] = { rich_text: [{ text: { content: data.role } }] };
    }
    if (data.zoomLink) {
      properties["Zoom Link"] = { url: data.zoomLink };
    }

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ parent: { database_id: dbId }, properties }),
    });

    if (!res.ok) {
      const err = await res.json();
      logger.error({ err }, "Notion logging failed");
    }
  } catch (e) {
    logger.error({ err: (e as Error).message }, "Notion logging failed");
  }
}

// Returns true only if the booking falls on a Saturday or Sunday.
// Prefers the ISO timestamp when available; falls back to parsing the display string.
function isWeekendBooking(isoTime: string | undefined, timeSlot: string): boolean {
  if (isoTime) {
    const d = new Date(isoTime);
    if (!isNaN(d.getTime())) {
      const dow = d.getDay();
      return dow === 0 || dow === 6;
    }
  }
  // Fallback: parse display string like "Jun 28 at 10:00 AM IST"
  const cleaned = timeSlot.replace(/ IST$/i, "").replace(" at ", " ");
  const d = new Date(`${cleaned} ${new Date().getFullYear()}`);
  if (!isNaN(d.getTime())) {
    const dow = d.getDay();
    return dow === 0 || dow === 6;
  }
  return true; // Cannot determine day — allow (fail open)
}

// ── Main booking handler ──────────────────────────────────────────────────────
bookingRouter.post("/", async (req: Request, res: Response) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed. Please check your input." });
  }

  const { name, email, company, role, timeSlot, isoTime, goal, website } = parsed.data;

  if (website && website.length > 0) {
    return res.json({ success: true, message: "Booking confirmed." });
  }

  const safeName     = escapeHtml(name);
  const safeCompany  = escapeHtml(company);
  const safeRole     = role ? escapeHtml(role) : "—";
  const safeTimeSlot = escapeHtml(timeSlot);
  const safeGoal     = escapeHtml(goal).replace(/\n/g, "<br>");

  try {
    // ── Create Cal.com booking (non-fatal, only when API is configured + isoTime provided) ─
    if (process.env.CALCOM_API_KEY && isoTime) {
      const eventTypeId = await getEventTypeId();
      if (eventTypeId) {
        createCalBooking({ start: isoTime, eventTypeId, name, email, notes: goal }).catch(() => {});
      }
    }

    // ── Create Zoom meeting (non-fatal) ───────────────────────────
    const zoomLink = await createZoomMeeting(
      `Automation Audit — ${name} (${company})`,
      isoTime || timeSlot
    );

    // ── Log to Notion for onboarding (non-fatal) ──────────────────
    logToNotion({ name, email, company, role, timeSlot, goal, zoomLink }).catch(() => {});

    const safeZoomLink = zoomLink ? escapeHtml(zoomLink) : null;

    const zoomSection = safeZoomLink
      ? `
          <div style="background:#e8f4ff;border-left:4px solid #2D8CFF;padding:12px 16px;margin:16px 0;border-radius:4px">
            <strong style="color:#2D8CFF">📹 Your Zoom Link:</strong><br>
            <a href="${safeZoomLink}" style="color:#2D8CFF;word-break:break-all">${safeZoomLink}</a>
          </div>`
      : `<p><em>I'll send your Zoom link to this email within 1 hour.</em></p>`;

    const consultantName = process.env.CONSULTANT_NAME || "The RudraAI Team";

    if (emailReady()) {
      try {
        // ── Notification to owner ─────────────────────────────────
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
              <p style="background:#f5f5f5;padding:12px;border-radius:6px">${safeGoal}</p>
              <p style="color:#888;font-size:0.85em"><em>Notion onboarding record created automatically.</em></p>
            `,
          });
        }

        // ── Confirmation email to client ──────────────────────────
        await sendEmail({
          to: email,
          subject: "Your Automation Audit is Confirmed — RudraAI",
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333">
              <h2 style="color:#FF6B00">You're booked, ${safeName}! 🎉</h2>
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
              <p>Need to reschedule? Just reply to this email and we'll sort it out.</p>
              <br>
              <p>Looking forward to it!<br>
              <strong>${escapeHtml(consultantName)}</strong><br>
              <span style="color:#888">RudraAI — Automation Agency</span></p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
              <p style="font-size:0.8em;color:#aaa">RudraAI — n8n Workflow Automation Agency</p>
            </div>
          `,
        });
      } catch (emailErr) {
        logger.error({ err: (emailErr as Error).message }, "Email send failed — booking still confirmed. Check RESEND_API_KEY and EMAIL_FROM domain verification.");
      }
    } else {
      logger.warn("emailReady() = false — RESEND_API_KEY is missing, no emails sent");
    } // end emailReady block

    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    await appendToSheet("Sheet1!A:I", [
      submittedAt,
      name,
      email,
      company || "",
      role || "",
      timeSlot,
      goal,
      zoomLink || "",
      "New",
    ]).catch((e: Error) => logger.warn({ err: e.message }, "Google Sheets skipped"));

    if (supabase) {
      supabase.from("bookings").insert({ name, email, company, role, time_slot: timeSlot, goal, zoom_link: zoomLink })
        .then(({ error: e }) => { if (e) logger.warn({ err: e.message }, "Supabase bookings insert failed"); });
    }

    return res.json({ success: true, message: "Booking confirmed." });
  } catch (error) {
    logger.error({ err: (error as Error).message }, "Booking error");
    return res.status(500).json({ error: "Failed to confirm booking. Please try again." });
  }
});
