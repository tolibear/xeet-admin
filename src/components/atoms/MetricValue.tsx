import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const metricValueVariants = cva(
  "font-mono tabular-nums transition-colors",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        success: "text-success",
        warning: "text-warning",
        error: "text-destructive",
        info: "text-info",
        primary: "text-primary",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium", 
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default", 
      weight: "semibold",
    },
  }
);

export interface MetricValueProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof metricValueVariants> {
  value: string | number;
  suffix?: string;
  prefix?: string;
  loading?: boolean;
}

const MetricValue = React.forwardRef<HTMLSpanElement, MetricValueProps>(
  ({ className, variant, size, weight, value, suffix, prefix, loading, ...props }, ref) => {
    if (loading) {
      return (
        <span
          ref={ref}
          className={cn(metricValueVariants({ variant: "muted", size, weight }), className)}
          aria-label="Loading metric value"
          {...props}
        >
          --
        </span>
      );
    }

    const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

    return (
      <span
        ref={ref}
        className={cn(metricValueVariants({ variant, size, weight }), className)}
        aria-label={`${prefix || ''}${formattedValue}${suffix || ''}`}
        {...props}
      >
        {prefix && <span className="text-muted-foreground">{prefix}</span>}
        {formattedValue}
        {suffix && <span className="text-muted-foreground">{suffix}</span>}
      </span>
    );
  }
);
MetricValue.displayName = "MetricValue";

export { MetricValue, metricValueVariants };
