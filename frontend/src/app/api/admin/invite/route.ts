import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, projectId } = await req.json() as { email: string; projectId: string };
  if (!email || !projectId) return NextResponse.json({ error: "email and projectId required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.FRONTEND_URL ?? "";

  const { data: invited, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/portal`,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Link the user to the project
  if (invited?.user?.id) {
    await admin.from("projects").update({ user_id: invited.user.id }).eq("id", projectId);
  }

  return NextResponse.json({ success: true });
}
