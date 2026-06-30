export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ArrowLeft, CheckCircle2, Download, MessageSquare } from "lucide-react";
import ProjectUpdateForm from "@/components/portal/project-update-form";

const STATUS_LABELS: Record<string, string> = {
  audit: "Automation Audit",
  proposal: "Proposal Sent",
  signed: "Contract Signed",
  in_dev: "In Development",
  deployed: "Deployed",
  support: "Ongoing Support",
};

const STATUS_COLORS: Record<string, string> = {
  audit: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  proposal: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  signed: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  in_dev: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  deployed: "text-green-400 bg-green-400/10 border-green-400/20",
  support: "text-teal-400 bg-teal-400/10 border-teal-400/20",
};

const TYPE_ICONS: Record<string, string> = {
  workflow: "⚙️",
  documentation: "📄",
  training: "🎓",
  recording: "🎥",
  other: "📦",
};

const DELIVERABLE_STATUS: Record<string, string> = {
  planned: "text-[#71717A] bg-white/[0.04] border-white/10",
  in_progress: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  completed: "text-green-400 bg-green-400/10 border-green-400/20",
  deployed: "text-teal-400 bg-teal-400/10 border-teal-400/20",
};

const PIPELINE = ["audit", "proposal", "signed", "in_dev", "deployed", "support"];

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: project }, { data: deliverables }, { data: metrics }, { data: updates }] = await Promise.all([
    supabase.from("projects").select("*").eq("id", id).eq("user_id", user.id).single(),
    supabase.from("deliverables").select("*").eq("project_id", id).order("created_at"),
    supabase.from("automation_metrics").select("*").eq("project_id", id),
    supabase.from("project_updates").select("*").eq("project_id", id).order("created_at"),
  ]);

  if (!project) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/portal/dashboard" className="flex items-center gap-2 text-[#A1A1AA] hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">{project.title}</h1>
            <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[project.status]}`}>
              <CheckCircle2 className="w-3 h-3" />
              {STATUS_LABELS[project.status] ?? project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6 mb-6">
        <h2 className="text-white font-heading font-semibold mb-5">Project Pipeline</h2>
        <div className="relative">
          <div className="absolute top-3 left-0 right-0 h-0.5 bg-white/[0.06]" />
          <div
            className="absolute top-3 left-0 h-0.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C00]"
            style={{ width: `${(PIPELINE.indexOf(project.status) / (PIPELINE.length - 1)) * 100}%` }}
          />
          <div className="relative flex justify-between">
            {PIPELINE.map((step, i) => {
              const done = i <= PIPELINE.indexOf(project.status);
              return (
                <div key={step} className="flex flex-col items-center gap-2">
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${done ? "bg-[#FF6B00] border-[#FF6B00]" : "bg-[#09090B] border-white/20"}`}>
                    {done && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <span className={`text-[10px] font-medium text-center leading-tight max-w-[70px] ${done ? "text-white" : "text-[#52525B]"}`}>
                    {STATUS_LABELS[step]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {(project.timeline_start || project.budget_approved) && (
          <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-3 gap-6 text-sm">
            {project.timeline_start && (
              <div>
                <span className="text-[#71717A]">Start date</span>
                <p className="text-white font-medium mt-1">{new Date(project.timeline_start).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            )}
            {project.timeline_end && (
              <div>
                <span className="text-[#71717A]">Est. delivery</span>
                <p className="text-white font-medium mt-1">{new Date(project.timeline_end).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            )}
            {project.budget_approved && (
              <div>
                <span className="text-[#71717A]">Approved budget</span>
                <p className="text-white font-medium mt-1">${Number(project.budget_approved).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Deliverables */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6 mb-6">
        <h2 className="text-white font-heading font-semibold mb-4">Deliverables</h2>
        {!deliverables?.length ? (
          <p className="text-[#52525B] text-sm text-center py-6">No deliverables added yet. They&apos;ll appear here as your project progresses.</p>
        ) : (
          <div className="space-y-3">
            {deliverables.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{TYPE_ICONS[d.type] ?? "📦"}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{d.name}</p>
                    {d.due_date && (
                      <p className="text-[#71717A] text-xs mt-0.5">Due {new Date(d.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${DELIVERABLE_STATUS[d.status]}`}>
                    {d.status.replace("_", " ")}
                  </span>
                  {d.file_url && (
                    <a href={d.file_url} target="_blank" rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20 transition-all">
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ROI Metrics */}
      {metrics && metrics.length > 0 && (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6 mb-6">
          <h2 className="text-white font-heading font-semibold mb-4">Automation Impact</h2>
          <div className="grid grid-cols-2 gap-4">
            {metrics.map((m) => (
              <div key={m.id} className="p-4 bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-xl">
                <p className="text-[#71717A] text-xs uppercase tracking-wider mb-2">{m.metric_name.replace(/_/g, " ")}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-heading font-bold text-white">{m.current_value ?? "—"}</span>
                  <span className="text-[#A1A1AA] text-sm">{m.unit}</span>
                </div>
                {m.baseline_value !== null && m.current_value !== null && (
                  <p className="text-green-400 text-xs mt-1">
                    {m.current_value > m.baseline_value ? "+" : ""}
                    {((m.current_value - m.baseline_value) / m.baseline_value * 100).toFixed(0)}% from baseline
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity feed */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-white font-heading font-semibold mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#FF6B00]" /> Activity & Updates
        </h2>
        {updates && updates.length > 0 && (
          <div className="space-y-4 mb-6">
            {updates.map((u) => (
              <div key={u.id} className="flex gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${u.author_role === "admin" ? "bg-[rgba(255,107,0,0.15)] text-[#FF6B00]" : "bg-white/[0.06] text-[#A1A1AA]"}`}>
                  {u.author_role === "admin" ? "R" : "Y"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">{u.author_role === "admin" ? "RudraAI Team" : "You"}</span>
                    <span className="text-[#52525B] text-xs">{new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed">{u.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <ProjectUpdateForm projectId={id} />
      </div>
    </div>
  );
}
