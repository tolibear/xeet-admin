/**
 * NetworkGraph Organism Types
 * Atomic types for network visualization functionality
 */

import { NetworkData, NetworkNode, NetworkLink, NetworkCluster, BaseOrganismProps } from "@/lib/types";

export interface NetworkGraphProps extends BaseOrganismProps {
  /** Network data to visualize */
  data: NetworkData;
  /** Width of the graph container */
  width?: number;
  /** Height of the graph container */
  height?: number;
  /** Enable clustering visualization */
  showClusters?: boolean;
  /** Clusters to highlight */
  clusters?: NetworkCluster[];
  /** Layout algorithm settings */
  layoutSettings?: {
    /** Force strength for node repulsion */
    chargeStrength?: number;
    /** Link distance */
    linkDistance?: number;
    /** Collision radius for nodes */
    collisionRadius?: number;
    /** Alpha decay rate */
    alphaDecay?: number;
  };
  /** Visual settings */
  visualSettings?: {
    /** Show node labels */
    showNodeLabels?: boolean;
    /** Show link labels */
    showLinkLabels?: boolean;
    /** Node label font size */
    nodeLabelFontSize?: number;
    /** Link label font size */
    linkLabelFontSize?: number;
    /** Background color */
    backgroundColor?: string;
  };
  /** Interaction settings */
  interactionSettings?: {
    /** Enable zoom and pan */
    enableZoom?: boolean;
    /** Enable node dragging */
    enableDrag?: boolean;
    /** Enable hover effects */
    enableHover?: boolean;
    /** Enable click selection */
    enableClick?: boolean;
  };
  /** Callbacks */
  onNodeClick?: (node: NetworkNode, event: MouseEvent) => void;
  onNodeHover?: (node: NetworkNode | null, prevNode: NetworkNode | null) => void;
  onLinkClick?: (link: NetworkLink, event: MouseEvent) => void;
  onLinkHover?: (link: NetworkLink | null, prevLink: NetworkLink | null) => void;
  /** Filter settings */
  filters?: {
    /** Node types to show */
    nodeTypes?: string[];
    /** Link types to show */
    linkTypes?: string[];
    /** Minimum node size to show */
    minNodeSize?: number;
    /** Minimum link value to show */
    minLinkValue?: number;
  };
}

export interface NetworkLegendProps {
  /** Node types with their colors */
  nodeTypes: Array<{
    type: string;
    color: string;
    label: string;
    count: number;
  }>;
  /** Link types with their colors */
  linkTypes: Array<{
    type: string;
    color: string;
    label: string;
    count: number;
  }>;
  /** Show clusters in legend */
  clusters?: NetworkCluster[];
  /** Orientation of the legend */
  orientation?: 'horizontal' | 'vertical';
}

export interface NetworkControlsProps {
  /** Current zoom level */
  zoom: number;
  /** Zoom change handler */
  onZoomChange: (zoom: number) => void;
  /** Reset view handler */
  onReset: () => void;
  /** Layout settings */
  layoutSettings: NonNullable<NetworkGraphProps['layoutSettings']>;
  /** Layout settings change handler */
  onLayoutSettingsChange: (settings: NonNullable<NetworkGraphProps['layoutSettings']>) => void;
  /** Visual settings */
  visualSettings: NonNullable<NetworkGraphProps['visualSettings']>;
  /** Visual settings change handler */
  onVisualSettingsChange: (settings: NonNullable<NetworkGraphProps['visualSettings']>) => void;
  /** Whether controls are expanded */
  expanded?: boolean;
}

export interface NetworkStatsProps {
  /** Network statistics */
  stats: {
    nodeCount: number;
    linkCount: number;
    clusterCount?: number;
    density: number;
    averageDegree: number;
    maxDegree: number;
  };
  /** Additional metrics */
  metrics?: {
    centrality?: Record<string, number>;
    clustering?: number;
    diameter?: number;
  };
}
