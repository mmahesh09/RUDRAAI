import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId, content, authorRole } = await req.json() as {
    projectId: string; content: string; authorRole?: string;
  };

  if (!projectId || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Admin can post as "admin"; clients always post as "client"
  const isAdmin = user.user_metadata?.role === "admin";
  const role = isAdmin && authorRole === "admin" ? "admin" : "client";

  // Verify the project belongs to this user (or user is admin)
  const admin = createSupabaseAdminClient();
  const { data: project } = await admin
    .from("projects")
    .select("id, user_id")
    .eq("id", projectId)
    .single();

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!isAdmin && project.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await admin
    .from("project_updates")
    .insert({ project_id: projectId, content: content.trim(), author_role: role });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
