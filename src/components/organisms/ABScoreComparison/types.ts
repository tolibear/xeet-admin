/**
 * ABScoreComparison Organism Types
 * A/B testing system for scoring rule comparisons
 */

import type { 
  ScoreComparison,
  ComparisonResult, 
  RuleSet,
  Post,
  ScoreBreakdown,
  BaseOrganismProps 
} from "@/lib/types";

export interface ABScoreComparisonProps extends BaseOrganismProps {
  /** Comparison data */
  comparison: ScoreComparison;
  /** Whether to show detailed breakdowns */
  showBreakdowns?: boolean;
  /** Whether to show statistical analysis */
  showStatistics?: boolean;
  /** Number of results to display per page */
  pageSize?: number;
  /** Callback when a post result is selected */
  onPostSelect?: (post: Post, resultA: ScoreBreakdown, resultB: ScoreBreakdown) => void;
  /** Callback when comparison is exported */
  onExport?: (format: ComparisonExportFormat) => void;
  /** Callback when new comparison is requested */
  onNewComparison?: () => void;
}

export interface ComparisonSummaryProps {
  /** Comparison results */
  results: ComparisonResult[];
  /** Rule set A */
  ruleSetA: RuleSet;
  /** Rule set B */
  ruleSetB: RuleSet;
  /** Whether to show detailed statistics */
  showDetails?: boolean;
}

export interface ComparisonResultCardProps {
  /** Single comparison result */
  result: ComparisonResult;
  /** The post being compared */
  post: Post;
  /** Whether to show detailed breakdowns */
  showBreakdown?: boolean;
  /** Whether this result is selected */
  isSelected?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export interface ScoreComparisonChartProps {
  /** Comparison results for visualization */
  results: ComparisonResult[];
  /** Chart type */
  chartType?: ComparisonChartType;
  /** Height of the chart */
  height?: number;
  /** Whether to show trend lines */
  showTrend?: boolean;
}

export interface ComparisonFiltersProps {
  /** Current filter values */
  filters: ComparisonFilters;
  /** Available posts for filtering */
  posts: Post[];
  /** Callback when filters change */
  onFiltersChange: (filters: ComparisonFilters) => void;
  /** Callback when filters are cleared */
  onClear: () => void;
}

export type ComparisonExportFormat = "csv" | "json" | "pdf" | "xlsx";

export type ComparisonChartType = "scatter" | "histogram" | "difference" | "correlation";

export interface ComparisonFilters {
  /** Minimum score difference to show */
  minDifference?: number;
  /** Maximum score difference to show */
  maxDifference?: number;
  /** Show only improvements */
  improvementsOnly?: boolean;
  /** Show only regressions */
  regressionsOnly?: boolean;
  /** Filter by platform */
  platforms?: string[];
  /** Filter by score range */
  scoreRange?: [number, number];
  /** Filter by percentage change */
  percentageRange?: [number, number];
}

export interface ComparisonStatistics {
  /** Total posts compared */
  totalPosts: number;
  /** Number of improvements (B > A) */
  improvements: number;
  /** Number of regressions (B < A) */
  regressions: number;
  /** Number of unchanged scores */
  unchanged: number;
  /** Average difference (B - A) */
  averageDifference: number;
  /** Median difference */
  medianDifference: number;
  /** Standard deviation of differences */
  standardDeviation: number;
  /** Maximum positive change */
  maxImprovement: number;
  /** Maximum negative change */
  maxRegression: number;
  /** Correlation coefficient between A and B scores */
  correlation: number;
}

export interface ComparisonInsight {
  /** Type of insight */
  type: InsightType;
  /** Human-readable title */
  title: string;
  /** Detailed description */
  description: string;
  /** Confidence level (0-1) */
  confidence: number;
  /** Supporting data */
  data?: Record<string, unknown>;
  /** Severity level */
  severity: InsightSeverity;
}

export type InsightType = 
  | "significant_improvement"
  | "significant_regression" 
  | "high_variance"
  | "systematic_bias"
  | "outlier_detection"
  | "category_impact"
  | "rule_effectiveness";

export type InsightSeverity = "info" | "warning" | "error" | "success";
