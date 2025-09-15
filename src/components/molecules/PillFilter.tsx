'use client';

import React from 'react';
import { X, Filter, Hash, TrendingUp, User, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PillFilterProps {
  /** Filter type */
  type: 'source' | 'score' | 'keyword' | 'tag' | 'user' | 'topic';
  /** Filter value/label */
  value: string;
  /** Display label (defaults to value) */
  label?: string;
  /** Count of items with this filter */
  count?: number;
  /** Color scheme for the pill */
  color?: string;
  /** Callback when filter is removed */
  onRemove: () => void;
  /** Whether the pill is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

interface PillFilterGroupProps {
  /** Array of active filters */
  filters: Array<{
    id: string;
    type: PillFilterProps['type'];
    value: string;
    label?: string;
    count?: number;
    color?: string;
  }>;
  /** Callback when a filter is removed */
  onRemoveFilter: (filterId: string) => void;
  /** Clear all filters callback */
  onClearAll?: () => void;
  /** Maximum pills to show before truncating */
  maxVisible?: number;
  /** Group title */
  title?: string;
  /** Compact mode */
  compact?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * PillFilter Molecule
 * Individual removable filter pill with icon and count
 * Atomic composition of Badge + Button for filter management
 */
export const PillFilter: React.FC<PillFilterProps> = ({
  type,
  value,
  label = value,
  count,
  color,
  onRemove,
  disabled = false,
  size = 'md',
  className
}) => {
  // Get icon based on filter type
  const getIcon = () => {
    const iconClass = cn(
      size === 'sm' && "h-2.5 w-2.5",
      size === 'md' && "h-3 w-3", 
      size === 'lg' && "h-3.5 w-3.5"
    );
    
    switch (type) {
      case 'source':
        return <Globe className={iconClass} />;
      case 'score':
        return <TrendingUp className={iconClass} />;
      case 'keyword':
        return <Hash className={iconClass} />;
      case 'tag':
        return <Hash className={iconClass} />;
      case 'user':
        return <User className={iconClass} />;
      case 'topic':
        return <Filter className={iconClass} />;
      default:
        return <Filter className={iconClass} />;
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return "text-xs px-2 py-0.5 gap-1";
      case 'md':
        return "text-xs px-2.5 py-1 gap-1.5";
      case 'lg':
        return "text-sm px-3 py-1.5 gap-2";
      default:
        return "text-xs px-2.5 py-1 gap-1.5";
    }
  };

  // Get type-based styling
  const getTypeColors = () => {
    if (color) {
      return {
        backgroundColor: `${color}15`,
        borderColor: color,
        color: color,
      };
    }

    switch (type) {
      case 'source':
        return 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-300';
      case 'score':
        return 'border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950/30 dark:text-green-300';
      case 'keyword':
        return 'border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-700 dark:bg-purple-950/30 dark:text-purple-300';
      case 'tag':
        return 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/30 dark:text-orange-300';
      case 'user':
        return 'border-pink-300 bg-pink-50 text-pink-700 dark:border-pink-700 dark:bg-pink-950/30 dark:text-pink-300';
      case 'topic':
        return 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300';
      default:
        return 'border-gray-300 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-950/30 dark:text-gray-300';
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center border-2 font-medium transition-colors",
        getSizeClasses(),
        !color && getTypeColors(),
        disabled && "opacity-50 pointer-events-none",
        "hover:bg-opacity-80 dark:hover:bg-opacity-80",
        className
      )}
      style={color ? {
        backgroundColor: `${color}15`,
        borderColor: color,
        color: color,
      } : undefined}
    >
      {getIcon()}
      <span className="truncate max-w-24">{label}</span>
      {count !== undefined && (
        <span className="ml-1 opacity-75">({count})</span>
      )}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "ml-1 h-auto p-0 hover:bg-transparent",
          size === 'sm' && "w-3 h-3",
          size === 'md' && "w-4 h-4", 
          size === 'lg' && "w-5 h-5"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        disabled={disabled}
        aria-label={`Remove ${type} filter: ${label}`}
      >
        <X className={cn(
          size === 'sm' && "h-2 w-2",
          size === 'md' && "h-2.5 w-2.5",
          size === 'lg' && "h-3 w-3"
        )} />
      </Button>
    </Badge>
  );
};

/**
 * PillFilterGroup Molecule
 * Collection of pill filters with group management
 * Handles overflow and provides clear-all functionality
 */
export const PillFilterGroup: React.FC<PillFilterGroupProps> = ({
  filters,
  onRemoveFilter,
  onClearAll,
  maxVisible = 5,
  title,
  compact = false,
  className
}) => {
  const [showAll, setShowAll] = React.useState(false);
  
  const visibleFilters = showAll ? filters : filters.slice(0, maxVisible);
  const hiddenCount = Math.max(0, filters.length - maxVisible);
  const hasOverflow = hiddenCount > 0;

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Title and Clear All */}
      {(title || onClearAll) && !compact && (
        <div className="flex items-center justify-between">
          {title && (
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Filter className="h-3 w-3" />
              {title}
            </h4>
          )}
          {onClearAll && filters.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-1">
        {visibleFilters.map((filter) => (
          <PillFilter
            key={filter.id}
            type={filter.type}
            value={filter.value}
            label={filter.label}
            count={filter.count}
            color={filter.color}
            onRemove={() => onRemoveFilter(filter.id)}
            size={compact ? 'sm' : 'md'}
          />
        ))}
        
        {/* Show More/Less Button */}
        {hasOverflow && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 h-6"
          >
            {showAll ? 'Show less' : `+${hiddenCount} more`}
          </Button>
        )}

        {/* Compact Clear All */}
        {compact && onClearAll && filters.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 h-6"
            aria-label="Clear all filters"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filter Summary */}
      {!compact && filters.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {filters.length} filter{filters.length !== 1 ? 's' : ''} active
          {hasOverflow && !showAll && ` (${hiddenCount} hidden)`}
        </p>
      )}
    </div>
  );
};

export default PillFilter;
