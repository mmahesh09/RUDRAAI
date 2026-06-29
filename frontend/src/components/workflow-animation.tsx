"use client";

import { motion } from "framer-motion";
import { Zap, Globe, Code2, BookOpen, Hash } from "lucide-react";
import type { ElementType } from "react";

// Real nodes from n8n/workflows/02-lead-qualification.json
type N8nNode = {
  id: string;
  name: string;
  type: string;
  Icon: ElementType;
  iconBg: string;
  status: "success" | "running" | "idle";
};

const NODES: N8nNode[] = [
  { id: "webhook",     name: "Webhook",             type: "Trigger",        Icon: Zap,      iconBg: "#FF6B00", status: "success" },
  { id: "http",        name: "Score Lead",           type: "HTTP Request",   Icon: Globe,    iconBg: "#3B82F6", status: "success" },
  { id: "code",        name: "Parse Score",          type: "Code",           Icon: Code2,    iconBg: "#8B5CF6", status: "success" },
  { id: "notion",      name: "Add to Notion CRM",    type: "Notion",         Icon: BookOpen, iconBg: "#1A1A1A", status: "success" },
  { id: "slack",       name: "Notify Slack",         type: "HTTP Request",   Icon: Hash,     iconBg: "#E01E5A", status: "success" },
];

const NODE_W = 158;
const NODE_H = 62;
const GAP_X  = 54;
const PAD_X  = 24;
const PAD_Y  = 28;
const TOTAL_W = PAD_X * 2 + NODES.length * NODE_W + (NODES.length - 1) * GAP_X;
const TOTAL_H = PAD_Y * 2 + NODE_H;

// Connection line between two adjacent nodes
function connX(i: number, side: "right" | "left") {
  const nodeX = PAD_X + i * (NODE_W + GAP_X);
  return side === "right" ? nodeX + NODE_W : nodeX;
}
const MID_Y = PAD_Y + NODE_H / 2;

const STATUS_COLORS = {
  success: "#10B981",
  running: "#F59E0B",
  idle:    "#71717A",
};

export default function WorkflowAnimation() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative w-full max-w-[780px] rounded-2xl border border-white/10 overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        style={{ background: "#1a1a1a" }}
      >
        {/* ── Window chrome ─────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[.07]"
          style={{ background: "#141414" }}>
          <div className="flex gap-1.5 flex-shrink-0">
            {["#ff5f57", "#febc2e", "#28c840"].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <div className="flex-1 flex items-center gap-2 justify-center">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md" style={{ background: "rgba(255,255,255,0.05)" }}>
              {/* n8n logo */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#FF6D5A"/>
                <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" fill="white"/>
              </svg>
              <span className="text-[10px] font-mono text-[#a1a1aa]">02 — Lead Qualification Agent</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-green-400 flex-shrink-0"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", fontSize: "9px", fontFamily: "monospace" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Active
          </div>
        </div>

        {/* ── Canvas ────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden" style={{ background: "#1a1a1a" }}>
          {/* Dot grid — matches n8n's actual canvas */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.35 }}
          >
            <defs>
              <pattern id="n8n-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.8" fill="#555" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#n8n-dots)" />
          </svg>

          {/* Main workflow SVG */}
          <svg
            viewBox={`0 0 ${TOTAL_W} ${TOTAL_H}`}
            className="w-full relative z-10"
            style={{ height: "auto", display: "block" }}
          >
            {/* ── Connection lines ───────────────────────────────── */}
            {NODES.slice(0, -1).map((_, i) => {
              const x1 = connX(i, "right");
              const x2 = connX(i + 1, "left");
              const cx1 = x1 + (x2 - x1) * 0.45;
              const cx2 = x2 - (x2 - x1) * 0.45;
              const d = `M${x1} ${MID_Y} C${cx1} ${MID_Y} ${cx2} ${MID_Y} ${x2} ${MID_Y}`;
              return (
                <g key={i}>
                  {/* Connection arrow line */}
                  <path d={d} fill="none" stroke="#444" strokeWidth="2" />
                  {/* Arrow head */}
                  <polygon
                    points={`${x2},${MID_Y} ${x2 - 7},${MID_Y - 4} ${x2 - 7},${MID_Y + 4}`}
                    fill="#444"
                  />
                  {/* Output handle (right side of source node) */}
                  <circle cx={x1} cy={MID_Y} r="5" fill="#1a1a1a" stroke="#666" strokeWidth="1.5" />
                  <circle cx={x1} cy={MID_Y} r="2.5" fill="#666" />
                  {/* Input handle (left side of target node) */}
                  <circle cx={x2} cy={MID_Y} r="5" fill="#1a1a1a" stroke="#666" strokeWidth="1.5" />
                  <circle cx={x2} cy={MID_Y} r="2.5" fill="#666" />
                </g>
              );
            })}

            {/* ── Nodes ──────────────────────────────────────────── */}
            {NODES.map((node, i) => {
              const x = PAD_X + i * (NODE_W + GAP_X);
              const y = PAD_Y;
              const Icon = node.Icon;
              const statusColor = STATUS_COLORS[node.status];

              return (
                <g key={node.id}>
                  {/* Node card shadow */}
                  <rect x={x + 2} y={y + 3} width={NODE_W} height={NODE_H} rx="8"
                    fill="rgba(0,0,0,0.45)" />

                  {/* Node card body */}
                  <rect x={x} y={y} width={NODE_W} height={NODE_H} rx="8"
                    fill="#2a2a2a" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                  {/* Colored icon area (left portion) */}
                  <rect x={x} y={y} width={50} height={NODE_H} rx="8" fill={node.iconBg} fillOpacity="0.2" />
                  <rect x={x + 42} y={y} width={8} height={NODE_H} fill={node.iconBg} fillOpacity="0.1" />
                  {/* Icon background circle */}
                  <circle cx={x + 25} cy={y + NODE_H / 2} r="16"
                    fill={node.iconBg} fillOpacity="0.25" />

                  {/* Status dot */}
                  <circle cx={x + NODE_W - 10} cy={y + 10} r="4" fill={statusColor} />

                  {/* Execution count badge */}
                  <rect x={x + NODE_W - 38} y={y + 4} width={22} height={12} rx="4"
                    fill="rgba(255,255,255,0.07)" />
                  <text x={x + NODE_W - 27} y={y + 12}
                    fontSize="7" fill="#888" textAnchor="middle" fontFamily="monospace">
                    {(i + 1) * 231}
                  </text>

                  {/* Icon — rendered as foreignObject */}
                  <foreignObject x={x + 9} y={y + NODE_H / 2 - 10} width="32" height="20">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={16} color={node.iconBg === "#1A1A1A" ? "#ccc" : node.iconBg} strokeWidth={2} />
                    </div>
                  </foreignObject>

                  {/* Node name */}
                  <text x={x + 56} y={y + 26}
                    fontSize="10" fontWeight="600" fill="rgba(255,255,255,0.88)"
                    fontFamily="DM Sans, sans-serif" dominantBaseline="middle">
                    {node.name.length > 14 ? node.name.slice(0, 13) + "…" : node.name}
                  </text>

                  {/* Node type */}
                  <text x={x + 56} y={y + 41}
                    fontSize="8.5" fill="#666"
                    fontFamily="DM Sans, sans-serif" dominantBaseline="middle">
                    {node.type}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* ── Execution stats bar ────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-2 border-t border-white/[.05]"
          style={{ background: "#111" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] font-mono text-[#71717A]">Last run: 2 min ago</span>
          </div>
          <div className="flex gap-5">
            {[
              { label: "Executions", value: "1,247", color: "#FF6B00" },
              { label: "Success",    value: "100%",  color: "#10B981" },
              { label: "Avg time",   value: "0.8s",  color: "#8B5CF6" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5">
                <span style={{ fontSize: "11px", fontWeight: 700, color: s.color, fontFamily: "DM Sans,sans-serif" }}>
                  {s.value}
                </span>
                <span style={{ fontSize: "9px", color: "#555", fontFamily: "DM Sans,sans-serif" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating badges */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.45 }}
        className="absolute -top-3 -right-2 glass border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs font-body text-white">Lead qualified ✓</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.45 }}
        className="absolute -bottom-3 -left-2 glass border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2"
      >
        <Zap className="w-3.5 h-3.5 text-[#FF6B00]" />
        <span className="text-xs font-body text-white">3–7 day deploy</span>
      </motion.div>
    </div>
  );
}
