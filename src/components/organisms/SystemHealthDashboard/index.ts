/**
 * System Health Dashboard Organism - Export Module
 * 
 * Atomic Design Level: ORGANISM  
 * Phase 5: Galaxy-Scale Operations
 * 
 * Comprehensive system health monitoring dashboard for galaxy-scale operations.
 * Provides real-time system metrics, service status monitoring, performance
 * visualization, and alert management for admin operations.
 */

export { SystemHealthDashboard as default } from './SystemHealthDashboard';
export { SystemHealthDashboard } from './SystemHealthDashboard';

export type {
  SystemHealthDashboardProps,
  ServiceStatusCardProps,
  MetricsOverviewProps,
  PerformanceChartsProps,
} from './SystemHealthDashboard';

export type {
  SystemHealthMetrics,
  SystemService,
  JobQueue,
  BackfillJob,
  LogEntry,
  BulkOperation,
  SlashingAction,
} from '@/lib/types';
