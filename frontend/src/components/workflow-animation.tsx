"use client";

import { motion } from "framer-motion";
import { Zap, Bot, Sparkles, Mail, Hash, Database, Globe } from "lucide-react";
import type { ElementType } from "react";

/* ─── Canvas constants ────────────────────────────────────────── */
const W   = 620;
const H   = 370;
const NW  = 128; // node width
const NH  = 52;  // node height

/* ─── Data ────────────────────────────────────────────────────── */
type NodeDef = {
  id: string; x: number; y: number;
  label: string; sub: string;
  Icon: ElementType; color: string; delay: number;
};
type EdgeDef = { from: string; to: string; color: string; delay: number };

const NODES: NodeDef[] = [
  { id:"trigger", x:8,   y:148, label:"Webhook",  sub:"Trigger",   Icon:Zap,      color:"#FF6B00", delay:0    },
  { id:"agent",   x:180, y:74,  label:"AI Agent", sub:"n8n Agent", Icon:Bot,      color:"#8B5CF6", delay:0.18 },
  { id:"openai",  x:350, y:18,  label:"GPT-4o",   sub:"OpenAI",    Icon:Sparkles, color:"#10A37F", delay:0.32 },
  { id:"gmail",   x:350, y:140, label:"Gmail",    sub:"Email",     Icon:Mail,     color:"#EA4335", delay:0.42 },
  { id:"slack",   x:350, y:262, label:"Slack",    sub:"Notify",    Icon:Hash,     color:"#E01E5A", delay:0.52 },
  { id:"crm",     x:486, y:88,  label:"HubSpot",  sub:"CRM",       Icon:Globe,    color:"#FF7A59", delay:0.66 },
  { id:"db",      x:486, y:230, label:"Database", sub:"Storage",   Icon:Database, color:"#3B82F6", delay:0.80 },
];

const EDGES: EdgeDef[] = [
  { from:"trigger", to:"agent",  color:"#FF6B00", delay:0.08 },
  { from:"agent",   to:"openai", color:"#8B5CF6", delay:0.26 },
  { from:"agent",   to:"gmail",  color:"#8B5CF6", delay:0.36 },
  { from:"agent",   to:"slack",  color:"#8B5CF6", delay:0.46 },
  { from:"openai",  to:"crm",    color:"#10A37F", delay:0.56 },
  { from:"gmail",   to:"crm",    color:"#EA4335", delay:0.66 },
  { from:"slack",   to:"db",     color:"#E01E5A", delay:0.76 },
];

/* ─── Helpers ────────────────────────────────────────────────── */
function node(id: string) { return NODES.find(n => n.id === id)!; }

function bezier(a: NodeDef, b: NodeDef) {
  const x1 = a.x + NW, y1 = a.y + NH / 2;
  const x2 = b.x,      y2 = b.y + NH / 2;
  const dx = (x2 - x1) * 0.5;
  return `M${x1} ${y1} C${x1+dx} ${y1} ${x2-dx} ${y2} ${x2} ${y2}`;
}

/* ─── Inline SVG styles ──────────────────────────────────────── */
const SVG_CSS = `
  @keyframes wf-draw  { to { stroke-dashoffset: 0 } }
  @keyframes wf-in    { to { opacity: 1 } }
  @keyframes wf-blink { 0%,100%{opacity:.5} 50%{opacity:1} }
  ${EDGES.map((e,i)=>`
    .we${i}{ stroke-dasharray:700; stroke-dashoffset:700;
             animation: wf-draw .75s ${e.delay}s ease forwards }
  `).join("")}
  ${NODES.map((n,i)=>`
    .wn${i}{ opacity:0; animation: wf-in .35s ${n.delay+.05}s ease forwards }
    .ws${i}{ animation: wf-blink 2.2s ${n.delay+.4}s ease-in-out infinite }
  `).join("")}
`;

/* ─── Component ──────────────────────────────────────────────── */
export default function WorkflowAnimation() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="relative w-full max-w-[640px] rounded-3xl border border-white/10 shadow-glass overflow-hidden"
        style={{ background: "#08080F" }}
      >

        {/* ── Window chrome ───────────────────────────────────── */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[.06]"
          style={{ background: "rgba(255,255,255,0.025)" }}
        >
          {/* Traffic lights */}
          <div className="flex gap-1.5 flex-shrink-0">
            {["#ff5f57","#febc2e","#28c840"].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>

          {/* Tab */}
          <div className="flex-1 flex justify-center">
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-md"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <Zap className="w-2.5 h-2.5 text-[#FF6B00]" />
              <span className="text-[10px] font-mono text-[#6b7280]">lead-qualification.json</span>
            </div>
          </div>

          {/* Status */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-green-400 flex-shrink-0"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.25)",
              fontSize: "10px",
              fontFamily: "monospace",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
            />
            Active
          </div>
        </div>

        {/* ── SVG canvas ──────────────────────────────────────── */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: "auto", display: "block" }}
        >
          <defs>
            {/* Glow filter */}
            <filter id="wf-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Subtle canvas grid */}
            <pattern id="wf-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path
                d="M 28 0 L 0 0 0 28"
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth=".5"
              />
            </pattern>

            {/* Per-node radial glow gradients */}
            {NODES.map(n => (
              <radialGradient key={n.id} id={`wf-rg-${n.id}`} cx="30%" cy="50%" r="70%">
                <stop offset="0%"   stopColor={n.color} stopOpacity=".12" />
                <stop offset="100%" stopColor={n.color} stopOpacity="0"   />
              </radialGradient>
            ))}

            <style>{SVG_CSS}</style>
          </defs>

          {/* Grid background */}
          <rect width={W} height={H} fill="url(#wf-grid)" />

          {/* ── Edges ─────────────────────────────────────────── */}
          {EDGES.map((edge, i) => {
            const a   = node(edge.from);
            const b   = node(edge.to);
            const d   = bezier(a, b);
            return (
              <g key={i}>
                {/* Dashed track */}
                <path
                  d={d} fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="1.5" strokeDasharray="5 6"
                />
                {/* Animated draw stroke */}
                <path
                  d={d} fill="none"
                  stroke={edge.color} strokeWidth="1.5" strokeOpacity=".55"
                  className={`we${i}`}
                />
                {/* 3 staggered data packets per edge */}
                {[0, 0.82, 1.64].map((offset, j) => (
                  <circle key={j} r="3.5" fill={edge.color} filter="url(#wf-glow)">
                    <animate
                      attributeName="opacity"
                      values="0;0;1;1;0"
                      keyTimes="0;0.05;0.18;0.85;1"
                      dur="2.6s"
                      begin={`${edge.delay + 0.8 + offset}s`}
                      repeatCount="indefinite"
                    />
                    <animateMotion
                      dur="2.6s"
                      begin={`${edge.delay + 0.8 + offset}s`}
                      repeatCount="indefinite"
                      path={d}
                    />
                  </circle>
                ))}
              </g>
            );
          })}

          {/* ── Nodes ─────────────────────────────────────────── */}
          {NODES.map((n, i) => {
            const Icon = n.Icon;
            return (
              <g key={n.id} className={`wn${i}`}>
                {/* Ambient glow halo */}
                <rect
                  x={n.x - 10} y={n.y - 10}
                  width={NW + 20} height={NH + 20}
                  rx="16"
                  fill={`url(#wf-rg-${n.id})`}
                />

                {/* Card background */}
                <rect
                  x={n.x} y={n.y} width={NW} height={NH}
                  rx="10"
                  fill="#111119"
                  stroke={n.color} strokeWidth=".85" strokeOpacity=".32"
                />
                {/* Top edge highlight */}
                <rect
                  x={n.x + 1} y={n.y} width={NW - 2} height="1"
                  rx="1"
                  fill="rgba(255,255,255,0.06)"
                />

                {/* Icon badge */}
                <rect
                  x={n.x + 8} y={n.y + 8}
                  width="36" height="36"
                  rx="8"
                  fill={n.color} fillOpacity=".18"
                  stroke={n.color} strokeWidth=".7" strokeOpacity=".4"
                />

                {/* Left port handle */}
                <circle
                  cx={n.x} cy={n.y + NH / 2} r="4"
                  fill="#0c0c18"
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1"
                />
                {/* Right port handle */}
                <circle
                  cx={n.x + NW} cy={n.y + NH / 2} r="4"
                  fill="#0c0c18"
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1"
                />

                {/* Status indicator */}
                <circle
                  cx={n.x + NW - 11} cy={n.y + 11} r="3.2"
                  fill="#10B981"
                  className={`ws${i}`}
                />

                {/* Text labels */}
                <text
                  x={n.x + 52} y={n.y + 21}
                  fontSize="10.5" fontWeight="600"
                  fill="rgba(255,255,255,0.9)"
                  fontFamily="DM Sans, sans-serif"
                  dominantBaseline="middle"
                >
                  {n.label}
                </text>
                <text
                  x={n.x + 52} y={n.y + 36}
                  fontSize="8.5"
                  fill="rgba(113,113,122,0.85)"
                  fontFamily="DM Sans, sans-serif"
                  dominantBaseline="middle"
                >
                  {n.sub}
                </text>

                {/* Lucide icon via foreignObject */}
                <foreignObject x={n.x + 8} y={n.y + 8} width="36" height="36">
                  {/* biome-ignore lint: xmlns required for SVG foreignObject */}
                  <div
                    style={{
                      width: "36px", height: "36px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Icon
                      size={17}
                      color={n.color}
                      strokeWidth={1.8}
                    />
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>

        {/* ── Stats bar ───────────────────────────────────────── */}
        <div
          className="flex items-center justify-between px-5 py-2.5 border-t border-white/[.05]"
          style={{ background: "rgba(255,255,255,0.02)" }}
        >
          {[
            { label: "Executions",   value: "1,247", color: "#FF6B00" },
            { label: "Success Rate", value: "99.9%", color: "#10B981" },
            { label: "Avg Time",     value: "1.2s",  color: "#8B5CF6" },
            { label: "Last Run",     value: "2s ago", color: "#3B82F6" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div style={{ fontSize:"13px", fontWeight:"700", color:s.color, fontFamily:"DM Sans,sans-serif" }}>
                {s.value}
              </div>
              <div style={{ fontSize:"10px", color:"#71717A", fontFamily:"DM Sans,sans-serif" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Floating badges ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="absolute -top-3 -right-2 glass border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-body text-white">Lead qualified ✓</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.3, duration: 0.5 }}
        className="absolute -bottom-3 -left-2 glass border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2"
      >
        <Zap className="w-3.5 h-3.5 text-[#FF6B00]" />
        <span className="text-xs font-body text-white">48h deployment</span>
      </motion.div>
    </div>
  );
}
