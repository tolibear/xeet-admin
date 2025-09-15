import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { MetricValue, Icon } from "../atoms";
import { Card, CardContent } from "./card";

const metricCardVariants = cva(
  "transition-colors hover:bg-accent/50",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-2",
        ghost: "border-0 shadow-none bg-transparent",
      },
      size: {
        sm: "p-3",
        default: "p-4", 
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const changeIndicatorVariants = cva(
  "inline-flex items-center gap-1 text-xs font-medium",
  {
    variants: {
      trend: {
        positive: "text-success",
        negative: "text-destructive",
        neutral: "text-muted-foreground",
      },
    },
    defaultVariants: {
      trend: "neutral",
    },
  }
);

export type MetricTrend = "positive" | "negative" | "neutral";

export interface MetricCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricCardVariants> {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: {
    value: string | number;
    trend: MetricTrend;
    label?: string;
  };
  suffix?: string;
  prefix?: string;
  loading?: boolean;
  description?: string;
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({
    className,
    variant,
    size,
    title,
    value,
    icon: IconComponent,
    change,
    suffix,
    prefix,
    loading,
    description,
    ...props
  }, ref) => {
    // Determine trend icon
    const getTrendIcon = (trend: MetricTrend) => {
      switch (trend) {
        case "positive":
          return TrendingUp;
        case "negative":
          return TrendingDown;
        case "neutral":
        default:
          return Minus;
      }
    };

    const TrendIcon = change ? getTrendIcon(change.trend) : null;
    
    return (
      <Card
        ref={ref}
        className={cn(metricCardVariants({ variant, size }), className)}
        role="region"
        aria-label={`${title} metric`}
        {...props}
      >
        <CardContent className={cn(
          "flex flex-col space-y-2",
          size === "sm" && "p-3",
          size === "default" && "p-4", 
          size === "lg" && "p-6"
        )}>
          {/* Header with title and icon */}
          <div className="flex items-center justify-between">
            <h3 className={cn(
              "font-medium text-muted-foreground truncate",
              size === "sm" && "text-xs",
              size === "default" && "text-sm",
              size === "lg" && "text-base"
            )}>
              {title}
            </h3>
            
            {IconComponent && (
              <Icon
                icon={IconComponent}
                variant="muted"
                size={size === "sm" ? "xs" : size === "lg" ? "lg" : "sm"}
                loading={loading}
              />
            )}
          </div>

          {/* Main metric value */}
          <div className="flex items-baseline justify-between">
            <MetricValue
              value={value}
              prefix={prefix}
              suffix={suffix}
              loading={loading}
              size={size === "sm" ? "lg" : size === "lg" ? "3xl" : "2xl"}
              weight="bold"
              variant="default"
            />
          </div>

          {/* Change indicator and description */}
          {(change || description) && (
            <div className="flex items-center justify-between">
              {change && (
                <div
                  className={cn(changeIndicatorVariants({ trend: change.trend }))}
                  role="status"
                  aria-label={`Change: ${change.value} ${change.label || ''}`}
                >
                  {TrendIcon && (
                    <Icon
                      icon={TrendIcon}
                      size="xs"
                      variant={change.trend === "positive" ? "success" : 
                              change.trend === "negative" ? "error" : "muted"}
                    />
                  )}
                  <span>{change.value}</span>
                  {change.label && (
                    <span className="text-muted-foreground font-normal">
                      {change.label}
                    </span>
                  )}
                </div>
              )}
              
              {description && (
                <p className={cn(
                  "text-muted-foreground truncate",
                  size === "sm" && "text-xs",
                  size === "default" && "text-xs", 
                  size === "lg" && "text-sm",
                  !change && "flex-1"
                )}>
                  {description}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);
MetricCard.displayName = "MetricCard";

export { MetricCard, metricCardVariants };
