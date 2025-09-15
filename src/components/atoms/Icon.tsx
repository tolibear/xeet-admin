import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const iconVariants = cva(
  "inline-flex shrink-0 transition-colors",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        success: "text-success",
        warning: "text-warning", 
        error: "text-destructive",
        info: "text-info",
      },
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        default: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-8 w-8",
        "2xl": "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface IconProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof iconVariants> {
  icon: LucideIcon;
  loading?: boolean;
  spin?: boolean;
}

const Icon = React.forwardRef<HTMLElement, IconProps>(
  ({ className, variant, size, icon: IconComponent, loading, spin, ...props }, ref) => {
    if (loading) {
      return (
        <Loader2
          ref={ref as React.Ref<SVGSVGElement>}
          className={cn(iconVariants({ variant, size }), "animate-spin", className)}
          aria-hidden="true"
          {...props}
        />
      );
    }

    return (
      <IconComponent
        ref={ref as React.Ref<SVGSVGElement>}
        className={cn(
          iconVariants({ variant, size }),
          spin && "animate-spin",
          className
        )}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
Icon.displayName = "Icon";

export { Icon, iconVariants };
