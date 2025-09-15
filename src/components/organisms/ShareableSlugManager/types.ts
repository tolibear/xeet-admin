/**
 * ShareableSlugManager Organism Types
 * Public shareable slugs system for leaderboard distribution
 */

import type { 
  Leaderboard,
  BaseOrganismProps 
} from "@/lib/types";

export interface ShareableSlugManagerProps extends BaseOrganismProps {
  /** Leaderboard to manage slugs for */
  leaderboard: Leaderboard;
  /** Existing shareable slugs */
  shareableUrls?: ShareableUrl[];
  /** Base URL for public leaderboards */
  baseUrl?: string;
  /** Whether user can create new slugs */
  canCreate?: boolean;
  /** Whether user can edit slugs */
  canEdit?: boolean;
  /** Whether user can delete slugs */
  canDelete?: boolean;
  /** Callback when new slug is created */
  onCreateSlug?: (config: CreateSlugConfig) => void;
  /** Callback when slug is updated */
  onUpdateSlug?: (id: string, config: UpdateSlugConfig) => void;
  /** Callback when slug is deleted */
  onDeleteSlug?: (id: string) => void;
  /** Callback when slug is copied to clipboard */
  onCopySlug?: (url: string) => void;
}

export interface ShareableUrl {
  /** Unique identifier */
  id: string;
  /** The shareable slug */
  slug: string;
  /** Full shareable URL */
  url: string;
  /** Human-readable name */
  name: string;
  /** Description of this share */
  description?: string;
  /** Whether this URL is active */
  isActive: boolean;
  /** Access settings */
  access: ShareableUrlAccess;
  /** Analytics data */
  analytics: ShareableUrlAnalytics;
  /** Creation info */
  createdBy: string;
  createdAt: string;
  /** Last update info */
  updatedAt: string;
  /** Expiration date */
  expiresAt?: string;
}

export interface ShareableUrlAccess {
  /** Whether password is required */
  requiresPassword: boolean;
  /** Hashed password (if required) */
  passwordHash?: string;
  /** Allowed domains for embedding */
  allowedDomains?: string[];
  /** Maximum number of views */
  maxViews?: number;
  /** IP restrictions */
  ipRestrictions?: string[];
  /** Geographic restrictions */
  geoRestrictions?: string[];
}

export interface ShareableUrlAnalytics {
  /** Total views */
  totalViews: number;
  /** Unique visitors */
  uniqueViews: number;
  /** Views in last 24 hours */
  viewsLast24h: number;
  /** Views in last 7 days */
  viewsLast7d: number;
  /** Views in last 30 days */
  viewsLast30d: number;
  /** Recent view events */
  recentViews: ViewEvent[];
  /** Referrer statistics */
  referrers: Record<string, number>;
  /** Geographic distribution */
  geoDistribution: Record<string, number>;
}

export interface ViewEvent {
  /** When the view occurred */
  timestamp: string;
  /** Viewer's IP address (hashed) */
  ipHash: string;
  /** User agent */
  userAgent?: string;
  /** Referrer URL */
  referrer?: string;
  /** Geographic location */
  location?: string;
  /** View duration in seconds */
  duration?: number;
}

export interface CreateSlugConfig {
  /** Name for this shareable URL */
  name: string;
  /** Description */
  description?: string;
  /** Custom slug (optional) */
  customSlug?: string;
  /** Access configuration */
  access: Partial<ShareableUrlAccess>;
  /** Expiration date */
  expiresAt?: Date;
}

export interface UpdateSlugConfig {
  /** Updated name */
  name?: string;
  /** Updated description */
  description?: string;
  /** Whether URL is active */
  isActive?: boolean;
  /** Updated access configuration */
  access?: Partial<ShareableUrlAccess>;
  /** Updated expiration date */
  expiresAt?: Date;
}

export interface ShareableUrlCardProps {
  /** Shareable URL data */
  shareableUrl: ShareableUrl;
  /** Base URL for display */
  baseUrl?: string;
  /** Whether user can edit */
  canEdit?: boolean;
  /** Whether user can delete */
  canDelete?: boolean;
  /** Whether card is selected */
  isSelected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Edit handler */
  onEdit?: () => void;
  /** Delete handler */
  onDelete?: () => void;
  /** Copy URL handler */
  onCopy?: () => void;
  /** View analytics handler */
  onViewAnalytics?: () => void;
}

export interface CreateSlugModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Leaderboard being shared */
  leaderboard: Leaderboard;
  /** Base URL */
  baseUrl?: string;
  /** Close handler */
  onClose: () => void;
  /** Submit handler */
  onSubmit: (config: CreateSlugConfig) => void;
}

export interface SlugAnalyticsProps {
  /** Shareable URL to show analytics for */
  shareableUrl: ShareableUrl;
  /** Time period for analytics */
  period?: AnalyticsPeriod;
  /** Whether to show detailed breakdown */
  showDetails?: boolean;
  /** Callback when period changes */
  onPeriodChange?: (period: AnalyticsPeriod) => void;
}

export interface ShareOptionsProps {
  /** URL to share */
  url: string;
  /** Title for sharing */
  title: string;
  /** Description for sharing */
  description?: string;
  /** Available share platforms */
  platforms?: SharePlatform[];
  /** Callback when platform is selected */
  onShare?: (platform: SharePlatform, url: string) => void;
}

export interface QRCodeGeneratorProps {
  /** URL to encode */
  url: string;
  /** Size of QR code in pixels */
  size?: number;
  /** Whether to show download button */
  showDownload?: boolean;
  /** Callback when QR code is downloaded */
  onDownload?: (dataUrl: string) => void;
}

export interface SlugAccessControlProps {
  /** Current access settings */
  access: ShareableUrlAccess;
  /** Whether settings can be edited */
  canEdit?: boolean;
  /** Validation errors */
  errors?: Record<string, string>;
  /** Change handler */
  onChange: (access: ShareableUrlAccess) => void;
}

export type AnalyticsPeriod = "24h" | "7d" | "30d" | "90d" | "1y";

export type SharePlatform = 
  | "twitter"
  | "linkedin" 
  | "facebook"
  | "reddit"
  | "email"
  | "copy"
  | "embed";

export interface SlugValidationResult {
  /** Whether slug is valid */
  isValid: boolean;
  /** Validation message */
  message?: string;
  /** Suggested alternative slug */
  suggestion?: string;
}

export interface EmbedCodeGeneratorProps {
  /** URL to embed */
  url: string;
  /** Default width */
  width?: number;
  /** Default height */
  height?: number;
  /** Whether to show customization options */
  showOptions?: boolean;
  /** Callback when embed code is generated */
  onGenerate?: (embedCode: string, config: EmbedConfig) => void;
}

export interface EmbedConfig {
  /** Width of embed */
  width: number;
  /** Height of embed */
  height: number;
  /** Whether to show border */
  showBorder: boolean;
  /** Whether to allow fullscreen */
  allowFullscreen: boolean;
  /** Additional CSS classes */
  cssClasses?: string;
}
