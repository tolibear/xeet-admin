/**
 * Re-scoring Manager Organism
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Enterprise-Scale Operations
 * 
 * Comprehensive re-scoring and reindexing management system for enterprise-scale
 * data integrity operations. Provides tools for score recalculation, index
 * rebuilding, and data consistency management with progress tracking and
 * rollback capabilities.
 * 
 * Features:
 * - Enterprise-scale re-scoring operations with progress tracking
 * - Index rebuilding and data consistency management  
 * - Batch processing with configurable chunk sizes
 * - Rollback capabilities and operation history
 * - Performance monitoring and resource optimization
 * - Entity-specific re-scoring (posts, users, topics)
 * - Rule-based scoring updates and validation
 * - Comprehensive audit trails and logging
 */

import React from 'react';
import {
  RotateCcw,
  Play,
  Check,
  X,
  Clock,
  Database,
  Percent,
  Ban
} from 'lucide-react';
import { Card } from '@/components';
import { Badge } from '@/components';
import { Button } from '@/components';
import { Progress } from '@/components';
import { Input } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components';
import { Switch } from '@/components';
import { Separator } from '@/components';
import { MetricCard } from '@/components/molecules/MetricCard';
import { StatusDot } from '@/components/atoms/StatusDot';
import { cn } from '@/lib/utils';
import type { 
  BackfillJob,
  BaseOrganismProps 
} from '@/lib/types';

export interface ReScoringManagerProps extends BaseOrganismProps {
  /** List of re-scoring jobs */
  jobs: BackfillJob[];
  /** Whether to show job creation controls */
  showCreateControls?: boolean;
  /** Available entity types for re-scoring */
  entityTypes?: string[];
  /** Available operation types */
  operationTypes?: ('rescore' | 'reindex' | 'rebuild' | 'validate')[];
  /** Callback when new re-scoring job is created */
  onCreateJob?: (job: Partial<BackfillJob>) => void;
  /** Callback when job is started */
  onStartJob?: (jobId: string) => void;
  /** Callback when job is cancelled */
  onCancelJob?: (jobId: string) => void;
  /** Callback when job is restarted */
  onRestartJob?: (jobId: string) => void;
  /** Callback when job details are viewed */
  onViewDetails?: (job: BackfillJob) => void;
}

export interface ReScoringJobCardProps {
  /** Re-scoring job to display */
  job: BackfillJob;
  /** Action callbacks */
  onStart?: (id: string) => void;
  onCancel?: (id: string) => void;
  onRestart?: (id: string) => void;
  onViewDetails?: (job: BackfillJob) => void;
}

export interface ReScoringStatsProps {
  /** Jobs for statistics */
  jobs: BackfillJob[];
}

export interface CreateReScoringFormProps {
  /** Entity types available */
  entityTypes: string[];
  /** Operation types available */
  operationTypes: ('rescore' | 'reindex' | 'rebuild' | 'validate')[];
  /** Form submission callback */
  onSubmit: (job: Partial<BackfillJob>) => void;
  /** Cancel callback */
  onCancel: () => void;
}

/**
 * Create Re-scoring Job Form Component
 */
const CreateReScoringForm: React.FC<CreateReScoringFormProps> = ({
  entityTypes,
  operationTypes,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'scoring_update' as const,
    totalRecords: 100000,
    parameters: {
      batchSize: 1000,
      parallelWorkers: 4,
      dryRun: true,
      entityType: 'posts',
      operation: 'rescore' as const
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'pending',
      progress: 0,
      recordsProcessed: 0,
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Job Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Name</label>
              <Input
                placeholder="Enter job name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Entity Type</label>
              <Select 
                value={formData.parameters.entityType}
                onValueChange={(value) => 
                  setFormData({
                    ...formData,
                    parameters: { ...formData.parameters, entityType: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Operation</label>
              <Select
                value={formData.parameters.operation}
                onValueChange={(value: any) => 
                  setFormData({
                    ...formData,
                    parameters: { ...formData.parameters, operation: value }
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operationTypes.map(op => (
                    <SelectItem key={op} value={op}>
                      {op.charAt(0).toUpperCase() + op.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Records</label>
              <Input
                type="number"
                min={1}
                value={formData.totalRecords}
                onChange={(e) =>
                  setFormData({ ...formData, totalRecords: parseInt(e.target.value) || 1000 })
                }
              />
            </div>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Performance Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Batch Size</label>
              <Input
                type="number"
                min={100}
                max={10000}
                value={formData.parameters.batchSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parameters: { 
                      ...formData.parameters, 
                      batchSize: parseInt(e.target.value) || 1000 
                    }
                  })
                }
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Parallel Workers</label>
              <Input
                type="number"
                min={1}
                max={10}
                value={formData.parameters.parallelWorkers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parameters: { 
                      ...formData.parameters, 
                      parallelWorkers: parseInt(e.target.value) || 1 
                    }
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Safety Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Safety Controls</h3>
          
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <div className="font-medium">Dry Run Mode</div>
              <div className="text-sm text-muted-foreground">
                Simulate operation without making changes
              </div>
            </div>
            <Switch
              checked={formData.parameters.dryRun}
              onCheckedChange={(checked) => 
                setFormData({
                  ...formData,
                  parameters: { ...formData.parameters, dryRun: checked }
                })
              }
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={!formData.name}>
            Create Job
          </Button>
        </div>
      </form>
    </div>
  );
};

/**
 * Re-scoring Job Card Component
 */
const ReScoringJobCard: React.FC<ReScoringJobCardProps> = ({
  job,
  onStart,
  onCancel,
  onRestart,
  onViewDetails
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

  const getStatusColor = (status: BackfillJob['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'running': return 'warning';
      case 'failed': return 'error';
      case 'cancelled': return 'idle';
      case 'pending': return 'idle';
      default: return 'idle';
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <StatusDot variant={getStatusColor(job.status)} />
            <h3 className="font-medium">{job.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(job.status)} size="sm">
              {job.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" size="sm">
              {job.type.replace('_', ' ').toUpperCase()}
            </Badge>
            {Boolean(job.parameters.dryRun) && (
              <Badge variant="outline" size="sm">DRY RUN</Badge>
            )}
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>{job.createdBy}</div>
          <div>{new Date(job.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Progress */}
      {job.status === 'running' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress: {job.progress}%</span>
            <span>{formatNumber(job.recordsProcessed)} / {formatNumber(job.totalRecords)}</span>
          </div>
          <Progress value={job.progress} />
        </div>
      )}

      {/* Job Details */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="space-y-2">
          <div>
            <span className="font-medium">Records: </span>
            <span className="text-muted-foreground">{formatNumber(job.totalRecords)}</span>
          </div>
          <div>
            <span className="font-medium">Batch Size: </span>
            <span className="text-muted-foreground">{String(job.parameters.batchSize)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Workers: </span>
            <span className="text-muted-foreground">{String(job.parameters.parallelWorkers)}</span>
          </div>
          <div>
            <span className="font-medium">Duration: </span>
            <span className="text-muted-foreground">{formatDuration(job.duration)}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {job.error && (
        <>
          <Separator />
          <div className="text-xs text-destructive">
            <span className="font-medium">Error: </span>
            {job.error}
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDetails?.(job)}
        >
          View Details
        </Button>
        
        <div className="flex gap-1">
          {job.status === 'pending' && (
            <Button 
              size="sm" 
              variant="default"
              onClick={() => onStart?.(job.id)}
            >
              Start
            </Button>
          )}
          
          {job.status === 'running' && (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onCancel?.(job.id)}
            >
              Cancel
            </Button>
          )}
          
          {job.status === 'failed' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onRestart?.(job.id)}
            >
              Restart
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

/**
 * Re-scoring Statistics Component
 */
const ReScoringStats: React.FC<ReScoringStatsProps> = ({ jobs }) => {
  const stats = React.useMemo(() => {
    const total = jobs.length;
    const byStatus = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalProcessed = jobs.reduce((sum, job) => sum + job.recordsProcessed, 0);
    const running = byStatus.running || 0;
    const completed = byStatus.completed || 0;
    const failed = byStatus.failed || 0;
    const pending = byStatus.pending || 0;
    
    const avgProgress = jobs.length > 0 ? 
      jobs.reduce((sum, job) => sum + job.progress, 0) / jobs.length : 0;
    
    return {
      total,
      running,
      completed,
      failed,
      pending,
      cancelled: byStatus.cancelled || 0,
      totalProcessed,
      avgProgress
    };
  }, [jobs]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        label="Total Jobs"
        value={stats.total.toString()}
        icon={RotateCcw}
        variant="outline"
      />
      
      <MetricCard
        label="Running"
        value={stats.running.toString()}
        icon={Play}
        variant="outline"
        trend={stats.running > 0 ? "up" : "stable"}
      />
      
      <MetricCard
        label="Completed"
        value={stats.completed.toString()}
        icon={Check}
        variant="default"
        trend="up"
      />
      
      <MetricCard
        label="Failed"
        value={stats.failed.toString()}
        icon={X}
        variant="outline"
      />
      
      <MetricCard
        label="Pending"
        value={stats.pending.toString()}
        icon={Clock}
        variant="outline"
      />
      
      <MetricCard
        label="Records Processed"
        value={stats.totalProcessed >= 1000000 ? 
          `${(stats.totalProcessed / 1000000).toFixed(1)}M` :
          stats.totalProcessed >= 1000 ? 
          `${(stats.totalProcessed / 1000).toFixed(1)}K` :
          stats.totalProcessed.toString()
        }
        icon={Database}
        variant="outline"
        trend="up"
      />
      
      <MetricCard
        label="Avg Progress"
        value={`${stats.avgProgress.toFixed(1)}%`}
        icon={Percent}
        variant="outline"
      />
      
      <MetricCard
        label="Cancelled"
        value={stats.cancelled.toString()}
        icon={Ban}
        variant="outline"
      />
    </div>
  );
};

/**
 * Re-scoring Manager Organism
 * 
 * Main component for comprehensive re-scoring and reindexing management
 */
export const ReScoringManager: React.FC<ReScoringManagerProps> = ({
  jobs,
  showCreateControls = true,
  entityTypes = ['posts', 'users', 'topics', 'leaderboards'],
  operationTypes = ['rescore', 'reindex', 'rebuild', 'validate'],
  onCreateJob,
  onStartJob,
  onCancelJob,
  onRestartJob,
  onViewDetails,
  loading = false,
  error = null,
  className,
  onError,
  size,
  variant,
  'data-testid': dataTestId,
  ...props
}) => {
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  const handleCreateJob = (jobData: Partial<BackfillJob>) => {
    onCreateJob?.(jobData);
    setShowCreateForm(false);
  };

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
              Re-scoring Manager Error
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
          <h1 className="text-2xl font-bold">Re-scoring Manager</h1>
          <p className="text-muted-foreground">
            Data integrity and score recalculation tools
          </p>
        </div>
        
        {showCreateControls && (
          <Button onClick={() => setShowCreateForm(true)}>
            Create Job
          </Button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="p-6">
          <CreateReScoringForm
            entityTypes={entityTypes}
            operationTypes={operationTypes}
            onSubmit={handleCreateJob}
            onCancel={() => setShowCreateForm(false)}
          />
        </Card>
      )}

      {/* Statistics Overview */}
      <ReScoringStats jobs={jobs} />

      {/* Jobs Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Re-scoring Jobs</h2>
        
        {jobs.length === 0 ? (
          <Card className="p-8">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">No Jobs</h3>
              <p className="text-muted-foreground">
                No re-scoring jobs found. Create one to get started.
              </p>
              {showCreateControls && (
                <Button onClick={() => setShowCreateForm(true)}>
                  Create Job
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <ReScoringJobCard
                key={job.id}
                job={job}
                onStart={onStartJob}
                onCancel={onCancelJob}
                onRestart={onRestartJob}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

ReScoringManager.displayName = "ReScoringManager";

export default ReScoringManager;
