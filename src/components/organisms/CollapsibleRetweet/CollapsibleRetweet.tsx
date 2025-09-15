'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Repeat2, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Quote,
  Users
} from 'lucide-react';
import { Button } from '@/components';
import { Card } from '@/components';
import { Badge } from '@/components';
import { Avatar, AvatarImage, AvatarFallback } from '@/components';
import { Separator } from '@/components';
import { ScrollArea } from '@/components';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components';
import { cn } from '@/lib/utils';
import type { CollapsibleRetweetProps, RetweetItem } from './types';

/**
 * CollapsibleRetweet Organism
 * Expandable retweet chain display with atomic composition
 * Efficiently manages large retweet threads with lazy loading
 */
export const CollapsibleRetweet: React.FC<CollapsibleRetweetProps> = ({
  chain,
  defaultExpanded = false,
  collapsedCount = 3,
  expandedCount = 20,
  onRetweetClick,
  onOriginalClick,
  onLoadMore,
  showEngagement = true,
  showTimestamps = true,
  compact = false,
  showAvatars = true,
  loading = false,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [loadingMore, setLoadingMore] = useState(false);

  // Calculate display counts
  const displayCount = isExpanded ? expandedCount : collapsedCount;
  const visibleRetweets = chain.retweets.slice(0, displayCount);
  const hiddenCount = Math.max(0, chain.retweets.length - displayCount);
  const canLoadMore = chain.hasMore && isExpanded;

  // Calculate aggregate stats
  const stats = useMemo(() => {
    const totalLikes = chain.retweets.reduce((sum, rt) => sum + rt.engagement.likes, 0);
    const totalShares = chain.retweets.reduce((sum, rt) => sum + rt.engagement.shares, 0);
    const totalComments = chain.retweets.reduce((sum, rt) => sum + rt.engagement.comments, 0);
    const uniqueUsers = new Set(chain.retweets.map(rt => rt.user.id)).size;
    
    return {
      totalRetweets: chain.totalCount,
      totalLikes,
      totalShares,
      totalComments,
      uniqueUsers,
      averageEngagement: (totalLikes + totalShares + totalComments) / chain.retweets.length || 0,
    };
  }, [chain]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Handle load more
  const handleLoadMore = async () => {
    if (!onLoadMore || loadingMore) return;
    
    setLoadingMore(true);
    try {
      await onLoadMore(chain.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  };

  // Render individual retweet item
  const renderRetweetItem = (retweet: RetweetItem, index: number) => (
    <div
      key={retweet.id}
      className={cn(
        "flex gap-3 py-2 transition-colors rounded-lg",
        "hover:bg-muted/50 cursor-pointer",
        compact && "py-1.5 gap-2"
      )}
      onClick={() => onRetweetClick?.(retweet)}
    >
      {/* Avatar */}
      {showAvatars && (
        <Avatar className={cn(compact ? "h-6 w-6" : "h-8 w-8")}>
          <AvatarImage src={retweet.user.profileImageUrl} />
          <AvatarFallback className="text-xs">
            {retweet.user.displayName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cn("font-medium", compact && "text-sm")}>
            {retweet.user.displayName}
          </span>
          <span className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
            @{retweet.user.username}
          </span>
          {retweet.user.isVerified && (
            <Badge variant="secondary" className="text-xs px-1">
              ✓
            </Badge>
          )}
          {retweet.isQuote && (
            <Quote className={cn(compact ? "h-3 w-3" : "h-4 w-4", "text-muted-foreground")} />
          )}
          {showTimestamps && (
            <span className={cn("text-muted-foreground ml-auto", compact ? "text-xs" : "text-sm")}>
              {formatTimestamp(retweet.timestamp)}
            </span>
          )}
        </div>

        {/* Quote comment */}
        {retweet.comment && (
          <p className={cn("text-muted-foreground mb-2", compact ? "text-sm" : "text-sm")}>
            {retweet.comment}
          </p>
        )}

        {/* Engagement */}
        {showEngagement && !compact && (
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            {retweet.engagement.likes > 0 && (
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{retweet.engagement.likes}</span>
              </div>
            )}
            {retweet.engagement.shares > 0 && (
              <div className="flex items-center gap-1">
                <Repeat2 className="h-3 w-3" />
                <span>{retweet.engagement.shares}</span>
              </div>
            )}
            {retweet.engagement.comments > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{retweet.engagement.comments}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 bg-muted rounded-full"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Original Post */}
      <div 
        className={cn("p-4 border-b cursor-pointer hover:bg-muted/30 transition-colors", compact && "p-3")}
        onClick={() => onOriginalClick?.(chain.originalPost)}
      >
        <div className="flex items-start gap-3">
          {showAvatars && (
            <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
              <AvatarImage src={chain.originalPost.author.profileImageUrl} />
              <AvatarFallback>
                {chain.originalPost.author.displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("font-semibold", compact && "text-sm")}>
                {chain.originalPost.author.displayName}
              </span>
              <span className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
                @{chain.originalPost.author.username}
              </span>
              {chain.originalPost.author.isVerified && (
                <Badge variant="secondary" className="text-xs px-1">
                  ✓
                </Badge>
              )}
              {showTimestamps && (
                <span className={cn("text-muted-foreground ml-auto", compact ? "text-xs" : "text-sm")}>
                  {formatTimestamp(chain.originalPost.createdAt)}
                </span>
              )}
            </div>
            <p className={cn(compact ? "text-sm" : "text-base", "mb-3")}>
              {chain.originalPost.content}
            </p>
            
            {/* Original post engagement */}
            {showEngagement && (
              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{chain.originalPost.engagement.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Repeat2 className="h-4 w-4" />
                  <span>{chain.originalPost.engagement.shares}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{chain.originalPost.engagement.comments}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Retweet Stats */}
      <div className={cn("px-4 py-3 bg-muted/30", compact && "px-3 py-2")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Repeat2 className={cn(compact ? "h-3 w-3" : "h-4 w-4")} />
              <span className={cn("font-medium", compact && "text-sm")}>
                {stats.totalRetweets.toLocaleString()} Retweets
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className={cn(compact ? "h-3 w-3" : "h-4 w-4")} />
              <span className={cn(compact ? "text-xs" : "text-sm")}>
                {stats.uniqueUsers} users
              </span>
            </div>
          </div>
          
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("gap-1", compact && "text-xs")}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Show {hiddenCount > 0 ? `${hiddenCount} more` : 'All'}
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </div>

      {/* Retweet Chain */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <div className={cn("max-h-96", compact && "max-h-80")}>
            <ScrollArea className="h-full">
              <div className={cn("p-4 space-y-1", compact && "p-3")}>
                {visibleRetweets.map((retweet, index) => 
                  renderRetweetItem(retweet, index)
                )}
                
                {/* Load More Button */}
                {canLoadMore && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="w-full"
                    >
                      {loadingMore ? (
                        <>Loading more retweets...</>
                      ) : (
                        <>Load More Retweets</>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      {/* Collapsed Preview */}
      {!isExpanded && chain.retweets.length > 0 && (
        <div className={cn("p-4 space-y-1", compact && "p-3")}>
          {visibleRetweets.map((retweet, index) => 
            renderRetweetItem(retweet, index)
          )}
          
          {hiddenCount > 0 && (
            <div className="pt-2 text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className={cn("text-muted-foreground", compact && "text-xs")}
              >
                View {hiddenCount} more retweets
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default CollapsibleRetweet;
