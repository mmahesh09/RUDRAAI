import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { z } from "zod";
import { getEventTypeId, createCalBooking } from "../lib/calcom";

export const bookingRouter = Router();

const bookingSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim(),
  company: z.string().max(100).trim().optional().default(""),
  role: z.string().max(100).trim().optional(),
  timeSlot: z.string().min(3).max(80).trim(),
  isoTime: z.string().max(50).trim().optional(), // ISO start time for Cal.com booking
  goal: z.string().min(20).max(2000).trim(),
  website: z.string().max(0).optional(), // honeypot
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function appendToGoogleSheet(row: string[]) {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEETS_ID;

  if (!email || !key || !sheetId) return;

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key: key },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet1!A:I",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

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
        duration: 60,
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
    console.error("Zoom meeting creation failed:", (e as Error).message);
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
      console.error("Notion logging failed:", JSON.stringify(err));
    }
  } catch (e) {
    console.error("Notion logging failed:", (e as Error).message);
  }
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

    const zoomSection = zoomLink
      ? `
          <div style="background:#e8f4ff;border-left:4px solid #2D8CFF;padding:12px 16px;margin:16px 0;border-radius:4px">
            <strong style="color:#2D8CFF">📹 Your Zoom Link:</strong><br>
            <a href="${zoomLink}" style="color:#2D8CFF;word-break:break-all">${zoomLink}</a>
          </div>`
      : `<p><em>I'll send your Zoom link to this email within 1 hour.</em></p>`;

    const consultantName = process.env.CONSULTANT_NAME || "The RudraAI Team";
    const smtpReady = !!(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_TO);

    if (smtpReady) {
    const transporter = createTransporter();

    // ── Email to owner ────────────────────────────────────────────
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
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
          ${zoomLink ? `<tr><td><strong>Zoom Link</strong></td><td><a href="${zoomLink}">${zoomLink}</a></td></tr>` : ""}
        </table>
        <h3>Automation Goal</h3>
        <p style="background:#f5f5f5;padding:12px;border-radius:6px">${safeGoal}</p>
        <p style="color:#888;font-size:0.85em"><em>Notion onboarding record created automatically.</em></p>
      `,
    });

    // ── Confirmation email to client ──────────────────────────────
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
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

    } // end smtpReady block

    // ── Google Sheets (non-fatal) ─────────────────────────────────
    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    await appendToGoogleSheet([
      submittedAt,
      name,
      email,
      company || "",
      role || "",
      timeSlot,
      goal,
      zoomLink || "",
      "New",
    ]).catch((e: Error) => console.warn("Google Sheets skipped:", e.message));

    return res.json({ success: true, message: "Booking confirmed." });
  } catch (error) {
    console.error("Booking error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to confirm booking. Please try again." });
  }
});
