import { Router, Request, Response } from "express";
import { z } from "zod";
import { supabase } from "../lib/supabase";
import logger from "../lib/logger";

export const newsletterRouter = Router();

const schema = z.object({
  email: z.string().email().max(320).trim().toLowerCase(),
});

newsletterRouter.post("/", async (req: Request, res: Response) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const { email } = parsed.data;

  // Forward to n8n webhook for CRM logging (fire-and-forget)
  if (process.env.N8N_WEBHOOK_NEWSLETTER) {
    fetch(process.env.N8N_WEBHOOK_NEWSLETTER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "newsletter_signup", email }),
    }).catch(() => {});
  }

  if (supabase) {
    supabase.from("newsletter_subscribers").upsert({ email }, { onConflict: "email", ignoreDuplicates: true })
      .then(({ error: e }) => { if (e) logger.warn({ err: e.message }, "Supabase newsletter insert failed"); });
  }

  return res.json({ success: true });
});
