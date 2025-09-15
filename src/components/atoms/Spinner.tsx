import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        inherit: "text-current",
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

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = React.forwardRef<HTMLElement, SpinnerProps>(
  ({ className, variant, size, label = "Loading", ...props }, ref) => {
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="status"
        aria-label={label}
        className="inline-flex items-center justify-center"
        {...props}
      >
        <Loader2
          className={cn(spinnerVariants({ variant, size }), className)}
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
