import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge, Button } from "@/components";

const filterChipVariants = cva(
  "inline-flex items-center gap-1 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        success: "bg-success text-success-foreground hover:bg-success/90",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        sm: "text-xs px-2 py-1 rounded-md",
        default: "text-xs px-2.5 py-0.5 rounded-md",
        lg: "text-sm px-3 py-1 rounded-md",
      },
      removable: {
        true: "",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      removable: true,
    },
  }
);

export interface FilterChipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof filterChipVariants> {
  label: string;
  value?: string | number;
  onRemove?: (value?: string | number) => void;
  removable?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  isSelected?: boolean;
}

const FilterChip = React.forwardRef<HTMLDivElement, FilterChipProps>(
  ({
    className,
    variant,
    size,
    label,
    value,
    onRemove,
    removable = true,
    disabled,
    icon,
    isSelected,
    onClick,
    ...props
  }, ref) => {
    const chipId = React.useId();
    
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent triggering chip click
      if (!disabled) {
        onRemove?.(value);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') && removable && !disabled) {
        e.preventDefault();
        onRemove?.(value);
      }
    };

    const isInteractive = Boolean(onClick) || removable;

    return (
      <div
        ref={ref}
        className={cn(
          filterChipVariants({ variant: isSelected ? 'primary' : variant, size, removable }),
          isInteractive && "cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        role={isInteractive ? "button" : "status"}
        tabIndex={isInteractive && !disabled ? 0 : -1}
        aria-label={`${label}${value ? `: ${value}` : ''}${removable ? '. Press backspace to remove' : ''}`}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Icon */}
        {icon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}

        {/* Label and Value */}
        <span className="truncate">
          {label}
          {value && (
            <span className="font-normal opacity-75">
              : {String(value)}
            </span>
          )}
        </span>

        {/* Remove Button */}
        {removable && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-3 w-3 p-0 hover:bg-transparent ml-1 shrink-0",
              size === "sm" && "h-2.5 w-2.5",
              size === "lg" && "h-4 w-4"
            )}
            onClick={handleRemove}
            disabled={disabled}
            aria-label={`Remove ${label} filter`}
            tabIndex={-1} // Handled by parent keyboard navigation
          >
            <X className={cn(
              "h-2.5 w-2.5",
              size === "sm" && "h-2 w-2",
              size === "lg" && "h-3 w-3"
            )} />
          </Button>
        )}
      </div>
    );
  }
);
FilterChip.displayName = "FilterChip";

export { FilterChip, filterChipVariants };
