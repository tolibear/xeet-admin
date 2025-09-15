'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { ZoomIn, ZoomOut, RotateCcw, Settings, BarChart3, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { NetworkGraphProps } from './types';
import type { NetworkNode, NetworkLink } from '@/lib/types';

/**
 * NetworkGraph Organism
 * Comprehensive network visualization with force-directed layout
 * Built with atomic controls and responsive design
 */
export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  data,
  width = 800,
  height = 600,
  showClusters = false,
  clusters = [],
  layoutSettings = {},
  visualSettings = {},
  interactionSettings = {},
  onNodeClick,
  onNodeHover,
  onLinkClick,
  onLinkHover,
  filters = {},
  loading = false,
  error = null,
  className
}) => {
  const graphRef = useRef<any>();
  const [controlsExpanded, setControlsExpanded] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  // Default settings
  const defaultLayoutSettings = {
    chargeStrength: -300,
    linkDistance: 50,
    collisionRadius: 10,
    alphaDecay: 0.02,
    ...layoutSettings,
  };

  const defaultVisualSettings = {
    showNodeLabels: true,
    showLinkLabels: false,
    nodeLabelFontSize: 12,
    linkLabelFontSize: 10,
    backgroundColor: '#0f0f23',
    ...visualSettings,
  };

  const defaultInteractionSettings = {
    enableZoom: true,
    enableDrag: true,
    enableHover: true,
    enableClick: true,
    ...interactionSettings,
  };

  const defaultFilters = {
    nodeTypes: [],
    linkTypes: [],
    minNodeSize: 0,
    minLinkValue: 0,
    ...filters,
  };

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    let filteredNodes = data.nodes;
    let filteredLinks = data.links;

    // Filter nodes
    if (defaultFilters.nodeTypes?.length) {
      filteredNodes = filteredNodes.filter(node => 
        defaultFilters.nodeTypes!.includes(node.type)
      );
    }

    if (defaultFilters.minNodeSize > 0) {
      filteredNodes = filteredNodes.filter(node => 
        node.size >= defaultFilters.minNodeSize
      );
    }

    // Filter links
    if (defaultFilters.linkTypes?.length) {
      filteredLinks = filteredLinks.filter(link => 
        defaultFilters.linkTypes!.includes(link.type)
      );
    }

    if (defaultFilters.minLinkValue > 0) {
      filteredLinks = filteredLinks.filter(link => 
        link.value >= defaultFilters.minLinkValue
      );
    }

    // Filter links to only include those between visible nodes
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    filteredLinks = filteredLinks.filter(link => 
      visibleNodeIds.has(link.source as string) && 
      visibleNodeIds.has(link.target as string)
    );

    return {
      nodes: filteredNodes,
      links: filteredLinks,
    };
  }, [data, defaultFilters]);

  // Calculate network statistics
  const networkStats = useMemo(() => {
    const nodeCount = filteredData.nodes.length;
    const linkCount = filteredData.links.length;
    
    // Calculate degree for each node
    const degrees = new Map<string, number>();
    filteredData.links.forEach(link => {
      const source = link.source as string;
      const target = link.target as string;
      degrees.set(source, (degrees.get(source) || 0) + 1);
      degrees.set(target, (degrees.get(target) || 0) + 1);
    });

    const degreeValues = Array.from(degrees.values());
    const averageDegree = degreeValues.length > 0 ? 
      degreeValues.reduce((sum, d) => sum + d, 0) / degreeValues.length : 0;
    const maxDegree = degreeValues.length > 0 ? Math.max(...degreeValues) : 0;
    
    // Network density: actual links / possible links
    const possibleLinks = nodeCount * (nodeCount - 1) / 2;
    const density = possibleLinks > 0 ? linkCount / possibleLinks : 0;

    return {
      nodeCount,
      linkCount,
      clusterCount: clusters.length,
      density,
      averageDegree,
      maxDegree,
    };
  }, [filteredData, clusters]);

  // Node types for legend
  const nodeTypes = useMemo(() => {
    const typeMap = new Map<string, { color: string; count: number }>();
    
    filteredData.nodes.forEach(node => {
      const existing = typeMap.get(node.type);
      if (existing) {
        existing.count++;
      } else {
        typeMap.set(node.type, { color: node.color, count: 1 });
      }
    });

    return Array.from(typeMap.entries()).map(([type, { color, count }]) => ({
      type,
      color,
      label: type.charAt(0).toUpperCase() + type.slice(1),
      count,
    }));
  }, [filteredData.nodes]);

  // Link types for legend
  const linkTypes = useMemo(() => {
    const typeMap = new Map<string, { color: string; count: number }>();
    
    filteredData.links.forEach(link => {
      const existing = typeMap.get(link.type);
      const color = link.color || '#999999';
      if (existing) {
        existing.count++;
      } else {
        typeMap.set(link.type, { color, count: 1 });
      }
    });

    return Array.from(typeMap.entries()).map(([type, { color, count }]) => ({
      type,
      color,
      label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
    }));
  }, [filteredData.links]);

  // Handle node interactions
  const handleNodeClick = useCallback((node: NetworkNode, event: MouseEvent) => {
    if (!defaultInteractionSettings.enableClick) return;
    setSelectedNode(node);
    onNodeClick?.(node, event);
  }, [defaultInteractionSettings.enableClick, onNodeClick]);

  const handleNodeHover = useCallback((node: NetworkNode | null, prevNode: NetworkNode | null) => {
    if (!defaultInteractionSettings.enableHover) return;
    setHoveredNode(node);
    onNodeHover?.(node, prevNode);
  }, [defaultInteractionSettings.enableHover, onNodeHover]);

  const handleLinkClick = useCallback((link: NetworkLink, event: MouseEvent) => {
    if (!defaultInteractionSettings.enableClick) return;
    onLinkClick?.(link, event);
  }, [defaultInteractionSettings.enableClick, onLinkClick]);

  const handleLinkHover = useCallback((link: NetworkLink | null, prevLink: NetworkLink | null) => {
    if (!defaultInteractionSettings.enableHover) return;
    onLinkHover?.(link, prevLink);
  }, [defaultInteractionSettings.enableHover, onLinkHover]);

  // Reset graph view
  const handleReset = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(400);
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card className={cn("p-6", className)} style={{ width, height }}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse space-y-4 text-center">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto"></div>
            <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
            <div className="h-3 bg-muted rounded w-48 mx-auto"></div>
          </div>
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("p-6", className)} style={{ width, height }}>
        <div className="flex items-center justify-center h-full text-center">
          <div>
            <p className="font-medium text-destructive">Failed to load network data</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("relative border border-border rounded-lg overflow-hidden", className)}>
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            className="shadow-lg"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setControlsExpanded(!controlsExpanded)}
            className="shadow-lg"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setStatsVisible(!statsVisible)}
            className="shadow-lg"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Expanded Controls */}
        <Collapsible open={controlsExpanded} onOpenChange={setControlsExpanded}>
          <CollapsibleContent>
            <Card className="p-4 space-y-4 shadow-lg max-w-sm">
              <div>
                <h4 className="text-sm font-medium mb-2">Layout Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground">Charge Strength</label>
                    <Slider
                      value={[Math.abs(defaultLayoutSettings.chargeStrength)]}
                      onValueChange={([value]) => {
                        // Update layout settings
                      }}
                      max={500}
                      min={50}
                      step={10}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Link Distance</label>
                    <Slider
                      value={[defaultLayoutSettings.linkDistance]}
                      max={200}
                      min={10}
                      step={5}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">Visual Settings</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Node Labels</span>
                    <Switch
                      checked={defaultVisualSettings.showNodeLabels}
                      size="sm"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Link Labels</span>
                    <Switch
                      checked={defaultVisualSettings.showLinkLabels}
                      size="sm"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Stats Panel */}
      {statsVisible && (
        <div className="absolute top-4 right-4 z-10">
          <Card className="p-4 shadow-lg max-w-xs">
            <h4 className="text-sm font-medium mb-3">Network Statistics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Nodes:</span>
                <span className="font-mono">{networkStats.nodeCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Links:</span>
                <span className="font-mono">{networkStats.linkCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Density:</span>
                <span className="font-mono">{(networkStats.density * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Degree:</span>
                <span className="font-mono">{networkStats.averageDegree.toFixed(1)}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="p-3 shadow-lg max-w-sm">
          <div className="space-y-3">
            <div>
              <h5 className="text-xs font-medium mb-2 text-muted-foreground">Node Types</h5>
              <div className="flex flex-wrap gap-1">
                {nodeTypes.map(({ type, color, label, count }) => (
                  <Badge
                    key={type}
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: color, color }}
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
            
            {linkTypes.length > 0 && (
              <div>
                <h5 className="text-xs font-medium mb-2 text-muted-foreground">Link Types</h5>
                <div className="flex flex-wrap gap-1">
                  {linkTypes.map(({ type, color, label, count }) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: color, color }}
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
            )}
          </div>
        </Card>
      </div>

      {/* Node Details */}
      {(hoveredNode || selectedNode) && (
        <div className="absolute top-4 right-4 z-20">
          <Card className="p-4 shadow-lg max-w-xs">
            {(selectedNode || hoveredNode) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: (selectedNode || hoveredNode)!.color }}
                  />
                  <h4 className="text-sm font-medium">{(selectedNode || hoveredNode)!.name}</h4>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Type: {(selectedNode || hoveredNode)!.type}</div>
                  <div>Size: {(selectedNode || hoveredNode)!.size}</div>
                  <div>ID: {(selectedNode || hoveredNode)!.id}</div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Force Graph */}
      <ForceGraph2D
        ref={graphRef}
        width={width}
        height={height}
        graphData={filteredData}
        backgroundColor={defaultVisualSettings.backgroundColor}
        nodeId="id"
        nodeLabel="name"
        nodeColor={(node: any) => node.color}
        nodeVal={(node: any) => node.size}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          // Custom node rendering
          const label = node.name;
          const fontSize = defaultVisualSettings.nodeLabelFontSize / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.color;
          
          // Draw node circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
          ctx.fill();
          
          // Draw label if enabled
          if (defaultVisualSettings.showNodeLabels) {
            ctx.fillStyle = 'white';
            ctx.fillText(label, node.x, node.y + node.size + fontSize);
          }
        }}
        linkColor={(link: any) => link.color || '#999999'}
        linkWidth={(link: any) => Math.sqrt(link.value)}
        linkDirectionalArrowLength={3}
        linkDirectionalArrowRelPos={1}
        d3AlphaDecay={defaultLayoutSettings.alphaDecay}
        d3VelocityDecay={0.4}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        onLinkClick={handleLinkClick}
        onLinkHover={handleLinkHover}
        enableZoomInteraction={defaultInteractionSettings.enableZoom}
        enablePanInteraction={defaultInteractionSettings.enableZoom}
        enableNodeDrag={defaultInteractionSettings.enableDrag}
      />
    </div>
  );
};

export default NetworkGraph;
