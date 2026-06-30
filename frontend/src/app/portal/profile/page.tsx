"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    void supabase.auth.getUser().then((res: Awaited<ReturnType<typeof supabase.auth.getUser>>) => setUser(res.data.user));
  }, [supabase]);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setError(error.message);
    else { setMessage("Password updated successfully"); setPassword(""); setConfirmPassword(""); }
    setLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-white">Profile</h1>
        <p className="text-[#A1A1AA] mt-1 text-sm">Manage your account settings.</p>
      </div>

      <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-[rgba(255,107,0,0.15)] border border-[rgba(255,107,0,0.2)] flex items-center justify-center">
            <User className="w-6 h-6 text-[#FF6B00]" />
          </div>
          <div>
            <p className="text-white font-medium">{user?.email}</p>
            <p className="text-[#71717A] text-sm">Client Account</p>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6">
          <h2 className="text-white font-heading font-semibold mb-4">Change Password</h2>
          <form onSubmit={updatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[#A1A1AA] text-sm">New password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[#A1A1AA] text-sm">Confirm password</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat password" />
            </div>
            {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">{error}</p>}
            {message && <p className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2">{message}</p>}
            <Button type="submit" size="sm" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
            </Button>
          </form>
        </div>
      </div>

      <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-white font-heading font-semibold mb-2">Sign out</h2>
        <p className="text-[#71717A] text-sm mb-4">You will be redirected to the login page.</p>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="w-4 h-4" /> Sign out
        </Button>
      </div>
    </div>
  );
}
