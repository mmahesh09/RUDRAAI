import { Router, Request, Response } from "express";
import { z } from "zod";
import logger from "../lib/logger";
import { supabase } from "../lib/supabase";
import { searchKnowledge } from "../lib/qdrant";

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

const BASE_SYSTEM_PROMPT = `You are an AI assistant for RudraAI, an n8n automation agency based in Hyderabad, India. Help visitors understand our services, pricing, and how AI automation saves their business time and money.

Be helpful, friendly, and concise (2–4 sentences per reply). Guide interested users to book a free audit at /booking. Do not make up information or pricing you are unsure about — only use what's provided in the context below.`;

function buildSystemPrompt(ragContext: string[]): string {
  if (ragContext.length === 0) {
    // Minimal fallback when RAG is unavailable
    return `${BASE_SYSTEM_PROMPT}

Key facts (fallback):
- Services: n8n workflow automation, AI agent development, CRM integrations, email/marketing automation
- Pricing: Starter $50 (1 workflow), Growth $100 (3 workflows), Scale $200 (5 workflows), Enterprise custom
- Process: Free 60-min audit → custom design → 3–7 day deployment → 30-day support
- Book at /booking | Email: hello@rudraai.online`;
  }

  return `${BASE_SYSTEM_PROMPT}

--- KNOWLEDGE BASE (use this to answer questions) ---
${ragContext.join("\n\n---\n\n")}
--- END OF KNOWLEDGE BASE ---`;
}

// ── OpenRouter (PRIMARY) ──────────────────────────────────────────────────────
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
        "google/gemma-2-9b-it:free",
        "mistralai/mistral-7b-instruct:free",
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

// ── Ollama (LOCAL FALLBACK) ───────────────────────────────────────────────────
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
    signal: AbortSignal.timeout(8_000),
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

// Persist a turn to Supabase (fire-and-forget)
async function persistTurn(
  sessionId: string,
  userMessage: string,
  assistantReply: string,
  provider: string
): Promise<void> {
  if (!supabase) return;
  try {
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

  // 1. Retrieve relevant knowledge from Qdrant (non-blocking — fallback gracefully)
  const ragContext = await searchKnowledge(message, 4);
  if (ragContext.length > 0) {
    logger.debug({ chunks: ragContext.length }, "RAG context retrieved");
  } else {
    logger.debug("RAG unavailable — using fallback system prompt");
  }

  const systemPrompt = buildSystemPrompt(ragContext);
  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: message },
  ];

  let reply: string;
  let provider = "openrouter";

  // 2. Try OpenRouter first
  try {
    reply = await callOpenRouter(messages);
  } catch (orErr) {
    logger.warn({ err: (orErr as Error).message }, "OpenRouter failed, trying Ollama");
    provider = "ollama";

    // 3. Fallback to local Ollama
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

  // Fire-and-forget: persist to Supabase
  if (session_id) {
    persistTurn(session_id, message, reply, provider).catch(() => {});
  }

  // Fire-and-forget: log to n8n/Notion
  if (process.env.N8N_WEBHOOK_CHAT) {
    fetch(process.env.N8N_WEBHOOK_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, reply, provider, history, session_id }),
    }).catch(() => {});
  }

  return res.json({ reply, provider, session_id });
});
