export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Download, FolderOpen } from "lucide-react";

const TYPE_ICONS: Record<string, string> = {
  workflow: "⚙️",
  documentation: "📄",
  training: "🎓",
  recording: "🎥",
  other: "📦",
};

const STATUS_COLORS: Record<string, string> = {
  planned: "text-[#71717A] bg-white/[0.04] border-white/10",
  in_progress: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  completed: "text-green-400 bg-green-400/10 border-green-400/20",
  deployed: "text-teal-400 bg-teal-400/10 border-teal-400/20",
};

export default async function DeliverablesPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: deliverables } = await supabase
    .from("deliverables")
    .select("*, projects!inner(title, user_id)")
    .eq("projects.user_id", user.id)
    .order("created_at", { ascending: false });

  const downloadable = deliverables?.filter((d) => d.file_url) ?? [];
  const allItems = deliverables ?? [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white">Deliverables</h1>
        <p className="text-[#A1A1AA] mt-1 text-sm">All files and assets across your automation projects.</p>
      </div>

      {!allItems.length ? (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/10 rounded-2xl p-12 text-center">
          <FolderOpen className="w-10 h-10 text-[#52525B] mx-auto mb-4" />
          <h2 className="text-white font-heading font-semibold mb-2">No deliverables yet</h2>
          <p className="text-[#A1A1AA] text-sm">Your workflows, documentation, and training materials will appear here.</p>
        </div>
      ) : (
        <>
          {downloadable.length > 0 && (
            <div className="mb-2 text-sm text-[#71717A]">
              {downloadable.length} file{downloadable.length !== 1 ? "s" : ""} available to download
            </div>
          )}
          <div className="space-y-3">
            {allItems.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-5 bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.04)] border border-white/[0.06] flex items-center justify-center text-xl">
                    {TYPE_ICONS[d.type] ?? "📦"}
                  </div>
                  <div>
                    <p className="text-white font-medium">{d.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#71717A] text-xs">{(d.projects as { title: string }).title}</span>
                      {d.due_date && (
                        <>
                          <span className="text-[#3F3F46]">·</span>
                          <span className="text-[#71717A] text-xs">Due {new Date(d.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${STATUS_COLORS[d.status]}`}>
                    {d.status.replace("_", " ")}
                  </span>
                  {d.file_url ? (
                    <a href={d.file_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-[#A1A1AA] hover:text-white hover:border-white/20 text-xs font-medium transition-all">
                      <Download className="w-3 h-3" /> Download
                    </a>
                  ) : (
                    <span className="text-[#3F3F46] text-xs px-3 py-1.5">Not ready yet</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
