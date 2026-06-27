import { Router, Request, Response } from "express";
import crypto from "crypto";
import logger from "../lib/logger";
import { supabase } from "../lib/supabase";

export const chatwootRouter = Router();

function verifySignature(body: string, signature: string | undefined): boolean {
  const secret = process.env.CHATWOOT_WEBHOOK_SECRET;
  if (!secret) return true; // skip verification if secret not configured
  if (!signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(signature, "hex")
  );
}

// Capture raw body before JSON parsing for HMAC verification
function captureRawBody(
  req: Request & { rawBody?: string },
  _res: Response,
  next: () => void
) {
  let data = "";
  req.on("data", (chunk: Buffer) => { data += chunk.toString(); });
  req.on("end", () => { req.rawBody = data; next(); });
}

chatwootRouter.post("/webhook", captureRawBody, async (req: Request, res: Response) => {
  const sig = req.headers["x-chatwoot-signature"] as string | undefined;
  const raw = (req as Request & { rawBody?: string }).rawBody ?? JSON.stringify(req.body);

  if (!verifySignature(raw, sig)) {
    logger.warn("Chatwoot webhook signature mismatch");
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { event, conversation, contact } = req.body as {
    event?: string;
    conversation?: { id?: number };
    contact?: { name?: string; email?: string };
  };

  logger.info({ event, conversationId: conversation?.id }, "Chatwoot webhook received");

  // Persist new conversation contacts to Supabase for CRM tracking
  if (event === "conversation_created" && contact?.email && supabase) {
    supabase
      .from("contacts")
      .insert({
        name: contact.name ?? "Chatwoot visitor",
        email: contact.email,
        message: `Chatwoot conversation #${conversation?.id ?? "?"}`,
        status: "chatwoot",
      })
      .then(({ error }) => {
        if (error) logger.warn({ err: error.message }, "Chatwoot contact insert failed");
      });
  }

  return res.json({ ok: true });
});
