/**
 * RuleSetManager Organism Types
 * Rule set lifecycle management system (draft/staged/active)
 */

import type { 
  RuleSet,
  ScoringRule, 
  RuleStatus,
  BaseOrganismProps 
} from "@/lib/types";

export interface RuleSetManagerProps extends BaseOrganismProps {
  /** Available rule sets */
  ruleSets: RuleSet[];
  /** Currently active rule set ID */
  activeRuleSetId?: string;
  /** Currently staged rule set ID */
  stagedRuleSetId?: string;
  /** Whether user can create new rule sets */
  canCreate?: boolean;
  /** Whether user can edit rule sets */
  canEdit?: boolean;
  /** Whether user can promote/deploy rule sets */
  canPromote?: boolean;
  /** Callback when rule set is selected */
  onRuleSetSelect?: (ruleSet: RuleSet) => void;
  /** Callback when rule set is created */
  onRuleSetCreate?: (name: string, description: string) => void;
  /** Callback when rule set is cloned */
  onRuleSetClone?: (sourceRuleSet: RuleSet, newName: string) => void;
  /** Callback when rule set is promoted */
  onRuleSetPromote?: (ruleSet: RuleSet, toStatus: RuleStatus) => void;
  /** Callback when rule set is archived */
  onRuleSetArchive?: (ruleSet: RuleSet) => void;
  /** Callback when rule set is deleted */
  onRuleSetDelete?: (ruleSet: RuleSet) => void;
}

export interface RuleSetCardProps {
  /** Rule set data */
  ruleSet: RuleSet;
  /** Whether this is the active rule set */
  isActive?: boolean;
  /** Whether this is the staged rule set */
  isStaged?: boolean;
  /** Whether user can edit this rule set */
  canEdit?: boolean;
  /** Whether user can promote this rule set */
  canPromote?: boolean;
  /** Whether this rule set is selected */
  isSelected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Action handlers */
  onEdit?: () => void;
  onClone?: () => void;
  onPromote?: (toStatus: RuleStatus) => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export interface RuleSetActionsProps {
  /** Rule set to show actions for */
  ruleSet: RuleSet;
  /** Whether user can edit */
  canEdit?: boolean;
  /** Whether user can promote */
  canPromote?: boolean;
  /** Whether this is the active rule set */
  isActive?: boolean;
  /** Whether this is the staged rule set */  
  isStaged?: boolean;
  /** Action handlers */
  onEdit?: () => void;
  onClone?: () => void;
  onPromote?: (toStatus: RuleStatus) => void;
  onArchive?: () => void;
  onDelete?: () => void;
}

export interface CreateRuleSetModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Submit handler */
  onSubmit: (name: string, description: string, basedOn?: RuleSet) => void;
  /** Available rule sets to base new one on */
  availableRuleSets?: RuleSet[];
}

export interface PromoteRuleSetModalProps {
  /** Whether modal is open */
  open: boolean;
  /** Rule set to promote */
  ruleSet: RuleSet;
  /** Target status */
  targetStatus: RuleStatus;
  /** Close handler */
  onClose: () => void;
  /** Confirm handler */
  onConfirm: () => void;
}

export interface RuleSetFiltersProps {
  /** Current filter values */
  filters: RuleSetFilters;
  /** Available organizations */
  organizations?: string[];
  /** Callback when filters change */
  onFiltersChange: (filters: RuleSetFilters) => void;
  /** Callback to clear all filters */
  onClear: () => void;
}

export interface RuleSetFilters {
  /** Filter by status */
  status?: RuleStatus[];
  /** Search by name */
  search?: string;
  /** Filter by organization */
  orgId?: string;
  /** Filter by date range */
  dateRange?: [Date, Date];
  /** Sort field */
  sortBy?: RuleSetSortField;
  /** Sort direction */
  sortDirection?: "asc" | "desc";
}

export type RuleSetSortField = "name" | "status" | "version" | "updatedAt" | "createdAt";

export interface RuleSetStatusBadgeProps {
  /** Rule set status */
  status: RuleStatus;
  /** Whether this is the active rule set */
  isActive?: boolean;
  /** Whether this is the staged rule set */
  isStaged?: boolean;
  /** Badge size */
  size?: "sm" | "md" | "lg";
}

export interface RuleSetMetricsProps {
  /** Rule sets to analyze */
  ruleSets: RuleSet[];
  /** Time period for metrics */
  period?: MetricsPeriod;
}

export type MetricsPeriod = "24h" | "7d" | "30d" | "90d";

export interface RuleSetDeploymentHistory {
  /** Deployment ID */
  id: string;
  /** Rule set that was deployed */
  ruleSet: RuleSet;
  /** Previous rule set (if any) */
  previousRuleSet?: RuleSet;
  /** Status of deployment */
  status: DeploymentStatus;
  /** Who initiated the deployment */
  deployedBy: string;
  /** When deployment started */
  deployedAt: string;
  /** When deployment completed/failed */
  completedAt?: string;
  /** Deployment notes */
  notes?: string;
  /** Rollback information */
  rollbackInfo?: {
    canRollback: boolean;
    rollbackTo?: RuleSet;
  };
}

export type DeploymentStatus = "pending" | "deploying" | "deployed" | "failed" | "rolled_back";
