import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { projectId, name, type, status, due_date, file_url } = await req.json() as {
    projectId: string; name: string; type: string; status: string;
    due_date?: string; file_url?: string;
  };

  if (!projectId || !name) return NextResponse.json({ error: "projectId and name required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("deliverables").insert({
    project_id: projectId, name, type, status,
    due_date: due_date || null,
    file_url: file_url || null,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, ...updates } = await req.json() as { id: string; [key: string]: unknown };
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("deliverables").update(updates).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
