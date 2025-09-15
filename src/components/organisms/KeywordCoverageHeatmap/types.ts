/**
 * KeywordCoverageHeatmap Organism Types
 * Atomic types for keyword coverage visualization
 */

import { BaseOrganismProps } from "@/lib/types";

export interface KeywordCoverageData {
  /** Keyword text */
  keyword: string;
  /** Coverage percentage (0-100) */
  coverage: number;
  /** Number of posts containing this keyword */
  postCount: number;
  /** Total number of mentions across all posts */
  mentions: number;
  /** Average engagement for posts with this keyword */
  avgEngagement: number;
  /** Trend compared to previous period (positive/negative percentage) */
  trend: number;
  /** Topic this keyword belongs to */
  topicId: string;
  /** Topic name for display */
  topicName: string;
  /** Color associated with the topic */
  topicColor: string;
}

export interface KeywordCoverageHeatmapProps extends BaseOrganismProps {
  /** Array of keyword coverage data */
  data: KeywordCoverageData[];
  /** Date range for the heatmap */
  dateRange?: {
    start: string;
    end: string;
  };
  /** Maximum number of keywords to display */
  maxKeywords?: number;
  /** Group by topics or show flat keyword list */
  groupByTopics?: boolean;
  /** Enable interactive features */
  interactive?: boolean;
  /** Callback when a keyword cell is clicked */
  onKeywordClick?: (keyword: KeywordCoverageData) => void;
  /** Show trend indicators */
  showTrends?: boolean;
  /** Color scheme for the heatmap */
  colorScheme?: 'coverage' | 'engagement' | 'trend';
}

export interface HeatmapCellProps {
  /** Keyword data for this cell */
  data: KeywordCoverageData;
  /** Size of the cell (responsive) */
  size: 'sm' | 'md' | 'lg';
  /** Color scheme being used */
  colorScheme: 'coverage' | 'engagement' | 'trend';
  /** Whether the cell is interactive */
  interactive: boolean;
  /** Click handler */
  onClick?: (data: KeywordCoverageData) => void;
  /** Show detailed tooltip on hover */
  showTooltip?: boolean;
}

export interface HeatmapLegendProps {
  /** Color scheme being displayed */
  colorScheme: 'coverage' | 'engagement' | 'trend';
  /** Range of values for the legend */
  valueRange: {
    min: number;
    max: number;
  };
}

export interface HeatmapFiltersProps {
  /** Available topics for filtering */
  topics: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  /** Selected topics */
  selectedTopics: string[];
  /** Topic selection change handler */
  onTopicsChange: (topics: string[]) => void;
  /** Coverage threshold filter */
  coverageThreshold: number;
  /** Coverage threshold change handler */
  onCoverageThresholdChange: (threshold: number) => void;
  /** Color scheme selection */
  colorScheme: 'coverage' | 'engagement' | 'trend';
  /** Color scheme change handler */
  onColorSchemeChange: (scheme: 'coverage' | 'engagement' | 'trend') => void;
  /** Whether to group by topics */
  groupByTopics: boolean;
  /** Group by topics change handler */
  onGroupByTopicsChange: (group: boolean) => void;
}
