/**
 * Chart Organism - Type Definitions
 * Base chart organism for data visualization
 */

import { BaseOrganismProps } from "@/lib/types";

export type ChartType = "line" | "area" | "bar" | "pie" | "scatter" | "heatmap";

export interface ChartDataPoint {
  [key: string]: any;
}

export interface ChartDataset {
  data: ChartDataPoint[];
  label?: string;
  color?: string;
  fillColor?: string;
  strokeWidth?: number;
}

export interface ChartAxis {
  key: string;
  label?: string;
  type?: "category" | "number" | "time";
  domain?: [number | "auto", number | "auto"];
  tickFormatter?: (value: any) => string;
  hide?: boolean;
}

export interface ChartLegend {
  show?: boolean;
  position?: "top" | "bottom" | "left" | "right";
}

export interface ChartTooltip {
  show?: boolean;
  formatter?: (value: any, name: string, props: any) => React.ReactNode;
  labelFormatter?: (label: any) => React.ReactNode;
}

export interface ChartGrid {
  show?: boolean;
  strokeDasharray?: string;
  horizontal?: boolean;
  vertical?: boolean;
}

export interface ChartAnimation {
  enabled?: boolean;
  duration?: number;
  delay?: number;
}

export interface ChartProps extends BaseOrganismProps {
  // Chart configuration
  type: ChartType;
  data: ChartDataPoint[];
  
  // Axes
  xAxis: ChartAxis;
  yAxis?: ChartAxis;
  
  // Data series (for multi-series charts)
  series?: ChartDataset[];
  
  // Visual configuration
  width?: number | string;
  height?: number | string;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  
  // Colors
  colors?: string[];
  colorScheme?: "default" | "categorical" | "sequential" | "diverging";
  
  // Features
  legend?: ChartLegend;
  tooltip?: ChartTooltip;
  grid?: ChartGrid;
  animation?: ChartAnimation;
  
  // Responsiveness
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  
  // Interaction
  onDataClick?: (data: ChartDataPoint, index: number) => void;
  onLegendClick?: (dataKey: string, entry: any) => void;
  
  // State
  loading?: boolean;
  error?: string | null;
  emptyState?: React.ReactNode;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;
}

// Specific chart type props
export interface LineChartProps extends Omit<ChartProps, 'type'> {
  type: "line";
  smooth?: boolean;
  strokeWidth?: number;
  dotSize?: number;
  activeDot?: boolean;
}

export interface AreaChartProps extends Omit<ChartProps, 'type'> {
  type: "area";
  smooth?: boolean;
  stacked?: boolean;
  fillOpacity?: number;
}

export interface BarChartProps extends Omit<ChartProps, 'type'> {
  type: "bar";
  layout?: "horizontal" | "vertical";
  stacked?: boolean;
  barGap?: number;
  barCategoryGap?: number;
}

export interface PieChartProps extends Omit<ChartProps, 'type'> {
  type: "pie";
  innerRadius?: number;
  outerRadius?: number;
  startAngle?: number;
  endAngle?: number;
  showLabels?: boolean;
  labelPosition?: "inside" | "outside";
}

export interface ScatterChartProps extends Omit<ChartProps, 'type'> {
  type: "scatter";
  dotSize?: number;
  shape?: "circle" | "square" | "triangle" | "diamond";
}
