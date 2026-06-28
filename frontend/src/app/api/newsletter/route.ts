import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/server-utils";

const schema = z.object({
  email: z.string().email().max(320).trim().toLowerCase(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const { email } = parsed.data;

    if (process.env.N8N_WEBHOOK_NEWSLETTER) {
      fetch(process.env.N8N_WEBHOOK_NEWSLETTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter_signup", email }),
      }).catch(() => {});
    }

    const supabase = getSupabase();
    if (supabase) {
      supabase.from("newsletter_subscribers")
        .upsert({ email }, { onConflict: "email", ignoreDuplicates: true })
        .then(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 });
  }
}
