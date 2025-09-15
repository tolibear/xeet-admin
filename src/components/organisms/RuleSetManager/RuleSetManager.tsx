"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings,
  Plus,
  Copy,
  ArrowUp,
  Archive,
  Trash2,
  Play,
  Pause,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  MoreVertical,
  Search,
  Filter,
  RotateCcw,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { 
  RuleSetManagerProps,
  RuleSetCardProps,
  RuleSetActionsProps,
  CreateRuleSetModalProps,
  PromoteRuleSetModalProps,
  RuleSetFilters,
  RuleSetSortField,
  RuleSetStatusBadgeProps
} from "./types";
import type { RuleSet, RuleStatus } from "@/lib/types";

// Status color mapping
const STATUS_COLORS: Record<RuleStatus, string> = {
  draft: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  staged: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  active: "bg-green-500/10 text-green-700 border-green-500/20",
  archived: "bg-slate-500/10 text-slate-700 border-slate-500/20",
};

const STATUS_ICONS: Record<RuleStatus, typeof Edit> = {
  draft: Edit,
  staged: Clock,
  active: CheckCircle,
  archived: Archive,
};

/**
 * RuleSetManager Organism
 * 
 * Comprehensive rule set lifecycle management with:
 * - Draft/Staged/Active state management
 * - Rule set promotion and deployment
 * - Version control and rollback capabilities
 * - Bulk operations and filtering
 * - Deployment history and audit trails
 */
export function RuleSetManager({
  ruleSets,
  activeRuleSetId,
  stagedRuleSetId,
  canCreate = true,
  canEdit = true,
  canPromote = false,
  onRuleSetSelect,
  onRuleSetCreate,
  onRuleSetClone,
  onRuleSetPromote,
  onRuleSetArchive,
  onRuleSetDelete,
  loading = false,
  error,
  className,
  "data-testid": testId = "rule-set-manager",
}: RuleSetManagerProps) {
  const [selectedRuleSet, setSelectedRuleSet] = useState<RuleSet | null>(null);
  const [filters, setFilters] = useState<RuleSetFilters>({
    sortBy: "updatedAt",
    sortDirection: "desc",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promotionTarget, setPromotionTarget] = useState<{ ruleSet: RuleSet; status: RuleStatus } | null>(null);

  // Filter and sort rule sets
  const filteredRuleSets = useMemo(() => {
    let filtered = [...ruleSets];

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(rs => filters.status!.includes(rs.status));
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(rs => 
        rs.name.toLowerCase().includes(searchLower) ||
        rs.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply organization filter
    if (filters.orgId) {
      filtered = filtered.filter(rs => rs.orgId === filters.orgId);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const direction = filters.sortDirection === "asc" ? 1 : -1;
      
      switch (filters.sortBy) {
        case "name":
          return direction * a.name.localeCompare(b.name);
        case "status":
          return direction * a.status.localeCompare(b.status);
        case "version":
          return direction * a.version.localeCompare(b.version);
        case "updatedAt":
          return direction * (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
        case "createdAt":
          return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        default:
          return 0;
      }
    });

    return filtered;
  }, [ruleSets, filters]);

  // Group rule sets by status
  const ruleSetsByStatus = useMemo(() => {
    return filteredRuleSets.reduce((acc, ruleSet) => {
      if (!acc[ruleSet.status]) {
        acc[ruleSet.status] = [];
      }
      acc[ruleSet.status].push(ruleSet);
      return acc;
    }, {} as Record<RuleStatus, RuleSet[]>);
  }, [filteredRuleSets]);

  const handleRuleSetSelect = useCallback((ruleSet: RuleSet) => {
    setSelectedRuleSet(ruleSet);
    onRuleSetSelect?.(ruleSet);
  }, [onRuleSetSelect]);

  const handleCreateRuleSet = useCallback((name: string, description: string, basedOn?: RuleSet) => {
    onRuleSetCreate?.(name, description);
    setShowCreateModal(false);
  }, [onRuleSetCreate]);

  const handleCloneRuleSet = useCallback((sourceRuleSet: RuleSet, newName: string) => {
    onRuleSetClone?.(sourceRuleSet, newName);
  }, [onRuleSetClone]);

  const handlePromoteRuleSet = useCallback((ruleSet: RuleSet, toStatus: RuleStatus) => {
    setPromotionTarget({ ruleSet, status: toStatus });
    setShowPromoteModal(true);
  }, []);

  const confirmPromotion = useCallback(() => {
    if (promotionTarget) {
      onRuleSetPromote?.(promotionTarget.ruleSet, promotionTarget.status);
      setShowPromoteModal(false);
      setPromotionTarget(null);
    }
  }, [promotionTarget, onRuleSetPromote]);

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)} data-testid={testId}>
        <CardHeader className="space-y-2">
          <div className="h-6 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-destructive", className)} data-testid={testId}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)} data-testid={testId}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Rule Set Management
              </CardTitle>
              <CardDescription>
                Manage scoring rule sets across draft, staging, and production environments
              </CardDescription>
            </div>
            {canCreate && (
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Rule Set
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search rule sets..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9"
                />
              </div>
            </div>
            <Select 
              value={filters.sortBy} 
              onValueChange={(value: RuleSetSortField) => setFilters(prev => ({ ...prev, sortBy: value }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">Last Updated</SelectItem>
                <SelectItem value="createdAt">Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="version">Version</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, sortDirection: prev.sortDirection === "asc" ? "desc" : "asc" }))}
              className="gap-2"
            >
              {filters.sortDirection === "asc" ? "↑" : "↓"}
              {filters.sortDirection === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rule Set Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.keys(STATUS_COLORS) as RuleStatus[]).map(status => {
          const count = ruleSetsByStatus[status]?.length || 0;
          const StatusIcon = STATUS_ICONS[status];
          
          return (
            <Card key={status} className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <StatusIcon className="h-4 w-4" />
                  <Badge variant="outline" className={cn("capitalize", STATUS_COLORS[status])}>
                    {status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-muted-foreground">
                  {count === 1 ? "Rule Set" : "Rule Sets"}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rule Sets List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Rule Sets ({filteredRuleSets.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="p-4 space-y-3">
              {filteredRuleSets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {filters.search || filters.status ? "No rule sets match your filters" : "No rule sets found"}
                </div>
              ) : (
                filteredRuleSets.map(ruleSet => (
                  <RuleSetCard
                    key={ruleSet.id}
                    ruleSet={ruleSet}
                    isActive={ruleSet.id === activeRuleSetId}
                    isStaged={ruleSet.id === stagedRuleSetId}
                    isSelected={selectedRuleSet?.id === ruleSet.id}
                    canEdit={canEdit}
                    canPromote={canPromote}
                    onClick={() => handleRuleSetSelect(ruleSet)}
                    onClone={(newName) => handleCloneRuleSet(ruleSet, newName)}
                    onPromote={(status) => handlePromoteRuleSet(ruleSet, status)}
                    onArchive={() => onRuleSetArchive?.(ruleSet)}
                    onDelete={() => onRuleSetDelete?.(ruleSet)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Create Rule Set Modal */}
      <CreateRuleSetModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateRuleSet}
        availableRuleSets={ruleSets}
      />

      {/* Promote Rule Set Modal */}
      <PromoteRuleSetModal
        open={showPromoteModal}
        ruleSet={promotionTarget?.ruleSet!}
        targetStatus={promotionTarget?.status!}
        onClose={() => setShowPromoteModal(false)}
        onConfirm={confirmPromotion}
      />
    </div>
  );
}

/**
 * RuleSetCard Component
 * Individual rule set display with actions
 */
function RuleSetCard({
  ruleSet,
  isActive,
  isStaged,
  isSelected,
  canEdit,
  canPromote,
  onClick,
  onEdit,
  onClone,
  onPromote,
  onArchive,
  onDelete,
}: RuleSetCardProps) {
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [cloneName, setCloneName] = useState(`${ruleSet.name} (Copy)`);

  const handleClone = () => {
    onClone?.(cloneName);
    setShowCloneDialog(false);
    setCloneName(`${ruleSet.name} (Copy)`);
  };

  return (
    <>
      <Card 
        className={cn(
          "transition-colors cursor-pointer hover:bg-muted/30",
          isSelected && "ring-2 ring-primary bg-primary/5",
          isActive && "border-green-500/50",
          isStaged && "border-yellow-500/50"
        )}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium">{ruleSet.name}</h3>
                <RuleSetStatusBadge 
                  status={ruleSet.status} 
                  isActive={isActive}
                  isStaged={isStaged}
                />
                {isActive && (
                  <Badge variant="default" className="gap-1">
                    <Play className="h-3 w-3" />
                    Production
                  </Badge>
                )}
                {isStaged && (
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Staged
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{ruleSet.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>v{ruleSet.version}</span>
                <span>{ruleSet.rules.length} rules</span>
                <span>Updated {new Date(ruleSet.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <RuleSetActions
              ruleSet={ruleSet}
              canEdit={canEdit}
              canPromote={canPromote}
              isActive={isActive}
              isStaged={isStaged}
              onEdit={onEdit}
              onClone={() => setShowCloneDialog(true)}
              onPromote={onPromote}
              onArchive={onArchive}
              onDelete={onDelete}
            />
          </div>
        </CardContent>
      </Card>

      {/* Clone Dialog */}
      <Dialog open={showCloneDialog} onOpenChange={setShowCloneDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clone Rule Set</DialogTitle>
            <DialogDescription>
              Create a copy of "{ruleSet.name}" with a new name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                placeholder="Enter name for cloned rule set"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCloneDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleClone} disabled={!cloneName.trim()}>
                Clone Rule Set
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * RuleSetActions Component
 * Action buttons for rule set management
 */
function RuleSetActions({
  ruleSet,
  canEdit,
  canPromote,
  isActive,
  isStaged,
  onEdit,
  onClone,
  onPromote,
  onArchive,
  onDelete,
}: RuleSetActionsProps) {
  const canPromoteToStaged = ruleSet.status === "draft" && canPromote;
  const canPromoteToActive = ruleSet.status === "staged" && canPromote;
  const canArchive = ruleSet.status !== "archived" && ruleSet.status !== "active";
  const canDelete = ruleSet.status === "draft" || ruleSet.status === "archived";

  return (
    <div className="flex items-center gap-1">
      {canEdit && (
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>
          <Edit className="h-4 w-4" />
        </Button>
      )}
      
      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onClone?.(); }}>
        <Copy className="h-4 w-4" />
      </Button>

      {canPromoteToStaged && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => { e.stopPropagation(); onPromote?.("staged"); }}
          className="text-yellow-600"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      )}

      {canPromoteToActive && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => { e.stopPropagation(); onPromote?.("active"); }}
          className="text-green-600"
        >
          <Play className="h-4 w-4" />
        </Button>
      )}

      {canArchive && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => { e.stopPropagation(); onArchive?.(); }}
          className="text-slate-600"
        >
          <Archive className="h-4 w-4" />
        </Button>
      )}

      {canDelete && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          className="text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

/**
 * RuleSetStatusBadge Component
 */
function RuleSetStatusBadge({ status, isActive, isStaged }: RuleSetStatusBadgeProps) {
  const StatusIcon = STATUS_ICONS[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn("capitalize gap-1", STATUS_COLORS[status])}
    >
      <StatusIcon className="h-3 w-3" />
      {status}
    </Badge>
  );
}

/**
 * CreateRuleSetModal Component
 */
function CreateRuleSetModal({
  open,
  onClose,
  onSubmit,
  availableRuleSets = [],
}: CreateRuleSetModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basedOnId, setBasedOnId] = useState<string>("");

  const handleSubmit = () => {
    if (name.trim()) {
      const basedOn = basedOnId ? availableRuleSets.find(rs => rs.id === basedOnId) : undefined;
      onSubmit(name.trim(), description.trim(), basedOn);
      setName("");
      setDescription("");
      setBasedOnId("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Rule Set</DialogTitle>
          <DialogDescription>
            Create a new rule set from scratch or based on an existing one
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter rule set name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter rule set description"
              rows={3}
            />
          </div>
          {availableRuleSets.length > 0 && (
            <div>
              <label className="text-sm font-medium">Based On (Optional)</label>
              <Select value={basedOnId} onValueChange={setBasedOnId}>
                <SelectTrigger>
                  <SelectValue placeholder="Start from scratch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Start from scratch</SelectItem>
                  {availableRuleSets.map(ruleSet => (
                    <SelectItem key={ruleSet.id} value={ruleSet.id}>
                      {ruleSet.name} (v{ruleSet.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim()}>
              Create Rule Set
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * PromoteRuleSetModal Component
 */
function PromoteRuleSetModal({
  open,
  ruleSet,
  targetStatus,
  onClose,
  onConfirm,
}: PromoteRuleSetModalProps) {
  if (!ruleSet) return null;

  const getPromotionMessage = () => {
    switch (targetStatus) {
      case "staged":
        return "This will move the rule set to staging for testing. You can promote it to production later.";
      case "active":
        return "This will deploy the rule set to production and make it the active scoring system. This action affects live scoring.";
      case "archived":
        return "This will archive the rule set and make it read-only. It cannot be activated again.";
      default:
        return "This will change the rule set status.";
    }
  };

  const getWarningLevel = () => {
    switch (targetStatus) {
      case "active":
        return "destructive";
      case "archived":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Promote Rule Set to {targetStatus.charAt(0).toUpperCase() + targetStatus.slice(1)}
          </DialogTitle>
          <DialogDescription>{ruleSet.name}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">{getPromotionMessage()}</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant={getWarningLevel() as any} onClick={onConfirm}>
              Confirm Promotion
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
