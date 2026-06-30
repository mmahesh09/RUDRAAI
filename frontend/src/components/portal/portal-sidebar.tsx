"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, FolderOpen, FileText, User, LogOut, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portal/deliverables", label: "Deliverables", icon: FolderOpen },
  { href: "/portal/profile", label: "Profile", icon: User },
];

export default function PortalSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0D0D10] border-r border-white/[0.06] flex flex-col z-40">
      <div className="p-6 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-heading font-bold text-white text-sm">RudraAI</span>
        </Link>
        <p className="text-[10px] text-[#52525B] mt-1 font-medium uppercase tracking-wider">Client Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/portal" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                active
                  ? "bg-[rgba(255,107,0,0.12)] text-[#FF6B00] border border-[rgba(255,107,0,0.2)]"
                  : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.06]">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs text-[#71717A] truncate">{userEmail}</p>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-[#A1A1AA] hover:text-white hover:bg-white/[0.04] transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
