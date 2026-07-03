import { Resend } from "resend";

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function maskKey(key: string | undefined): string {
  if (!key) return "(MISSING)";
  if (key.length < 8) return "(TOO SHORT — invalid)";
  return `${key.slice(0, 8)}...${key.slice(-4)} (len=${key.length})`;
}

function extractDomain(from: string): string {
  const m = from.match(/@([^>\s]+)/);
  return m ? m[1] : "(could not extract)";
}

// ── emailReady ────────────────────────────────────────────────────────────────
export function emailReady(): boolean {
  const apiKey = process.env.RESEND_API_KEY;
  const ready = !!(apiKey && apiKey.trim().length > 0);

  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║  STEP: emailReady()                           ║");
  console.log("╚═══════════════════════════════════════════════╝");
  console.log("  Current  RESEND_API_KEY :", maskKey(apiKey));
  console.log("  Expected               : starts with 're_', length > 20");
  if (!ready) {
    console.log("  Result  : ❌ FAIL — RESEND_API_KEY is empty or missing");
    console.log("  Fix     : Add RESEND_API_KEY=re_... to your .env file");
  } else if (!apiKey?.startsWith("re_")) {
    console.log("  Result  : ⚠️  WARN — key exists but does NOT start with 're_'");
    console.log("  Fix     : Regenerate the key at https://resend.com/api-keys");
  } else {
    console.log("  Result  : ✅ PASS — key present and well-formed");
  }
  console.log("");

  return ready;
}

// ── Resend singleton ──────────────────────────────────────────────────────────
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    console.log("[Resend SDK] Initialising with key:", maskKey(apiKey));
    _resend = new Resend(apiKey);
  }
  return _resend;
}

// ── SendEmailOptions ──────────────────────────────────────────────────────────
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

// ── sendEmail ─────────────────────────────────────────────────────────────────
export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  const from = process.env.EMAIL_FROM || "RudraAI <onboarding@resend.dev>";
  const apiKey = process.env.RESEND_API_KEY;
  const fromDomain = extractDomain(from);
  const isUsingFallback = !process.env.EMAIL_FROM;

  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║  STEP: sendEmail()                            ║");
  console.log("╚═══════════════════════════════════════════════╝");
  console.log("  FROM (resolved)  :", from);
  console.log("  FROM domain      :", fromDomain);
  console.log("  TO               :", JSON.stringify(opts.to));
  console.log("  SUBJECT          :", opts.subject);
  console.log("  API key          :", maskKey(apiKey));
  if (isUsingFallback) {
    console.log("  ⚠️  EMAIL_FROM not set — using Resend test address (onboarding@resend.dev)");
    console.log("     This only works while your account is in test mode.");
  }
  console.log("");
  console.log("  Expected FROM    : must match a VERIFIED domain in the Resend account");
  console.log("                     that owns this API key");
  console.log("  Expected TO      : valid email address, not on suppression list");
  console.log("  Expected API key : re_... key from resend.com, same account as domain");
  console.log("");
  console.log("  ▶ Calling resend.emails.send() ...");

  // ── Actual API call ───────────────────────────────────────────────────────
  let result: Awaited<ReturnType<Resend["emails"]["send"]>>;
  try {
    result = await getResend().emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    });
  } catch (sdkErr) {
    const err = sdkErr as Error;
    console.error("\n╔═══════════════════════════════════════════════════╗");
    console.error("║  FAIL: Resend SDK threw an exception              ║");
    console.error("╚═══════════════════════════════════════════════════╝");
    console.error("  Error class  :", err.constructor?.name ?? "Unknown");
    console.error("  Error message:", err.message);
    console.error("  Stack        :", err.stack);
    console.error("");
    console.error("  Possible causes:");
    console.error("    1. Network error — server cannot reach api.resend.com");
    console.error("    2. The SDK received undefined/null as the API key");
    console.error("    3. SDK version bug — check 'resend' in package.json");
    console.error("");
    throw err;
  }

  // ── Log full raw response ─────────────────────────────────────────────────
  console.log("\n╔═══════════════════════════════════════════════╗");
  console.log("║  Resend API Raw Response                      ║");
  console.log("╚═══════════════════════════════════════════════╝");
  console.log(JSON.stringify(result, null, 2));
  console.log("");

  const { data, error } = result;

  if (error) {
    console.error("╔═══════════════════════════════════════════════════════╗");
    console.error("║  FAIL: Resend returned an API-level error             ║");
    console.error("╚═══════════════════════════════════════════════════════╝");
    console.error("  error.name    :", error.name);
    console.error("  error.message :", error.message);
    console.error("");
    console.error("  Diagnostic checklist:");
    console.error("  [ ] Does the API key start with 're_'?");
    console.error(`  [ ] Is domain '${fromDomain}' verified at https://resend.com/domains?`);
    console.error("  [ ] Does the API key belong to the SAME Resend account as the domain?");
    console.error("  [ ] Is the recipient email valid?");
    console.error("  [ ] Is the account within sending limits?");
    console.error("");
    throw new Error(`Resend error [${error.name}]: ${error.message}`);
  }

  console.log("╔═══════════════════════════════════════════════╗");
  console.log("║  PASS: Email accepted by Resend               ║");
  console.log("╚═══════════════════════════════════════════════╝");
  console.log("  Email ID :", data?.id ?? "(no id returned — unexpected)");
  console.log("  TO       :", JSON.stringify(opts.to));
  console.log("  FROM     :", from);
  console.log("  If id is present, check https://resend.com/emails for delivery status");
  console.log("");
}
