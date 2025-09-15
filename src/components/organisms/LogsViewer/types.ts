/**
 * Logs Viewer Types
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Galaxy-Scale Operations
 * 
 * Type definitions for log viewing and analysis system components.
 */

import type { 
  LogEntry,
  BaseOrganismProps 
} from '@/lib/types';

/**
 * Log streaming modes
 */
export type LogStreamMode = 'tail' | 'historical' | 'search';

/**
 * Log export formats
 */
export type LogExportFormat = 'json' | 'csv' | 'txt' | 'xml';

/**
 * Log parsing and formatting options
 */
export interface LogParsingOptions {
  /** Whether to parse JSON metadata */
  parseJson: boolean;
  /** Whether to extract stack traces */
  extractStackTraces: boolean;
  /** Whether to highlight syntax */
  highlightSyntax: boolean;
  /** Timestamp format preference */
  timestampFormat: 'relative' | 'absolute' | 'iso' | 'unix';
  /** Maximum message length before truncation */
  maxMessageLength: number;
}

/**
 * Advanced log search configuration
 */
export interface LogSearchConfig {
  /** Search mode */
  mode: 'text' | 'regex' | 'structured';
  /** Whether search is case sensitive */
  caseSensitive: boolean;
  /** Whether to use whole word matching */
  wholeWord: boolean;
  /** Whether to search in metadata */
  includeMetadata: boolean;
  /** Search context (lines before/after matches) */
  context: {
    before: number;
    after: number;
  };
  /** Maximum search results */
  maxResults: number;
}

/**
 * Log correlation and tracing configuration
 */
export interface LogCorrelationConfig {
  /** Fields to use for correlation */
  correlationFields: string[];
  /** Whether to show correlation chains */
  showChains: boolean;
  /** Maximum correlation depth */
  maxDepth: number;
  /** Correlation timeout (ms) */
  timeout: number;
}

/**
 * Log aggregation and analytics configuration
 */
export interface LogAnalyticsConfig {
  /** Time bucket size for aggregation */
  bucketSize: '1m' | '5m' | '15m' | '1h' | '1d';
  /** Metrics to calculate */
  metrics: Array<'count' | 'rate' | 'percentiles' | 'errors' | 'latency'>;
  /** Whether to calculate trends */
  calculateTrends: boolean;
  /** Whether to detect anomalies */
  detectAnomalies: boolean;
}

/**
 * Real-time log streaming configuration
 */
export interface LogStreamingConfig {
  /** Stream protocol */
  protocol: 'websocket' | 'sse' | 'polling';
  /** Connection URL */
  url: string;
  /** Reconnection settings */
  reconnection: {
    enabled: boolean;
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
  };
  /** Buffer settings */
  buffer: {
    maxSize: number;
    flushInterval: number;
    strategy: 'fifo' | 'lifo' | 'priority';
  };
  /** Compression settings */
  compression: {
    enabled: boolean;
    algorithm: 'gzip' | 'deflate' | 'br';
  };
}

/**
 * Extended log entry with analysis data
 */
export interface AnalyzedLogEntry extends LogEntry {
  /** Parsed structured data */
  parsedData?: Record<string, unknown>;
  /** Stack trace information */
  stackTrace?: {
    frames: Array<{
      file: string;
      line: number;
      column: number;
      function: string;
      context?: string[];
    }>;
    errorType: string;
    errorMessage: string;
  };
  /** Correlation information */
  correlationId?: string;
  /** Related log entries */
  relatedLogs?: string[];
  /** Performance metrics */
  metrics?: {
    processingTime?: number;
    memoryUsage?: number;
    responseSize?: number;
  };
  /** Geographic information */
  geo?: {
    country: string;
    region: string;
    city: string;
    coordinates?: [number, number];
  };
  /** User agent information */
  userAgent?: {
    browser: string;
    version: string;
    os: string;
    device: string;
  };
}

/**
 * Log aggregation result
 */
export interface LogAggregation {
  /** Time bucket */
  bucket: string;
  /** Aggregated metrics */
  metrics: {
    count: number;
    rate: number;
    errorRate: number;
    avgResponseTime?: number;
    p50ResponseTime?: number;
    p95ResponseTime?: number;
    p99ResponseTime?: number;
  };
  /** Top errors in this bucket */
  topErrors: Array<{
    message: string;
    count: number;
    percentage: number;
  }>;
  /** Top services in this bucket */
  topServices: Array<{
    service: string;
    count: number;
    percentage: number;
  }>;
}

/**
 * Log anomaly detection result
 */
export interface LogAnomaly {
  /** Anomaly ID */
  id: string;
  /** Anomaly type */
  type: 'spike' | 'drop' | 'pattern' | 'outlier';
  /** Severity level */
  severity: 'low' | 'medium' | 'high' | 'critical';
  /** Confidence score (0-1) */
  confidence: number;
  /** Time range of anomaly */
  timeRange: {
    start: string;
    end: string;
  };
  /** Affected metrics */
  affectedMetrics: string[];
  /** Description of the anomaly */
  description: string;
  /** Suggested actions */
  suggestions: string[];
  /** Related log entries */
  relatedLogs: string[];
}

/**
 * Log viewer performance metrics
 */
export interface LogViewerMetrics {
  /** Rendering performance */
  rendering: {
    totalLogs: number;
    visibleLogs: number;
    renderTime: number;
    scrollPosition: number;
  };
  /** Memory usage */
  memory: {
    bufferSize: number;
    totalMemory: number;
    garbageCollections: number;
  };
  /** Network performance */
  network: {
    bytesReceived: number;
    messagesReceived: number;
    connectionLatency: number;
    reconnections: number;
  };
  /** User interactions */
  interactions: {
    searchQueries: number;
    filterChanges: number;
    scrollEvents: number;
    logClicks: number;
  };
}

/**
 * Advanced log viewer configuration
 */
export interface AdvancedLogViewerConfig {
  /** Parsing options */
  parsing: LogParsingOptions;
  /** Search configuration */
  search: LogSearchConfig;
  /** Correlation settings */
  correlation: LogCorrelationConfig;
  /** Analytics configuration */
  analytics: LogAnalyticsConfig;
  /** Streaming settings */
  streaming: LogStreamingConfig;
  /** Performance settings */
  performance: {
    virtualScrolling: boolean;
    lazyLoading: boolean;
    debounceMs: number;
    maxConcurrentRequests: number;
  };
  /** UI preferences */
  ui: {
    theme: 'light' | 'dark' | 'auto';
    fontFamily: 'monospace' | 'sans-serif';
    fontSize: 'xs' | 'sm' | 'md' | 'lg';
    lineHeight: 'tight' | 'normal' | 'relaxed';
    showLineNumbers: boolean;
    wrapLines: boolean;
  };
}

/**
 * Log viewer state management
 */
export interface LogViewerState {
  /** Current logs */
  logs: AnalyzedLogEntry[];
  /** Active filters */
  filters: LogFilters;
  /** Search state */
  search: {
    query: string;
    results: string[];
    currentIndex: number;
  };
  /** Streaming state */
  streaming: {
    connected: boolean;
    mode: LogStreamMode;
    lastUpdate: string;
    bufferSize: number;
  };
  /** Selection state */
  selection: {
    selectedLogs: string[];
    contextLog?: string;
  };
  /** View state */
  view: {
    scrollPosition: number;
    visibleRange: [number, number];
    autoScroll: boolean;
    expanded: Record<string, boolean>;
  };
}

/**
 * Export types for external use
 */
export type {
  LogsViewerProps,
  LogFilters,
  LogEntryRowProps,
  LogStatsProps,
  LogFiltersBarProps,
} from './LogsViewer';
