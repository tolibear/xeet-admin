"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, Building2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, Badge } from "../atoms";
import { useOrg } from "@/lib/org-context";

const orgSwitcherVariants = cva(
  "relative inline-flex",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

// Mock org list - in real app this would come from API
const AVAILABLE_ORGS = [
  { id: "demo-org", slug: "demo-org", name: "Demo Organization" },
  { id: "test-org", slug: "test-org", name: "Test Organization" },
  { id: "acme-corp", slug: "acme-corp", name: "ACME Corporation" },
  { id: "xeet-internal", slug: "xeet-internal", name: "Xeet Internal" },
];

export interface OrgSwitcherProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof orgSwitcherVariants> {
  showBadge?: boolean;
}

const OrgSwitcher = React.forwardRef<HTMLDivElement, OrgSwitcherProps>(
  ({ className, size, showBadge = false, ...props }, ref) => {
    const { org, switchOrg, isLoading } = useOrg();
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedOrgId, setSelectedOrgId] = React.useState(org.id);
    
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const handleOrgSelect = (orgSlug: string) => {
      setSelectedOrgId(orgSlug);
      setIsOpen(false);
      
      if (orgSlug !== org.slug) {
        switchOrg(orgSlug);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(orgSwitcherVariants({ size }), className)}
        {...props}
      >
        <div ref={dropdownRef} className="relative">
          {/* Trigger Button */}
          <Button
            variant="outline"
            className="flex items-center justify-between min-w-[200px] bg-background"
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={`Current organization: ${org.name}. Click to switch organizations.`}
          >
            <div className="flex items-center space-x-2 truncate">
              <Building2 className="h-4 w-4 shrink-0" />
              <span className="truncate">{org.name}</span>
              {showBadge && (
                <Badge variant="outline" size="sm">
                  {org.slug}
                </Badge>
              )}
            </div>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform shrink-0",
              isOpen && "rotate-180"
            )} />
          </Button>

          {/* Dropdown */}
          {isOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50 py-1"
              role="listbox"
              aria-label="Available organizations"
            >
              {AVAILABLE_ORGS.map((orgOption) => (
                <button
                  key={orgOption.id}
                  className={cn(
                    "w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground transition-colors flex items-center justify-between",
                    orgOption.slug === org.slug && "bg-accent/50"
                  )}
                  onClick={() => handleOrgSelect(orgOption.slug)}
                  role="option"
                  aria-selected={orgOption.slug === selectedOrgId}
                  aria-label={`Switch to ${orgOption.name}`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="truncate">
                      <div className="font-medium truncate">{orgOption.name}</div>
                      <div className="text-xs text-muted-foreground">{orgOption.slug}</div>
                    </div>
                  </div>
                  
                  {orgOption.slug === org.slug && (
                    <Check className="h-4 w-4 text-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
            <div className="text-xs text-muted-foreground">Switching...</div>
          </div>
        )}
      </div>
    );
  }
);
OrgSwitcher.displayName = "OrgSwitcher";

export { OrgSwitcher, orgSwitcherVariants };
