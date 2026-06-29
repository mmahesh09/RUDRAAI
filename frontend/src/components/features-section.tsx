"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Zap, Shield, Clock, BarChart2, Code2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NODE_W = 160;
const NODE_H = 52;

interface WFNode {
  id: string;
  x: number;
  y: number;
  label: string;
  sub: string;
  color: string;
  initial: string;
}

const wfNodes: WFNode[] = [
  { id: "webhook",  x: 10,  y: 174, label: "Webhook Trigger", sub: "Form submitted",      color: "#7C3AED", initial: "W"  },
  { id: "openai",   x: 210, y: 174, label: "OpenAI",          sub: "Score lead intent",   color: "#10B981", initial: "AI" },
  { id: "if",       x: 410, y: 174, label: "IF Node",         sub: "Lead score ≥ 7?",     color: "#F59E0B", initial: "IF" },
  { id: "hubspot",  x: 600, y: 50,  label: "HubSpot CRM",     sub: "Create contact",      color: "#FF6B00", initial: "HS" },
  { id: "gmail1",   x: 600, y: 120, label: "Gmail",           sub: "Send welcome email",  color: "#EA4335", initial: "G"  },
  { id: "slack",    x: 600, y: 190, label: "Slack",           sub: "Notify sales team",   color: "#611F69", initial: "S"  },
  { id: "gmail2",   x: 600, y: 300, label: "Gmail",           sub: "Nurture sequence",    color: "#EA4335", initial: "G"  },
];

type ConnType = "default" | "true" | "false";

const ARROW_COLORS: Record<ConnType, string> = {
  default: "#4B5563",
  true: "#10B981",
  false: "#EF4444",
};

interface ConnProps {
  fromId: string;
  toId: string;
  type?: ConnType;
  vertical?: boolean;
  showLabel?: boolean;
}

function Connection({ fromId, toId, type = "default", vertical = false, showLabel = false }: ConnProps) {
  const from = wfNodes.find((n) => n.id === fromId)!;
  const to   = wfNodes.find((n) => n.id === toId)!;
  const color = ARROW_COLORS[type];

  let d: string;
  let labelX = 0, labelY = 0;

  if (vertical) {
    const cx = from.x + NODE_W / 2;
    d = `M${cx},${from.y + NODE_H} L${cx},${to.y}`;
  } else {
    const fromX = from.x + NODE_W;
    const fromY = from.y + NODE_H / 2;
    const toX   = to.x;
    const toY   = to.y + NODE_H / 2;
    d = `M${fromX},${fromY} C${fromX + 28},${fromY} ${toX - 28},${toY} ${toX},${toY}`;
    labelX = (fromX + toX) / 2;
    labelY = (fromY + toY) / 2 - 8;
  }

  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" markerEnd={`url(#arrow-${type})`} />
      {showLabel && !vertical && (
        <text x={labelX} y={labelY} textAnchor="middle" fill={color} fontSize="9" fontWeight="700" fontFamily="monospace">
          {type.toUpperCase()}
        </text>
      )}
    </g>
  );
}

function WFNode({ node }: { node: WFNode }) {
  return (
    <g>
      <rect x={node.x} y={node.y} width={NODE_W} height={NODE_H} rx="8"
        fill="#080810" stroke={node.color} strokeWidth="1" strokeOpacity="0.45" />
      <circle cx={node.x + 26} cy={node.y + NODE_H / 2} r="15" fill={node.color} fillOpacity="0.15" />
      <text x={node.x + 26} y={node.y + NODE_H / 2 + 4} textAnchor="middle"
        fontSize="9" fontWeight="700" fill={node.color} fontFamily="monospace">
        {node.initial}
      </text>
      <text x={node.x + 48} y={node.y + 21} fontSize="10" fontWeight="600"
        fill="#E4E4E7" fontFamily="system-ui,sans-serif">
        {node.label}
      </text>
      <text x={node.x + 48} y={node.y + 36} fontSize="8.5"
        fill="#71717A" fontFamily="system-ui,sans-serif">
        {node.sub}
      </text>
    </g>
  );
}

function N8nWorkflowCanvas() {
  return (
    <div className="relative w-full rounded-2xl bg-[#080810] border border-white/08 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-white/02 border-b border-white/06">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
        </div>
        <span className="text-[11px] text-[#52525B] font-mono ml-1">
          Lead Qualification Automation · n8n Canvas
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[10px] text-[#3F3F46] font-mono">7 nodes</span>
          <span className="text-[#27272A]">|</span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] text-green-400 font-mono">active</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-4 py-5">
        <svg viewBox="0 0 780 390" width="100%" style={{ minWidth: 520 }}>
          <defs>
            {(Object.keys(ARROW_COLORS) as ConnType[]).map((t) => (
              <marker key={t} id={`arrow-${t}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill={ARROW_COLORS[t]} />
              </marker>
            ))}
            <pattern id="n8n-dots" width="22" height="22" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="#16162A" />
            </pattern>
          </defs>

          <rect width="780" height="390" fill="url(#n8n-dots)" />

          <Connection fromId="webhook" toId="openai" />
          <Connection fromId="openai"  toId="if" />
          <Connection fromId="if"      toId="hubspot" type="true"  showLabel />
          <Connection fromId="hubspot" toId="gmail1"  vertical />
          <Connection fromId="gmail1"  toId="slack"   vertical />
          <Connection fromId="if"      toId="gmail2"  type="false" showLabel />

          <rect x="598" y="8"   width="44" height="16" rx="4" fill="#10B98112" stroke="#10B98135" strokeWidth="1" />
          <text x="620" y="20" textAnchor="middle" fontSize="8" fill="#10B981" fontWeight="700" fontFamily="monospace">TRUE</text>

          <rect x="598" y="260" width="48" height="16" rx="4" fill="#EF444412" stroke="#EF444435" strokeWidth="1" />
          <text x="622" y="272" textAnchor="middle" fontSize="8" fill="#EF4444" fontWeight="700" fontFamily="monospace">FALSE</text>

          {wfNodes.map((node) => (
            <WFNode key={node.id} node={node} />
          ))}
        </svg>
      </div>

      <div className="px-4 py-2.5 bg-white/01 border-t border-white/05 flex flex-wrap items-center gap-x-6 gap-y-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[10px] text-[#52525B] font-mono">TRUE → CRM create · welcome email · Slack alert</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <span className="text-[10px] text-[#52525B] font-mono">FALSE → nurture email sequence</span>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: "Deploy in 3–7 Days",
    description: "Battle-tested n8n workflow templates and expert builds — production-ready in 3–7 days, not weeks.",
    color: "#FF6B00",
  },
  {
    icon: Shield,
    title: "99.9% Uptime SLA",
    description: "Every workflow ships with monitoring, error handling, and automatic retries built in from day one.",
    color: "#10B981",
  },
  {
    icon: Clock,
    title: "Reclaim Manual Hours",
    description: "Eliminate repetitive tasks from your ops stack. What took hours runs unattended in minutes.",
    color: "#8B5CF6",
  },
  {
    icon: BarChart2,
    title: "Full Observability",
    description: "Real-time execution logs, success rates, and failure alerts — always know exactly what's running.",
    color: "#3B82F6",
  },
  {
    icon: Code2,
    title: "Fully Custom Builds",
    description: "No cookie-cutter templates. Every automation is purpose-built for your exact business logic.",
    color: "#F59E0B",
  },
  {
    icon: CheckCircle2,
    title: "Ongoing Support",
    description: "Monthly maintenance and a dedicated Slack channel — we stay accountable long after delivery.",
    color: "#EC4899",
  },
];

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="features" className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0D0D14]" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div ref={ref} className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4">Why RudraAI</Badge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-black text-white mb-4 leading-tight">
            Production Automation,{" "}
            <span className="text-gradient-orange">Not One-Off Scripts</span>
          </h2>
          <p className="text-[#A1A1AA] font-body max-w-2xl mx-auto leading-relaxed text-sm sm:text-base">
            We engineer n8n workflows built to run reliably at scale — with error handling,
            retries, and full observability baked in from day one.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: prefersReducedMotion ? 0 : 0.15 }}
          className="mb-12"
        >
          <N8nWorkflowCanvas />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: prefersReducedMotion ? 0 : 0.3 + i * 0.07 }}
                className="flex items-start gap-4 p-5 rounded-xl bg-white/02 border border-white/06 hover:border-white/12 hover:bg-white/04 transition-all duration-300"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                >
                  <Icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <div>
                  <h4 className="font-subheading font-semibold text-sm text-white mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-xs font-body text-[#71717A] leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
