import type { Metadata } from "next";

import { DashboardMetrics, QuickLinks } from "@/components/organisms";
import { OrgSwitcher } from "@/components/molecules";

export const metadata: Metadata = {
  title: "Overview",
};

interface OrgPageProps {
  params: {
    org: string;
  };
}

export default function OrgPage({ params }: OrgPageProps) {
  const orgSlug = params.org;
  
  // Format org name for display
  const orgName = orgSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">{orgName}</h1>
            <p className="text-muted-foreground mt-2">
              Admin platform overview for your organization
            </p>
          </div>
          
          {/* Organization Switcher */}
          <div className="flex-shrink-0">
            <OrgSwitcher showBadge />
          </div>
        </div>

        {/* Dashboard Metrics */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Key Metrics</h2>
          <DashboardMetrics />
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <QuickLinks />
        </section>
      </div>
    </div>
  );
}
