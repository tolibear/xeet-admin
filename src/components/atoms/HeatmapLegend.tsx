'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HeatmapLegendProps {
  /** Color scheme being displayed */
  colorScheme: 'coverage' | 'engagement' | 'trend';
  /** Range of values for the legend */
  valueRange: {
    min: number;
    max: number;
  };
  /** Additional CSS classes */
  className?: string;
  /** Orientation of the legend */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * HeatmapLegend Atom
 * Visual legend for heatmap color scales
 * Shows the mapping between colors and values
 */
export const HeatmapLegend: React.FC<HeatmapLegendProps> = ({
  colorScheme,
  valueRange,
  className,
  orientation = 'horizontal'
}) => {
  // Generate gradient steps
  const getGradientSteps = () => {
    const steps = [];
    const numSteps = 5;
    
    for (let i = 0; i <= numSteps; i++) {
      const percentage = i / numSteps;
      const value = valueRange.min + (valueRange.max - valueRange.min) * percentage;
      
      let color;
      switch (colorScheme) {
        case 'coverage':
          color = `rgba(59, 130, 246, ${0.1 + percentage * 0.8})`;
          break;
        case 'engagement':
          color = `rgba(34, 197, 94, ${0.1 + percentage * 0.8})`;
          break;
        case 'trend':
          // For trend, we need negative to positive spectrum
          if (percentage < 0.5) {
            // Red for negative
            const redIntensity = (0.5 - percentage) * 2;
            color = `rgba(239, 68, 68, ${0.1 + redIntensity * 0.8})`;
          } else {
            // Green for positive
            const greenIntensity = (percentage - 0.5) * 2;
            color = `rgba(34, 197, 94, ${0.1 + greenIntensity * 0.8})`;
          }
          break;
        default:
          color = `rgba(59, 130, 246, ${0.1 + percentage * 0.8})`;
      }
      
      steps.push({
        percentage: percentage * 100,
        value,
        color
      });
    }
    
    return steps;
  };

  const gradientSteps = getGradientSteps();

  // Generate CSS gradient string
  const getGradientString = () => {
    const direction = orientation === 'horizontal' ? 'to right' : 'to bottom';
    const colorStops = gradientSteps.map(step => step.color).join(', ');
    return `linear-gradient(${direction}, ${colorStops})`;
  };

  // Get legend title
  const getLegendTitle = () => {
    switch (colorScheme) {
      case 'coverage':
        return 'Coverage %';
      case 'engagement':
        return 'Avg Engagement';
      case 'trend':
        return 'Trend %';
      default:
        return 'Value';
    }
  };

  // Format value for display
  const formatValue = (value: number) => {
    if (colorScheme === 'trend') {
      return value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
    } else if (colorScheme === 'coverage') {
      return `${Math.round(value)}%`;
    } else {
      return Math.round(value).toLocaleString();
    }
  };

  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={cn(
      "flex items-center gap-3",
      !isHorizontal && "flex-col",
      className
    )}>
      {/* Legend Title */}
      <div className={cn(
        "text-sm font-medium text-muted-foreground whitespace-nowrap",
        !isHorizontal && "writing-mode-vertical text-center"
      )}>
        {getLegendTitle()}
      </div>
      
      {/* Legend Bar */}
      <div className={cn(
        "relative border border-border rounded",
        isHorizontal ? "flex-1 min-w-0" : "flex-1 min-h-0"
      )}>
        {/* Gradient Background */}
        <div
          className={cn(
            "rounded",
            isHorizontal ? "h-4 w-full" : "w-4 h-full"
          )}
          style={{
            background: getGradientString(),
          }}
          aria-hidden="true"
        />
        
        {/* Value Labels */}
        <div className={cn(
          "absolute inset-0 flex justify-between items-center px-1",
          !isHorizontal && "flex-col py-1"
        )}>
          <span className="text-xs font-medium text-foreground bg-background/80 px-1 rounded">
            {formatValue(valueRange.min)}
          </span>
          <span className="text-xs font-medium text-foreground bg-background/80 px-1 rounded">
            {formatValue(valueRange.max)}
          </span>
        </div>
      </div>
      
      {/* Value Range Info */}
      <div className="text-xs text-muted-foreground">
        {colorScheme === 'trend' ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500/60 rounded"></div>
              <span>Decrease</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500/60 rounded"></div>
              <span>Increase</span>
            </div>
          </div>
        ) : (
          <div>
            {colorScheme === 'coverage' ? 'Low to High Coverage' : 'Low to High Engagement'}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeatmapLegend;
