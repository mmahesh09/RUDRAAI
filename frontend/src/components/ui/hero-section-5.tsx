"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface Milestone {
  id: number;
  name: string;
  status: "complete" | "in-progress" | "pending";
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
}

interface AnimatedRoadmapProps extends React.HTMLAttributes<HTMLDivElement> {
  milestones: Milestone[];
  mapImageSrc?: string;
}

const MilestoneMarker = ({ milestone }: { milestone: Milestone }) => {
  const statusClasses = {
    complete: "bg-[#10B981] border-[#059669]",
    "in-progress": "bg-[#FF6B00] border-[#EA580C] animate-pulse",
    pending: "bg-white/20 border-white/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: milestone.id * 0.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.5 }}
      className="absolute flex items-center gap-3"
      style={milestone.position}
    >
      <div className="relative flex h-8 w-8 items-center justify-center">
        <div className={cn("absolute h-3 w-3 rounded-full border-2", statusClasses[milestone.status])} />
        <div className="absolute h-full w-full rounded-full bg-[rgba(255,107,0,0.08)]" />
      </div>
      <div className="rounded-xl border border-white/10 bg-[rgba(255,255,255,0.04)] backdrop-blur-sm px-4 py-2 text-sm font-subheading font-medium text-white shadow-sm whitespace-nowrap">
        {milestone.name}
      </div>
    </motion.div>
  );
};

const AnimatedRoadmap = React.forwardRef<HTMLDivElement, AnimatedRoadmapProps>(
  ({ className, milestones, mapImageSrc, ...props }, ref) => {
    const targetRef = React.useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
      target: targetRef,
      offset: ["start end", "end start"],
    });

    const pathLength = useTransform(scrollYProgress, [0.15, 0.7], [0, 1]);

    return (
      <div
        ref={targetRef}
        className={cn("relative w-full max-w-4xl mx-auto py-16", className)}
        {...props}
      >
        {mapImageSrc && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.2 }}
            className="absolute inset-0 top-10 opacity-30"
          >
            <img src={mapImageSrc} alt="Roadmap" className="h-full w-full object-contain" />
          </motion.div>
        )}

        <div className="relative h-[360px]">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 360"
            preserveAspectRatio="none"
            className="absolute top-0 left-0"
          >
            <motion.path
              d="M 50 300 Q 200 50 400 180 T 750 80"
              fill="none"
              stroke="#FF6B00"
              strokeWidth="2"
              strokeDasharray="8 4"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          {milestones.map((milestone) => (
            <MilestoneMarker key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>
    );
  }
);

AnimatedRoadmap.displayName = "AnimatedRoadmap";

export { AnimatedRoadmap };
