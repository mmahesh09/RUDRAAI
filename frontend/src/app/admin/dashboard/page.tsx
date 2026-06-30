import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import { Users, FolderOpen, CalendarCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  audit: "Audit",
  proposal: "Proposal",
  signed: "Signed",
  in_dev: "In Dev",
  deployed: "Deployed",
  support: "Support",
};

const STATUS_COLORS: Record<string, string> = {
  audit: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
  proposal: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  signed: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  in_dev: "bg-orange-400/10 text-orange-400 border-orange-400/20",
  deployed: "bg-green-400/10 text-green-400 border-green-400/20",
  support: "bg-teal-400/10 text-teal-400 border-teal-400/20",
};

export default async function AdminDashboard() {
  const supabase = createSupabaseAdminClient();

  const [
    { count: projectCount },
    { count: bookingCount },
    { data: recentProjects },
    { data: recentBookings },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*").order("updated_at", { ascending: false }).limit(5),
    supabase.from("bookings").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const deployedCount = recentProjects?.filter((p) => p.status === "deployed" || p.status === "support").length ?? 0;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white">Admin Overview</h1>
        <p className="text-[#A1A1AA] mt-1 text-sm">Monitor all clients and projects.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Projects", value: projectCount ?? 0, icon: FolderOpen, color: "text-[#FF6B00]" },
          { label: "Bookings", value: bookingCount ?? 0, icon: CalendarCheck, color: "text-green-400" },
          { label: "Deployed", value: deployedCount, icon: TrendingUp, color: "text-teal-400" },
          { label: "In Progress", value: (recentProjects?.filter((p) => p.status === "in_dev").length ?? 0), icon: Users, color: "text-blue-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#71717A] text-xs font-medium uppercase tracking-wider">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-white font-heading font-bold text-2xl">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-heading font-semibold">Recent Projects</h2>
            <Link href="/admin/clients" className="text-[#FF6B00] text-sm hover:underline">View all</Link>
          </div>
          {!recentProjects?.length ? (
            <p className="text-[#52525B] text-sm text-center py-4">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((p) => (
                <Link key={p.id} href={`/admin/clients/${p.id}`}
                  className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-xl hover:border-white/15 transition-all">
                  <div>
                    <p className="text-white text-sm font-medium">{p.title}</p>
                    <p className="text-[#71717A] text-xs mt-0.5">Updated {new Date(p.updated_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${STATUS_COLORS[p.status]}`}>
                    {STATUS_LABELS[p.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-heading font-semibold">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-[#FF6B00] text-sm hover:underline">View all</Link>
          </div>
          {!recentBookings?.length ? (
            <p className="text-[#52525B] text-sm text-center py-4">No bookings yet</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-xl">
                  <div>
                    <p className="text-white text-sm font-medium">{b.name}</p>
                    <p className="text-[#71717A] text-xs mt-0.5">{b.email} · {b.time_slot}</p>
                  </div>
                  <Link href="/admin/bookings" className="text-[#FF6B00] text-xs hover:underline">View</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
