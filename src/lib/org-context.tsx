"use client";

import React from "react";

export interface OrgPermissions {
  canViewAnalytics: boolean;
  canManageLeaderboards: boolean;
  canAccessSystem: boolean;
  canViewResearch: boolean;
}

export interface OrgData {
  id: string;
  slug: string;
  name: string;
  permissions: OrgPermissions;
}

interface OrgContextValue {
  org: OrgData;
  isLoading: boolean;
  hasPermission: (permission: keyof OrgPermissions) => boolean;
  switchOrg: (orgSlug: string) => void;
}

const OrgContext = React.createContext<OrgContextValue | null>(null);

interface OrgProviderProps {
  children: React.ReactNode;
  org: OrgData;
}

export function OrgProvider({ children, org }: OrgProviderProps) {
  const [currentOrg, setCurrentOrg] = React.useState<OrgData>(org);
  const [isLoading, setIsLoading] = React.useState(false);

  // Update current org when prop changes (e.g., route change)
  React.useEffect(() => {
    setCurrentOrg(org);
  }, [org]);

  const hasPermission = React.useCallback((permission: keyof OrgPermissions): boolean => {
    return currentOrg.permissions[permission];
  }, [currentOrg.permissions]);

  const switchOrg = React.useCallback((orgSlug: string) => {
    setIsLoading(true);
    
    // Navigate to new org - in a real app this might involve API calls
    const newUrl = window.location.pathname.replace(
      `/[^/]+/`, // Replace first path segment (current org)
      `/${orgSlug}/`
    );
    
    // Update URL
    window.location.href = newUrl;
  }, []);

  const value = React.useMemo<OrgContextValue>(() => ({
    org: currentOrg,
    isLoading,
    hasPermission,
    switchOrg,
  }), [currentOrg, isLoading, hasPermission, switchOrg]);

  return (
    <OrgContext.Provider value={value}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg(): OrgContextValue {
  const context = React.useContext(OrgContext);
  if (!context) {
    throw new Error("useOrg must be used within an OrgProvider");
  }
  return context;
}

// Helper hook for checking permissions
export function useOrgPermission(permission: keyof OrgPermissions): boolean {
  const { hasPermission } = useOrg();
  return hasPermission(permission);
}
