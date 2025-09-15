'use client';

import React, { useState, useMemo } from 'react';
import { Filter, Grid3X3, List, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { HeatmapCell } from '@/components/atoms/HeatmapCell';
import { HeatmapLegend } from '@/components/atoms/HeatmapLegend';
import { cn } from '@/lib/utils';
import type { KeywordCoverageHeatmapProps, KeywordCoverageData } from './types';

/**
 * KeywordCoverageHeatmap Organism
 * Comprehensive visualization of keyword coverage patterns
 * Built with atomic HeatmapCell and HeatmapLegend components
 */
export const KeywordCoverageHeatmap: React.FC<KeywordCoverageHeatmapProps> = ({
  data,
  dateRange,
  maxKeywords = 50,
  groupByTopics = false,
  interactive = true,
  onKeywordClick,
  showTrends = true,
  colorScheme: initialColorScheme = 'coverage',
  loading = false,
  error = null,
  className
}) => {
  // Local state
  const [colorScheme, setColorScheme] = useState(initialColorScheme);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [coverageThreshold, setCoverageThreshold] = useState([0]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localGroupByTopics, setLocalGroupByTopics] = useState(groupByTopics);

  // Filtered and processed data
  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filter by selected topics
    if (selectedTopics.length > 0) {
      filtered = filtered.filter(item => selectedTopics.includes(item.topicId));
    }

    // Filter by coverage threshold
    filtered = filtered.filter(item => item.coverage >= coverageThreshold[0]);

    // Sort by the current color scheme value
    filtered.sort((a, b) => {
      switch (colorScheme) {
        case 'coverage':
          return b.coverage - a.coverage;
        case 'engagement':
          return b.avgEngagement - a.avgEngagement;
        case 'trend':
          return Math.abs(b.trend) - Math.abs(a.trend);
        default:
          return b.coverage - a.coverage;
      }
    });

    // Limit to max keywords
    return filtered.slice(0, maxKeywords);
  }, [data, selectedTopics, coverageThreshold, colorScheme, maxKeywords]);

  // Group data by topics if enabled
  const groupedData = useMemo(() => {
    if (!localGroupByTopics) {
      return { ungrouped: filteredData };
    }

    return filteredData.reduce((groups, item) => {
      const topicKey = item.topicId;
      if (!groups[topicKey]) {
        groups[topicKey] = [];
      }
      groups[topicKey].push(item);
      return groups;
    }, {} as Record<string, KeywordCoverageData[]>);
  }, [filteredData, localGroupByTopics]);

  // Get available topics
  const availableTopics = useMemo(() => {
    const topicsMap = new Map();
    data.forEach(item => {
      if (!topicsMap.has(item.topicId)) {
        topicsMap.set(item.topicId, {
          id: item.topicId,
          name: item.topicName,
          color: item.topicColor
        });
      }
    });
    return Array.from(topicsMap.values());
  }, [data]);

  // Calculate value range for legend
  const valueRange = useMemo(() => {
    if (filteredData.length === 0) return { min: 0, max: 100 };

    let values: number[];
    switch (colorScheme) {
      case 'coverage':
        values = filteredData.map(item => item.coverage);
        break;
      case 'engagement':
        values = filteredData.map(item => item.avgEngagement);
        break;
      case 'trend':
        values = filteredData.map(item => item.trend);
        break;
      default:
        values = filteredData.map(item => item.coverage);
    }

    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }, [filteredData, colorScheme]);

  // Handle keyword click
  const handleKeywordClick = (keyword: KeywordCoverageData) => {
    if (interactive && onKeywordClick) {
      onKeywordClick(keyword);
    }
  };

  // Get cell value based on color scheme
  const getCellValue = (item: KeywordCoverageData) => {
    switch (colorScheme) {
      case 'coverage':
        return item.coverage;
      case 'engagement':
        return item.avgEngagement;
      case 'trend':
        return Math.abs(item.trend);
      default:
        return item.coverage;
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="text-center text-destructive">
          <p className="font-medium">Failed to load keyword coverage data</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-6 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Keyword Coverage Heatmap</h3>
          <p className="text-sm text-muted-foreground">
            {dateRange ? 
              `Coverage analysis from ${new Date(dateRange.start).toLocaleDateString()} to ${new Date(dateRange.end).toLocaleDateString()}` :
              'Keyword coverage and engagement patterns'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
        {/* Color Scheme */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">View:</label>
          <Select value={colorScheme} onValueChange={(value: any) => setColorScheme(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coverage">Coverage</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="trend">Trend</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="gap-1"
          >
            <Grid3X3 className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="gap-1"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>

        {/* Group by Topics */}
        <div className="flex items-center gap-2">
          <Switch
            id="group-topics"
            checked={localGroupByTopics}
            onCheckedChange={setLocalGroupByTopics}
          />
          <label htmlFor="group-topics" className="text-sm font-medium">
            Group by Topics
          </label>
        </div>

        {/* Coverage Threshold */}
        <div className="flex items-center gap-2 min-w-32">
          <label className="text-sm font-medium">Min Coverage:</label>
          <div className="flex-1">
            <Slider
              value={coverageThreshold}
              onValueChange={setCoverageThreshold}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
          <span className="text-sm text-muted-foreground w-8">
            {coverageThreshold[0]}%
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center">
        <HeatmapLegend
          colorScheme={colorScheme}
          valueRange={valueRange}
        />
      </div>

      <Separator />

      {/* Topic Filters */}
      {availableTopics.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter by Topics:</span>
            {selectedTopics.length === 0 && (
              <span className="text-xs text-muted-foreground">All topics selected</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTopics.map(topic => (
              <Badge
                key={topic.id}
                variant={selectedTopics.includes(topic.id) ? "default" : "outline"}
                className="cursor-pointer hover:bg-secondary/80"
                style={{
                  backgroundColor: selectedTopics.includes(topic.id) ? topic.color : undefined,
                  borderColor: topic.color,
                }}
                onClick={() => {
                  setSelectedTopics(prev => 
                    prev.includes(topic.id)
                      ? prev.filter(id => id !== topic.id)
                      : [...prev, topic.id]
                  );
                }}
              >
                {topic.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Heatmap Visualization */}
      <div className="space-y-4">
        {localGroupByTopics ? (
          // Grouped by topics
          Object.entries(groupedData).map(([topicId, keywords]) => {
            const topic = availableTopics.find(t => t.id === topicId);
            return (
              <div key={topicId} className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: topic?.color }}
                  />
                  <h4 className="font-medium">{topic?.name}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {keywords.length} keywords
                  </Badge>
                </div>
                
                <div className={cn(
                  viewMode === 'grid' ? 
                    "grid gap-2" : 
                    "space-y-2",
                  viewMode === 'grid' && "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10"
                )}>
                  {keywords.map((keyword) => (
                    <HeatmapCell
                      key={keyword.keyword}
                      keyword={keyword.keyword}
                      value={getCellValue(keyword)}
                      trend={showTrends ? keyword.trend : undefined}
                      colorScheme={colorScheme}
                      size={viewMode === 'grid' ? 'md' : 'sm'}
                      interactive={interactive}
                      onClick={() => handleKeywordClick(keyword)}
                      showTrend={showTrends}
                      tooltip={`${keyword.keyword}: ${keyword.coverage}% coverage, ${keyword.postCount} posts, ${keyword.mentions} mentions`}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          // Flat view
          <div className={cn(
            viewMode === 'grid' ? 
              "grid gap-2" : 
              "space-y-2",
            viewMode === 'grid' && "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10"
          )}>
            {filteredData.map((keyword) => (
              <HeatmapCell
                key={keyword.keyword}
                keyword={keyword.keyword}
                value={getCellValue(keyword)}
                trend={showTrends ? keyword.trend : undefined}
                colorScheme={colorScheme}
                size={viewMode === 'grid' ? 'md' : 'sm'}
                interactive={interactive}
                onClick={() => handleKeywordClick(keyword)}
                showTrend={showTrends}
                tooltip={`${keyword.keyword}: ${keyword.coverage}% coverage, ${keyword.postCount} posts, ${keyword.mentions} mentions`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="flex justify-between items-center text-sm text-muted-foreground pt-4 border-t">
        <div>
          Showing {filteredData.length} of {data.length} keywords
          {selectedTopics.length > 0 && ` from ${selectedTopics.length} topics`}
        </div>
        <div>
          Coverage threshold: {coverageThreshold[0]}%+
        </div>
      </div>
    </Card>
  );
};

export default KeywordCoverageHeatmap;
