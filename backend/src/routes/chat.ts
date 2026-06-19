import { Router, Request, Response } from "express";
import { z } from "zod";

export const chatRouter = Router();

const chatSchema = z.object({
  message: z.string().min(1).max(1000).trim(),
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

const SYSTEM_PROMPT = `You are an AI assistant for RudraAI, an n8n automation agency based in Hyderabad, India. Help visitors understand our services, pricing, and how AI automation saves time and money.

Services: n8n workflow automation, AI agent development, lead qualification, CRM integrations, email sequences, client onboarding.

Pricing: 1 automation = $50 | 3 automations = $100 | 5 automations = $200 | 5+ = Contact us.

Process: Free 60-min audit → design → 48-hour deployment → 30-day support.

Be helpful and concise (2–4 sentences). Guide interested users to book at /booking. Do not make up information.`;

// ── Ollama (PRIMARY — local, free, llama3.2:3b) ──────────────────────────────
async function callOllama(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: false }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) throw new Error(`Ollama ${res.status}`);
  const data = await res.json();
  const content = data.message?.content || data.response || "";
  if (!content) throw new Error("Ollama returned empty content");
  return content as string;
}

// ── OpenRouter (OPTIONAL fallback — only used when Ollama is unreachable) ───
async function callOpenRouter(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OpenRouter key not set");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.FRONTEND_URL || "https://rudraai.io",
      "X-Title": "RudraAI Chat",
    },
    body: JSON.stringify({
      // Cheapest capable free-tier model on OpenRouter
      model: "meta-llama/llama-3.2-3b-instruct:free",
      messages,
      max_tokens: 512,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter returned empty content");
  return content as string;
}

chatRouter.post("/", async (req: Request, res: Response) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request." });
  }

  const { message, history } = parsed.data;
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: message },
  ];

  let reply: string;
  let provider = "ollama";

  // Try Ollama first (local, free)
  try {
    reply = await callOllama(messages);
  } catch (ollamaErr) {
    console.warn("Ollama unavailable, trying OpenRouter fallback:", (ollamaErr as Error).message);
    provider = "openrouter";
    try {
      reply = await callOpenRouter(messages);
    } catch (orErr) {
      console.error("OpenRouter fallback also failed:", (orErr as Error).message);
      reply =
        "The AI assistant is temporarily offline. Please email hello@rudraai.io or book a call at rudraai.io/booking.";
      provider = "none";
    }
  }

  // Fire-and-forget to n8n (logs chat to Notion if configured)
  if (process.env.N8N_WEBHOOK_CHAT) {
    fetch(process.env.N8N_WEBHOOK_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, reply, provider, history }),
    }).catch(() => {});
  }

  return res.json({ reply });
});
