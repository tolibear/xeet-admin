/**
 * Job Queue Manager Organism - Export Module
 * 
 * Atomic Design Level: ORGANISM  
 * Phase 5: Enterprise-Scale Operations
 * 
 * Comprehensive job queue management system for enterprise-scale background
 * processing operations. Provides real-time monitoring, lifecycle tracking,
 * retry mechanisms, and bulk job management capabilities.
 */

export { JobQueueManager as default } from './JobQueueManager';
export { JobQueueManager } from './JobQueueManager';

export type {
  JobQueueManagerProps,
  QueueCardProps,
  JobTableProps,
  QueueMetricsProps,
} from './JobQueueManager';

export type {
  JobQueue,
  BackfillJob,
  JobType,
} from '@/lib/types';
