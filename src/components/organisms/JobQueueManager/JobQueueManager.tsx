/**
 * Job Queue Manager Organism
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Enterprise-Scale Operations
 * 
 * Comprehensive job queue management system for enterprise-scale operations.
 * Provides real-time queue monitoring, job lifecycle tracking, retry controls,
 * and batch job management for scalable background processing.
 * 
 * Features:
 * - Multi-queue monitoring and management
 * - Job lifecycle tracking (pending, running, completed, failed)
 * - Retry mechanisms and failure analysis
 * - Performance metrics and throughput monitoring
 * - Priority queue management
 * - Bulk job operations and batch controls
 * - Real-time job status updates
 * - Queue health and capacity monitoring
 */

import React from 'react';
import { Card } from '@/components';
import { Badge } from '@/components';
import { Button } from '@/components';
import { Progress } from '@/components';
import { Separator } from '@/components';
import { DataTable } from '@/components/organisms/DataTable';
import { MetricCard } from '@/components/molecules/MetricCard';
import { StatusDot } from '@/components/atoms/StatusDot';
import { Chart } from '@/components/organisms/Chart';
import { cn } from '@/lib/utils';
import type { 
  JobQueue, 
  BackfillJob, 
  JobType,
  BaseOrganismProps,
  DataTableColumn 
} from '@/lib/types';

export interface JobQueueManagerProps extends BaseOrganismProps {
  /** List of job queues to monitor */
  queues: JobQueue[];
  /** List of running and recent jobs */
  jobs: BackfillJob[];
  /** Whether to auto-refresh queue data */
  autoRefresh?: boolean;
  /** Refresh interval in milliseconds */
  refreshInterval?: number;
  /** Whether to show queue management controls */
  showControls?: boolean;
  /** Callback when queue is paused/resumed */
  onQueueToggle?: (queueId: string, action: 'pause' | 'resume' | 'stop') => void;
  /** Callback when job is retried */
  onJobRetry?: (jobId: string) => void;
  /** Callback when job is cancelled */
  onJobCancel?: (jobId: string) => void;
  /** Callback when bulk action is performed */
  onBulkAction?: (action: string, jobIds: string[]) => void;
}

export interface QueueCardProps {
  /** Queue information */
  queue: JobQueue;
  /** Whether to show management controls */
  showControls?: boolean;
  /** Queue action callback */
  onAction?: (queueId: string, action: 'pause' | 'resume' | 'stop' | 'clear') => void;
}

export interface JobTableProps {
  /** List of jobs */
  jobs: BackfillJob[];
  /** Job action callbacks */
  onJobRetry?: (jobId: string) => void;
  onJobCancel?: (jobId: string) => void;
  onBulkAction?: (action: string, jobIds: string[]) => void;
}

export interface QueueMetricsProps {
  /** Queue statistics */
  queues: JobQueue[];
  /** Jobs for metrics calculation */
  jobs: BackfillJob[];
}

/**
 * Queue Card Component - Individual queue monitoring
 */
const QueueCard: React.FC<QueueCardProps> = ({
  queue,
  showControls = true,
  onAction
}) => {
  const getStatusVariant = (status: JobQueue['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';  
      case 'stopped': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: JobQueue['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'stopped': return 'error';
      default: return 'idle';
    }
  };

  const getPriorityVariant = (priority: JobQueue['priority']) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'normal': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const formatLastActivity = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Queue Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <StatusDot status={getStatusColor(queue.status)} />
            <h3 className="font-medium">{queue.name}</h3>
            <Badge variant={getPriorityVariant(queue.priority)} size="sm">
              {queue.priority.toUpperCase()}
            </Badge>
          </div>
          <Badge variant={getStatusVariant(queue.status)} size="sm">
            {queue.status.toUpperCase()}
          </Badge>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>Size: {queue.size}</div>
          <div>Rate: {queue.rate}/min</div>
        </div>
      </div>

      {/* Queue Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Queue Size</div>
          <div className="text-lg font-semibold">{queue.size}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Processing Rate</div>
          <div className="text-lg font-semibold">{queue.rate}/min</div>
        </div>
      </div>

      {/* Job Types Breakdown */}
      {queue.jobTypes.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground">Job Types</div>
            <div className="space-y-1">
              {queue.jobTypes.map((jobType, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span>{jobType.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{jobType.count}</span>
                    <span className={cn(
                      "px-1 py-0.5 rounded text-xs",
                      jobType.failureRate > 10 ? "bg-destructive/10 text-destructive" :
                      jobType.failureRate > 5 ? "bg-yellow-500/10 text-yellow-700" :
                      "bg-green-500/10 text-green-700"
                    )}>
                      {jobType.failureRate.toFixed(1)}% fail
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Last Activity */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Last activity: {formatLastActivity(queue.lastActivity)}</span>
        <span>ID: {queue.id.slice(0, 8)}</span>
      </div>

      {/* Queue Controls */}
      {showControls && (
        <>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {queue.status === 'active' && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onAction?.(queue.id, 'pause')}
                >
                  Pause
                </Button>
              )}
              {queue.status === 'paused' && (
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={() => onAction?.(queue.id, 'resume')}
                >
                  Resume
                </Button>
              )}
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onAction?.(queue.id, 'stop')}
                disabled={queue.status === 'stopped'}
              >
                Stop
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => onAction?.(queue.id, 'clear')}
              disabled={queue.size === 0}
            >
              Clear
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

/**
 * Job Table Component - Detailed job monitoring
 */
const JobTable: React.FC<JobTableProps> = ({
  jobs,
  onJobRetry,
  onJobCancel,
  onBulkAction
}) => {
  const getStatusVariant = (status: BackfillJob['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'running': return 'secondary';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const formatRecords = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const columns: DataTableColumn<BackfillJob>[] = [
    {
      key: 'name',
      header: 'Job Name',
      cell: (job) => (
        <div className="space-y-1">
          <div className="font-medium">{job.name || 'Unnamed Job'}</div>
          <div className="text-xs text-muted-foreground">{job.type || 'Unknown Type'}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (job) => (
        <div className="flex items-center gap-2">
          <Badge variant={getStatusVariant(job.status)} size="sm">
            {job.status?.toUpperCase() || 'UNKNOWN'}
          </Badge>
          {job.status === 'running' && (
            <Progress value={job.progress} className="w-16 h-1" />
          )}
        </div>
      )
    },
    {
      key: 'progress',
      header: 'Progress',
      cell: (job) => (
        <div className="space-y-1">
          <div className="text-sm">{job.progress || 0}%</div>
          <div className="text-xs text-muted-foreground">
            {formatRecords(job.recordsProcessed || 0)} / {formatRecords(job.totalRecords || 0)}
          </div>
        </div>
      )
    },
    {
      key: 'duration',
      header: 'Duration', 
      cell: (job) => (
        <div className="text-sm">
          {formatDuration(job.duration)}
        </div>
      )
    },
    {
      key: 'createdBy',
      header: 'Created By',
      cell: (job) => (
        <div className="space-y-1">
          <div className="text-sm">{job.createdBy}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (job) => (
        <div className="flex gap-1">
          {job.status === 'failed' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onJobRetry?.(job.id)}
            >
              Retry
            </Button>
          )}
          {job.status && ['pending', 'running'].includes(job.status) && (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onJobCancel?.(job.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      )
    }
  ];

  const handleBulkAction = (selectedIds: string[], action: string) => {
    onBulkAction?.(action, selectedIds);
  };

  return (
    <DataTable
      data={jobs}
      columns={columns}
      enableSelection
      enableSearch
      enableFiltering
      enableColumnVisibility
      searchPlaceholder="Search jobs..."
      bulkActions={[
        {
          label: 'Cancel Selected',
          value: 'cancel',
          variant: 'destructive'
        },
        {
          label: 'Retry Selected',
          value: 'retry',
          variant: 'default'
        }
      ]}
      onBulkAction={handleBulkAction}
    />
  );
};

/**
 * Queue Metrics Component - Overall statistics
 */
const QueueMetrics: React.FC<QueueMetricsProps> = ({
  queues,
  jobs
}) => {
  // Calculate metrics
  const totalQueueSize = queues.reduce((sum, queue) => sum + queue.size, 0);
  const totalProcessingRate = queues.reduce((sum, queue) => sum + queue.rate, 0);
  const activeQueues = queues.filter(q => q.status === 'active').length;
  const healthyQueues = queues.filter(q => 
    q.status === 'active' && 
    q.jobTypes.every(jt => jt.failureRate < 5)
  ).length;

  const runningJobs = jobs.filter(j => j.status === 'running').length;
  const failedJobs = jobs.filter(j => j.status === 'failed').length;
  const completedJobs = jobs.filter(j => j.status === 'completed').length;
  
  const totalProcessed = jobs.reduce((sum, job) => sum + (job.recordsProcessed || 0), 0);
  const avgProgress = jobs.length > 0 ? 
    jobs.reduce((sum, job) => sum + (job.progress || 0), 0) / jobs.length : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        label="Total Queue Size"
        value={totalQueueSize.toString()}
        icon="queue"
        variant="outline"
      />
      <MetricCard
        label="Processing Rate"
        value={`${totalProcessingRate}/min`}
        icon="clock"
        variant="outline"
        trend="up"
      />
      <MetricCard
        label="Active Queues"
        value={`${activeQueues}/${queues.length}`}
        icon="activity"
        variant={activeQueues === queues.length ? "default" : "secondary"}
      />
      <MetricCard
        label="Healthy Queues"
        value={`${healthyQueues}/${queues.length}`}
        icon="check"
        variant={healthyQueues === queues.length ? "default" : "destructive"}
      />
      <MetricCard
        label="Running Jobs"
        value={runningJobs.toString()}
        icon="play"
        variant="secondary"
        trend={runningJobs > 0 ? "up" : "stable"}
      />
      <MetricCard
        label="Failed Jobs"
        value={failedJobs.toString()}
        icon="x"
        variant={failedJobs > 0 ? "destructive" : "outline"}
      />
      <MetricCard
        label="Completed Jobs"
        value={completedJobs.toString()}
        icon="check"
        variant="default"
        trend="up"
      />
      <MetricCard
        label="Records Processed"
        value={totalProcessed >= 1000000 ? `${(totalProcessed / 1000000).toFixed(1)}M` : 
               totalProcessed >= 1000 ? `${(totalProcessed / 1000).toFixed(1)}K` : 
               totalProcessed.toString()}
        icon="database"
        variant="outline"
        trend="up"
      />
    </div>
  );
};

/**
 * Job Queue Manager Organism
 * 
 * Main component for comprehensive job queue management
 */
export const JobQueueManager: React.FC<JobQueueManagerProps> = ({
  queues,
  jobs,
  autoRefresh = true,
  refreshInterval = 5000,
  showControls = true,
  onQueueToggle,
  onJobRetry,
  onJobCancel,
  onBulkAction,
  loading = false,
  error = null,
  className,
  ...props
}) => {
  // Auto-refresh functionality
  React.useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        // In a real app, this would trigger a data refresh
        console.log('Refreshing job queue data...');
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  if (loading) {
    return (
      <div className={cn("space-y-6", className)} {...props}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
              Job Queue Manager Error
            </h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Queue Manager</h1>
          <p className="text-muted-foreground">
            Monitor and manage background job processing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {queues.filter(q => q.status === 'active').length} Active
          </Badge>
          {autoRefresh && (
            <span className="text-xs text-muted-foreground">
              Auto-refresh: {refreshInterval / 1000}s
            </span>
          )}
        </div>
      </div>

      {/* Queue Metrics Overview */}
      <QueueMetrics queues={queues} jobs={jobs} />

      {/* Queue Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Queue Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {queues.map((queue) => (
            <QueueCard
              key={queue.id}
              queue={queue}
              showControls={showControls}
              onAction={onQueueToggle}
            />
          ))}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Job Management</h2>
        <JobTable
          jobs={jobs}
          onJobRetry={onJobRetry}
          onJobCancel={onJobCancel}
          onBulkAction={onBulkAction}
        />
      </div>
    </div>
  );
};

JobQueueManager.displayName = "JobQueueManager";

export default JobQueueManager;
