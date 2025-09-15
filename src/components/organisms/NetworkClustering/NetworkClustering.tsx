'use client';

import React, { useState, useMemo } from 'react';
import { Play, Square, RotateCcw, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { NetworkClusteringProps, ClusteringParameters, ClusteringResult } from '../NetworkFilter/types';
import type { NetworkData, NetworkCluster } from '@/lib/types';

/**
 * NetworkClustering Organism
 * Advanced clustering analysis for network visualization
 * Built with atomic controls for algorithm configuration
 */
export const NetworkClustering: React.FC<NetworkClusteringProps> = ({
  data,
  algorithm,
  parameters,
  onParametersChange,
  onClustersGenerated,
  isRunning = false,
  loading = false,
  error = null,
  className
}) => {
  const [progress, setProgress] = useState(0);
  const [lastResult, setLastResult] = useState<ClusteringResult | null>(null);

  // Calculate network statistics for clustering context
  const networkStats = useMemo(() => {
    const nodeCount = data.nodes.length;
    const linkCount = data.links.length;
    const density = linkCount / (nodeCount * (nodeCount - 1) / 2);
    
    // Calculate degree distribution
    const degrees = new Map<string, number>();
    data.links.forEach(link => {
      const source = link.source as string;
      const target = link.target as string;
      degrees.set(source, (degrees.get(source) || 0) + 1);
      degrees.set(target, (degrees.get(target) || 0) + 1);
    });

    const degreeValues = Array.from(degrees.values());
    const avgDegree = degreeValues.reduce((sum, d) => sum + d, 0) / degreeValues.length;
    const maxDegree = Math.max(...degreeValues);

    return {
      nodeCount,
      linkCount,
      density,
      avgDegree,
      maxDegree,
    };
  }, [data]);

  // Get algorithm description
  const getAlgorithmDescription = (algo: string) => {
    switch (algo) {
      case 'louvain':
        return 'Louvain method optimizes modularity to find communities. Good for large networks.';
      case 'leiden':
        return 'Leiden algorithm improves upon Louvain with better quality guarantees.';
      case 'kmeans':
        return 'K-means clustering groups nodes based on structural similarity.';
      case 'modularity':
        return 'Direct modularity optimization finds optimal community structure.';
      default:
        return 'Select an algorithm to see its description.';
    }
  };

  // Get parameter constraints based on algorithm and data
  const getParameterConstraints = (algo: string) => {
    switch (algo) {
      case 'louvain':
      case 'leiden':
        return {
          resolution: { min: 0.1, max: 2.0, default: 1.0, step: 0.1 },
          maxIterations: { min: 10, max: 1000, default: 100, step: 10 },
          minClusterSize: { min: 2, max: Math.floor(networkStats.nodeCount / 4), default: 3, step: 1 },
        };
      case 'kmeans':
        return {
          k: { min: 2, max: Math.min(20, Math.floor(networkStats.nodeCount / 3)), default: 4, step: 1 },
          maxIterations: { min: 10, max: 500, default: 100, step: 10 },
          minClusterSize: { min: 1, max: Math.floor(networkStats.nodeCount / 4), default: 2, step: 1 },
        };
      case 'modularity':
        return {
          maxIterations: { min: 10, max: 500, default: 50, step: 10 },
          minClusterSize: { min: 2, max: Math.floor(networkStats.nodeCount / 4), default: 3, step: 1 },
        };
      default:
        return {};
    }
  };

  const constraints = getParameterConstraints(algorithm);

  // Simulate clustering execution (in real app, this would call actual clustering algorithms)
  const runClustering = async () => {
    if (isRunning) return;

    setProgress(0);
    const startTime = Date.now();

    // Simulate progressive clustering
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress((i / steps) * 100);
    }

    // Generate mock clustering result
    const clusterCount = algorithm === 'kmeans' ? parameters.k || 4 : Math.floor(Math.random() * 6) + 3;
    const clusters: NetworkCluster[] = [];
    
    // Distribute nodes across clusters
    const shuffledNodes = [...data.nodes].sort(() => Math.random() - 0.5);
    const nodesPerCluster = Math.floor(shuffledNodes.length / clusterCount);
    
    for (let i = 0; i < clusterCount; i++) {
      const startIdx = i * nodesPerCluster;
      const endIdx = i === clusterCount - 1 ? shuffledNodes.length : startIdx + nodesPerCluster;
      const clusterNodes = shuffledNodes.slice(startIdx, endIdx);
      
      if (clusterNodes.length >= (parameters.minClusterSize || 2)) {
        clusters.push({
          id: `cluster-${i}`,
          name: `Cluster ${i + 1}`,
          nodeIds: clusterNodes.map(n => n.id),
          color: `hsl(${(i * 360) / clusterCount}, 70%, 50%)`,
          center: {
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
          },
          metrics: {
            density: Math.random() * 0.5 + 0.1,
            centralityScore: Math.random() * 0.8 + 0.2,
            influence: Math.random() * 0.6 + 0.3,
          },
        });
      }
    }

    const result: ClusteringResult = {
      clusters,
      metrics: {
        modularity: Math.random() * 0.4 + 0.3, // 0.3-0.7
        silhouetteScore: algorithm === 'kmeans' ? Math.random() * 0.4 + 0.3 : undefined,
        coverage: clusters.reduce((sum, c) => sum + c.nodeIds.length, 0) / data.nodes.length,
        performance: Math.random() * 0.3 + 0.6, // 0.6-0.9
      },
      algorithm,
      parameters,
      executionTime: Date.now() - startTime,
    };

    setLastResult(result);
    onClustersGenerated(clusters);
    setProgress(100);
    
    // Reset progress after a delay
    setTimeout(() => setProgress(0), 1000);
  };

  // Update parameter
  const updateParameter = (key: string, value: number) => {
    onParametersChange({
      ...parameters,
      [key]: value,
    });
  };

  // Loading state
  if (loading) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-4 space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">Network Clustering</h3>
          <p className="text-sm text-muted-foreground">
            Analyze community structure and group similar nodes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={runClustering}
            disabled={isRunning || progress > 0}
            size="sm"
            className="gap-2"
          >
            {isRunning || progress > 0 ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning || progress > 0 ? 'Running...' : 'Run Analysis'}
          </Button>
          {lastResult && (
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      {progress > 0 && progress < 100 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Clustering in progress...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Algorithm Selection */}
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Clustering Algorithm</label>
          <Select value={algorithm} onValueChange={(value: any) => onParametersChange({ ...parameters })}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="louvain">Louvain Method</SelectItem>
              <SelectItem value="leiden">Leiden Algorithm</SelectItem>
              <SelectItem value="kmeans">K-Means Clustering</SelectItem>
              <SelectItem value="modularity">Modularity Optimization</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {getAlgorithmDescription(algorithm)}
          </AlertDescription>
        </Alert>
      </div>

      {/* Network Statistics */}
      <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded">
        <div className="text-center">
          <div className="text-lg font-semibold">{networkStats.nodeCount}</div>
          <div className="text-xs text-muted-foreground">Nodes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{networkStats.linkCount}</div>
          <div className="text-xs text-muted-foreground">Links</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{(networkStats.density * 100).toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground">Density</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold">{networkStats.avgDegree.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">Avg Degree</div>
        </div>
      </div>

      <Separator />

      {/* Parameters */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Algorithm Parameters</h4>
        
        {/* K parameter for K-means */}
        {algorithm === 'kmeans' && constraints.k && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm">Number of Clusters (k)</label>
              <span className="text-sm font-mono">{parameters.k || constraints.k.default}</span>
            </div>
            <Slider
              value={[parameters.k || constraints.k.default]}
              onValueChange={([value]) => updateParameter('k', value)}
              min={constraints.k.min}
              max={constraints.k.max}
              step={constraints.k.step}
              className="w-full"
            />
          </div>
        )}

        {/* Resolution parameter for Louvain/Leiden */}
        {(algorithm === 'louvain' || algorithm === 'leiden') && constraints.resolution && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm">Resolution</label>
              <span className="text-sm font-mono">{(parameters.resolution || constraints.resolution.default).toFixed(1)}</span>
            </div>
            <Slider
              value={[parameters.resolution || constraints.resolution.default]}
              onValueChange={([value]) => updateParameter('resolution', value)}
              min={constraints.resolution.min}
              max={constraints.resolution.max}
              step={constraints.resolution.step}
              className="w-full"
            />
          </div>
        )}

        {/* Max Iterations */}
        {constraints.maxIterations && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm">Max Iterations</label>
              <span className="text-sm font-mono">{parameters.maxIterations || constraints.maxIterations.default}</span>
            </div>
            <Slider
              value={[parameters.maxIterations || constraints.maxIterations.default]}
              onValueChange={([value]) => updateParameter('maxIterations', value)}
              min={constraints.maxIterations.min}
              max={constraints.maxIterations.max}
              step={constraints.maxIterations.step}
              className="w-full"
            />
          </div>
        )}

        {/* Minimum Cluster Size */}
        {constraints.minClusterSize && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm">Min Cluster Size</label>
              <span className="text-sm font-mono">{parameters.minClusterSize || constraints.minClusterSize.default}</span>
            </div>
            <Slider
              value={[parameters.minClusterSize || constraints.minClusterSize.default]}
              onValueChange={([value]) => updateParameter('minClusterSize', value)}
              min={constraints.minClusterSize.min}
              max={constraints.minClusterSize.max}
              step={constraints.minClusterSize.step}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Results */}
      {lastResult && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Clustering Results</h4>
            
            {/* Quality Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Modularity</div>
                <div className="text-lg font-semibold">{lastResult.metrics.modularity.toFixed(3)}</div>
              </div>
              {lastResult.metrics.silhouetteScore && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Silhouette Score</div>
                  <div className="text-lg font-semibold">{lastResult.metrics.silhouetteScore.toFixed(3)}</div>
                </div>
              )}
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Coverage</div>
                <div className="text-lg font-semibold">{(lastResult.metrics.coverage * 100).toFixed(1)}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Performance</div>
                <div className="text-lg font-semibold">{(lastResult.metrics.performance * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Cluster Summary */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Clusters Found: {lastResult.clusters.length}</span>
                <span className="text-xs text-muted-foreground">
                  Completed in {lastResult.executionTime}ms
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {lastResult.clusters.map((cluster, index) => (
                  <Badge
                    key={cluster.id}
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: cluster.color, color: cluster.color }}
                  >
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: cluster.color }}
                    />
                    {cluster.nodeIds.length} nodes
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default NetworkClustering;
