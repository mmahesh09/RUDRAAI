import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-xl bg-[#0B0B0C] border border-white/[0.12]",
          "px-4 py-3 text-base font-body text-[#F5F5F7] placeholder:text-[#8A8A93]",
          "ring-offset-background transition-all duration-200 resize-none",
          "focus-visible:outline-none focus-visible:border-[#BF5AF2] focus-visible:ring-1 focus-visible:ring-[#BF5AF2]",
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
