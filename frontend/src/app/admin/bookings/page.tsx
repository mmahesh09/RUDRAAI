import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminBookings() {
  const supabase = createSupabaseAdminClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white">Bookings</h1>
          <p className="text-[#A1A1AA] mt-1 text-sm">{bookings?.length ?? 0} total bookings</p>
        </div>
        <Link href="/admin/clients/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white text-sm font-medium shadow-[0_4px_20px_rgba(255,107,0,0.3)]">
          <Plus className="w-4 h-4" /> Create Project
        </Link>
      </div>

      {!bookings?.length ? (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/10 rounded-2xl p-12 text-center">
          <p className="text-[#A1A1AA] text-sm">No bookings yet.</p>
        </div>
      ) : (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Name", "Email", "Company", "Time Slot", "Goal", "Date", ""].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-[#71717A] text-xs font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4 text-white text-sm font-medium">{b.name}</td>
                  <td className="px-5 py-4 text-[#A1A1AA] text-sm">{b.email}</td>
                  <td className="px-5 py-4 text-[#A1A1AA] text-sm">{b.company || "—"}</td>
                  <td className="px-5 py-4 text-[#A1A1AA] text-sm whitespace-nowrap">{b.time_slot}</td>
                  <td className="px-5 py-4 text-[#71717A] text-sm max-w-[200px] truncate">{b.goal}</td>
                  <td className="px-5 py-4 text-[#71717A] text-xs whitespace-nowrap">
                    {new Date(b.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/clients/new?email=${encodeURIComponent(b.email)}&company=${encodeURIComponent(b.company ?? "")}&bookingId=${b.id}`}
                      className="text-[#FF6B00] text-xs hover:underline whitespace-nowrap"
                    >
                      + Project
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
