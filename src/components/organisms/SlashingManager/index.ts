/**
 * Slashing Manager Organism - Export Module
 * 
 * Atomic Design Level: ORGANISM  
 * Phase 5: Enterprise-Scale Operations
 * 
 * Comprehensive slashing and score management system for enterprise-scale content
 * moderation operations with audit trails and safety controls.
 */

export { SlashingManager as default } from './SlashingManager';
export { SlashingManager } from './SlashingManager';

export type {
  SlashingManagerProps,
  CreateSlashingFormProps,
  SlashingCardProps,
  SlashingStatsProps,
} from './SlashingManager';

export type {
  SlashingAction,
} from '@/lib/types';
