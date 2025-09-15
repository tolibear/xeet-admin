/**
 * Bulk Operations Manager Organism - Export Module
 * 
 * Atomic Design Level: ORGANISM  
 * Phase 5: Enterprise-Scale Operations
 * 
 * Comprehensive bulk operations management system for enterprise-scale data
 * processing and batch operations with safety controls and audit trails.
 */

export { BulkOperationsManager as default } from './BulkOperationsManager';
export { BulkOperationsManager } from './BulkOperationsManager';

export type {
  BulkOperationsManagerProps,
  CreateOperationFormProps,
  OperationCardProps,
  OperationsStatsProps,
} from './BulkOperationsManager';

export type {
  BulkOperation,
} from '@/lib/types';
