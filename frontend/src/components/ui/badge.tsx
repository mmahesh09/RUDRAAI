import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Badges read as mono index labels, not pills — structure, not decoration.
const badgeVariants = cva(
  "inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors",
  {
    variants: {
      variant: {
        default: "text-[#2997FF]",
        secondary: "text-[#A1A1AA]",
        destructive: "text-red-400",
        outline: "rounded-full border border-white/15 px-3 py-1 text-[#F5F5F7]",
        success: "text-emerald-400",
        purple: "text-zinc-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
