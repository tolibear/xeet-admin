import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components";

const searchBoxVariants = cva(
  "relative flex w-full items-center",
  {
    variants: {
      size: {
        sm: "gap-1",
        default: "gap-2", 
        lg: "gap-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const searchInputVariants = cva(
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-2 text-xs",
        default: "h-9 px-3 text-sm",
        lg: "h-10 px-4 text-base",
      },
      hasValue: {
        true: "pr-16", // Space for clear button
        false: "pr-8", // Space for search icon only
      },
    },
    defaultVariants: {
      size: "default",
      hasValue: false,
    },
  }
);

export interface SearchBoxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof searchBoxVariants> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
  clearable?: boolean;
  searchOnType?: boolean;
  debounceMs?: number;
}

const SearchBox = React.forwardRef<HTMLInputElement, SearchBoxProps>(
  ({
    className,
    size,
    onSearch,
    onClear,
    loading,
    clearable = true,
    searchOnType = false,
    debounceMs = 300,
    placeholder = "Search...",
    ...props
  }, ref) => {
    const [value, setValue] = React.useState(props.value || props.defaultValue || "");
    const [isFocused, setIsFocused] = React.useState(false);
    const debounceRef = React.useRef<NodeJS.Timeout>();
    
    const inputId = React.useId();
    const hasValue = Boolean(value);

    // Handle debounced search on type
    React.useEffect(() => {
      if (searchOnType && hasValue) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          onSearch?.(String(value));
        }, debounceMs);
      }
      
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, [value, searchOnType, onSearch, debounceMs, hasValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      props.onChange?.(e);
    };

    const handleSearch = () => {
      if (!loading && hasValue) {
        onSearch?.(String(value));
      }
    };

    const handleClear = () => {
      setValue("");
      onClear?.();
      // Focus back to input after clearing
      if (ref && typeof ref === 'object' && ref.current) {
        ref.current.focus();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
      props.onKeyDown?.(e);
    };

    return (
      <div className={cn(searchBoxVariants({ size }), className)} role="search">
        <div className="relative flex-1">
          <input
            ref={ref}
            id={inputId}
            className={cn(searchInputVariants({ size, hasValue }))}
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            disabled={loading}
            aria-label={props['aria-label'] || "Search"}
            {...props}
          />
          
          {/* Search Icon */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {hasValue && clearable && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={handleClear}
                aria-label="Clear search"
                tabIndex={isFocused ? 0 : -1}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={handleSearch}
              disabled={loading || !hasValue}
              aria-label="Search"
              tabIndex={isFocused ? 0 : -1}
            >
              <Search className={cn(
                "h-3 w-3 transition-colors",
                hasValue ? "text-primary" : "text-muted-foreground"
              )} />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
SearchBox.displayName = "SearchBox";

export { SearchBox, searchBoxVariants };
