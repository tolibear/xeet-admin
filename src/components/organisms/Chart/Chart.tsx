/**
 * Chart Organism
 * Base chart organism for data visualization using Recharts
 * 
 * Atomic Composition:
 * - Uses Card atoms for structure
 * - Uses Badge atoms for legends
 * - Uses Spinner atoms for loading states
 * - Integrates Recharts for visualization
 */

"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

// Atomic imports
import { Card, CardContent, CardHeader, Badge, Spinner } from "../../atoms";

// Types
import { 
  ChartProps, 
  LineChartProps, 
  AreaChartProps, 
  BarChartProps, 
  PieChartProps, 
  ScatterChartProps 
} from "./types";

// Default color schemes
const COLOR_SCHEMES = {
  default: ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"],
  categorical: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
  sequential: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
  diverging: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac"],
};

export function Chart(props: ChartProps): React.ReactElement;
export function Chart(props: LineChartProps): React.ReactElement;
export function Chart(props: AreaChartProps): React.ReactElement;
export function Chart(props: BarChartProps): React.ReactElement;
export function Chart(props: PieChartProps): React.ReactElement;
export function Chart(props: ScatterChartProps): React.ReactElement;
export function Chart({
  type,
  data,
  xAxis,
  yAxis,
  series = [],
  width = "100%",
  height = 300,
  margin = { top: 20, right: 30, left: 20, bottom: 20 },
  colors = [],
  colorScheme = "default",
  legend = { show: true, position: "bottom" },
  tooltip = { show: true },
  grid = { show: true, horizontal: true, vertical: false },
  animation = { enabled: true, duration: 300 },
  responsive = true,
  maintainAspectRatio = false,
  onDataClick,
  onLegendClick,
  loading = false,
  error = null,
  emptyState,
  ariaLabel,
  ariaDescription,
  className,
  ...typeSpecificProps
}: ChartProps | LineChartProps | AreaChartProps | BarChartProps | PieChartProps | ScatterChartProps) {
  
  // Get color palette
  const colorPalette = useMemo(() => {
    if (colors.length > 0) return colors;
    return COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.default;
  }, [colors, colorScheme]);

  // Format tooltip content
  const CustomTooltip = useMemo(() => {
    if (!tooltip.show) return null;
    
    return ({ active, payload, label }: any) => {
      if (!active || !payload || !payload.length) return null;
      
      return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
          {tooltip.labelFormatter ? (
            tooltip.labelFormatter(label)
          ) : (
            <p className="font-medium text-sm mb-1">{label}</p>
          )}
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">
                {tooltip.formatter ? tooltip.formatter(entry.value, entry.name, entry) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    };
  }, [tooltip]);

  // Custom legend content
  const CustomLegend = useMemo(() => {
    if (!legend.show) return null;
    
    return ({ payload }: any) => (
      <div className={cn(
        "flex flex-wrap justify-center gap-4 mt-4",
        legend.position === "top" && "mb-4 mt-0",
        legend.position === "left" && "flex-col justify-start",
        legend.position === "right" && "flex-col justify-start"
      )}>
        {payload?.map((entry: any, index: number) => (
          <div
            key={index}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80"
            onClick={() => onLegendClick?.(entry.dataKey, entry)}
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-muted-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }, [legend, onLegendClick]);

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data,
      margin,
      onClick: onDataClick,
    };

    const axisProps = {
      xAxis: (
        <XAxis
          dataKey={xAxis.key}
          type={xAxis.type === "number" ? "number" : "category"}
          domain={xAxis.domain}
          tickFormatter={xAxis.tickFormatter}
          hide={xAxis.hide}
        />
      ),
      yAxis: yAxis && (
        <YAxis
          dataKey={yAxis.key}
          type={yAxis.type === "number" ? "number" : "category"}
          domain={yAxis.domain}
          tickFormatter={yAxis.tickFormatter}
          hide={yAxis.hide}
        />
      ),
      grid: grid.show && (
        <CartesianGrid 
          strokeDasharray={grid.strokeDasharray || "3 3"}
          horizontal={grid.horizontal}
          vertical={grid.vertical}
        />
      ),
      tooltip: tooltip.show && <Tooltip content={CustomTooltip} />,
      legend: legend.show && <Legend content={CustomLegend} />,
    };

    switch (type) {
      case "line": {
        const lineProps = typeSpecificProps as Partial<LineChartProps>;
        return (
          <LineChart {...commonProps}>
            {axisProps.xAxis}
            {axisProps.yAxis}
            {axisProps.grid}
            {axisProps.tooltip}
            {axisProps.legend}
            
            {series.length > 0 ? (
              series.map((dataset, index) => (
                <Line
                  key={dataset.label || index}
                  dataKey={dataset.label || `series${index}`}
                  stroke={dataset.color || colorPalette[index % colorPalette.length]}
                  strokeWidth={lineProps.strokeWidth || dataset.strokeWidth || 2}
                  dot={lineProps.dotSize ? { r: lineProps.dotSize } : false}
                  activeDot={lineProps.activeDot ? { r: 4 } : false}
                  type={lineProps.smooth ? "monotone" : "linear"}
                  animationDuration={animation.enabled ? animation.duration : 0}
                />
              ))
            ) : (
              // Single line from data keys
              Object.keys(data[0] || {}).filter(key => key !== xAxis.key).map((key, index) => (
                <Line
                  key={key}
                  dataKey={key}
                  stroke={colorPalette[index % colorPalette.length]}
                  strokeWidth={lineProps.strokeWidth || 2}
                  dot={lineProps.dotSize ? { r: lineProps.dotSize } : false}
                  activeDot={lineProps.activeDot ? { r: 4 } : false}
                  type={lineProps.smooth ? "monotone" : "linear"}
                  animationDuration={animation.enabled ? animation.duration : 0}
                />
              ))
            )}
          </LineChart>
        );
      }
      
      case "area": {
        const areaProps = typeSpecificProps as Partial<AreaChartProps>;
        return (
          <AreaChart {...commonProps}>
            {axisProps.xAxis}
            {axisProps.yAxis}
            {axisProps.grid}
            {axisProps.tooltip}
            {axisProps.legend}
            
            {series.length > 0 ? (
              series.map((dataset, index) => (
                <Area
                  key={dataset.label || index}
                  dataKey={dataset.label || `series${index}`}
                  stroke={dataset.color || colorPalette[index % colorPalette.length]}
                  fill={dataset.fillColor || dataset.color || colorPalette[index % colorPalette.length]}
                  fillOpacity={areaProps.fillOpacity || 0.3}
                  type={areaProps.smooth ? "monotone" : "linear"}
                  stackId={areaProps.stacked ? "1" : undefined}
                  animationDuration={animation.enabled ? animation.duration : 0}
                />
              ))
            ) : (
              Object.keys(data[0] || {}).filter(key => key !== xAxis.key).map((key, index) => (
                <Area
                  key={key}
                  dataKey={key}
                  stroke={colorPalette[index % colorPalette.length]}
                  fill={colorPalette[index % colorPalette.length]}
                  fillOpacity={areaProps.fillOpacity || 0.3}
                  type={areaProps.smooth ? "monotone" : "linear"}
                  stackId={areaProps.stacked ? "1" : undefined}
                  animationDuration={animation.enabled ? animation.duration : 0}
                />
              ))
            )}
          </AreaChart>
        );
      }
      
      case "bar": {
        const barProps = typeSpecificProps as Partial<BarChartProps>;
        return (
          <BarChart 
            {...commonProps} 
            layout={barProps.layout || "horizontal"}
            barGap={barProps.barGap}
            barCategoryGap={barProps.barCategoryGap}
          >
            {axisProps.xAxis}
            {axisProps.yAxis}
            {axisProps.grid}
            {axisProps.tooltip}
            {axisProps.legend}
            
            {series.length > 0 ? (
              series.map((dataset, index) => (
                <Bar
                  key={dataset.label || index}
                  dataKey={dataset.label || `series${index}`}
                  fill={dataset.color || colorPalette[index % colorPalette.length]}
                  stackId={barProps.stacked ? "1" : undefined}
                  animationDuration={animation.enabled ? animation.duration : 0}
                />
              ))
            ) : (
              Object.keys(data[0] || {}).filter(key => key !== xAxis.key).map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colorPalette[index % colorPalette.length]}
                  stackId={barProps.stacked ? "1" : undefined}
                  animationDuration={animation.enabled ? animation.duration : 0}
                />
              ))
            )}
          </BarChart>
        );
      }
      
      case "pie": {
        const pieProps = typeSpecificProps as Partial<PieChartProps>;
        return (
          <PieChart {...commonProps}>
            {axisProps.tooltip}
            {axisProps.legend}
            
            <Pie
              data={data}
              dataKey={yAxis?.key || "value"}
              nameKey={xAxis.key}
              cx="50%"
              cy="50%"
              innerRadius={pieProps.innerRadius || 0}
              outerRadius={pieProps.outerRadius || 80}
              startAngle={pieProps.startAngle || 0}
              endAngle={pieProps.endAngle || 360}
              animationDuration={animation.enabled ? animation.duration : 0}
              label={pieProps.showLabels}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colorPalette[index % colorPalette.length]} 
                />
              ))}
            </Pie>
          </PieChart>
        );
      }
      
      case "scatter": {
        const scatterProps = typeSpecificProps as Partial<ScatterChartProps>;
        return (
          <ScatterChart {...commonProps}>
            {axisProps.xAxis}
            {axisProps.yAxis}
            {axisProps.grid}
            {axisProps.tooltip}
            {axisProps.legend}
            
            <Scatter
              data={data}
              fill={colorPalette[0]}
              shape={scatterProps.shape || "circle"}
              animationDuration={animation.enabled ? animation.duration : 0}
            />
          </ScatterChart>
        );
      }
      
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Spinner size="sm" />
            <span>Loading chart...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("w-full border-destructive", className)}>
        <CardContent className="flex items-center justify-center text-center" style={{ height }}>
          <div className="text-destructive">
            <p className="font-semibold">Error loading chart</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          {emptyState || (
            <div className="text-center text-muted-foreground">
              <p>No data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div 
          role="img" 
          aria-label={ariaLabel || `${type} chart`}
          aria-description={ariaDescription}
        >
          {responsive ? (
            <ResponsiveContainer width={width} height={height}>
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            <div style={{ width, height }}>
              {renderChart()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

Chart.displayName = "Chart";
