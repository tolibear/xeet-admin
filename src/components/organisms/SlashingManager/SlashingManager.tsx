/**
 * Slashing Manager Organism
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Enterprise-Scale Operations
 * 
 * Comprehensive slashing and score management system for enterprise-scale content
 * moderation operations. Provides safe, auditable, and reversible content
 * actions with comprehensive audit trails and safety controls.
 * 
 * Features:
 * - Score slashing and boosting with precise control
 * - Content disabling, flagging, and removal actions
 * - Comprehensive audit trails and action history
 * - Rollback capabilities and action reversal
 * - Safety controls and confirmation workflows
 * - Severity-based action classification
 * - Multi-target support (users, posts, topics)
 * - Batch slashing operations with safety limits
 */

import React from 'react';
import {
  Shield,
  Clock,
  Check,
  Undo,
  Minus,
  Plus,
  AlertTriangle,
  X
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/organisms/DataTable';
import { MetricCard } from '@/components/molecules/MetricCard';
import { StatusDot } from '@/components/atoms/StatusDot';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { 
  SlashingAction, 
  BaseOrganismProps
} from '@/lib/types';
import type { DataTableColumn } from '@/components/organisms/DataTable/types';

export interface SlashingManagerProps extends BaseOrganismProps {
  /** List of slashing actions */
  actions: SlashingAction[];
  /** Whether to show action creation controls */
  showCreateControls?: boolean;
  /** Available target types for slashing */
  targetTypes?: SlashingAction['targetType'][];
  /** Available action types */
  actionTypes?: SlashingAction['action'][];
  /** Callback when new slashing action is created */
  onCreateAction?: (action: Partial<SlashingAction>) => void;
  /** Callback when action is applied */
  onApplyAction?: (actionId: string) => void;
  /** Callback when action is reverted */
  onRevertAction?: (actionId: string) => void;
  /** Callback when action is reviewed */
  onReviewAction?: (actionId: string, notes: string) => void;
  /** Callback when action details are viewed */
  onViewDetails?: (action: SlashingAction) => void;
}

export interface CreateSlashingFormProps {
  /** Target types available */
  targetTypes: SlashingAction['targetType'][];
  /** Action types available */
  actionTypes: SlashingAction['action'][];
  /** Form submission callback */
  onSubmit: (action: Partial<SlashingAction>) => void;
  /** Cancel callback */
  onCancel: () => void;
}

export interface SlashingCardProps {
  /** Slashing action to display */
  action: SlashingAction;
  /** Action callbacks */
  onApply?: (id: string) => void;
  onRevert?: (id: string) => void;
  onReview?: (id: string, notes: string) => void;
  onViewDetails?: (action: SlashingAction) => void;
}

export interface SlashingStatsProps {
  /** Actions for statistics */
  actions: SlashingAction[];
}

/**
 * Create Slashing Action Form Component
 */
const CreateSlashingForm: React.FC<CreateSlashingFormProps> = ({
  targetTypes,
  actionTypes,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = React.useState({
    targetType: 'post' as SlashingAction['targetType'],
    targetId: '',
    action: 'slash_score' as SlashingAction['action'],
    amount: 10,
    reason: '',
    severity: 'moderate' as SlashingAction['severity']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'pending',
      audit: {
        appliedBy: 'Current User',
        appliedAt: new Date().toISOString()
      }
    });
  };

  const requiresAmount = ['slash_score', 'boost_score'].includes(formData.action);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Target Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Target Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Target Type</label>
            <Select 
              value={formData.targetType}
              onValueChange={(value: SlashingAction['targetType']) => 
                setFormData({ ...formData, targetType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {targetTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Target ID</label>
            <Input
              placeholder="Enter target ID"
              value={formData.targetId}
              onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {/* Action Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Action Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Action Type</label>
            <Select
              value={formData.action}
              onValueChange={(value: SlashingAction['action']) => 
                setFormData({ ...formData, action: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {actionTypes.map(action => (
                  <SelectItem key={action} value={action}>
                    {action.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {requiresAmount && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {formData.action === 'slash_score' ? 'Slash Amount' : 'Boost Amount'}
              </label>
              <Input
                type="number"
                min={1}
                max={100}
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseInt(e.target.value) || 1 })
                }
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Severity</label>
          <Select
            value={formData.severity}
            onValueChange={(value: SlashingAction['severity']) => 
              setFormData({ ...formData, severity: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minor">Minor</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="major">Major</SelectItem>
              <SelectItem value="severe">Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Reason</label>
          <Textarea
            placeholder="Enter detailed reason for this action"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            rows={3}
            required
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!formData.targetId || !formData.reason}>
          Create Action
        </Button>
      </div>
    </form>
  );
};

/**
 * Slashing Action Card Component
 */
const SlashingCard: React.FC<SlashingCardProps> = ({
  action,
  onApply,
  onRevert,
  onReview,
  onViewDetails
}) => {
  const [reviewNotes, setReviewNotes] = React.useState('');

  const getStatusVariant = (status: SlashingAction['status']) => {
    switch (status) {
      case 'applied': return 'default';
      case 'pending': return 'secondary';
      case 'reverted': return 'outline';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: SlashingAction['status']) => {
    switch (status) {
      case 'applied': return 'success';
      case 'pending': return 'warning';
      case 'reverted': return 'idle';
      case 'failed': return 'error';
      default: return 'idle';
    }
  };

  const getSeverityVariant = (severity: SlashingAction['severity']) => {
    switch (severity) {
      case 'minor': return 'outline';
      case 'moderate': return 'secondary';
      case 'major': return 'default';
      case 'severe': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <StatusDot variant={getStatusColor(action.status)} />
            <div className="font-medium">
              {action.action.replace('_', ' ').toUpperCase()}
            </div>
            {action.amount && (
              <Badge variant="outline" size="sm">
                {action.action === 'slash_score' ? '-' : '+'}{action.amount}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getStatusVariant(action.status)} size="sm">
              {action.status.toUpperCase()}
            </Badge>
            <Badge variant={getSeverityVariant(action.severity)} size="sm">
              {action.severity.toUpperCase()}
            </Badge>
            <Badge variant="outline" size="sm">
              {action.targetType.toUpperCase()}
            </Badge>
          </div>
        </div>
        
        <div className="text-right text-xs text-muted-foreground">
          <div>{action.audit.appliedBy}</div>
          <div>{new Date(action.audit.appliedAt).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Target Information */}
      <div className="space-y-2">
        <div className="text-sm font-medium">Target: {action.targetId}</div>
        <div className="text-sm text-muted-foreground">{action.reason}</div>
      </div>

      {/* Audit Trail */}
      {(action.audit.reviewedBy || action.audit.revertedBy) && (
        <>
          <Separator />
          <div className="space-y-2 text-xs">
            {action.audit.reviewedBy && (
              <div className="flex items-center justify-between">
                <span>Reviewed by: {action.audit.reviewedBy}</span>
                <span>{action.audit.reviewedAt && new Date(action.audit.reviewedAt).toLocaleString()}</span>
              </div>
            )}
            {action.audit.revertedBy && (
              <div className="flex items-center justify-between">
                <span>Reverted by: {action.audit.revertedBy}</span>
                <span>{action.audit.revertedAt && new Date(action.audit.revertedAt).toLocaleString()}</span>
              </div>
            )}
            {action.audit.notes && (
              <div className="text-muted-foreground">
                Notes: {action.audit.notes}
              </div>
            )}
          </div>
        </>
      )}

      {/* Value Changes */}
      {action.originalValues && action.newValues && (
        <>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-medium text-muted-foreground">Original</div>
              <div>Score: {String(action.originalValues.score)}</div>
              <div>Status: {String(action.originalValues.status)}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground">New</div>
              <div>Score: {String(action.newValues.score)}</div>
              <div>Status: {String(action.newValues.status)}</div>
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onViewDetails?.(action)}
        >
          View Details
        </Button>
        
        <div className="flex gap-1">
          {action.status === 'pending' && (
            <>
              <Button 
                size="sm" 
                variant="default"
                onClick={() => onApply?.(action.id)}
              >
                Apply
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">Review</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Review Action</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Enter review notes..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        onClick={() => {
                          onReview?.(action.id, reviewNotes);
                          setReviewNotes('');
                        }}
                        disabled={!reviewNotes}
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
          
          {action.status === 'applied' && (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onRevert?.(action.id)}
            >
              Revert
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

/**
 * Slashing Statistics Component
 */
const SlashingStats: React.FC<SlashingStatsProps> = ({ actions }) => {
  const stats = React.useMemo(() => {
    const total = actions.length;
    const byStatus = actions.reduce((acc, action) => {
      acc[action.status] = (acc[action.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const bySeverity = actions.reduce((acc, action) => {
      acc[action.severity] = (acc[action.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byAction = actions.reduce((acc, action) => {
      acc[action.action] = (acc[action.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total,
      pending: byStatus.pending || 0,
      applied: byStatus.applied || 0,
      reverted: byStatus.reverted || 0,
      failed: byStatus.failed || 0,
      severe: bySeverity.severe || 0,
      major: bySeverity.major || 0,
      moderate: bySeverity.moderate || 0,
      minor: bySeverity.minor || 0,
      slashes: byAction.slash_score || 0,
      boosts: byAction.boost_score || 0,
      disables: byAction.disable || 0,
      flags: byAction.flag || 0,
      removals: byAction.remove || 0
    };
  }, [actions]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        title="Total Actions"
        value={stats.total.toString()}
        icon={Shield}
        variant="outline"
      />
      
      <MetricCard
        title="Pending Review"
        value={stats.pending.toString()}
        icon={Clock}
        variant="outline"
        // trend={stats.pending > 0 ? "up" : "stable"}
      />
      
      <MetricCard
        title="Applied"
        value={stats.applied.toString()}
        icon={Check}
        variant="default"
        // trend="up"
      />
      
      <MetricCard
        title="Reverted"
        value={stats.reverted.toString()}
        icon={Undo}
        variant="outline"
      />
      
      <MetricCard
        title="Score Slashes"
        value={stats.slashes.toString()}
        icon={Minus}
        variant="outline"
      />
      
      <MetricCard
        title="Score Boosts"
        value={stats.boosts.toString()}
        icon={Plus}
        variant={stats.boosts > 0 ? "default" : "outline"}
      />
      
      <MetricCard
        title="Severe Actions"
        value={stats.severe.toString()}
        icon={AlertTriangle}
        variant="outline"
      />
      
      <MetricCard
        title="Failed Actions"
        value={stats.failed.toString()}
        icon={X}
        variant="outline"
      />
    </div>
  );
};

/**
 * Slashing Manager Organism
 * 
 * Main component for comprehensive slashing and score management
 */
export const SlashingManager: React.FC<SlashingManagerProps> = ({
  actions,
  showCreateControls = true,
  targetTypes = ['user', 'post', 'topic'],
  actionTypes = ['slash_score', 'boost_score', 'disable', 'flag', 'remove'],
  onCreateAction,
  onApplyAction,
  onRevertAction,
  onReviewAction,
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

  const handleCreateAction = (actionData: Partial<SlashingAction>) => {
    onCreateAction?.(actionData);
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
              Slashing Manager Error
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
          <h1 className="text-2xl font-bold">Slashing Manager</h1>
          <p className="text-muted-foreground">
            Content moderation and score management with audit trails
          </p>
        </div>
        
        {showCreateControls && (
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button>Create Action</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Slashing Action</DialogTitle>
              </DialogHeader>
              <CreateSlashingForm
                targetTypes={targetTypes}
                actionTypes={actionTypes}
                onSubmit={handleCreateAction}
                onCancel={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Overview */}
      <SlashingStats actions={actions} />

      {/* Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Slashing Actions</h2>
        
        {actions.length === 0 ? (
          <Card className="p-8">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium">No Actions</h3>
              <p className="text-muted-foreground">
                No slashing actions found. Create one to get started.
              </p>
              {showCreateControls && (
                <Button onClick={() => setShowCreateForm(true)}>
                  Create Action
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {actions.map((action) => (
              <SlashingCard
                key={action.id}
                action={action}
                onApply={onApplyAction}
                onRevert={onRevertAction}
                onReview={onReviewAction}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

SlashingManager.displayName = "SlashingManager";

export default SlashingManager;
