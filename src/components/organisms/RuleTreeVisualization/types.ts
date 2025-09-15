/**
 * RuleTreeVisualization Organism Types
 * Hierarchical scoring rules visualization system
 */

import type { 
  ScoringRule, 
  RuleSet, 
  ScoringCategory,
  BaseOrganismProps 
} from "@/lib/types";

export interface RuleTreeVisualizationProps extends BaseOrganismProps {
  /** Rule set to visualize */
  ruleSet: RuleSet;
  /** Selected rule IDs to highlight */
  selectedRuleIds?: string[];
  /** Collapsed category IDs */
  collapsedCategories?: ScoringCategory[];
  /** Whether to show rule connections/dependencies */
  showConnections?: boolean;
  /** Whether to show rule statistics */
  showStatistics?: boolean;
  /** View mode for the tree */
  viewMode?: TreeViewMode;
  /** Callback when rule is selected */
  onRuleSelect?: (rule: ScoringRule) => void;
  /** Callback when category is toggled */
  onCategoryToggle?: (category: ScoringCategory) => void;
  /** Callback when view mode changes */
  onViewModeChange?: (mode: TreeViewMode) => void;
}

export interface TreeNodeProps {
  /** Rule data */
  rule: ScoringRule;
  /** Whether this node is selected */
  isSelected?: boolean;
  /** Whether this node is highlighted */
  isHighlighted?: boolean;
  /** Tree depth level */
  level?: number;
  /** Whether this node is expanded */
  isExpanded?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Expand/collapse handler */
  onToggle?: () => void;
}

export interface CategoryNodeProps {
  /** Category information */
  category: ScoringCategory;
  /** Rules in this category */
  rules: ScoringRule[];
  /** Whether this category is expanded */
  isExpanded?: boolean;
  /** Whether any rules in this category are selected */
  hasSelectedRules?: boolean;
  /** Category statistics */
  statistics?: CategoryStatistics;
  /** Click handler */
  onClick?: () => void;
  /** Expand/collapse handler */
  onToggle?: () => void;
}

export interface TreeConnectionProps {
  /** Source rule ID */
  sourceRuleId: string;
  /** Target rule ID */
  targetRuleId: string;
  /** Connection type */
  connectionType: ConnectionType;
  /** Whether this connection is highlighted */
  isHighlighted?: boolean;
}

export type TreeViewMode = 
  | "category" // Group by category
  | "priority" // Group by priority level
  | "dependency" // Show dependency tree
  | "execution"; // Show execution order

export type ConnectionType = 
  | "dependency" // One rule depends on another
  | "conflict" // Rules may conflict
  | "sequence" // Rules execute in sequence
  | "conditional"; // Conditional execution

export interface CategoryStatistics {
  totalRules: number;
  activeRules: number;
  averagePriority: number;
  averageWeight: number;
  totalImpact: number;
}

export interface RuleHierarchy {
  category: ScoringCategory;
  rules: ScoringRule[];
  subcategories?: RuleHierarchy[];
}

export interface ExecutionFlow {
  order: number;
  rule: ScoringRule;
  dependencies: string[];
  conditions: string[];
}

export interface TreeLayoutConfig {
  nodeWidth: number;
  nodeHeight: number;
  horizontalSpacing: number;
  verticalSpacing: number;
  categorySpacing: number;
}
