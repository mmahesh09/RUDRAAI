import { Router, Request, Response } from "express";
import { z } from "zod";
import { escapeHtml, createTransporter } from "../lib/email";
import { appendToSheet } from "../lib/sheets";
import logger from "../lib/logger";

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim(),
  company: z.string().max(100).trim().optional(),
  budget: z.string().max(50).trim().optional(),
  message: z.string().min(20).max(2000).trim(),
  website: z.string().max(0).optional(), // honeypot
});


contactRouter.post("/", async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed. Please check your input." });
  }

  const { name, email, company, budget, message, website } = parsed.data;

  if (website && website.length > 0) {
    return res.json({ success: true, message: "Message sent successfully." });
  }

  const safeName    = escapeHtml(name);
  const safeCompany = company ? escapeHtml(company) : "—";
  const safeBudget  = budget ? escapeHtml(budget) : "—";
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  // Skip email entirely if SMTP isn't configured (dev without credentials)
  const smtpReady = !!(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.CONTACT_TO);

  try {
    if (smtpReady) {
    const transporter = createTransporter();

    // ── Email to owner ────────────────────────────────────────────
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_TO,
      subject: `New Contact: ${safeName} from ${safeCompany}`,
      html: `
        <h2 style="color:#FF6B00">New Contact Form Submission</h2>
        <table cellpadding="8" style="border-collapse:collapse">
          <tr><td><strong>Name</strong></td><td>${safeName}</td></tr>
          <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
          <tr><td><strong>Company</strong></td><td>${safeCompany}</td></tr>
          <tr><td><strong>Budget</strong></td><td>${safeBudget}</td></tr>
        </table>
        <h3>Message</h3>
        <p style="background:#f5f5f5;padding:12px;border-radius:6px">${safeMessage}</p>
        <p style="color:#888"><em>Reply directly to ${escapeHtml(email)}</em></p>
      `,
    });

    // ── Confirmation email to client ──────────────────────────────
    const bookingUrl = `${process.env.FRONTEND_URL || "https://rudraai.io"}/booking`;
    const consultantName = process.env.CONSULTANT_NAME || "The RudraAI Team";
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Got your message — I'll be in touch soon | RudraAI",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333">
          <h2 style="color:#FF6B00">Thanks for reaching out, ${safeName}!</h2>
          <p>I've received your message and will get back to you within <strong>4 business hours</strong>.</p>
          <p>While you wait, you're welcome to <a href="${bookingUrl}" style="color:#FF6B00">book a free 60-minute automation audit</a> — no pitch, just a practical look at your workflows and what's worth automating first.</p>
          <br>
          <p>Talk soon,<br>
          <strong>${escapeHtml(consultantName)}</strong><br>
          <span style="color:#888">RudraAI — Automation Agency</span></p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
          <p style="font-size:0.8em;color:#aaa">RudraAI — n8n Workflow Automation Agency</p>
        </div>
      `,
    });

    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    await appendToSheet("Contacts!A:G", [
      submittedAt,
      name,
      email,
      company || "",
      budget || "",
      message,
      "New",
    ]);

    if (process.env.N8N_WEBHOOK_CONTACT) {
      await fetch(process.env.N8N_WEBHOOK_CONTACT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, budget, message }),
      }).catch(() => {});
    }

    } // end smtpReady block

    return res.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    logger.error({ err: (error as Error).message }, "Contact error");
    return res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});
