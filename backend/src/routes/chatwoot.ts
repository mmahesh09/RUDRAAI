import { Router, Request, Response } from "express";
import express from "express";
import crypto from "crypto";
import logger from "../lib/logger";
import { supabase } from "../lib/supabase";

export const chatwootRouter = Router();

// Accepts the raw Buffer captured by express.raw() before JSON parsing.
function verifySignature(rawBody: Buffer, signature: string | undefined): boolean {
  const secret = process.env.CHATWOOT_WEBHOOK_SECRET;
  if (!secret) return true; // skip verification when secret is not configured
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  const expectedBuf = Buffer.from(expected, "utf-8");
  const sigBuf = Buffer.from(signature, "utf-8");
  // timingSafeEqual requires identical lengths — return false instead of throwing
  if (expectedBuf.length !== sigBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, sigBuf);
}

// express.raw() reads the stream as a Buffer before express.json() can consume it.
// This router must be mounted in index.ts BEFORE the global express.json() middleware.
chatwootRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["x-chatwoot-signature"] as string | undefined;
    const rawBody = req.body as Buffer;

    if (!verifySignature(rawBody, sig)) {
      logger.warn("Chatwoot webhook signature mismatch");
      return res.status(401).json({ error: "Unauthorized" });
    }

    let payload: {
      event?: string;
      conversation?: { id?: number };
      contact?: { name?: string; email?: string };
    };

    try {
      payload = JSON.parse(rawBody.toString("utf-8"));
    } catch {
      return res.status(400).json({ error: "Invalid JSON payload" });
    }

    const { event, conversation, contact } = payload;
    logger.info({ event, conversationId: conversation?.id }, "Chatwoot webhook received");

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
  }
);
