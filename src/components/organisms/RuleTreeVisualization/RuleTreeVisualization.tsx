"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";
import { Badge } from "@/components";
import { Button } from "@/components";
import { Separator } from "@/components";
import { ScrollArea } from "@/components";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components";
import { 
  TreePine,
  ChevronDown, 
  ChevronRight,
  List,
  Network,
  PlayCircle,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Layers,
  ArrowRight,
  ArrowDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { 
  RuleTreeVisualizationProps,
  TreeNodeProps,
  CategoryNodeProps,
  TreeViewMode,
  CategoryStatistics,
  RuleHierarchy,
  ExecutionFlow
} from "./types";
import type { ScoringCategory, ScoringRule } from "@/lib/types";

// Category color mapping for consistent theming
const CATEGORY_COLORS: Record<ScoringCategory, string> = {
  engagement: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  quality: "bg-green-500/10 text-green-700 border-green-500/20", 
  relevance: "bg-purple-500/10 text-purple-700 border-purple-500/20",
  influence: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  sentiment: "bg-pink-500/10 text-pink-700 border-pink-500/20",
  reach: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
};

const CATEGORY_ICONS: Record<ScoringCategory, typeof TrendingUp> = {
  engagement: TrendingUp,
  quality: CheckCircle,
  relevance: Target,
  influence: BarChart3,
  sentiment: AlertCircle,
  reach: Layers,
};

const VIEW_MODE_ICONS: Record<TreeViewMode, typeof List> = {
  category: List,
  priority: BarChart3,
  dependency: Network,
  execution: PlayCircle,
};

/**
 * RuleTreeVisualization Organism
 * 
 * Provides hierarchical visualization of scoring rules with:
 * - Multiple view modes (category, priority, dependency, execution)
 * - Interactive tree navigation
 * - Rule statistics and insights
 * - Connection visualization between rules
 * - Responsive layout for complex rule sets
 */
export function RuleTreeVisualization({
  ruleSet,
  selectedRuleIds = [],
  collapsedCategories = [],
  showConnections = false,
  showStatistics = true,
  viewMode = "category",
  onRuleSelect,
  onCategoryToggle,
  onViewModeChange,
  loading = false,
  error,
  className,
  "data-testid": testId = "rule-tree-visualization",
}: RuleTreeVisualizationProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<ScoringCategory>>(
    new Set(Object.keys(CATEGORY_COLORS) as ScoringCategory[])
  );
  const [selectedViewMode, setSelectedViewMode] = useState<TreeViewMode>(viewMode);

  // Organize rules based on view mode
  const organizedRules = useMemo(() => {
    switch (selectedViewMode) {
      case "category":
        return organizeByCategoryView(ruleSet.rules);
      case "priority":
        return organizeByPriorityView(ruleSet.rules);
      case "dependency":
        return organizeByDependencyView(ruleSet.rules);
      case "execution":
        return organizeByExecutionView(ruleSet.rules);
      default:
        return organizeByCategoryView(ruleSet.rules);
    }
  }, [ruleSet.rules, selectedViewMode]);

  // Calculate statistics for each category
  const categoryStatistics = useMemo<Record<ScoringCategory, CategoryStatistics>>(() => {
    const stats: Record<string, CategoryStatistics> = {};
    
    Object.values(CATEGORY_COLORS).forEach((_, index) => {
      const category = Object.keys(CATEGORY_COLORS)[index] as ScoringCategory;
      const categoryRules = ruleSet.rules.filter(rule => rule.category === category);
      
      stats[category] = {
        totalRules: categoryRules.length,
        activeRules: categoryRules.filter(rule => rule.isActive).length,
        averagePriority: categoryRules.length > 0 
          ? categoryRules.reduce((sum, rule) => sum + rule.priority, 0) / categoryRules.length 
          : 0,
        averageWeight: categoryRules.length > 0
          ? categoryRules.reduce((sum, rule) => sum + rule.weight, 0) / categoryRules.length
          : 0,
        totalImpact: 0, // Would be calculated based on historical data
      };
    });

    return stats as Record<ScoringCategory, CategoryStatistics>;
  }, [ruleSet.rules]);

  const handleViewModeChange = useCallback((mode: TreeViewMode) => {
    setSelectedViewMode(mode);
    onViewModeChange?.(mode);
  }, [onViewModeChange]);

  const handleCategoryToggle = useCallback((category: ScoringCategory) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
    onCategoryToggle?.(category);
  }, [onCategoryToggle]);

  const handleRuleSelect = useCallback((rule: ScoringRule) => {
    onRuleSelect?.(rule);
  }, [onRuleSelect]);

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)} data-testid={testId}>
        <CardHeader className="space-y-2">
          <div className="h-6 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded" />
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
      {/* Header with view mode controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                Rules Hierarchy
              </CardTitle>
              <CardDescription>
                {ruleSet.name} • {ruleSet.rules.length} rules • v{ruleSet.version}
              </CardDescription>
            </div>
            
            {/* View Mode Selector */}
            <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
              {(Object.keys(VIEW_MODE_ICONS) as TreeViewMode[]).map(mode => {
                const Icon = VIEW_MODE_ICONS[mode];
                return (
                  <Button
                    key={mode}
                    variant={selectedViewMode === mode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleViewModeChange(mode)}
                    className="gap-1"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="capitalize text-xs">{mode}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Overview */}
      {showStatistics && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rule Set Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{ruleSet.rules.length}</div>
                <div className="text-xs text-muted-foreground">Total Rules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {ruleSet.rules.filter(r => r.isActive).length}
                </div>
                <div className="text-xs text-muted-foreground">Active Rules</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {Object.keys(categoryStatistics).filter(cat => categoryStatistics[cat as ScoringCategory].totalRules > 0).length}
                </div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{ruleSet.status.toUpperCase()}</div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rule Tree */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="p-4 space-y-3">
              {selectedViewMode === "category" && (
                <CategoryTreeView
                  rules={ruleSet.rules}
                  expandedCategories={expandedCategories}
                  selectedRuleIds={selectedRuleIds}
                  categoryStatistics={categoryStatistics}
                  onCategoryToggle={handleCategoryToggle}
                  onRuleSelect={handleRuleSelect}
                />
              )}
              {selectedViewMode === "priority" && (
                <PriorityTreeView
                  rules={ruleSet.rules}
                  selectedRuleIds={selectedRuleIds}
                  onRuleSelect={handleRuleSelect}
                />
              )}
              {selectedViewMode === "execution" && (
                <ExecutionTreeView
                  rules={ruleSet.rules}
                  selectedRuleIds={selectedRuleIds}
                  onRuleSelect={handleRuleSelect}
                />
              )}
              {selectedViewMode === "dependency" && (
                <DependencyTreeView
                  rules={ruleSet.rules}
                  selectedRuleIds={selectedRuleIds}
                  showConnections={showConnections}
                  onRuleSelect={handleRuleSelect}
                />
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * CategoryTreeView Component
 * Shows rules organized by category
 */
function CategoryTreeView({
  rules,
  expandedCategories,
  selectedRuleIds,
  categoryStatistics,
  onCategoryToggle,
  onRuleSelect,
}: {
  rules: ScoringRule[];
  expandedCategories: Set<ScoringCategory>;
  selectedRuleIds: string[];
  categoryStatistics: Record<ScoringCategory, CategoryStatistics>;
  onCategoryToggle: (category: ScoringCategory) => void;
  onRuleSelect: (rule: ScoringRule) => void;
}) {
  const rulesByCategory = useMemo(() => {
    const grouped: Record<ScoringCategory, ScoringRule[]> = {} as Record<ScoringCategory, ScoringRule[]>;
    
    // Initialize all categories
    Object.keys(CATEGORY_COLORS).forEach(category => {
      grouped[category as ScoringCategory] = [];
    });
    
    // Group rules by category
    rules.forEach(rule => {
      grouped[rule.category].push(rule);
    });
    
    // Sort rules within each category by priority
    Object.keys(grouped).forEach(category => {
      grouped[category as ScoringCategory].sort((a, b) => b.priority - a.priority);
    });
    
    return grouped;
  }, [rules]);

  return (
    <div className="space-y-3">
      {(Object.keys(rulesByCategory) as ScoringCategory[])
        .filter(category => rulesByCategory[category].length > 0)
        .map(category => (
        <CategoryNode
          key={category}
          category={category}
          rules={rulesByCategory[category]}
          isExpanded={expandedCategories.has(category)}
          hasSelectedRules={rulesByCategory[category].some(rule => selectedRuleIds.includes(rule.id))}
          statistics={categoryStatistics[category]}
          onToggle={() => onCategoryToggle(category)}
          onClick={() => onCategoryToggle(category)}
        >
          {expandedCategories.has(category) && (
            <div className="ml-6 mt-2 space-y-2">
              {rulesByCategory[category].map(rule => (
                <TreeNode
                  key={rule.id}
                  rule={rule}
                  isSelected={selectedRuleIds.includes(rule.id)}
                  onClick={() => onRuleSelect(rule)}
                />
              ))}
            </div>
          )}
        </CategoryNode>
      ))}
    </div>
  );
}

/**
 * PriorityTreeView Component  
 * Shows rules organized by priority levels
 */
function PriorityTreeView({
  rules,
  selectedRuleIds,
  onRuleSelect,
}: {
  rules: ScoringRule[];
  selectedRuleIds: string[];
  onRuleSelect: (rule: ScoringRule) => void;
}) {
  const rulesByPriority = useMemo(() => {
    const sorted = [...rules].sort((a, b) => b.priority - a.priority);
    const grouped: Record<string, ScoringRule[]> = {};
    
    sorted.forEach(rule => {
      const level = getPriorityLevel(rule.priority);
      if (!grouped[level]) grouped[level] = [];
      grouped[level].push(rule);
    });
    
    return grouped;
  }, [rules]);

  return (
    <div className="space-y-4">
      {Object.entries(rulesByPriority).map(([level, levelRules]) => (
        <div key={level} className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Badge variant="outline">{level} Priority</Badge>
            <span className="text-muted-foreground">({levelRules.length} rules)</span>
          </div>
          <div className="ml-4 space-y-2">
            {levelRules.map(rule => (
              <TreeNode
                key={rule.id}
                rule={rule}
                isSelected={selectedRuleIds.includes(rule.id)}
                onClick={() => onRuleSelect(rule)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * ExecutionTreeView Component
 * Shows rules in their execution order
 */
function ExecutionTreeView({
  rules,
  selectedRuleIds,
  onRuleSelect,
}: {
  rules: ScoringRule[];
  selectedRuleIds: string[];
  onRuleSelect: (rule: ScoringRule) => void;
}) {
  const executionOrder = useMemo(() => {
    return [...rules]
      .filter(rule => rule.isActive)
      .sort((a, b) => b.priority - a.priority);
  }, [rules]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <PlayCircle className="h-4 w-4" />
        Execution Order (Priority → Weight)
      </div>
      {executionOrder.map((rule, index) => (
        <div key={rule.id} className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary text-xs font-bold rounded-full">
            {index + 1}
          </div>
          <ArrowDown className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <TreeNode
              rule={rule}
              isSelected={selectedRuleIds.includes(rule.id)}
              onClick={() => onRuleSelect(rule)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * DependencyTreeView Component
 * Shows rule dependencies and relationships
 */
function DependencyTreeView({
  rules,
  selectedRuleIds,
  showConnections,
  onRuleSelect,
}: {
  rules: ScoringRule[];
  selectedRuleIds: string[];
  showConnections: boolean;
  onRuleSelect: (rule: ScoringRule) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Network className="h-4 w-4" />
        Rule Dependencies (Conceptual View)
      </div>
      <div className="space-y-2">
        {rules.map(rule => (
          <TreeNode
            key={rule.id}
            rule={rule}
            isSelected={selectedRuleIds.includes(rule.id)}
            onClick={() => onRuleSelect(rule)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * CategoryNode Component
 * Represents a category in the tree
 */
function CategoryNode({
  category,
  rules,
  isExpanded,
  hasSelectedRules,
  statistics,
  onToggle,
  onClick,
  children,
}: CategoryNodeProps & { children?: React.ReactNode }) {
  const CategoryIcon = CATEGORY_ICONS[category];

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger className="w-full">
        <Card className={cn(
          "hover:bg-muted/50 transition-colors cursor-pointer",
          hasSelectedRules && "ring-1 ring-primary"
        )}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <CategoryIcon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={cn("capitalize", CATEGORY_COLORS[category])}
                    >
                      {category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {statistics?.totalRules} rules
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right text-sm">
                <div className="text-green-600 font-medium">
                  {statistics?.activeRules} active
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg priority: {statistics?.averagePriority.toFixed(0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

/**
 * TreeNode Component
 * Represents a single rule in the tree
 */
function TreeNode({
  rule,
  isSelected,
  isHighlighted,
  level = 0,
  onClick,
}: TreeNodeProps) {
  return (
    <Card 
      className={cn(
        "transition-colors cursor-pointer hover:bg-muted/30",
        isSelected && "ring-2 ring-primary bg-primary/5",
        isHighlighted && "ring-1 ring-orange-500",
        !rule.isActive && "opacity-60"
      )}
      onClick={onClick}
      style={{ marginLeft: level * 16 }}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">{rule.name}</h4>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  CATEGORY_COLORS[rule.category]
                )}
              >
                {rule.category}
              </Badge>
              {!rule.isActive && (
                <Badge variant="outline" className="text-xs text-muted-foreground">
                  Inactive
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{rule.description}</p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="text-xs text-muted-foreground">
              Priority: {rule.priority}
            </div>
            <div className="text-xs text-muted-foreground">
              Weight: {rule.weight}x
            </div>
            <Badge 
              variant={rule.status === "active" ? "default" : "secondary"}
              className="text-xs"
            >
              {rule.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Utility functions
function organizeByCategoryView(rules: ScoringRule[]) {
  return rules; // Already handled in CategoryTreeView
}

function organizeByPriorityView(rules: ScoringRule[]) {
  return rules; // Already handled in PriorityTreeView
}

function organizeByDependencyView(rules: ScoringRule[]) {
  return rules; // Already handled in DependencyTreeView
}

function organizeByExecutionView(rules: ScoringRule[]) {
  return rules; // Already handled in ExecutionTreeView
}

function getPriorityLevel(priority: number): string {
  if (priority >= 80) return "Critical";
  if (priority >= 60) return "High";
  if (priority >= 40) return "Medium";
  if (priority >= 20) return "Low";
  return "Minimal";
}
