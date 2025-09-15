import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrgProvider } from "@/lib/org-context";

interface OrgLayoutProps {
  children: React.ReactNode;
  params: {
    org: string;
  };
}

// Mock org validation - in real app this would check against database
const VALID_ORGS = ["demo-org", "test-org", "acme-corp", "xeet-internal"];

function isValidOrg(orgSlug: string): boolean {
  // Basic slug validation
  if (!/^[a-z0-9-]+$/.test(orgSlug)) {
    return false;
  }
  
  // Check against allowed orgs (mock)
  return VALID_ORGS.includes(orgSlug);
}

export async function generateMetadata({
  params,
}: {
  params: { org: string };
}): Promise<Metadata> {
  const orgSlug = params.org;
  
  if (!isValidOrg(orgSlug)) {
    return {
      title: "Organization Not Found",
    };
  }

  // Format org name for display
  const orgName = orgSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: {
      template: `%s | ${orgName} - Xeet Admin`,
      default: `${orgName} - Xeet Admin`,
    },
    description: `Admin platform for ${orgName} - research, analytics, leaderboards, and operational management.`,
  };
}

export default function OrgLayout({ children, params }: OrgLayoutProps) {
  const orgSlug = params.org;
  
  // Validate org exists and user has access
  if (!isValidOrg(orgSlug)) {
    notFound();
  }

  // Mock org data - in real app this would come from database/API
  const orgData = {
    id: orgSlug,
    slug: orgSlug,
    name: orgSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    // Mock user permissions - in real app from auth system
    permissions: {
      canViewAnalytics: true,
      canManageLeaderboards: true, 
      canAccessSystem: true,
      canViewResearch: true,
    },
  };

  return (
    <OrgProvider org={orgData}>
      <div className="min-h-screen bg-background">
        {/* Org-scoped layout wrapper */}
        <div className="flex flex-col">
          {/* Main content area - children will render here */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </OrgProvider>
  );
}
