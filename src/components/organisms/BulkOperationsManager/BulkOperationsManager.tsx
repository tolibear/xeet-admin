/**
 * Bulk Operations Manager Organism
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Enterprise-Scale Operations
 * 
 * Comprehensive bulk operations management system for enterprise-scale data
 * processing and batch operations. Provides safe, auditable, and efficient
 * bulk data management with progress tracking and rollback capabilities.
 * 
 * Features:
 * - Enterprise-scale bulk data operations (delete, update, rescore, reindex)
 * - Safety controls and confirmation workflows
 * - Progress tracking and real-time status monitoring
 * - Rollback capabilities and operation history
 * - Batch size optimization and resource management
 * - Comprehensive audit trails and logging
 * - Dry-run simulations before execution
 * - Multi-entity type support (posts, users, topics, etc.)
 */

import React from 'react';
import {
  Layers,
  Play,
  Check,
  X,
  Clock,
  AlertTriangle,
  Archive
} from 'lucide-react';
import { Card } from '@/components';
import { Badge } from '@/components';
import { Button } from '@/components';
import { Progress } from '@/components';
import { Switch } from '@/components';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components';
import { Input } from '@/components';
import { Textarea } from '@/components';
import { Separator } from '@/components';
import { DataTable } from '@/components/organisms/DataTable';
import { MetricCard } from '@/components/molecules/MetricCard';
import { StatusDot } from '@/components/atoms/StatusDot';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components';
import { cn } from '@/lib/utils';
import type { 
  BulkOperation, 
  BaseOrganismProps
} from '@/lib/types';
import type { DataTableColumn } from '@/components/organisms/DataTable/types';

export interface BulkOperationsManagerProps extends BaseOrganismProps {
  /** List of bulk operations */
  operations: BulkOperation[];
  /** Whether to show operation creation controls */
  showCreateControls?: boolean;
  /** Whether to auto-refresh operations data */
  autoRefresh?: boolean;
  /** Available entity types for operations */
  entityTypes?: string[];
  /** Available operation types */
  operationTypes?: string[];
  /** Callback when new operation is created */
  onCreateOperation?: (operation: Partial<BulkOperation>) => void;
  /** Callback when operation is cancelled */
  onCancelOperation?: (operationId: string) => void;
  /** Callback when operation is retried */
  onRetryOperation?: (operationId: string) => void;
  /** Callback when operation is rolled back */
  onRollbackOperation?: (operationId: string) => void;
  /** Callback when operation details are viewed */
  onViewDetails?: (operation: BulkOperation) => void;
}

export interface CreateOperationFormProps {
  /** Entity types available */
  entityTypes: string[];
  /** Operation types available */
  operationTypes: string[];
  /** Form submission callback */
  onSubmit: (operation: Partial<BulkOperation>) => void;
  /** Cancel callback */
  onCancel: () => void;
}

export interface OperationCardProps {
  /** Operation to display */
  operation: BulkOperation;
  /** Action callbacks */
  onCancel?: (id: string) => void;
  onRetry?: (id: string) => void;
  onRollback?: (id: string) => void;
  onViewDetails?: (operation: BulkOperation) => void;
}

export interface OperationsStatsProps {
  /** Operations for statistics */
  operations: BulkOperation[];
}

/**
 * Create Operation Form Component
 */
const CreateOperationForm: React.FC<CreateOperationFormProps> = ({
  entityTypes,
  operationTypes,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'update' as const,
    entityType: 'posts' as const,
    parameters: {},
    filters: {},
    safetyControls: {
      dryRun: true,
      requiresConfirmation: true,
      maxItems: 10000,
      timeout: 3600
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      createdBy: 'Current User',
      createdAt: new Date().toISOString()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Operation Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Operation Name</label>
            <Input
              placeholder="Enter operation name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Operation Type</label>
            <Select 
              value={formData.type}
              onValueChange={(value: any) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {operationTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Entity Type</label>
          <Select
            value={formData.entityType}
            onValueChange={(value: any) => setFormData({ ...formData, entityType: value })}
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

      {/* Safety Controls */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Safety Controls</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <div className="font-medium">Dry Run Mode</div>
              <div className="text-sm text-muted-foreground">
                Simulate operation without making changes
              </div>
            </div>
            <Switch
              checked={formData.safetyControls.dryRun}
              onCheckedChange={(checked) => 
                setFormData({
                  ...formData,
                  safetyControls: { ...formData.safetyControls, dryRun: checked }
                })
              }
            />
          </div>
          
          <div className="flex items-center justify-between p-3 border rounded">
            <div>
              <div className="font-medium">Requires Confirmation</div>
              <div className="text-sm text-muted-foreground">
                Additional confirmation before execution
              </div>
            </div>
            <Switch
              checked={formData.safetyControls.requiresConfirmation}
              onCheckedChange={(checked) => 
                setFormData({
                  ...formData,
                  safetyControls: { ...formData.safetyControls, requiresConfirmation: checked }
                })
              }
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Max Items</label>
            <Input
              type="number"
              min={1}
              max={1000000}
              value={formData.safetyControls.maxItems}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  safetyControls: { 
                    ...formData.safetyControls, 
                    maxItems: parseInt(e.target.value) || 10000 
                  }
                })
              }
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Timeout (seconds)</label>
            <Input
              type="number"
              min={60}
              max={86400}
              value={formData.safetyControls.timeout}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  safetyControls: { 
                    ...formData.safetyControls, 
                    timeout: parseInt(e.target.value) || 3600 
                  }
                })
              }
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!formData.name}>
          Create Operation
        </Button>
      </div>
    </form>
  );
};

/**
 * Operation Card Component
 */
const OperationCard: React.FC<OperationCardProps> = ({
  operation,
  onCancel,
  onRetry,
  onRollback,
  onViewDetails
}) => {
  const getStatusVariant = (status: BulkOperation['status']) => {
    switch (status) {
      case 'completed': return 'default';
      case 'running': return 'secondary';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      case 'queued': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: BulkOperation['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'running': return 'warning';
      case 'failed': return 'error';
      case 'cancelled': return 'idle';
      case 'queued': return 'idle';
      default: return 'idle';
    }
  };

  const formatDuration = (startTime?: string, endTime?: string) => {
    if (!startTime) return '-';
    const start = new Date(startTime).getTime();
    const end = endTime ? new Date(endTime).getTime() : Date.now();
    const duration = Math.floor((end - start) / 1000);
    
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
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
            <StatusDot variant={getStatusColor(operation.status)} />
            <h3 className="font-medium">{operation.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(operation.status)} size="sm">
              {operation.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" size="sm">
              {operation.type.toUpperCase()}
            </Badge>
            <Badge variant="outline" size="sm">
              {operation.entityType.toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>{operation.createdBy}</div>
          <div>{new Date(operation.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Progress */}
      {operation.status === 'running' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress: {operation.progress.percentage}%</span>
            <span>{formatNumber(operation.progress.processed)} / {formatNumber(operation.progress.total)}</span>
          </div>
          <Progress value={operation.progress.percentage} />
          {operation.progress.currentItem && (
            <div className="text-xs text-muted-foreground">
              Processing: {operation.progress.currentItem}
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {operation.results && (
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
            <div className="font-medium text-green-700 dark:text-green-400">
              {formatNumber(operation.results.successful)}
            </div>
            <div className="text-green-600 dark:text-green-500">Successful</div>
          </div>
          <div className="text-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
            <div className="font-medium text-red-700 dark:text-red-400">
              {formatNumber(operation.results.failed)}
            </div>
            <div className="text-red-600 dark:text-red-500">Failed</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-950/20 rounded">
            <div className="font-medium text-gray-700 dark:text-gray-400">
              {formatNumber(operation.results.skipped)}
            </div>
            <div className="text-gray-600 dark:text-gray-500">Skipped</div>
          </div>
        </div>
      )}

      {/* Duration and Safety Controls */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Duration: {formatDuration(operation.startedAt, operation.completedAt)}</span>
          {operation.safetyControls.dryRun && (
            <Badge variant="outline" size="sm">DRY RUN</Badge>
          )}
        </div>
        <div>Max: {formatNumber(operation.safetyControls.maxItems)}</div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDetails?.(operation)}
        >
          View Details
        </Button>
        
        <div className="flex gap-1">
          {operation.status === 'failed' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onRetry?.(operation.id)}
            >
              Retry
            </Button>
          )}
          
          {['queued', 'running'].includes(operation.status) && (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onCancel?.(operation.id)}
            >
              Cancel
            </Button>
          )}
          
          {operation.status === 'completed' && !operation.safetyControls.dryRun && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onRollback?.(operation.id)}
            >
              Rollback
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

/**
 * Operations Statistics Component
 */
const OperationsStats: React.FC<OperationsStatsProps> = ({ operations }) => {
  const stats = React.useMemo(() => {
    const total = operations.length;
    const byStatus = operations.reduce((acc, op) => {
      acc[op.status] = (acc[op.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const totalProcessed = operations
      .filter(op => op.results)
      .reduce((sum, op) => sum + (op.results?.successful || 0), 0);
    
    const totalFailed = operations
      .filter(op => op.results)
      .reduce((sum, op) => sum + (op.results?.failed || 0), 0);
    
    const running = byStatus.running || 0;
    const completed = byStatus.completed || 0;
    const failed = byStatus.failed || 0;
    
    return {
      total,
      running,
      completed,
      failed,
      queued: byStatus.queued || 0,
      cancelled: byStatus.cancelled || 0,
      totalProcessed,
      totalFailed,
      successRate: totalProcessed + totalFailed > 0 ? 
        (totalProcessed / (totalProcessed + totalFailed)) * 100 : 0
    };
  }, [operations]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        label="Total Operations"
        value={stats.total.toString()}
        icon="activity"
        variant="outline"
      />
      
      <MetricCard
        label="Running"
        value={stats.running.toString()}
        icon="play"
        variant={stats.running > 0 ? "secondary" : "outline"}
        trend={stats.running > 0 ? "up" : "stable"}
      />
      
      <MetricCard
        label="Completed"
        value={stats.completed.toString()}
        icon="check"
        variant="default"
        trend="up"
      />
      
      <MetricCard
        label="Failed"
        value={stats.failed.toString()}
        icon="x"
        variant={stats.failed > 0 ? "destructive" : "outline"}
      />
      
      <MetricCard
        label="Success Rate"
        value={`${stats.successRate.toFixed(1)}%`}
        icon="percent"
        variant={stats.successRate > 90 ? "default" : stats.successRate > 70 ? "secondary" : "destructive"}
      />
      
      <MetricCard
        label="Items Processed"
        value={stats.totalProcessed >= 1000000 ? 
          `${(stats.totalProcessed / 1000000).toFixed(1)}M` :
          stats.totalProcessed >= 1000 ? 
          `${(stats.totalProcessed / 1000).toFixed(1)}K` :
          stats.totalProcessed.toString()
        }
        icon="database"
        variant="outline"
        trend="up"
      />
      
      <MetricCard
        label="Queued"
        value={stats.queued.toString()}
        icon="clock"
        variant={stats.queued > 0 ? "secondary" : "outline"}
      />
      
      <MetricCard
        label="Cancelled"
        value={stats.cancelled.toString()}
        icon="ban"
        variant="outline"
      />
    </div>
  );
};

/**
 * Bulk Operations Manager Organism
 * 
 * Main component for comprehensive bulk operations management
 */
export const BulkOperationsManager: React.FC<BulkOperationsManagerProps> = ({
  operations,
  showCreateControls = true,
  autoRefresh = true,
  entityTypes = ['posts', 'users', 'topics', 'leaderboards', 'rules'],
  operationTypes = ['delete', 'update', 'rescore', 'reindex', 'export', 'import'],
  onCreateOperation,
  onCancelOperation,
  onRetryOperation,
  onRollbackOperation,
  onViewDetails,
  loading = false,
  error = null,
  className,
  ...props
}) => {
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  // Auto-refresh functionality
  React.useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // In a real app, this would trigger a data refresh
        console.log('Refreshing bulk operations data...');
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleCreateOperation = (operationData: Partial<BulkOperation>) => {
    onCreateOperation?.(operationData);
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
              Bulk Operations Manager Error
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
          <h1 className="text-2xl font-bold">Bulk Operations</h1>
          <p className="text-muted-foreground">
            Enterprise-scale data processing and batch operations
          </p>
        </div>
        
        {showCreateControls && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button>Create Operation</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Bulk Operation</DialogTitle>
              </DialogHeader>
              <CreateOperationForm
                entityTypes={entityTypes}
                operationTypes={operationTypes}
                onSubmit={handleCreateOperation}
                onCancel={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Overview */}
      <OperationsStats operations={operations} />

      {/* Operations Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Active Operations</h2>
        
        {operations.length === 0 ? (
          <Card className="p-8">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">No Operations</h3>
              <p className="text-muted-foreground">
                No bulk operations found. Create one to get started.
              </p>
              {showCreateControls && (
                <Button onClick={() => setShowCreateForm(true)}>
                  Create Operation
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {operations.map((operation) => (
              <OperationCard
                key={operation.id}
                operation={operation}
                onCancel={onCancelOperation}
                onRetry={onRetryOperation}
                onRollback={onRollbackOperation}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

BulkOperationsManager.displayName = "BulkOperationsManager";

export default BulkOperationsManager;
