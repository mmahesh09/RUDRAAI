import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium font-subheading transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[rgba(255,107,0,0.1)] border border-[rgba(255,107,0,0.3)] text-[#FF6B00]",
        secondary:
          "bg-white/05 border border-white/10 text-[#A1A1AA]",
        destructive: "bg-red-500/10 border border-red-500/30 text-red-400",
        outline: "border border-white/15 text-white",
        success: "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",
        purple: "bg-purple-500/10 border border-purple-500/30 text-purple-400",
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
