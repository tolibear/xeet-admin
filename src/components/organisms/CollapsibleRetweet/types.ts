/**
 * CollapsibleRetweet Organism Types
 * Atomic types for retweet chain management functionality
 */

import { Post, User, BaseOrganismProps } from "@/lib/types";

export interface RetweetChain {
  /** Original post that was retweeted */
  originalPost: Post;
  /** Chain of retweets */
  retweets: RetweetItem[];
  /** Total count of retweets */
  totalCount: number;
  /** Whether there are more retweets to load */
  hasMore: boolean;
  /** Next cursor for pagination */
  nextCursor?: string;
}

export interface RetweetItem {
  /** Unique identifier for this retweet */
  id: string;
  /** User who retweeted */
  user: User;
  /** When the retweet happened */
  timestamp: string;
  /** Optional comment/quote added to the retweet */
  comment?: string;
  /** Engagement metrics for this retweet */
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  /** Whether this is a quote retweet */
  isQuote: boolean;
}

export interface CollapsibleRetweetProps extends BaseOrganismProps {
  /** Retweet chain data */
  chain: RetweetChain;
  /** Whether the chain is initially expanded */
  defaultExpanded?: boolean;
  /** Maximum retweets to show when collapsed */
  collapsedCount?: number;
  /** Maximum retweets to show when expanded */
  expandedCount?: number;
  /** Callback when a retweet is clicked */
  onRetweetClick?: (retweet: RetweetItem) => void;
  /** Callback when the original post is clicked */
  onOriginalClick?: (post: Post) => void;
  /** Callback to load more retweets */
  onLoadMore?: (cursor?: string) => void;
  /** Show engagement metrics */
  showEngagement?: boolean;
  /** Show timestamps */
  showTimestamps?: boolean;
  /** Compact display mode */
  compact?: boolean;
  /** Show user avatars */
  showAvatars?: boolean;
}

export interface RetweetItemProps {
  /** Retweet data */
  retweet: RetweetItem;
  /** Whether to show engagement metrics */
  showEngagement?: boolean;
  /** Whether to show timestamps */
  showTimestamps?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Compact display mode */
  compact?: boolean;
  /** Show user avatar */
  showAvatar?: boolean;
  /** Whether this is the first item in a chain */
  isFirst?: boolean;
  /** Whether this is the last item in a chain */
  isLast?: boolean;
}

export interface RetweetStatsProps {
  /** Retweet chain statistics */
  stats: {
    totalRetweets: number;
    totalLikes: number;
    totalShares: number;
    totalComments: number;
    uniqueUsers: number;
    topRetweeter?: User;
    averageEngagement: number;
  };
  /** Compact display */
  compact?: boolean;
}
