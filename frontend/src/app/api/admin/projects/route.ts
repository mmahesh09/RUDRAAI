import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

async function assertAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") return null;
  return user;
}

export async function POST(req: NextRequest) {
  const caller = await assertAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, status, budget_approved, timeline_start, timeline_end, notes, userEmail } = await req.json() as {
    title: string; status: string; budget_approved?: number | null;
    timeline_start?: string | null; timeline_end?: string | null;
    notes?: string | null; userEmail?: string;
  };

  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const admin = createSupabaseAdminClient();

  let userId: string | null = null;
  if (userEmail) {
    const { data: existingUser } = await admin.auth.admin.listUsers();
    const found = existingUser?.users?.find((u) => u.email === userEmail);
    if (found) {
      userId = found.id;
    } else {
      const { data: invited } = await admin.auth.admin.inviteUserByEmail(userEmail, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? process.env.FRONTEND_URL ?? ""}/auth/callback?next=/portal`,
      });
      userId = invited?.user?.id ?? null;
    }
  }

  const { data, error } = await admin.from("projects").insert({
    title, status: status ?? "audit", budget_approved, timeline_start, timeline_end, notes,
    user_id: userId,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
