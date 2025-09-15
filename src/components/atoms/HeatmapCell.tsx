'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeatmapCellProps {
  /** Keyword text */
  keyword: string;
  /** Primary value to visualize (0-100) */
  value: number;
  /** Secondary value for display */
  secondaryValue?: number;
  /** Trend direction */
  trend?: number;
  /** Color scheme */
  colorScheme: 'coverage' | 'engagement' | 'trend';
  /** Cell size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the cell is interactive */
  interactive?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Show trend indicator */
  showTrend?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Tooltip content */
  tooltip?: string;
}

/**
 * HeatmapCell Atom
 * Basic building block for heatmap visualization
 * Displays keyword coverage with color-coded intensity
 */
export const HeatmapCell: React.FC<HeatmapCellProps> = ({
  keyword,
  value,
  secondaryValue,
  trend = 0,
  colorScheme = 'coverage',
  size = 'md',
  interactive = false,
  onClick,
  showTrend = false,
  className,
  tooltip
}) => {
  // Generate color intensity based on value and color scheme
  const getBackgroundColor = () => {
    const intensity = Math.max(0, Math.min(100, value)) / 100;
    
    switch (colorScheme) {
      case 'coverage':
        // Blue gradient for coverage
        return `rgba(59, 130, 246, ${0.1 + intensity * 0.8})`;
      case 'engagement':
        // Green gradient for engagement
        return `rgba(34, 197, 94, ${0.1 + intensity * 0.8})`;
      case 'trend':
        // Red/green based on trend direction
        if (trend > 0) {
          return `rgba(34, 197, 94, ${0.1 + Math.min(Math.abs(trend) / 50, 1) * 0.8})`;
        } else if (trend < 0) {
          return `rgba(239, 68, 68, ${0.1 + Math.min(Math.abs(trend) / 50, 1) * 0.8})`;
        }
        return 'rgba(148, 163, 184, 0.1)';
      default:
        return `rgba(59, 130, 246, ${0.1 + intensity * 0.8})`;
    }
  };

  // Get text color based on background intensity
  const getTextColor = () => {
    const intensity = Math.max(0, Math.min(100, value)) / 100;
    return intensity > 0.6 ? 'text-white' : 'text-foreground';
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-12 w-16 text-xs';
      case 'md':
        return 'h-16 w-20 text-sm';
      case 'lg':
        return 'h-20 w-24 text-base';
      default:
        return 'h-16 w-20 text-sm';
    }
  };

  // Get trend icon
  const getTrendIcon = () => {
    if (!showTrend || trend === 0) return null;
    
    const iconClass = "h-3 w-3";
    
    if (trend > 0) {
      return <TrendingUp className={cn(iconClass, "text-green-500")} />;
    } else if (trend < 0) {
      return <TrendingDown className={cn(iconClass, "text-red-500")} />;
    }
    
    return <Minus className={cn(iconClass, "text-gray-500")} />;
  };

  return (
    <div
      className={cn(
        "relative border border-border rounded-lg p-2 flex flex-col justify-between",
        "transition-all duration-200 ease-in-out",
        getSizeClasses(),
        getTextColor(),
        interactive && "cursor-pointer hover:scale-105 hover:shadow-md hover:border-ring",
        interactive && "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      style={{
        backgroundColor: getBackgroundColor(),
      }}
      onClick={interactive ? onClick : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
      tabIndex={interactive ? 0 : -1}
      role={interactive ? "button" : undefined}
      aria-label={interactive ? `${keyword}: ${value}${colorScheme === 'coverage' ? '% coverage' : ''}` : undefined}
      title={tooltip || `${keyword}: ${value}`}
    >
      {/* Keyword text */}
      <div className="text-center font-medium leading-tight line-clamp-2">
        {keyword}
      </div>
      
      {/* Value and trend */}
      <div className="flex items-center justify-center gap-1">
        <span className="font-bold">
          {colorScheme === 'trend' ? 
            (trend > 0 ? `+${trend.toFixed(1)}%` : `${trend.toFixed(1)}%`) :
            `${Math.round(value)}${colorScheme === 'coverage' ? '%' : ''}`
          }
        </span>
        {getTrendIcon()}
      </div>
      
      {/* Secondary value if provided */}
      {secondaryValue !== undefined && (
        <div className="text-xs text-center opacity-75">
          {secondaryValue}
        </div>
      )}
      
      {/* Intensity indicator (small dot in corner) */}
      <div
        className="absolute top-1 right-1 w-2 h-2 rounded-full opacity-50"
        style={{
          backgroundColor: colorScheme === 'coverage' ? '#3b82f6' : 
                          colorScheme === 'engagement' ? '#22c55e' : 
                          trend > 0 ? '#22c55e' : trend < 0 ? '#ef4444' : '#94a3b8'
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default HeatmapCell;
