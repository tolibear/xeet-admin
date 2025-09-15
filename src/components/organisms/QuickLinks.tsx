import * as React from "react";
import Link from "next/link";
import { LucideIcon, Search, BarChart3, Settings, Users, FileText, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "../atoms";
import { Card, CardContent } from "../molecules/card";
import { useOrg } from "@/lib/org-context";

export interface QuickLink {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
}

export interface QuickLinksProps {
  links?: QuickLink[];
  className?: string;
}

// Mock quick links - in real app this would be configurable per org
const generateMockLinks = (orgSlug: string): QuickLink[] => [
  {
    id: "research",
    title: "Research Hub",
    description: "Advanced research tools and saved views",
    href: `/${orgSlug}/research`,
    icon: Search,
    badge: "New",
  },
  {
    id: "leaderboards", 
    title: "Leaderboards",
    description: "Create and manage public leaderboards",
    href: `/${orgSlug}/leaderboards`,
    icon: BarChart3,
  },
  {
    id: "system",
    title: "System Health",
    description: "Monitor system status and admin tools",
    href: `/${orgSlug}/system`, 
    icon: Settings,
  },
  {
    id: "users",
    title: "User Management",
    description: "Manage users and permissions",
    href: `/${orgSlug}/users`,
    icon: Users,
    disabled: true,
    badge: "Coming Soon",
  },
  {
    id: "reports",
    title: "Reports",
    description: "Generate and export custom reports",
    href: `/${orgSlug}/reports`,
    icon: FileText,
    disabled: true,
    badge: "Coming Soon",
  },
  {
    id: "automation",
    title: "Automation",
    description: "Set up automated workflows and alerts",
    href: `/${orgSlug}/automation`,
    icon: Zap,
    disabled: true,
    badge: "Coming Soon",
  },
];

const QuickLinks = React.forwardRef<HTMLDivElement, QuickLinksProps>(
  ({ links, className }, ref) => {
    const { org } = useOrg();
    
    // Use provided links or generate mock data
    const displayLinks = links || generateMockLinks(org.slug);

    return (
      <div ref={ref} className={className}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayLinks.map((link) => {
            const LinkComponent = link.disabled ? "div" : Link;
            const linkProps = link.disabled ? {} : { href: link.href };

            return (
              <Card
                key={link.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  link.disabled 
                    ? "opacity-60 cursor-not-allowed" 
                    : "hover:scale-[1.02] cursor-pointer"
                )}
              >
                <LinkComponent {...linkProps}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className={cn(
                        "rounded-lg p-2 flex-shrink-0",
                        link.disabled
                          ? "bg-muted text-muted-foreground"
                          : "bg-primary/10 text-primary"
                      )}>
                        <link.icon className="h-5 w-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-sm truncate">
                            {link.title}
                          </h3>
                          {link.badge && (
                            <span className={cn(
                              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              link.disabled || link.badge === "Coming Soon"
                                ? "bg-muted text-muted-foreground"
                                : "bg-primary/10 text-primary"
                            )}>
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </LinkComponent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }
);
QuickLinks.displayName = "QuickLinks";

export { QuickLinks };
