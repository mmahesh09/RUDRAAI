"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/portal";

  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const supabase = createSupabaseBrowserClient();

  async function handlePasswordLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(next);
      router.refresh();
    }
  }

  async function handleMagicLink(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMagicSent(true);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF8C00] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-white">RudraAI</span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-white">Sign in to your portal</h1>
          <p className="text-[#A1A1AA] mt-2 text-sm">Access your project dashboard and deliverables</p>
        </div>

        <div className="bg-[rgba(255,255,255,0.03)] border border-white/10 rounded-2xl p-8">
          {magicSent ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-[rgba(255,107,0,0.1)] flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-[#FF6B00]" />
              </div>
              <h2 className="text-white font-heading font-semibold text-lg mb-2">Check your inbox</h2>
              <p className="text-[#A1A1AA] text-sm">
                We sent a sign-in link to <strong className="text-white">{email}</strong>. Click it to access your portal.
              </p>
              <button
                onClick={() => { setMagicSent(false); setEmail(""); }}
                className="mt-6 text-sm text-[#FF6B00] hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setMode("password")}
                  className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${mode === "password" ? "bg-[rgba(255,107,0,0.15)] text-[#FF6B00] border border-[rgba(255,107,0,0.3)]" : "text-[#A1A1AA] hover:text-white"}`}
                >
                  Password
                </button>
                <button
                  onClick={() => setMode("magic")}
                  className={`flex-1 py-2 text-sm rounded-lg font-medium transition-all ${mode === "magic" ? "bg-[rgba(255,107,0,0.15)] text-[#FF6B00] border border-[rgba(255,107,0,0.3)]" : "text-[#A1A1AA] hover:text-white"}`}
                >
                  Magic Link
                </button>
              </div>

              <form onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[#A1A1AA] text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                {mode === "password" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-[#A1A1AA] text-sm">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                )}

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
                    {error}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : mode === "magic" ? (
                    <>Send magic link <Mail className="w-4 h-4" /></>
                  ) : (
                    <>Sign in <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-[#A1A1AA] text-sm mt-6">
          Not a client yet?{" "}
          <Link href="/booking" className="text-[#FF6B00] hover:underline">
            Book a free consultation
          </Link>
        </p>
      </div>
    </div>
  );
}
