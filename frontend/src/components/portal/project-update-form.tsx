"use client";

import { useState, FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectUpdateForm({ projectId }: { projectId: string }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/portal/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, content: content.trim() }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setContent("");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch {
      setError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ask a question or leave a note for your project team..."
        rows={3}
        className="w-full bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#52525B] resize-none focus:outline-none focus:border-[rgba(255,107,0,0.4)] transition-colors"
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {sent && <p className="text-green-400 text-xs">Message sent!</p>}
      <Button type="submit" size="sm" disabled={loading || !content.trim()}>
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Send className="w-3.5 h-3.5" /> Send message</>}
      </Button>
    </form>
  );
}
