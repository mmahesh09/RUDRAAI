import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-xl bg-[rgba(255,255,255,0.05)] border border-white/10",
          "px-4 py-3 text-sm font-body text-white placeholder:text-[#71717A]",
          "ring-offset-background transition-all duration-200 resize-none",
          "focus-visible:outline-none focus-visible:border-[rgba(255,107,0,0.5)] focus-visible:ring-1 focus-visible:ring-[rgba(255,107,0,0.3)]",
          "hover:border-white/15 hover:bg-[rgba(255,255,255,0.07)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
