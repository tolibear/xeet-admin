/**
 * System Health Dashboard Organism
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Enterprise-Scale Operations
 * 
 * Complete system health monitoring dashboard displaying real-time metrics,
 * service status, performance indicators, and system uptime in an enterprise-scale 
 * admin interface.
 * 
 * Features:
 * - Real-time system health metrics visualization
 * - Service status monitoring with health checks
 * - Performance graphs and historical data
 * - Alert indicators for critical issues  
 * - Resource usage monitoring (CPU, memory, disk, network)
 * - Database and API performance metrics
 */

import React from 'react';
import { 
  Clock, 
  Cpu, 
  HardDrive,
  Activity,
  Database,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MetricCard } from '@/components/molecules/MetricCard';
import { StatusDot } from '@/components/atoms/StatusDot';
import { Chart } from '@/components/organisms/Chart';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { 
  SystemHealthMetrics, 
  SystemService, 
  BaseOrganismProps 
} from '@/lib/types';

export interface SystemHealthDashboardProps extends BaseOrganismProps {
  /** Current system health metrics */
  metrics: SystemHealthMetrics;
  /** List of system services with their status */
  services: SystemService[];
  /** Historical metrics for trend visualization */
  historicalMetrics?: SystemHealthMetrics[];
  /** Whether to show detailed service information */
  showServiceDetails?: boolean;
  /** Refresh interval for real-time updates */
  refreshInterval?: number;
  /** Callback when metric thresholds are exceeded */
  onAlert?: (type: string, value: number, threshold: number) => void;
  /** Callback when service status changes */
  onServiceStatusChange?: (service: SystemService) => void;
}

export interface ServiceStatusCardProps {
  /** Service information */
  service: SystemService;
  /** Whether to show detailed information */
  showDetails?: boolean;
  /** Click handler for service details */
  onClick?: (service: SystemService) => void;
}

export interface MetricsOverviewProps {
  /** System health metrics */
  metrics: SystemHealthMetrics;
  /** Alert threshold callback */
  onAlert?: (type: string, value: number, threshold: number) => void;
}

export interface PerformanceChartsProps {
  /** Historical metrics data */
  historicalMetrics: SystemHealthMetrics[];
  /** Chart height */
  height?: number;
}

/**
 * Service Status Card - Shows individual service health
 */
const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({
  service,
  showDetails = false,
  onClick
}) => {
  const statusVariant = {
    healthy: 'default' as const,
    warning: 'secondary' as const,
    critical: 'destructive' as const,
    down: 'destructive' as const,
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-colors hover:bg-muted/50",
        onClick && "hover:border-primary"
      )}
      onClick={() => onClick?.(service)}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <StatusDot variant={service.status === 'healthy' ? 'success' : 'error'} />
              <h3 className="font-medium text-sm">{service.name}</h3>
            </div>
            <Badge variant={statusVariant[service.status]} size="sm">
              {service.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground text-right">
            <div>v{service.version}</div>
            <div>↑ {formatUptime(service.uptime)}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Response: {service.healthCheck.responseTime}ms</span>
          <span>{new Date(service.healthCheck.lastCheck).toLocaleTimeString()}</span>
        </div>

        {showDetails && (
          <>
            <Separator />
            <div className="space-y-2 text-xs">
              {service.healthCheck.message && (
                <div className="text-muted-foreground">
                  {service.healthCheck.message}
                </div>
              )}
              {service.dependencies.length > 0 && (
                <div>
                  <span className="font-medium">Dependencies: </span>
                  <span className="text-muted-foreground">
                    {service.dependencies.join(', ')}
                  </span>
                </div>
              )}
              <div>
                <span className="font-medium">Endpoint: </span>
                <span className="text-muted-foreground font-mono">
                  {service.healthCheck.endpoint}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

/**
 * Metrics Overview - Display key system metrics
 */
const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  metrics,
  onAlert
}) => {
  // Define alert thresholds
  const thresholds = {
    cpu: 80,
    memory: 85,
    disk: 90,
    apiErrorRate: 5,
    dbResponseTime: 1000,
  };

  // Check for alerts
  React.useEffect(() => {
    if (metrics.cpu > thresholds.cpu) {
      onAlert?.('cpu', metrics.cpu, thresholds.cpu);
    }
    if (metrics.memory > thresholds.memory) {
      onAlert?.('memory', metrics.memory, thresholds.memory);
    }
    if (metrics.disk > thresholds.disk) {
      onAlert?.('disk', metrics.disk, thresholds.disk);
    }
    if (metrics.api.errorRate > thresholds.apiErrorRate) {
      onAlert?.('api_error_rate', metrics.api.errorRate, thresholds.apiErrorRate);
    }
    if (metrics.database.responseTime > thresholds.dbResponseTime) {
      onAlert?.('db_response_time', metrics.database.responseTime, thresholds.dbResponseTime);
    }
  }, [metrics, onAlert]);

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* System Uptime */}
      <MetricCard
        title="System Uptime"
        value={formatUptime(metrics.uptime)}
        icon={Clock}
        variant="outline"
      />

      {/* CPU Usage */}
      <MetricCard
        title="CPU Usage"
        value={`${metrics.cpu}%`}
        icon={Cpu}
        variant="outline"
      />

      {/* Memory Usage */}
      <MetricCard
        title="Memory Usage"  
        value={`${metrics.memory}%`}
        icon={Activity}
        variant="outline"
        // trend={metrics.memory > 60 ? "up" : "down"}
      />

      {/* Disk Usage */}
      <MetricCard
        title="Disk Usage"
        value={`${metrics.disk}%`}
        icon={HardDrive}
        variant="outline"
        // trend={metrics.disk > 70 ? "up" : "down"}
      />

      {/* Network In */}
      <MetricCard
        title="Network In"
        value={formatBytes(metrics.network.in)}
        icon={Globe}
        variant="outline"
      />

      {/* Network Out */}
      <MetricCard
        title="Network Out" 
        value={formatBytes(metrics.network.out)}
        icon={Globe}
        variant="outline"
      />

      {/* DB Connections */}
      <MetricCard
        title="DB Connections"
        value={metrics.database.connections.toString()}
        icon={Database}
        variant="outline"
      />

      {/* API Requests/min */}
      <MetricCard
        title="API Requests"
        value={`${metrics.api.requestRate}/min`}
        icon={Globe}
        variant="outline"
        // trend="up"
      />

      {/* API Error Rate */}
      <MetricCard
        title="API Error Rate"
        value={`${metrics.api.errorRate}%`}
        icon={AlertTriangle}
        variant="outline"
        // trend={metrics.api.errorRate > 1 ? "up" : "down"}
      />

      {/* Queue Size */}
      <MetricCard
        title="Queue Size"
        value={metrics.processing.queueSize.toString()}
        icon={BarChart3}
        variant="outline"
      />

      {/* Processed Jobs */}
      <MetricCard
        title="Jobs Processed"
        value={metrics.processing.processedJobs.toString()}
        icon={CheckCircle}
        variant="outline"
        // trend="up"
      />

      {/* Failed Jobs */}
      <MetricCard
        title="Failed Jobs"
        value={metrics.processing.failedJobs.toString()}
        icon={XCircle}
        variant="outline"
      />
    </div>
  );
};

/**
 * Performance Charts - Historical data visualization
 */
const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  historicalMetrics,
  height = 300
}) => {
  if (!historicalMetrics.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No historical data available
      </div>
    );
  }

  // Prepare data for charts
  const chartData = historicalMetrics.map((metric) => ({
    timestamp: new Date(metric.timestamp).toLocaleTimeString(),
    cpu: metric.cpu,
    memory: metric.memory,
    disk: metric.disk,
    apiResponseTime: metric.api.responseTime,
    dbResponseTime: metric.database.responseTime,
    networkIn: metric.network.in / 1024 / 1024, // Convert to MB
    networkOut: metric.network.out / 1024 / 1024, // Convert to MB
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* System Resources Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">System Resources</h3>
        <Chart
          type="line"
          data={chartData.map(d => ({
            time: d.timestamp,
            cpu: d.cpu,
            memory: d.memory,
            disk: d.disk,
          }))}
          xAxis={{
            key: 'time',
            label: 'Time',
            type: 'time'
          }}
          yAxis={{
            key: 'value',
            label: 'Percentage (%)',
            type: 'number',
            domain: [0, 100],
            tickFormatter: (value: number) => `${value}%`
          }}
          series={[
            {
              data: chartData.map(d => ({ time: d.timestamp, value: d.cpu })),
              label: 'CPU %',
              color: 'hsl(var(--chart-1))'
            },
            {
              data: chartData.map(d => ({ time: d.timestamp, value: d.memory })),
              label: 'Memory %', 
              color: 'hsl(var(--chart-2))'
            },
            {
              data: chartData.map(d => ({ time: d.timestamp, value: d.disk })),
              label: 'Disk %',
              color: 'hsl(var(--chart-3))'
            }
          ]}
          height={height}
        />
      </Card>

      {/* Response Time Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Response Times</h3>
        <Chart
          type="line"
          data={chartData.map(d => ({
            time: d.timestamp,
            api: d.apiResponseTime,
            database: d.dbResponseTime
          }))}
          xAxis={{
            key: 'time',
            label: 'Time',
            type: 'time'
          }}
          yAxis={{
            key: 'value',
            label: 'Response Time (ms)',
            type: 'number',
            tickFormatter: (value: number) => `${value}ms`
          }}
          series={[
            {
              data: chartData.map(d => ({ time: d.timestamp, value: d.apiResponseTime })),
              label: 'API (ms)',
              color: 'hsl(var(--chart-1))'
            },
            {
              data: chartData.map(d => ({ time: d.timestamp, value: d.dbResponseTime })),
              label: 'Database (ms)',
              color: 'hsl(var(--chart-2))'
            }
          ]}
          height={height}
        />
      </Card>

      {/* Network Traffic Chart */}
      <Card className="p-6 lg:col-span-2">
        <h3 className="text-lg font-medium mb-4">Network Traffic</h3>
        <Chart
          type="area"
          data={chartData.map(d => ({
            time: d.timestamp,
            networkIn: d.networkIn,
            networkOut: d.networkOut
          }))}
          xAxis={{
            key: 'time',
            label: 'Time',
            type: 'time'
          }}
          yAxis={{
            key: 'value',
            label: 'Network Traffic (MB/s)',
            type: 'number',
            tickFormatter: (value: number) => `${value} MB/s`
          }}
          series={[
            {
              data: chartData.map(d => ({ time: d.timestamp, value: d.networkIn })),
              label: 'Incoming (MB/s)',
              color: 'hsl(var(--chart-1))',
              fillColor: 'hsla(var(--chart-1), 0.3)'
            },
            {
              data: chartData.map(d => ({ time: d.timestamp, value: d.networkOut })),
              label: 'Outgoing (MB/s)',
              color: 'hsl(var(--chart-2))',
              fillColor: 'hsla(var(--chart-2), 0.3)'
            }
          ]}
          height={height}
        />
      </Card>
    </div>
  );
};

/**
 * System Health Dashboard Organism
 * 
 * Main dashboard component for system health monitoring
 */
export const SystemHealthDashboard: React.FC<SystemHealthDashboardProps> = ({
  metrics,
  services,
  historicalMetrics = [],
  showServiceDetails = false,
  refreshInterval = 30000,
  onAlert,
  onServiceStatusChange,
  loading = false,
  error = null,
  className,
  onError,
  size,
  variant,
  'data-testid': dataTestId,
  ...props
}) => {
  // Auto-refresh functionality
  React.useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        // In a real app, this would trigger a data refresh
        console.log('Refreshing system health metrics...');
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  // Monitor service status changes
  React.useEffect(() => {
    services.forEach(service => {
      if (service.status !== 'healthy') {
        onServiceStatusChange?.(service);
      }
    });
  }, [services, onServiceStatusChange]);

  if (loading) {
    return (
      <div className={cn("space-y-6", className)} {...props}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-6 bg-muted rounded w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-6", className)} {...props}>
        <Card className="p-6 border-destructive">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-destructive">
              System Health Dashboard Error
            </h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  // Group services by status for better overview
  const servicesByStatus = services.reduce((acc, service) => {
    acc[service.status] = (acc[service.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Header with overall system status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Health</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={Object.keys(servicesByStatus).some(s => s !== 'healthy') ? "destructive" : "default"}>
            {services.filter(s => s.status === 'healthy').length}/{services.length} Services Healthy
          </Badge>
          <span className="text-xs text-muted-foreground">
            Updated {new Date(metrics.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <MetricsOverview metrics={metrics} onAlert={onAlert} />

      {/* Services Status Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Services Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((service) => (
            <ServiceStatusCard
              key={service.id}
              service={service}
              showDetails={showServiceDetails}
              onClick={onServiceStatusChange}
            />
          ))}
        </div>
      </div>

      {/* Performance Charts */}
      {historicalMetrics.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Performance Trends</h2>
          <PerformanceCharts historicalMetrics={historicalMetrics} />
        </div>
      )}
    </div>
  );
};

SystemHealthDashboard.displayName = "SystemHealthDashboard";

export default SystemHealthDashboard;
