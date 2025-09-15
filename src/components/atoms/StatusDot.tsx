import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const statusDotVariants = cva(
  "inline-flex rounded-full border-2 border-background",
  {
    variants: {
      variant: {
        success: "bg-success",
        warning: "bg-warning", 
        error: "bg-destructive",
        info: "bg-info",
        neutral: "bg-muted-foreground",
        primary: "bg-primary",
      },
      size: {
        sm: "h-2 w-2",
        default: "h-3 w-3", 
        lg: "h-4 w-4",
        xl: "h-5 w-5",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        ping: "animate-ping",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
      animation: "none",
    },
  }
);

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusDotVariants> {
  label?: string;
}

const StatusDot = React.forwardRef<HTMLDivElement, StatusDotProps>(
  ({ className, variant, size, animation, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(statusDotVariants({ variant, size, animation }), className)}
        role="status"
        aria-label={label}
        {...props}
      />
    );
  }
);
StatusDot.displayName = "StatusDot";

export { StatusDot, statusDotVariants };
