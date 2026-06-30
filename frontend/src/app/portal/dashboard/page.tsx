export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ArrowRight, Clock, CheckCircle2, Package, TrendingUp, AlertCircle } from "lucide-react";

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

const PIPELINE = ["audit", "proposal", "signed", "in_dev", "deployed", "support"];

export default async function PortalDashboard() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: projects }, { data: deliverables }] = await Promise.all([
    supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("deliverables").select("*, projects!inner(user_id)").eq("projects.user_id", user.id),
  ]);

  const activeProject = projects?.[0] ?? null;
  const completedDeliverables = deliverables?.filter((d) => d.status === "completed" || d.status === "deployed").length ?? 0;
  const totalDeliverables = deliverables?.length ?? 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white">Welcome back</h1>
        <p className="text-[#A1A1AA] mt-1 text-sm">Here&apos;s an overview of your automation project.</p>
      </div>

      {!activeProject ? (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/10 rounded-2xl p-12 text-center">
          <AlertCircle className="w-10 h-10 text-[#52525B] mx-auto mb-4" />
          <h2 className="text-white font-heading font-semibold mb-2">No active project yet</h2>
          <p className="text-[#A1A1AA] text-sm mb-6">Your project will appear here once your audit call is complete.</p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white text-sm font-medium"
          >
            Book your audit <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Project Status", value: STATUS_LABELS[activeProject.status] ?? activeProject.status, icon: Clock, color: "text-[#FF6B00]" },
              { label: "Deliverables Done", value: `${completedDeliverables} / ${totalDeliverables}`, icon: Package, color: "text-green-400" },
              { label: "Active Projects", value: projects?.length ?? 0, icon: TrendingUp, color: "text-blue-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#71717A] text-xs font-medium uppercase tracking-wider">{label}</span>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-white font-heading font-bold text-xl">{value}</p>
              </div>
            ))}
          </div>

          {/* Active project card */}
          <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white font-heading font-semibold text-lg">{activeProject.title}</h2>
                <span className={`inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[activeProject.status]}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  {STATUS_LABELS[activeProject.status] ?? activeProject.status}
                </span>
              </div>
              <Link
                href={`/portal/project/${activeProject.id}`}
                className="flex items-center gap-1.5 text-[#FF6B00] text-sm font-medium hover:underline"
              >
                View details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Pipeline stepper */}
            <div className="relative">
              <div className="absolute top-3 left-0 right-0 h-0.5 bg-white/[0.06]" />
              <div
                className="absolute top-3 left-0 h-0.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] transition-all duration-500"
                style={{ width: `${(PIPELINE.indexOf(activeProject.status) / (PIPELINE.length - 1)) * 100}%` }}
              />
              <div className="relative flex justify-between">
                {PIPELINE.map((step, i) => {
                  const currentIdx = PIPELINE.indexOf(activeProject.status);
                  const done = i <= currentIdx;
                  return (
                    <div key={step} className="flex flex-col items-center gap-2">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${done ? "bg-[#FF6B00] border-[#FF6B00]" : "bg-[#09090B] border-white/20"}`}>
                        {done && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`text-[10px] font-medium text-center leading-tight max-w-[60px] ${done ? "text-white" : "text-[#52525B]"}`}>
                        {STATUS_LABELS[step].split(" ").slice(0, 2).join(" ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {activeProject.timeline_start && activeProject.timeline_end && (
              <div className="mt-6 pt-4 border-t border-white/[0.06] flex gap-8 text-sm">
                <div>
                  <span className="text-[#71717A]">Start</span>
                  <p className="text-white font-medium mt-0.5">{new Date(activeProject.timeline_start).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div>
                  <span className="text-[#71717A]">Est. Delivery</span>
                  <p className="text-white font-medium mt-0.5">{new Date(activeProject.timeline_end).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                {activeProject.budget_approved && (
                  <div>
                    <span className="text-[#71717A]">Budget</span>
                    <p className="text-white font-medium mt-0.5">${Number(activeProject.budget_approved).toLocaleString()}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Other projects */}
          {(projects?.length ?? 0) > 1 && (
            <div>
              <h3 className="text-sm font-medium text-[#71717A] uppercase tracking-wider mb-3">All Projects</h3>
              <div className="space-y-2">
                {projects!.slice(1).map((p) => (
                  <Link
                    key={p.id}
                    href={`/portal/project/${p.id}`}
                    className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-xl hover:border-white/15 transition-all"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{p.title}</p>
                      <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_COLORS[p.status]}`}>
                        {STATUS_LABELS[p.status]}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#52525B]" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
