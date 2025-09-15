export interface EmbedConfig {
  leaderboardId: string;
  slug: string;
  orgId: string;
  theme: 'light' | 'dark' | 'auto';
  showHeader: boolean;
  showFooter: boolean;
  showBranding: boolean;
  showExportButton: boolean;
  showRefreshButton: boolean;
  maxRows: number;
  refreshInterval?: number; // in seconds
  customStyles?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: string;
    fontFamily?: string;
  };
  allowedDomains?: string[];
  title?: string;
  subtitle?: string;
}

export interface EmbedSecurityConfig {
  allowFullscreen: boolean;
  allowScripts: boolean;
  allowSameOrigin: boolean;
  allowForms: boolean;
  referrerPolicy: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
  contentSecurityPolicy?: string;
}

export interface EmbedAnalytics {
  trackViews: boolean;
  trackClicks: boolean;
  trackScrolling: boolean;
  customEvents?: string[];
  analyticsProvider?: 'google' | 'mixpanel' | 'amplitude' | 'custom';
  trackingId?: string;
}

export interface EmbedPreview {
  width: number;
  height: number;
  responsive: boolean;
  device: 'desktop' | 'tablet' | 'mobile';
  showBorder: boolean;
  backgroundColor: string;
}

export interface LeaderboardData {
  id: string;
  name: string;
  description?: string;
  entries: Array<{
    id: string;
    rank: number;
    name: string;
    score: number;
    change?: number;
    avatar?: string;
    metadata?: Record<string, any>;
  }>;
  lastUpdated: string;
  totalEntries: number;
  isPublic: boolean;
  isActive: boolean;
}

export interface EmbedMetrics {
  views: number;
  uniqueViews: number;
  domains: Array<{
    domain: string;
    views: number;
    lastSeen: string;
  }>;
  countries: Array<{
    country: string;
    views: number;
  }>;
  devices: {
    desktop: number;
    tablet: number;
    mobile: number;
  };
  avgSessionTime: number;
  bounceRate: number;
  topReferrers: Array<{
    referrer: string;
    views: number;
  }>;
}
