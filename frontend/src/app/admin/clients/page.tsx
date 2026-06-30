import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  audit: "Audit", proposal: "Proposal", signed: "Signed",
  in_dev: "In Dev", deployed: "Deployed", support: "Support",
};

const STATUS_COLORS: Record<string, string> = {
  audit: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  proposal: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  signed: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  in_dev: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  deployed: "bg-green-400/10 text-green-400 border-green-400/20",
  support: "bg-teal-400/10 text-teal-400 border-teal-400/20",
};

export default async function AdminClients() {
  const supabase = createSupabaseAdminClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Clients</h1>
          <p className="text-[#A1A1AA] mt-1 text-sm">{projects?.length ?? 0} active projects</p>
        </div>
        <Link href="/admin/clients/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white text-sm font-medium shadow-[0_4px_20px_rgba(255,107,0,0.3)]">
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {!projects?.length ? (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-[#A1A1AA] text-sm">No client projects yet. Create one from a booking.</p>
        </div>
      ) : (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Project", "Status", "Timeline", ""].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-[#71717A] text-xs font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-white font-medium text-sm">{p.title}</p>
                    <p className="text-[#71717A] text-xs mt-0.5">Updated {new Date(p.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${STATUS_COLORS[p.status]}`}>
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#71717A] text-xs">
                    {p.timeline_end ? new Date(p.timeline_end).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/clients/${p.id}`} className="flex items-center gap-1 text-[#FF6B00] text-sm hover:underline">
                      Manage <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
