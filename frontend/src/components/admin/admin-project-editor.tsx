"use client";

import { useState } from "react";
import { Loader2, Plus, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

type Project = {
  id: string; title: string; status: string; budget_approved: number | null;
  timeline_start: string | null; timeline_end: string | null; notes: string | null;
  user_id: string | null;
};
type Deliverable = {
  id: string; name: string; type: string; file_url: string | null;
  status: string; due_date: string | null;
};
type Metric = { id: string; metric_name: string; baseline_value: number | null; current_value: number | null; unit: string | null };
type Update = { id: string; content: string; author_role: string; created_at: string };

const STATUSES = ["audit", "proposal", "signed", "in_dev", "deployed", "support"] as const;
const STATUS_LABELS: Record<string, string> = {
  audit: "Audit", proposal: "Proposal Sent", signed: "Contract Signed",
  in_dev: "In Development", deployed: "Deployed", support: "Ongoing Support",
};

export default function AdminProjectEditor({
  project, deliverables, metrics, updates,
}: {
  project: Project | null;
  deliverables: Deliverable[];
  metrics: Metric[];
  updates: Update[];
}) {
  const router = useRouter();
  const isNew = !project;

  const [form, setForm] = useState({
    title: project?.title ?? "",
    status: project?.status ?? "audit",
    budget: project?.budget_approved?.toString() ?? "",
    start: project?.timeline_start ?? "",
    end: project?.timeline_end ?? "",
    notes: project?.notes ?? "",
    userEmail: "",
  });
  const [saving, setSaving] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [updateContent, setUpdateContent] = useState("");
  const [sendingUpdate, setSendingUpdate] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState({ name: "", type: "workflow", status: "planned", due_date: "" });
  const [addingDel, setAddingDel] = useState(false);
  const [metricForm, setMetricForm] = useState({ metric_name: "", baseline_value: "", current_value: "", unit: "" });
  const [addingMetric, setAddingMetric] = useState(false);
  const [msg, setMsg] = useState("");

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(""), 3000); }

  async function saveProject() {
    setSaving(true);
    const url = isNew ? "/api/admin/projects" : `/api/admin/projects/${project!.id}`;
    const method = isNew ? "POST" : "PATCH";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        status: form.status,
        budget_approved: form.budget ? parseFloat(form.budget) : null,
        timeline_start: form.start || null,
        timeline_end: form.end || null,
        notes: form.notes || null,
        ...(isNew ? { userEmail: form.userEmail } : {}),
      }),
    });
    setSaving(false);
    if (res.ok) {
      flash("Saved!");
      if (isNew) {
        const data = await res.json() as { id?: string };
        if (data.id) router.push(`/admin/clients/${data.id}`);
      } else {
        router.refresh();
      }
    } else flash("Error saving");
  }

  async function sendInvite() {
    if (!inviteEmail || !project) return;
    setInviting(true);
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail, projectId: project.id }),
    });
    setInviting(false);
    if (res.ok) { flash("Invite sent!"); setInviteEmail(""); router.refresh(); }
    else flash("Error sending invite");
  }

  async function postUpdate() {
    if (!updateContent.trim() || !project) return;
    setSendingUpdate(true);
    const res = await fetch("/api/portal/updates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, content: updateContent, authorRole: "admin" }),
    });
    setSendingUpdate(false);
    if (res.ok) { flash("Update posted!"); setUpdateContent(""); router.refresh(); }
    else flash("Error posting update");
  }

  async function addDeliverable() {
    if (!newDeliverable.name || !project) return;
    setAddingDel(true);
    const res = await fetch("/api/admin/deliverables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, ...newDeliverable }),
    });
    setAddingDel(false);
    if (res.ok) { flash("Deliverable added!"); setNewDeliverable({ name: "", type: "workflow", status: "planned", due_date: "" }); router.refresh(); }
    else flash("Error adding deliverable");
  }

  async function addMetric() {
    if (!metricForm.metric_name || !project) return;
    setAddingMetric(true);
    const res = await fetch("/api/admin/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: project.id, ...metricForm }),
    });
    setAddingMetric(false);
    if (res.ok) { flash("Metric added!"); setMetricForm({ metric_name: "", baseline_value: "", current_value: "", unit: "" }); router.refresh(); }
    else flash("Error adding metric");
  }

  return (
    <div className="space-y-6">
      {msg && <div className="px-4 py-2.5 rounded-xl bg-green-400/10 border border-green-400/20 text-green-400 text-sm">{msg}</div>}

      {/* Project details */}
      <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-white font-heading font-semibold mb-4">Project Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <Label className="text-[#A1A1AA] text-sm">Project Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Lead Capture Automation — Acme Corp" />
          </div>
          {isNew && (
            <div className="col-span-2 space-y-1.5">
              <Label className="text-[#A1A1AA] text-sm">Client Email (creates portal account)</Label>
              <Input value={form.userEmail} onChange={(e) => setForm({ ...form, userEmail: e.target.value })} placeholder="client@company.com" type="email" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label className="text-[#A1A1AA] text-sm">Status</Label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full h-11 rounded-xl bg-[rgba(255,255,255,0.05)] border border-white/10 px-4 text-sm text-white focus:outline-none focus:border-[rgba(255,107,0,0.5)]"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#A1A1AA] text-sm">Budget (USD)</Label>
            <Input value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder="5000" type="number" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#A1A1AA] text-sm">Start date</Label>
            <Input value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} type="date" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[#A1A1AA] text-sm">Est. delivery</Label>
            <Input value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} type="date" />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label className="text-[#A1A1AA] text-sm">Internal notes</Label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Internal notes (not visible to client)"
              rows={3}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#52525B] resize-none focus:outline-none focus:border-[rgba(255,107,0,0.4)] transition-colors"
            />
          </div>
        </div>
        <Button onClick={saveProject} disabled={saving} className="mt-4">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isNew ? "Create Project" : "Save Changes"}
        </Button>
      </div>

      {/* Invite client */}
      {project && !project.user_id && (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white font-heading font-semibold mb-1">Invite Client</h2>
          <p className="text-[#71717A] text-sm mb-4">Send a magic link to give the client access to their portal.</p>
          <div className="flex gap-3">
            <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="client@company.com" type="email" className="flex-1" />
            <Button onClick={sendInvite} disabled={inviting || !inviteEmail}>
              {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Invite"}
            </Button>
          </div>
        </div>
      )}

      {/* Deliverables */}
      {project && (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white font-heading font-semibold mb-4">Deliverables</h2>
          {deliverables.length > 0 && (
            <div className="space-y-2 mb-4">
              {deliverables.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-xl text-sm">
                  <div>
                    <span className="text-white font-medium">{d.name}</span>
                    <span className="text-[#71717A] ml-2">{d.type}</span>
                  </div>
                  <span className="text-[#A1A1AA]">{d.status}</span>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Input value={newDeliverable.name} onChange={(e) => setNewDeliverable({ ...newDeliverable, name: e.target.value })} placeholder="Deliverable name" />
            <select
              value={newDeliverable.type}
              onChange={(e) => setNewDeliverable({ ...newDeliverable, type: e.target.value })}
              className="h-11 rounded-xl bg-[rgba(255,255,255,0.05)] border border-white/10 px-4 text-sm text-white focus:outline-none"
            >
              {["workflow", "documentation", "training", "recording", "other"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select
              value={newDeliverable.status}
              onChange={(e) => setNewDeliverable({ ...newDeliverable, status: e.target.value })}
              className="h-11 rounded-xl bg-[rgba(255,255,255,0.05)] border border-white/10 px-4 text-sm text-white focus:outline-none"
            >
              {["planned", "in_progress", "completed", "deployed"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Input value={newDeliverable.due_date} onChange={(e) => setNewDeliverable({ ...newDeliverable, due_date: e.target.value })} type="date" />
          </div>
          <Button size="sm" className="mt-3" onClick={addDeliverable} disabled={addingDel || !newDeliverable.name}>
            {addingDel ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Plus className="w-3.5 h-3.5" /> Add Deliverable</>}
          </Button>
        </div>
      )}

      {/* Metrics */}
      {project && (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white font-heading font-semibold mb-4">ROI Metrics</h2>
          {metrics.length > 0 && (
            <div className="space-y-2 mb-4">
              {metrics.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-xl text-sm">
                  <span className="text-white">{m.metric_name}</span>
                  <span className="text-[#A1A1AA]">{m.current_value} {m.unit}</span>
                </div>
              ))}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Input value={metricForm.metric_name} onChange={(e) => setMetricForm({ ...metricForm, metric_name: e.target.value })} placeholder="hours_saved_per_week" />
            <Input value={metricForm.unit} onChange={(e) => setMetricForm({ ...metricForm, unit: e.target.value })} placeholder="Unit (hours, %, $)" />
            <Input value={metricForm.baseline_value} onChange={(e) => setMetricForm({ ...metricForm, baseline_value: e.target.value })} placeholder="Baseline value" type="number" />
            <Input value={metricForm.current_value} onChange={(e) => setMetricForm({ ...metricForm, current_value: e.target.value })} placeholder="Current value" type="number" />
          </div>
          <Button size="sm" className="mt-3" onClick={addMetric} disabled={addingMetric || !metricForm.metric_name}>
            {addingMetric ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Plus className="w-3.5 h-3.5" /> Add Metric</>}
          </Button>
        </div>
      )}

      {/* Activity feed */}
      {project && (
        <div className="bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-white font-heading font-semibold mb-4">Activity Feed</h2>
          {updates.length > 0 && (
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {updates.map((u) => (
                <div key={u.id} className="flex gap-3 p-3 bg-[rgba(255,255,255,0.02)] border border-white/[0.06] rounded-xl">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${u.author_role === "admin" ? "bg-[rgba(255,107,0,0.15)] text-[#FF6B00]" : "bg-white/[0.06] text-[#A1A1AA]"}`}>
                    {u.author_role === "admin" ? "R" : "C"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white text-xs font-medium">{u.author_role === "admin" ? "You" : "Client"}</span>
                      <span className="text-[#52525B] text-[10px]">{new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p className="text-[#A1A1AA] text-sm">{u.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <textarea
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
              placeholder="Post an update visible to the client..."
              rows={2}
              className="flex-1 bg-[rgba(255,255,255,0.04)] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-[#52525B] resize-none focus:outline-none focus:border-[rgba(255,107,0,0.4)] transition-colors"
            />
            <Button size="icon" onClick={postUpdate} disabled={sendingUpdate || !updateContent.trim()}>
              {sendingUpdate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
