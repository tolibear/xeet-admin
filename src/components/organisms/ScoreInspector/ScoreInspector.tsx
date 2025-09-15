"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";
import { Badge } from "@/components";
import { Button } from "@/components";
import { Separator } from "@/components";
import { Progress } from "@/components";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components";
import { 
  BarChart3, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Info, 
  TrendingUp, 
  TrendingDown,
  Target,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { 
  ScoreInspectorProps, 
  RuleCardProps, 
  ScoreSummaryProps, 
  RuleCategoryGroup,
  ExportFormat
} from "./types";
import type { ScoringCategory } from "@/lib/types";

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
  reach: TrendingUp,
};

/**
 * ScoreInspector Organism
 * 
 * Provides transparent atomic breakdown of post scoring with:
 * - Detailed rule impact visualization
 * - Confidence indicators for each rule
 * - Category-based grouping
 * - Interactive rule exploration
 * - Export capabilities
 */
export function ScoreInspector({
  post,
  scoreBreakdown,
  showDetails = true,
  showConfidence = true,
  highlightCategories = [],
  onRuleClick,
  onExport,
  loading = false,
  error,
  className,
  "data-testid": testId = "score-inspector",
}: ScoreInspectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<ScoringCategory>>(new Set());
  const [exportFormat, setExportFormat] = useState<ExportFormat>("json");

  // Group rules by category with impact calculations
  const ruleGroups = useMemo<RuleCategoryGroup[]>(() => {
    const groups = scoreBreakdown.appliedRules.reduce((acc, rule) => {
      if (!acc[rule.category]) {
        acc[rule.category] = [];
      }
      acc[rule.category].push(rule);
      return acc;
    }, {} as Record<ScoringCategory, typeof scoreBreakdown.appliedRules>);

    return Object.entries(groups).map(([category, rules]) => ({
      category: category as ScoringCategory,
      rules: rules.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)),
      totalImpact: rules.reduce((sum, rule) => sum + rule.impact, 0),
      averageConfidence: rules.reduce((sum, rule) => sum + rule.confidence, 0) / rules.length,
    })).sort((a, b) => Math.abs(b.totalImpact) - Math.abs(a.totalImpact));
  }, [scoreBreakdown.appliedRules]);

  const toggleCategory = (category: ScoringCategory) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleExport = () => {
    if (onExport) {
      onExport(exportFormat);
    }
  };

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)} data-testid={testId}>
        <CardHeader className="space-y-2">
          <div className="h-6 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded" />
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
      {/* Score Summary */}
      <ScoreSummary 
        scoreBreakdown={scoreBreakdown}
        showComputationDetails={showDetails}
      />

      {/* Rule Categories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Applied Rules Breakdown</CardTitle>
            <CardDescription>
              {scoreBreakdown.appliedRules.length} rules applied • Version {scoreBreakdown.version}
            </CardDescription>
          </div>
          {onExport && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {ruleGroups.map((group) => {
            const isExpanded = expandedCategories.has(group.category);
            const isHighlighted = highlightCategories.includes(group.category);
            const CategoryIcon = CATEGORY_ICONS[group.category];

            return (
              <Card 
                key={group.category}
                className={cn(
                  "border transition-colors",
                  isHighlighted && "ring-2 ring-primary"
                )}
              >
                <Collapsible>
                  <CollapsibleTrigger 
                    className="w-full"
                    onClick={() => toggleCategory(group.category)}
                  >
                    <CardHeader className="hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CategoryIcon className="h-5 w-5" />
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline"
                                className={cn("capitalize", CATEGORY_COLORS[group.category])}
                              >
                                {group.category}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {group.rules.length} rule{group.rules.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1">
                              <span className={cn(
                                "text-sm font-medium",
                                group.totalImpact > 0 ? "text-green-600" : "text-red-600"
                              )}>
                                {group.totalImpact > 0 ? '+' : ''}{group.totalImpact.toFixed(1)} pts
                              </span>
                              {showConfidence && (
                                <span className="text-xs text-muted-foreground">
                                  {(group.averageConfidence * 100).toFixed(0)}% confidence
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 space-y-3">
                      {group.rules.map((rule) => (
                        <RuleCard
                          key={rule.ruleId}
                          rule={rule}
                          showDetails={showDetails}
                          showConfidence={showConfidence}
                          isHighlighted={isHighlighted}
                          onClick={() => onRuleClick?.(rule)}
                        />
                      ))}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Computation Details */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Computation Details
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <div>Computed: {new Date(scoreBreakdown.computedAt).toLocaleString()}</div>
            <div>Rule Version: {scoreBreakdown.version}</div>
            <div>Post ID: {scoreBreakdown.postId}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * ScoreSummary Component
 * Shows the overall score breakdown with visual indicators
 */
function ScoreSummary({ scoreBreakdown, showComputationDetails }: ScoreSummaryProps) {
  const rulesImpact = scoreBreakdown.totalScore - scoreBreakdown.baseScore;
  const scorePercentage = (scoreBreakdown.totalScore / 100) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">
              {scoreBreakdown.totalScore.toFixed(1)}
              <span className="text-lg text-muted-foreground ml-1">/100</span>
            </CardTitle>
            <CardDescription>Overall Content Score</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Base Score</div>
            <div className="text-lg font-medium">{scoreBreakdown.baseScore.toFixed(1)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={scorePercentage} className="h-2" />
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Rules Impact:</span>
          <span className={cn(
            "font-medium",
            rulesImpact > 0 ? "text-green-600" : rulesImpact < 0 ? "text-red-600" : "text-muted-foreground"
          )}>
            {rulesImpact > 0 ? '+' : ''}{rulesImpact.toFixed(1)} pts
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold">{scoreBreakdown.appliedRules.length}</div>
            <div className="text-xs text-muted-foreground">Rules Applied</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {scoreBreakdown.appliedRules.filter(r => r.impact > 0).length}
            </div>
            <div className="text-xs text-muted-foreground">Positive Impact</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              {scoreBreakdown.appliedRules.filter(r => r.impact < 0).length}
            </div>
            <div className="text-xs text-muted-foreground">Negative Impact</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * RuleCard Component
 * Individual rule display with impact and confidence indicators
 */
function RuleCard({
  rule,
  isHighlighted,
  showDetails,
  showConfidence,
  onClick,
}: RuleCardProps) {
  const isPositive = rule.impact > 0;

  return (
    <Card 
      className={cn(
        "transition-colors cursor-pointer hover:bg-muted/30",
        isHighlighted && "ring-1 ring-primary",
        onClick && "hover:shadow-sm"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">{rule.ruleName}</h4>
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs",
                  CATEGORY_COLORS[rule.category]
                )}
              >
                {rule.category}
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-2">{rule.reason}</p>
            
            {showDetails && rule.appliedConditions.length > 0 && (
              <div className="text-xs">
                <span className="text-muted-foreground">Conditions: </span>
                <span className="font-mono">{rule.appliedConditions.join(', ')}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className={cn(
              "text-sm font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? '+' : ''}{rule.impact.toFixed(1)}
            </span>
            
            {showConfidence && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">
                  {(rule.confidence * 100).toFixed(0)}%
                </span>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  rule.confidence >= 0.8 ? "bg-green-500" :
                  rule.confidence >= 0.6 ? "bg-yellow-500" : "bg-red-500"
                )} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
