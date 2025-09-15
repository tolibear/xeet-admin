/**
 * NetworkFilter Organism Types
 * Atomic types for network filtering and clustering functionality
 */

import { NetworkData, NetworkNode, NetworkLink, NetworkCluster, BaseOrganismProps } from "@/lib/types";

export interface NetworkFilterProps extends BaseOrganismProps {
  /** Network data to filter */
  data: NetworkData;
  /** Current filter settings */
  filters: NetworkFilterSettings;
  /** Filter settings change handler */
  onFiltersChange: (filters: NetworkFilterSettings) => void;
  /** Available clusters for cluster-based filtering */
  clusters?: NetworkCluster[];
  /** Whether to show advanced options */
  showAdvanced?: boolean;
  /** Compact mode for smaller spaces */
  compact?: boolean;
}

export interface NetworkFilterSettings {
  /** Node type filters */
  nodeTypes: {
    enabled: string[];
    available: Array<{
      type: string;
      label: string;
      color: string;
      count: number;
    }>;
  };
  /** Link type filters */
  linkTypes: {
    enabled: string[];
    available: Array<{
      type: string;
      label: string;
      color: string;
      count: number;
    }>;
  };
  /** Size-based filters */
  sizeFilter: {
    enabled: boolean;
    minNodeSize: number;
    maxNodeSize: number;
    range: { min: number; max: number };
  };
  /** Value-based filters */
  valueFilter: {
    enabled: boolean;
    minLinkValue: number;
    maxLinkValue: number;
    range: { min: number; max: number };
  };
  /** Degree-based filters */
  degreeFilter: {
    enabled: boolean;
    minDegree: number;
    maxDegree: number;
    range: { min: number; max: number };
  };
  /** Cluster-based filters */
  clusterFilter: {
    enabled: boolean;
    selectedClusters: string[];
    availableClusters: Array<{
      id: string;
      name: string;
      color: string;
      nodeCount: number;
    }>;
  };
  /** Text-based search */
  searchFilter: {
    enabled: boolean;
    query: string;
    fields: ('name' | 'type' | 'id')[];
  };
}

export interface NetworkClusteringProps extends BaseOrganismProps {
  /** Network data to cluster */
  data: NetworkData;
  /** Clustering algorithm to use */
  algorithm: 'louvain' | 'leiden' | 'kmeans' | 'modularity';
  /** Clustering parameters */
  parameters: ClusteringParameters;
  /** Parameters change handler */
  onParametersChange: (params: ClusteringParameters) => void;
  /** Clustering result handler */
  onClustersGenerated: (clusters: NetworkCluster[]) => void;
  /** Whether clustering is in progress */
  isRunning?: boolean;
}

export interface ClusteringParameters {
  /** Number of clusters (for k-means) */
  k?: number;
  /** Resolution parameter (for Louvain/Leiden) */
  resolution?: number;
  /** Maximum iterations */
  maxIterations?: number;
  /** Minimum cluster size */
  minClusterSize?: number;
  /** Random seed for reproducible results */
  seed?: number;
}

export interface ClusteringResult {
  /** Generated clusters */
  clusters: NetworkCluster[];
  /** Clustering quality metrics */
  metrics: {
    modularity: number;
    silhouetteScore?: number;
    coverage: number;
    performance: number;
  };
  /** Algorithm used */
  algorithm: string;
  /** Parameters used */
  parameters: ClusteringParameters;
  /** Execution time in milliseconds */
  executionTime: number;
}

export interface FilterSummaryProps {
  /** Current filter settings */
  filters: NetworkFilterSettings;
  /** Original data statistics */
  originalStats: {
    nodeCount: number;
    linkCount: number;
  };
  /** Filtered data statistics */
  filteredStats: {
    nodeCount: number;
    linkCount: number;
  };
  /** Reset filters handler */
  onReset: () => void;
}
