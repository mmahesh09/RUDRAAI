import { Resend } from "resend";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function emailReady(): boolean {
  return !!process.env.RESEND_API_KEY;
}

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  const from = process.env.EMAIL_FROM || "RudraAI <onboarding@resend.dev>";
  const { error } = await getResend().emails.send({
    from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
  });
  if (error) throw new Error(error.message);
}
