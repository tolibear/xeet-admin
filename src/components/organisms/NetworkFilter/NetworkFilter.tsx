'use client';

import React, { useState, useMemo } from 'react';
import { Filter, Search, X, RotateCcw, ChevronDown, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SearchBox } from '@/components/molecules/SearchBox';
import { cn } from '@/lib/utils';
import type { NetworkFilterProps, NetworkFilterSettings } from './types';

/**
 * NetworkFilter Organism
 * Comprehensive filtering controls for network visualization
 * Built with atomic form components and responsive design
 */
export const NetworkFilter: React.FC<NetworkFilterProps> = ({
  data,
  filters,
  onFiltersChange,
  clusters = [],
  showAdvanced = false,
  compact = false,
  className
}) => {
  const [advancedOpen, setAdvancedOpen] = useState(showAdvanced);
  const [searchQuery, setSearchQuery] = useState(filters.searchFilter.query);

  // Calculate filtered data statistics
  const filteredStats = useMemo(() => {
    let filteredNodes = data.nodes;
    let filteredLinks = data.links;

    // Apply node type filter
    if (filters.nodeTypes.enabled.length > 0) {
      filteredNodes = filteredNodes.filter(node =>
        filters.nodeTypes.enabled.includes(node.type)
      );
    }

    // Apply size filter
    if (filters.sizeFilter.enabled) {
      filteredNodes = filteredNodes.filter(node =>
        node.size >= filters.sizeFilter.minNodeSize &&
        node.size <= filters.sizeFilter.maxNodeSize
      );
    }

    // Apply search filter
    if (filters.searchFilter.enabled && filters.searchFilter.query) {
      const query = filters.searchFilter.query.toLowerCase();
      filteredNodes = filteredNodes.filter(node => {
        return filters.searchFilter.fields.some(field => {
          const value = node[field]?.toString().toLowerCase() || '';
          return value.includes(query);
        });
      });
    }

    // Apply cluster filter
    if (filters.clusterFilter.enabled && filters.clusterFilter.selectedClusters.length > 0) {
      const clusterNodeIds = new Set<string>();
      filters.clusterFilter.selectedClusters.forEach(clusterId => {
        const cluster = clusters.find(c => c.id === clusterId);
        if (cluster) {
          cluster.nodeIds.forEach(nodeId => clusterNodeIds.add(nodeId));
        }
      });
      filteredNodes = filteredNodes.filter(node => clusterNodeIds.has(node.id));
    }

    // Filter links based on visible nodes
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    filteredLinks = data.links.filter(link =>
      visibleNodeIds.has(link.source as string) &&
      visibleNodeIds.has(link.target as string)
    );

    // Apply link type filter
    if (filters.linkTypes.enabled.length > 0) {
      filteredLinks = filteredLinks.filter(link =>
        filters.linkTypes.enabled.includes(link.type)
      );
    }

    // Apply value filter
    if (filters.valueFilter.enabled) {
      filteredLinks = filteredLinks.filter(link =>
        link.value >= filters.valueFilter.minLinkValue &&
        link.value <= filters.valueFilter.maxLinkValue
      );
    }

    return {
      nodeCount: filteredNodes.length,
      linkCount: filteredLinks.length,
    };
  }, [data, filters, clusters]);

  // Handle node type toggle
  const toggleNodeType = (nodeType: string) => {
    const newEnabled = filters.nodeTypes.enabled.includes(nodeType)
      ? filters.nodeTypes.enabled.filter(t => t !== nodeType)
      : [...filters.nodeTypes.enabled, nodeType];
    
    onFiltersChange({
      ...filters,
      nodeTypes: {
        ...filters.nodeTypes,
        enabled: newEnabled,
      },
    });
  };

  // Handle link type toggle
  const toggleLinkType = (linkType: string) => {
    const newEnabled = filters.linkTypes.enabled.includes(linkType)
      ? filters.linkTypes.enabled.filter(t => t !== linkType)
      : [...filters.linkTypes.enabled, linkType];
    
    onFiltersChange({
      ...filters,
      linkTypes: {
        ...filters.linkTypes,
        enabled: newEnabled,
      },
    });
  };

  // Handle cluster toggle
  const toggleCluster = (clusterId: string) => {
    const newSelected = filters.clusterFilter.selectedClusters.includes(clusterId)
      ? filters.clusterFilter.selectedClusters.filter(id => id !== clusterId)
      : [...filters.clusterFilter.selectedClusters, clusterId];
    
    onFiltersChange({
      ...filters,
      clusterFilter: {
        ...filters.clusterFilter,
        selectedClusters: newSelected,
      },
    });
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onFiltersChange({
      ...filters,
      searchFilter: {
        ...filters.searchFilter,
        query,
        enabled: query.length > 0,
      },
    });
  };

  // Reset all filters
  const resetFilters = () => {
    onFiltersChange({
      ...filters,
      nodeTypes: {
        ...filters.nodeTypes,
        enabled: [],
      },
      linkTypes: {
        ...filters.linkTypes,
        enabled: [],
      },
      sizeFilter: {
        ...filters.sizeFilter,
        enabled: false,
        minNodeSize: filters.sizeFilter.range.min,
        maxNodeSize: filters.sizeFilter.range.max,
      },
      valueFilter: {
        ...filters.valueFilter,
        enabled: false,
        minLinkValue: filters.valueFilter.range.min,
        maxLinkValue: filters.valueFilter.range.max,
      },
      degreeFilter: {
        ...filters.degreeFilter,
        enabled: false,
        minDegree: filters.degreeFilter.range.min,
        maxDegree: filters.degreeFilter.range.max,
      },
      clusterFilter: {
        ...filters.clusterFilter,
        selectedClusters: [],
      },
      searchFilter: {
        ...filters.searchFilter,
        query: '',
        enabled: false,
      },
    });
    setSearchQuery('');
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filters.nodeTypes.enabled.length > 0 ||
    filters.linkTypes.enabled.length > 0 ||
    filters.sizeFilter.enabled ||
    filters.valueFilter.enabled ||
    filters.degreeFilter.enabled ||
    filters.clusterFilter.selectedClusters.length > 0 ||
    filters.searchFilter.enabled;

  return (
    <Card className={cn("p-4 space-y-4", compact && "p-3 space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className={cn("font-medium", compact && "text-sm")}>Network Filters</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAdvancedOpen(!advancedOpen)}
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="p-2 bg-muted/50 rounded text-sm">
          <div className="flex justify-between items-center">
            <span>Showing {filteredStats.nodeCount} nodes, {filteredStats.linkCount} links</span>
            <span className="text-muted-foreground">
              of {data.nodes.length} nodes, {data.links.length} links
            </span>
          </div>
        </div>
      )}

      {/* Search Filter */}
      <div className="space-y-2">
        <SearchBox
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search nodes by name, type, or ID..."
          className="w-full"
        />
        {filters.searchFilter.enabled && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Searching in:</span>
            {filters.searchFilter.fields.map(field => (
              <Badge key={field} variant="outline" className="text-xs">
                {field}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Node Type Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Node Types</h4>
        <div className="flex flex-wrap gap-1">
          {filters.nodeTypes.available.map(({ type, label, color, count }) => (
            <Badge
              key={type}
              variant={filters.nodeTypes.enabled.includes(type) ? "default" : "outline"}
              className="cursor-pointer hover:bg-secondary/80 text-xs"
              style={{
                backgroundColor: filters.nodeTypes.enabled.includes(type) ? color : undefined,
                borderColor: color,
              }}
              onClick={() => toggleNodeType(type)}
            >
              <div
                className="w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: color }}
              />
              {label} ({count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Link Type Filters */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Link Types</h4>
        <div className="flex flex-wrap gap-1">
          {filters.linkTypes.available.map(({ type, label, color, count }) => (
            <Badge
              key={type}
              variant={filters.linkTypes.enabled.includes(type) ? "default" : "outline"}
              className="cursor-pointer hover:bg-secondary/80 text-xs"
              style={{
                backgroundColor: filters.linkTypes.enabled.includes(type) ? color : undefined,
                borderColor: color,
              }}
              onClick={() => toggleLinkType(type)}
            >
              <div
                className="w-3 h-0.5 mr-1"
                style={{ backgroundColor: color }}
              />
              {label} ({count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between text-sm">
            Advanced Filters
            <ChevronDown className={cn("h-4 w-4 transition-transform", advancedOpen && "rotate-180")} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-4 pt-2">
          {/* Size Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Node Size</h4>
              <Switch
                checked={filters.sizeFilter.enabled}
                onCheckedChange={(enabled) =>
                  onFiltersChange({
                    ...filters,
                    sizeFilter: { ...filters.sizeFilter, enabled },
                  })
                }
                size="sm"
              />
            </div>
            {filters.sizeFilter.enabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{filters.sizeFilter.minNodeSize}</span>
                  <span>{filters.sizeFilter.maxNodeSize}</span>
                </div>
                <Slider
                  value={[filters.sizeFilter.minNodeSize, filters.sizeFilter.maxNodeSize]}
                  onValueChange={([min, max]) =>
                    onFiltersChange({
                      ...filters,
                      sizeFilter: {
                        ...filters.sizeFilter,
                        minNodeSize: min,
                        maxNodeSize: max,
                      },
                    })
                  }
                  min={filters.sizeFilter.range.min}
                  max={filters.sizeFilter.range.max}
                  step={1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Value Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Link Strength</h4>
              <Switch
                checked={filters.valueFilter.enabled}
                onCheckedChange={(enabled) =>
                  onFiltersChange({
                    ...filters,
                    valueFilter: { ...filters.valueFilter, enabled },
                  })
                }
                size="sm"
              />
            </div>
            {filters.valueFilter.enabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{filters.valueFilter.minLinkValue.toFixed(1)}</span>
                  <span>{filters.valueFilter.maxLinkValue.toFixed(1)}</span>
                </div>
                <Slider
                  value={[filters.valueFilter.minLinkValue, filters.valueFilter.maxLinkValue]}
                  onValueChange={([min, max]) =>
                    onFiltersChange({
                      ...filters,
                      valueFilter: {
                        ...filters.valueFilter,
                        minLinkValue: min,
                        maxLinkValue: max,
                      },
                    })
                  }
                  min={filters.valueFilter.range.min}
                  max={filters.valueFilter.range.max}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Cluster Filter */}
          {filters.clusterFilter.availableClusters.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Clusters</h4>
              <div className="flex flex-wrap gap-1">
                {filters.clusterFilter.availableClusters.map(({ id, name, color, nodeCount }) => (
                  <Badge
                    key={id}
                    variant={filters.clusterFilter.selectedClusters.includes(id) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-secondary/80 text-xs"
                    style={{
                      backgroundColor: filters.clusterFilter.selectedClusters.includes(id) ? color : undefined,
                      borderColor: color,
                    }}
                    onClick={() => toggleCluster(id)}
                  >
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: color }}
                    />
                    {name} ({nodeCount})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default NetworkFilter;
