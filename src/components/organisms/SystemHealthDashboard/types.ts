/**
 * System Health Dashboard Types
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Enterprise-Scale Operations
 * 
 * Type definitions for system health monitoring dashboard components.
 */

import type { 
  SystemHealthMetrics, 
  SystemService,
  BaseOrganismProps 
} from '@/lib/types';

/**
 * Alert severity levels for system health monitoring
 */
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'fatal';

/**
 * System health alert configuration
 */
export interface HealthAlert {
  /** Alert identifier */
  id: string;
  /** Metric type that triggered the alert */
  type: string;
  /** Current metric value */
  value: number;
  /** Threshold that was exceeded */
  threshold: number;
  /** Alert severity */
  severity: AlertSeverity;
  /** Alert message */
  message: string;
  /** Timestamp when alert was triggered */
  triggeredAt: string;
  /** Whether alert has been acknowledged */
  acknowledged: boolean;
}

/**
 * System health dashboard configuration
 */
export interface HealthDashboardConfig {
  /** Metrics refresh interval in milliseconds */
  refreshInterval: number;
  /** Whether to show service details by default */
  showServiceDetails: boolean;
  /** Chart height in pixels */
  chartHeight: number;
  /** Number of historical data points to display */
  historyPoints: number;
  /** Alert thresholds configuration */
  thresholds: {
    cpu: number;
    memory: number;
    disk: number;
    apiErrorRate: number;
    dbResponseTime: number;
  };
}

/**
 * Service health summary statistics
 */
export interface ServiceHealthSummary {
  /** Total number of services */
  total: number;
  /** Number of healthy services */
  healthy: number;
  /** Number of services with warnings */
  warning: number;
  /** Number of critical services */
  critical: number;
  /** Number of down services */
  down: number;
  /** Overall health percentage */
  healthPercentage: number;
}

/**
 * Performance metric trend data
 */
export interface MetricTrend {
  /** Metric name */
  name: string;
  /** Current value */
  current: number;
  /** Previous value for comparison */
  previous: number;
  /** Percentage change */
  change: number;
  /** Trend direction */
  direction: 'up' | 'down' | 'stable';
  /** Whether the trend is considered good or bad */
  isHealthy: boolean;
}

/**
 * System resource usage breakdown
 */
export interface ResourceUsage {
  /** CPU usage breakdown */
  cpu: {
    system: number;
    user: number;
    idle: number;
    iowait: number;
  };
  /** Memory usage breakdown */
  memory: {
    used: number;
    free: number;
    cached: number;
    buffers: number;
    total: number;
  };
  /** Disk usage breakdown */
  disk: {
    used: number;
    free: number;
    total: number;
    inodes: {
      used: number;
      total: number;
    };
  };
  /** Network interface statistics */
  network: {
    interfaces: Array<{
      name: string;
      bytesIn: number;
      bytesOut: number;
      packetsIn: number;
      packetsOut: number;
      errors: number;
    }>;
    totalBytesIn: number;
    totalBytesOut: number;
  };
}

/**
 * Extended system health metrics with additional context
 */
export interface ExtendedSystemHealthMetrics extends SystemHealthMetrics {
  /** Detailed resource usage breakdown */
  resources: ResourceUsage;
  /** Active alerts */
  alerts: HealthAlert[];
  /** Performance trends */
  trends: MetricTrend[];
  /** Load averages */
  loadAverage: {
    oneMin: number;
    fiveMin: number;
    fifteenMin: number;
  };
  /** System information */
  system: {
    hostname: string;
    platform: string;
    architecture: string;
    kernelVersion: string;
    totalMemory: number;
    cpuCount: number;
  };
}

/**
 * Props for SystemHealthDashboard with extended functionality
 */
export interface ExtendedSystemHealthDashboardProps extends BaseOrganismProps {
  /** Extended system health metrics */
  metrics: ExtendedSystemHealthMetrics;
  /** List of system services */
  services: SystemService[];
  /** Historical metrics for trend visualization */
  historicalMetrics?: SystemHealthMetrics[];
  /** Dashboard configuration */
  config?: Partial<HealthDashboardConfig>;
  /** Callback when metric thresholds are exceeded */
  onAlert?: (alert: HealthAlert) => void;
  /** Callback when service status changes */
  onServiceStatusChange?: (service: SystemService) => void;
  /** Callback when alert is acknowledged */
  onAlertAcknowledge?: (alertId: string) => void;
  /** Callback to refresh metrics */
  onRefresh?: () => void;
  /** Whether dashboard is in fullscreen mode */
  fullscreen?: boolean;
}

/**
 * Chart configuration for performance visualization
 */
export interface ChartConfiguration {
  /** Chart type */
  type: 'line' | 'area' | 'bar';
  /** Color scheme */
  colors: string[];
  /** Whether to show legend */
  showLegend: boolean;
  /** Whether to show grid */
  showGrid: boolean;
  /** Y-axis configuration */
  yAxis: {
    min?: number;
    max?: number;
    format?: (value: number) => string;
  };
  /** X-axis configuration */
  xAxis: {
    format?: (value: string) => string;
  };
  /** Animation configuration */
  animation: {
    enabled: boolean;
    duration: number;
  };
}

/**
 * Export all types for external use
 */
export type {
  SystemHealthDashboardProps,
  ServiceStatusCardProps,
  MetricsOverviewProps,
  PerformanceChartsProps,
} from './SystemHealthDashboard';
