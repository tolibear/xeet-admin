/**
 * Xeet Admin Platform - Type Definitions
 * Galaxy-scale TypeScript types for atomic design system
 */

// Atomic Design System Types
export type AtomicLevel = "atom" | "molecule" | "organism" | "template" | "system" | "galaxy";

export type ComponentState = "loading" | "error" | "success" | "idle" | "disabled";

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export type Variant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";

// Organization and Multi-tenancy
export interface Organization {
  id: string;
  slug: string;
  name: string;
  description?: string;
  settings: OrganizationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  theme: "dark" | "light";
  timezone: string;
  features: string[];
}

// Data structures for Research Hub
export interface Post {
  id: string;
  content: string;
  author: User;
  platform: Platform;
  engagement: EngagementMetrics;
  score: number;
  signals: Signal[];
  topics: Topic[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  platform: Platform;
  followerCount: number;
  isVerified: boolean;
  bio?: string;
  profileImageUrl?: string;
}

export interface Platform {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
}

export interface EngagementMetrics {
  likes: number;
  shares: number;
  comments: number;
  views: number;
  impressions: number;
}

export interface Signal {
  id: string;
  type: SignalType;
  value: number;
  confidence: number;
  source: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export type SignalType =
  | "engagement"
  | "sentiment"
  | "reach"
  | "influence"
  | "relevance"
  | "quality";

export interface Topic {
  id: string;
  name: string;
  keywords: string[];
  synonyms: string[];
  stopWords: string[];
  color: string;
  isActive: boolean;
}

// Leaderboard System
export interface Leaderboard {
  id: string;
  name: string;
  description: string;
  slug: string;
  isPublic: boolean;
  criteria: LeaderboardCriteria;
  entries: LeaderboardEntry[];
  settings: LeaderboardSettings;
  orgId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardCriteria {
  timeframe: "hour" | "day" | "week" | "month" | "year" | "all";
  platforms: string[];
  topics: string[];
  signals: SignalType[];
  minScore: number;
  maxEntries: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  user: User;
  score: number;
  posts: Post[];
  change: number; // rank change from previous period
}

export interface LeaderboardSettings {
  updateFrequency: "realtime" | "hourly" | "daily";
  showScores: boolean;
  showChange: boolean;
  allowEmbedding: boolean;
}

// Data Table and Pagination
export interface PaginationParams {
  cursor?: string;
  limit: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  cursor?: string;
  hasMore: boolean;
  total?: number;
}

// Chart and Visualization
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
}

export type ChartType = "line" | "bar" | "pie" | "scatter" | "heatmap" | "area";

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Scoring System Types
export interface ScoringRule {
  id: string;
  name: string;
  description: string;
  category: ScoringCategory;
  weight: number;
  conditions: ScoringCondition[];
  actions: ScoringAction[];
  isActive: boolean;
  priority: number;
  version: number;
  status: RuleStatus;
  createdAt: string;
  updatedAt: string;
  metadata: Record<string, unknown>;
}

export interface ScoringCondition {
  id: string;
  field: string;
  operator: ConditionOperator;
  value: unknown;
  logicalOperator?: "AND" | "OR";
}

export interface ScoringAction {
  id: string;
  type: ActionType;
  value: number;
  reason: string;
}

export type ScoringCategory = 
  | "engagement" 
  | "quality" 
  | "relevance" 
  | "influence" 
  | "sentiment" 
  | "reach";

export type ConditionOperator = 
  | "equals" 
  | "not_equals" 
  | "greater_than" 
  | "less_than" 
  | "contains" 
  | "not_contains" 
  | "in" 
  | "not_in";

export type ActionType = "add" | "subtract" | "multiply" | "set_min" | "set_max";

export type RuleStatus = "draft" | "staged" | "active" | "archived";

export interface RuleSet {
  id: string;
  name: string;
  description: string;
  version: string;
  rules: ScoringRule[];
  status: RuleStatus;
  orgId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScoreBreakdown {
  postId: string;
  totalScore: number;
  baseScore: number;
  appliedRules: AppliedRule[];
  computedAt: string;
  version: string;
}

export interface AppliedRule {
  ruleId: string;
  ruleName: string;
  category: ScoringCategory;
  impact: number;
  reason: string;
  confidence: number;
  appliedConditions: string[];
}

export interface ScoreComparison {
  id: string;
  name: string;
  ruleSetA: RuleSet;
  ruleSetB: RuleSet;
  testPosts: Post[];
  results: ComparisonResult[];
  createdAt: string;
  status: "running" | "completed" | "failed";
}

export interface ComparisonResult {
  postId: string;
  scoreA: ScoreBreakdown;
  scoreB: ScoreBreakdown;
  difference: number;
  percentChange: number;
}

// Keyword Coverage Analysis (Phase 4)
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

// Network Visualization System (Phase 4)
export interface NetworkNode {
  /** Unique node identifier */
  id: string;
  /** Display name for the node */
  name: string;
  /** Node type (user, post, topic, etc.) */
  type: 'user' | 'post' | 'topic' | 'keyword' | 'hashtag';
  /** Node size based on importance/influence */
  size: number;
  /** Color for visual categorization */
  color: string;
  /** Additional data for the node */
  data: Record<string, unknown>;
  /** X coordinate (can be set for fixed positioning) */
  x?: number;
  /** Y coordinate (can be set for fixed positioning) */
  y?: number;
  /** Fixed position flag */
  fx?: number;
  /** Fixed position flag */
  fy?: number;
}

export interface NetworkLink {
  /** Source node ID */
  source: string;
  /** Target node ID */
  target: string;
  /** Strength/weight of the connection */
  value: number;
  /** Type of relationship */
  type: 'follows' | 'mentions' | 'retweets' | 'replies' | 'shared_topic' | 'keyword_match';
  /** Color for the link */
  color?: string;
  /** Additional data for the link */
  data?: Record<string, unknown>;
}

export interface NetworkData {
  /** Array of nodes in the network */
  nodes: NetworkNode[];
  /** Array of links between nodes */
  links: NetworkLink[];
}

export interface NetworkCluster {
  /** Cluster identifier */
  id: string;
  /** Cluster name */
  name: string;
  /** Nodes belonging to this cluster */
  nodeIds: string[];
  /** Cluster color */
  color: string;
  /** Cluster center coordinates */
  center?: { x: number; y: number };
  /** Cluster metrics */
  metrics?: {
    density: number;
    centralityScore: number;
    influence: number;
  };
}

// Live Feed System (Phase 4)
export interface LiveFeedItem {
  /** Unique identifier for the feed item */
  id: string;
  /** Type of feed item */
  type: 'post' | 'user_action' | 'signal' | 'system_event';
  /** Timestamp when the item was created */
  timestamp: string;
  /** Title or summary of the feed item */
  title: string;
  /** Detailed content */
  content: string;
  /** Related data object */
  data: Record<string, unknown>;
  /** Source of the feed item */
  source: string;
  /** Priority level */
  priority: 'low' | 'medium' | 'high' | 'urgent';
  /** Tags for categorization */
  tags: string[];
  /** Whether the item has been read */
  read: boolean;
  /** Associated user if applicable */
  user?: User;
  /** Associated post if applicable */
  post?: Post;
}

export interface LiveFeedConnection {
  /** Connection ID */
  id: string;
  /** Connection status */
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  /** Connection type */
  type: 'websocket' | 'sse';
  /** Connection URL */
  url: string;
  /** Last activity timestamp */
  lastActivity: string;
  /** Error message if any */
  error?: string;
  /** Connection metrics */
  metrics: {
    messagesReceived: number;
    bytesReceived: number;
    connectionTime: number;
    reconnectCount: number;
  };
}

export interface LiveFeedFilters {
  /** Types to include */
  types: LiveFeedItem['type'][];
  /** Priority levels to include */
  priorities: LiveFeedItem['priority'][];
  /** Tags to filter by */
  tags: string[];
  /** Sources to include */
  sources: string[];
  /** Show only unread items */
  unreadOnly: boolean;
  /** Date range filter */
  dateRange?: {
    start: string;
    end: string;
  };
}

// Component Props Base Types
export interface BaseAtomProps {
  className?: string;
  children?: React.ReactNode;
  "data-testid"?: string;
}

export interface BaseMoleculeProps extends BaseAtomProps {
  size?: Size;
  variant?: Variant;
}

export interface BaseOrganismProps extends BaseMoleculeProps {
  loading?: boolean;
  error?: string | null;
  onError?: (error: Error) => void;
}
