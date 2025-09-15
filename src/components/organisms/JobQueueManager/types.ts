/**
 * Job Queue Manager Types
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Galaxy-Scale Operations
 * 
 * Type definitions for job queue management system components.
 */

import type { 
  JobQueue, 
  BackfillJob, 
  JobType,
  BaseOrganismProps 
} from '@/lib/types';

/**
 * Job execution priority levels
 */
export type JobPriority = 'low' | 'normal' | 'high' | 'critical' | 'emergency';

/**
 * Queue management actions
 */
export type QueueAction = 'pause' | 'resume' | 'stop' | 'clear' | 'drain';

/**
 * Job lifecycle management actions
 */
export type JobAction = 'retry' | 'cancel' | 'restart' | 'delete' | 'duplicate';

/**
 * Bulk operation types for job management
 */
export type BulkJobAction = 'cancel' | 'retry' | 'delete' | 'reprioritize' | 'reschedule';

/**
 * Queue health status indicators
 */
export interface QueueHealthStatus {
  /** Overall queue health */
  status: 'healthy' | 'warning' | 'critical' | 'down';
  /** Health score (0-100) */
  score: number;
  /** Issues affecting queue health */
  issues: Array<{
    type: 'high_failure_rate' | 'queue_backup' | 'slow_processing' | 'memory_pressure';
    severity: 'low' | 'medium' | 'high';
    message: string;
    affectedJobs?: number;
  }>;
  /** Health check timestamp */
  lastCheck: string;
}

/**
 * Advanced queue configuration
 */
export interface QueueConfiguration {
  /** Maximum queue size before blocking new jobs */
  maxSize: number;
  /** Maximum concurrent job processing */
  concurrency: number;
  /** Job timeout in seconds */
  jobTimeout: number;
  /** Number of retry attempts for failed jobs */
  retryAttempts: number;
  /** Retry delay strategy */
  retryDelay: {
    type: 'fixed' | 'exponential' | 'linear';
    baseDelay: number;
    maxDelay: number;
  };
  /** Dead letter queue configuration */
  deadLetterQueue?: {
    enabled: boolean;
    maxRetries: number;
    ttl: number; // Time to live in seconds
  };
  /** Queue monitoring settings */
  monitoring: {
    metricsEnabled: boolean;
    alertThresholds: {
      queueSize: number;
      failureRate: number;
      avgProcessingTime: number;
    };
  };
}

/**
 * Job execution context and metadata
 */
export interface JobExecutionContext {
  /** Execution environment */
  environment: 'development' | 'staging' | 'production';
  /** Worker node information */
  worker: {
    id: string;
    hostname: string;
    pid: number;
    version: string;
  };
  /** Resource limits */
  resources: {
    maxMemory: number;
    maxCpuTime: number;
    maxDiskSpace: number;
  };
  /** Execution metadata */
  metadata: {
    attemptNumber: number;
    totalAttempts: number;
    previousFailures?: string[];
    dependencies?: string[];
    tags?: string[];
  };
}

/**
 * Job performance metrics
 */
export interface JobPerformanceMetrics {
  /** Execution time statistics */
  executionTime: {
    min: number;
    max: number;
    avg: number;
    p50: number;
    p95: number;
    p99: number;
  };
  /** Memory usage statistics */
  memoryUsage: {
    peak: number;
    avg: number;
    current: number;
  };
  /** Throughput metrics */
  throughput: {
    recordsPerSecond: number;
    bytesPerSecond: number;
    operationsPerSecond: number;
  };
  /** Error analytics */
  errors: {
    totalCount: number;
    uniqueErrors: number;
    mostCommonError: string;
    errorCategories: Record<string, number>;
  };
}

/**
 * Extended job information with performance and context
 */
export interface ExtendedBackfillJob extends BackfillJob {
  /** Queue this job belongs to */
  queueId: string;
  /** Job execution context */
  context: JobExecutionContext;
  /** Performance metrics */
  metrics?: JobPerformanceMetrics;
  /** Retry history */
  retryHistory?: Array<{
    attempt: number;
    startTime: string;
    endTime?: string;
    error?: string;
    duration?: number;
  }>;
  /** Job dependencies */
  dependencies?: string[];
  /** Jobs that depend on this one */
  dependents?: string[];
  /** Estimated completion time */
  estimatedCompletion?: string;
  /** Resource usage */
  resourceUsage?: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

/**
 * Queue analytics and insights
 */
export interface QueueAnalytics {
  /** Processing statistics */
  processing: {
    totalJobsProcessed: number;
    successRate: number;
    avgProcessingTime: number;
    throughputTrend: Array<{
      timestamp: string;
      jobsPerMinute: number;
    }>;
  };
  /** Failure analysis */
  failures: {
    totalFailures: number;
    failuresByType: Record<string, number>;
    mostCommonFailures: Array<{
      error: string;
      count: number;
      percentage: number;
    }>;
    failureTrend: Array<{
      timestamp: string;
      failureCount: number;
      failureRate: number;
    }>;
  };
  /** Resource utilization */
  resources: {
    avgMemoryUsage: number;
    avgCpuUsage: number;
    peakResourceUsage: {
      timestamp: string;
      memory: number;
      cpu: number;
    };
  };
  /** Queue capacity analysis */
  capacity: {
    utilizationPercentage: number;
    bottlenecks: string[];
    recommendations: string[];
  };
}

/**
 * Job scheduling configuration
 */
export interface JobScheduleConfig {
  /** Schedule type */
  type: 'immediate' | 'delayed' | 'cron' | 'recurring';
  /** Schedule expression (for cron jobs) */
  expression?: string;
  /** Delay before execution (for delayed jobs) */
  delay?: number;
  /** Recurring interval (for recurring jobs) */
  interval?: number;
  /** Schedule timezone */
  timezone?: string;
  /** Maximum number of executions (for recurring jobs) */
  maxExecutions?: number;
  /** Schedule end date */
  endDate?: string;
}

/**
 * Extended queue information with analytics
 */
export interface ExtendedJobQueue extends JobQueue {
  /** Queue configuration */
  configuration: QueueConfiguration;
  /** Health status */
  health: QueueHealthStatus;
  /** Analytics data */
  analytics?: QueueAnalytics;
  /** Active worker count */
  activeWorkers: number;
  /** Queue capacity information */
  capacity: {
    current: number;
    maximum: number;
    utilizationPercentage: number;
  };
  /** Recent job activity */
  recentActivity: Array<{
    timestamp: string;
    action: 'job_added' | 'job_started' | 'job_completed' | 'job_failed';
    jobId: string;
    details?: string;
  }>;
}

/**
 * Export prop types for external use
 */
export type {
  JobQueueManagerProps,
  QueueCardProps, 
  JobTableProps,
  QueueMetricsProps,
} from './JobQueueManager';
