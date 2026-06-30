import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { projectId, metric_name, baseline_value, current_value, unit } = await req.json() as {
    projectId: string; metric_name: string;
    baseline_value?: string; current_value?: string; unit?: string;
  };

  if (!projectId || !metric_name) return NextResponse.json({ error: "projectId and metric_name required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.from("automation_metrics").insert({
    project_id: projectId,
    metric_name,
    baseline_value: baseline_value ? parseFloat(baseline_value) : null,
    current_value: current_value ? parseFloat(current_value) : null,
    unit: unit || null,
    updated_at: new Date().toISOString(),
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
