export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminProjectEditor from "@/components/admin/admin-project-editor";

export default async function AdminClientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === "new") {
    return (
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/clients" className="flex items-center gap-2 text-[#A1A1AA] hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Link>
        <h1 className="text-2xl font-heading font-bold text-white mb-6">New Project</h1>
        <AdminProjectEditor project={null} deliverables={[]} metrics={[]} updates={[]} />
      </div>
    );
  }

  const supabase = createSupabaseAdminClient();
  const [{ data: project }, { data: deliverables }, { data: metrics }, { data: updates }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).single(),
    supabase.from("deliverables").select("*").eq("project_id", id).order("created_at"),
    supabase.from("automation_metrics").select("*").eq("project_id", id),
    supabase.from("project_updates").select("*").eq("project_id", id).order("created_at"),
  ]);

  if (!project) notFound();

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/admin/clients" className="flex items-center gap-2 text-[#A1A1AA] hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </Link>
      <h1 className="text-2xl font-heading font-bold text-white mb-6">{project.title}</h1>
      <AdminProjectEditor
        project={project}
        deliverables={deliverables ?? []}
        metrics={metrics ?? []}
        updates={updates ?? []}
      />
    </div>
  );
}
