/**
 * LiveFeedSystem Organism Types
 * Atomic types for real-time data streaming functionality
 */

import { LiveFeedItem, LiveFeedConnection, LiveFeedFilters, BaseOrganismProps } from "@/lib/types";

export interface LiveFeedSystemProps extends BaseOrganismProps {
  /** WebSocket/SSE connection URL */
  connectionUrl: string;
  /** Connection type preference */
  connectionType?: 'websocket' | 'sse' | 'auto';
  /** Organization ID for scoped feeds */
  orgId: string;
  /** Current feed filters */
  filters: LiveFeedFilters;
  /** Filter change handler */
  onFiltersChange: (filters: LiveFeedFilters) => void;
  /** Feed item click handler */
  onItemClick?: (item: LiveFeedItem) => void;
  /** Mark item as read handler */
  onMarkAsRead?: (itemId: string) => void;
  /** Bulk actions handler */
  onBulkAction?: (action: string, itemIds: string[]) => void;
  /** Maximum items to keep in memory */
  maxItems?: number;
  /** Auto-scroll to new items */
  autoScroll?: boolean;
  /** Show connection status */
  showConnectionStatus?: boolean;
  /** Compact mode for smaller spaces */
  compact?: boolean;
}

export interface LiveFeedItemProps {
  /** Feed item data */
  item: LiveFeedItem;
  /** Whether item is selected */
  selected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Mark as read handler */
  onMarkAsRead?: () => void;
  /** Compact display mode */
  compact?: boolean;
  /** Show relative time */
  showRelativeTime?: boolean;
}

export interface ConnectionStatusProps {
  /** Connection information */
  connection: LiveFeedConnection;
  /** Reconnect handler */
  onReconnect: () => void;
  /** Disconnect handler */
  onDisconnect: () => void;
  /** Compact display */
  compact?: boolean;
}

export interface FeedFiltersProps {
  /** Current filters */
  filters: LiveFeedFilters;
  /** Available filter options */
  options: {
    types: Array<{
      value: LiveFeedItem['type'];
      label: string;
      count: number;
    }>;
    priorities: Array<{
      value: LiveFeedItem['priority'];
      label: string;
      count: number;
    }>;
    sources: Array<{
      value: string;
      label: string;
      count: number;
    }>;
    tags: Array<{
      value: string;
      label: string;
      count: number;
    }>;
  };
  /** Filter change handler */
  onFiltersChange: (filters: LiveFeedFilters) => void;
  /** Reset filters handler */
  onReset: () => void;
  /** Compact mode */
  compact?: boolean;
}

export interface FeedStatsProps {
  /** Feed statistics */
  stats: {
    totalItems: number;
    unreadItems: number;
    itemsPerMinute: number;
    connectionUptime: number;
    filteredItems: number;
    itemsByType: Record<LiveFeedItem['type'], number>;
    itemsByPriority: Record<LiveFeedItem['priority'], number>;
  };
  /** Time window for rate calculations */
  timeWindow?: number;
}

export interface DeduplicationConfig {
  /** Enable deduplication */
  enabled: boolean;
  /** Fields to use for deduplication */
  fields: ('content' | 'title' | 'source' | 'data')[];
  /** Time window for duplicate detection (ms) */
  timeWindow: number;
  /** Deduplication strategy */
  strategy: 'exact' | 'fuzzy' | 'hash';
  /** Fuzzy matching threshold (0-1) */
  fuzzyThreshold?: number;
}
