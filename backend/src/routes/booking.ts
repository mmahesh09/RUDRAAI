import { Router, Request, Response } from "express";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { z } from "zod";

export const bookingRouter = Router();

const bookingSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim(),
  company: z.string().min(1).max(100).trim(),
  role: z.string().max(100).trim().optional(),
  timeSlot: z.string().min(3).max(80).trim(),
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

  if (!email || !key || !sheetId) return; // silently skip if not configured

  const auth = new google.auth.GoogleAuth({
    credentials: { client_email: email, private_key: key },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "Sheet1!A:H",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [row] },
  });
}

bookingRouter.post("/", async (req: Request, res: Response) => {
  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed. Please check your input." });
  }

  const { name, email, company, role, timeSlot, goal, website } = parsed.data;

  if (website && website.length > 0) {
    return res.json({ success: true, message: "Booking confirmed." });
  }

  const safeName     = escapeHtml(name);
  const safeCompany  = escapeHtml(company);
  const safeRole     = role ? escapeHtml(role) : "—";
  const safeTimeSlot = escapeHtml(timeSlot);
  const safeGoal     = escapeHtml(goal).replace(/\n/g, "<br>");

  try {
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
        </table>
        <h3>Automation Goal</h3>
        <p style="background:#f5f5f5;padding:12px;border-radius:6px">${safeGoal}</p>
        <p style="color:#888"><em>Reply to this email or send Zoom link to ${escapeHtml(email)}</em></p>
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
          <p><strong>What happens next:</strong></p>
          <ol style="line-height:1.8">
            <li>I'll send a Zoom link to this email within 1 hour</li>
            <li>You'll receive a short pre-call questionnaire 24 hours before</li>
            <li>On the call, we'll map your workflows and identify your top automation opportunities</li>
          </ol>
          <p>Need to reschedule? Just reply to this email and I'll sort it out.</p>
          <br>
          <p>Looking forward to it!<br>
          <strong>Avnish</strong><br>
          <span style="color:#888">Founder, RudraAI</span></p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
          <p style="font-size:0.8em;color:#aaa">RudraAI — n8n Workflow Automation Agency</p>
        </div>
      `,
    });

    // ── Google Sheets ─────────────────────────────────────────────
    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    await appendToGoogleSheet([
      submittedAt,
      name,
      email,
      company,
      role || "",
      timeSlot,
      goal,
      "New",         // Status column — update manually as you progress
    ]);

    return res.json({ success: true, message: "Booking confirmed." });
  } catch (error) {
    console.error("Booking error:", (error as Error).message);
    return res.status(500).json({ error: "Failed to confirm booking. Please try again." });
  }
});
