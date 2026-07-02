import { Router, Request, Response } from "express";
import { z } from "zod";
import logger from "../lib/logger";
import { supabase } from "../lib/supabase";

export const chatRouter = Router();

const chatSchema = z.object({
  message: z.string().min(1).max(1000).trim(),
  session_id: z.string().uuid().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      })
    )
    .max(20)
    .optional()
    .default([]),
});

const SYSTEM_PROMPT = `You are an AI assistant for RudraAI, an n8n automation agency based in Hyderabad, India run by Mahesh. Help visitors understand our services, pricing, and how AI automation saves time and money.

Services: n8n workflow automation, AI agent development, lead qualification, CRM integrations, email sequences, client onboarding, proposal generation, SEO content automation.

Pricing:
- Starter: $50 — 1 automation
- Growth: $100 — 3 automations (most popular)
- Scale: $200 — 5 automations
- Enterprise: Contact us — 5+ automations with dedicated support

Process: Free 60-min audit → custom design → 48-hour deployment → 30-day monitoring and support.

Be helpful, friendly, and concise (2–4 sentences per reply). Guide interested users to book a free audit at /booking. Do not make up information or pricing you are unsure about.`;

// ── OpenRouter (PRIMARY — multi-model fallback routing) ───────────────────────
// Uses the `models` array so if the first model is rate-limited, OpenRouter
// automatically tries the next one. All are free-tier models.
async function callOpenRouter(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OpenRouter key not configured");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.FRONTEND_URL || "https://rudraai.online",
      "X-Title": "RudraAI Chat",
    },
    body: JSON.stringify({
      models: [
        "meta-llama/llama-3.3-70b-instruct:free",
        "google/gemma-4-31b-it:free",
        "openai/gpt-oss-20b:free",
      ],
      messages,
      max_tokens: 400,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(25_000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${err.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("OpenRouter returned empty content");
  return content as string;
}

// ── Ollama (OPTIONAL local fallback — only if OLLAMA_BASE_URL is set) ─────────
async function callOllama(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL;
  if (!baseUrl) throw new Error("Ollama not configured");

  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: false }),
    signal: AbortSignal.timeout(8_000), // quick fail — don't block UX
  });

  if (!res.ok) throw new Error(`Ollama ${res.status}`);
  const data = (await res.json()) as {
    message?: { content?: string };
    response?: string;
  };
  const content = (data.message?.content || data.response || "").trim();
  if (!content) throw new Error("Ollama returned empty content");
  return content as string;
}

// Persist a turn to Supabase chat tables (fire-and-forget)
async function persistTurn(
  sessionId: string,
  userMessage: string,
  assistantReply: string,
  provider: string
): Promise<void> {
  if (!supabase) return;
  try {
    // Upsert session so it exists before inserting messages
    await supabase
      .from("chat_sessions")
      .upsert({ id: sessionId, updated_at: new Date().toISOString() }, { onConflict: "id" });

    await supabase.from("chat_messages").insert([
      { session_id: sessionId, role: "user", content: userMessage },
      { session_id: sessionId, role: "assistant", content: assistantReply, provider },
    ]);
  } catch (err) {
    logger.warn({ err: (err as Error).message }, "Chat persistence failed");
  }
}

chatRouter.post("/", async (req: Request, res: Response) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request." });
  }

  const { message, session_id, history } = parsed.data;
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: message },
  ];

  let reply: string;
  let provider = "openrouter";

  // 1. Try OpenRouter first (primary)
  try {
    reply = await callOpenRouter(messages);
  } catch (orErr) {
    logger.warn({ err: (orErr as Error).message }, "OpenRouter failed, trying Ollama");
    provider = "ollama";

    // 2. Fallback to local Ollama
    try {
      reply = await callOllama(messages);
    } catch (ollamaErr) {
      logger.error({ err: (ollamaErr as Error).message }, "Both AI providers failed");
      return res.json({
        reply:
          "The AI assistant is temporarily offline. Please email hello@rudraai.online or book a call at /booking.",
        provider: "none",
      });
    }
  }

  // Fire-and-forget: persist to Supabase if session_id provided
  if (session_id) {
    persistTurn(session_id, message, reply, provider).catch(() => {});
  }

  // Fire-and-forget to n8n (logs chat to Notion if configured)
  if (process.env.N8N_WEBHOOK_CHAT) {
    fetch(process.env.N8N_WEBHOOK_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, reply, provider, history, session_id }),
    }).catch(() => {});
  }

  return res.json({ reply, provider, session_id });
});
