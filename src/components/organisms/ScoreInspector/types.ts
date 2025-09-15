/**
 * ScoreInspector Organism Types
 * Atomic rule breakdown visualization system
 */

import type { 
  ScoreBreakdown, 
  AppliedRule, 
  Post, 
  ScoringCategory,
  BaseOrganismProps 
} from "@/lib/types";

export interface ScoreInspectorProps extends BaseOrganismProps {
  /** Post to inspect scoring for */
  post: Post;
  /** Score breakdown data */
  scoreBreakdown: ScoreBreakdown;
  /** Whether to show detailed rule information */
  showDetails?: boolean;
  /** Whether to show rule confidence levels */
  showConfidence?: boolean;
  /** Categories to highlight or filter */
  highlightCategories?: ScoringCategory[];
  /** Callback when rule is clicked */
  onRuleClick?: (rule: AppliedRule) => void;
  /** Callback when export is requested */
  onExport?: (format: ExportFormat) => void;
}

export interface RuleCardProps {
  /** Applied rule data */
  rule: AppliedRule;
  /** Whether this rule is highlighted */
  isHighlighted?: boolean;
  /** Whether to show detailed information */
  showDetails?: boolean;
  /** Whether to show confidence indicator */
  showConfidence?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export interface ScoreSummaryProps {
  /** Score breakdown data */
  scoreBreakdown: ScoreBreakdown;
  /** Whether to show computation details */
  showComputationDetails?: boolean;
}

export interface ScoreVisualizationProps {
  /** Score breakdown data */
  scoreBreakdown: ScoreBreakdown;
  /** Height of the visualization */
  height?: number;
  /** Whether to animate the visualization */
  animated?: boolean;
}

export type ExportFormat = "json" | "csv" | "pdf";

export interface RuleCategoryGroup {
  category: ScoringCategory;
  rules: AppliedRule[];
  totalImpact: number;
  averageConfidence: number;
}
