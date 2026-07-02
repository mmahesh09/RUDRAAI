import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { escapeHtml, getSupabase, appendToSheet, sendEmail } from "@/lib/server-utils";

const contactSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(254).trim(),
  company: z.string().max(100).trim().optional(),
  budget: z.string().max(50).trim().optional(),
  message: z.string().min(20).max(2000).trim(),
  website: z.string().max(0).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed. Please check your input." }, { status: 400 });
    }

    const { name, email, company, budget, message, website } = parsed.data;

    if (website && website.length > 0) {
      return NextResponse.json({ success: true, message: "Message sent successfully." });
    }

    const safeName    = escapeHtml(name);
    const safeCompany = company ? escapeHtml(company) : "—";
    const safeBudget  = budget ? escapeHtml(budget) : "—";
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");
    const consultantName = process.env.CONSULTANT_NAME ?? "The RudraAI Team";
    const bookingUrl = `${process.env.FRONTEND_URL ?? "https://rudraai.online"}/booking`;

    if (process.env.RESEND_API_KEY) {
      try {
        if (process.env.CONTACT_TO) {
          await sendEmail({
            to: process.env.CONTACT_TO,
            subject: `New Contact: ${safeName} from ${safeCompany}`,
            replyTo: email,
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
              <p style="color:#888"><em>Reply directly to ${escapeHtml(email)}</em></p>`,
          });
        }
        await sendEmail({
          to: email,
          subject: "Got your message — I'll be in touch soon | RudraAI",
          html: `
            <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#333">
              <h2 style="color:#FF6B00">Thanks for reaching out, ${safeName}!</h2>
              <p>I've received your message and will get back to you within <strong>4 business hours</strong>.</p>
              <p>While you wait, you're welcome to <a href="${bookingUrl}" style="color:#FF6B00">book a free automation audit</a> — no pitch, just a practical look at your workflows.</p>
              <br>
              <p>Talk soon,<br>
              <strong>${escapeHtml(consultantName)}</strong><br>
              <span style="color:#888">RudraAI — Automation Agency</span></p>
            </div>`,
        });
      } catch (emailErr) {
        console.error("[contact] Email send failed:", (emailErr as Error).message);
      }
    }

    if (process.env.N8N_WEBHOOK_CONTACT) {
      fetch(process.env.N8N_WEBHOOK_CONTACT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, budget, message }),
      }).catch(() => {});
    }

    const submittedAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    appendToSheet("Contacts!A:G", [submittedAt, name, email, company ?? "", budget ?? "", message, "New"]).catch(() => {});

    const supabase = getSupabase();
    if (supabase) {
      supabase.from("contacts").insert({ name, email, company, budget, message }).then(() => {});
    }

    return NextResponse.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 });
  }
}
