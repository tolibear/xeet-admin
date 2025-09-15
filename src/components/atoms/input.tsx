import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-success focus-visible:ring-success",
      },
      size: {
        default: "h-9",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof inputVariants> {
  loading?: boolean;
  error?: string;
  success?: boolean;
  "aria-describedby"?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, loading, error, success, ...props }, ref) => {
    const inputId = React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    
    // Determine variant based on state
    const computedVariant = error ? "error" : success ? "success" : variant;

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            inputVariants({ variant: computedVariant, size }),
            loading && "pr-8", // Make space for loading spinner
            className
          )}
          ref={ref}
          disabled={loading || props.disabled}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={cn(errorId, props["aria-describedby"])}
          {...props}
        />
        {loading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
        )}
        {error && (
          <p
            id={errorId}
            className="mt-1 text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
