import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/server-utils";

// Runs on the Vercel Node runtime — the OpenRouter key stays server-side only.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

// OpenRouter with multi-model fallback: if the first model is rate-limited or
// unavailable, OpenRouter automatically tries the next one in the array.
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
      "HTTP-Referer":
        process.env.FRONTEND_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://rudraai.online",
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
  return content;
}

// Persist a turn to Supabase (fire-and-forget — never blocks the reply).
async function persistTurn(
  sessionId: string,
  userMessage: string,
  assistantReply: string,
  provider: string
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase
      .from("chat_sessions")
      .upsert(
        { id: sessionId, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
    await supabase.from("chat_messages").insert([
      { session_id: sessionId, role: "user", content: userMessage },
      { session_id: sessionId, role: "assistant", content: assistantReply, provider },
    ]);
  } catch (err) {
    console.error("[chat] persistence failed:", (err as Error).message);
  }
}

export async function POST(req: NextRequest) {
  let parsed;
  try {
    parsed = chatSchema.safeParse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { message, session_id, history } = parsed.data;
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: message },
  ];

  let reply: string;
  try {
    reply = await callOpenRouter(messages);
  } catch (err) {
    console.error("[chat] OpenRouter failed:", (err as Error).message);
    // Always return 200 with a graceful message so the widget never shows a
    // raw "connection error" to the visitor.
    return NextResponse.json({
      reply:
        "The AI assistant is briefly unavailable. Please email hello@rudraai.online or book a free audit at /booking — I'll get right back to you.",
      provider: "none",
    });
  }

  if (session_id) {
    persistTurn(session_id, message, reply, "openrouter").catch(() => {});
  }

  if (process.env.N8N_WEBHOOK_CHAT) {
    fetch(process.env.N8N_WEBHOOK_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, reply, provider: "openrouter", history, session_id }),
    }).catch(() => {});
  }

  return NextResponse.json({ reply, provider: "openrouter", session_id });
}
