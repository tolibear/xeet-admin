import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { StatusDot } from "../atoms";

const statePillVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-warning border border-warning/20",
        error: "bg-destructive/10 text-destructive border border-destructive/20",
        info: "bg-info/10 text-info border border-info/20",
        neutral: "bg-muted text-muted-foreground border border-border",
        primary: "bg-primary/10 text-primary border border-primary/20",
      },
      size: {
        sm: "px-2 py-0.5 text-xs gap-1",
        default: "px-3 py-1 text-xs gap-2",
        lg: "px-4 py-1.5 text-sm gap-2",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
      animation: "none",
    },
  }
);

export interface StatePillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statePillVariants> {
  label: string;
  showDot?: boolean;
  dotAnimation?: "none" | "pulse" | "ping";
}

const StatePill = React.forwardRef<HTMLDivElement, StatePillProps>(
  ({
    className,
    variant,
    size,
    animation,
    label,
    showDot = true,
    dotAnimation = "none",
    ...props
  }, ref) => {
    const statusDotSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";
    
    return (
      <div
        ref={ref}
        className={cn(statePillVariants({ variant, size, animation }), className)}
        role="status"
        aria-label={`Status: ${label}`}
        {...props}
      >
        {showDot && (
          <StatusDot
            variant={variant === "neutral" ? "neutral" : variant || "neutral"}
            size={statusDotSize}
            animation={dotAnimation}
            label={`${label} status indicator`}
          />
        )}
        <span className="truncate">{label}</span>
      </div>
    );
  }
);
StatePill.displayName = "StatePill";

export { StatePill, statePillVariants };
