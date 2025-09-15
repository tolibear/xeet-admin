"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";
import { Badge } from "@/components";
import { Button } from "@/components";
import { Separator } from "@/components";
import { Progress } from "@/components";
import { ScrollArea } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { 
  GitCompare,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  Lightbulb,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Chart } from "@/components/organisms/Chart";
import type { 
  ABScoreComparisonProps,
  ComparisonSummaryProps,
  ComparisonResultCardProps,
  ComparisonStatistics,
  ComparisonInsight,
  ComparisonFilters,
  ComparisonExportFormat
} from "./types";
import type { ComparisonResult, Post, ScoreBreakdown } from "@/lib/types";

/**
 * ABScoreComparison Organism
 * 
 * Comprehensive A/B testing system for scoring rules with:
 * - Statistical analysis and insights
 * - Visual comparison charts
 * - Detailed result breakdown
 * - Export capabilities
 * - Performance impact analysis
 */
export function ABScoreComparison({
  comparison,
  showBreakdowns = true,
  showStatistics = true,
  pageSize = 20,
  onPostSelect,
  onExport,
  onNewComparison,
  loading = false,
  error,
  className,
  "data-testid": testId = "ab-score-comparison",
}: ABScoreComparisonProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ComparisonFilters>({});
  const [exportFormat, setExportFormat] = useState<ComparisonExportFormat>("csv");

  // Calculate comparison statistics
  const statistics = useMemo<ComparisonStatistics>(() => {
    const results = comparison.results;
    const differences = results.map(r => r.difference);
    const improvements = results.filter(r => r.difference > 0).length;
    const regressions = results.filter(r => r.difference < 0).length;
    const unchanged = results.filter(r => Math.abs(r.difference) < 0.1).length;

    const avg = differences.reduce((sum, d) => sum + d, 0) / differences.length;
    const sortedDiffs = [...differences].sort((a, b) => a - b);
    const median = sortedDiffs[Math.floor(sortedDiffs.length / 2)];
    
    const variance = differences.reduce((sum, d) => sum + Math.pow(d - avg, 2), 0) / differences.length;
    const stdDev = Math.sqrt(variance);

    // Calculate correlation between A and B scores
    const scoresA = results.map(r => r.scoreA.totalScore);
    const scoresB = results.map(r => r.scoreB.totalScore);
    const correlation = calculateCorrelation(scoresA, scoresB);

    return {
      totalPosts: results.length,
      improvements,
      regressions,
      unchanged,
      averageDifference: avg,
      medianDifference: median,
      standardDeviation: stdDev,
      maxImprovement: Math.max(...differences),
      maxRegression: Math.min(...differences),
      correlation,
    };
  }, [comparison.results]);

  // Generate insights based on statistical analysis
  const insights = useMemo<ComparisonInsight[]>(() => {
    return generateComparisonInsights(statistics, comparison);
  }, [statistics, comparison]);

  // Filter results based on current filters
  const filteredResults = useMemo(() => {
    return comparison.results.filter(result => {
      if (filters.minDifference !== undefined && result.difference < filters.minDifference) return false;
      if (filters.maxDifference !== undefined && result.difference > filters.maxDifference) return false;
      if (filters.improvementsOnly && result.difference <= 0) return false;
      if (filters.regressionsOnly && result.difference >= 0) return false;
      if (filters.scoreRange && (
        result.scoreA.totalScore < filters.scoreRange[0] || 
        result.scoreA.totalScore > filters.scoreRange[1]
      )) return false;
      if (filters.percentageRange && (
        result.percentChange < filters.percentageRange[0] || 
        result.percentChange > filters.percentageRange[1]
      )) return false;
      
      return true;
    });
  }, [comparison.results, filters]);

  // Paginated results
  const paginatedResults = useMemo(() => {
    const start = currentPage * pageSize;
    return filteredResults.slice(start, start + pageSize);
  }, [filteredResults, currentPage, pageSize]);

  const handleResultClick = useCallback((result: ComparisonResult) => {
    setSelectedResultId(result.postId);
    const post = comparison.testPosts.find(p => p.id === result.postId);
    if (post && onPostSelect) {
      onPostSelect(post, result.scoreA, result.scoreB);
    }
  }, [comparison.testPosts, onPostSelect]);

  const handleExport = useCallback(() => {
    if (onExport) {
      onExport(exportFormat);
    }
  }, [onExport, exportFormat]);

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)} data-testid={testId}>
        <CardHeader className="space-y-2">
          <div className="h-6 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded" />
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
                <GitCompare className="h-5 w-5" />
                A/B Score Comparison
              </CardTitle>
              <CardDescription>{comparison.name}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNewComparison?.()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                New Test
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Comparison Summary */}
      <ComparisonSummary
        results={comparison.results}
        ruleSetA={comparison.ruleSetA}
        ruleSetB={comparison.ruleSetB}
        showDetails={showStatistics}
      />

      {/* Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="h-4 w-4" />
              Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Card>
        <Tabs defaultValue="results" className="w-full">
          <CardHeader className="pb-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="results">Results ({filteredResults.length})</TabsTrigger>
              <TabsTrigger value="charts">Visualization</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="results" className="space-y-4">
              <div className="space-y-4">
                {paginatedResults.map(result => {
                  const post = comparison.testPosts.find(p => p.id === result.postId);
                  return post ? (
                    <ComparisonResultCard
                      key={result.postId}
                      result={result}
                      post={post}
                      showBreakdown={showBreakdowns}
                      isSelected={selectedResultId === result.postId}
                      onClick={() => handleResultClick(result)}
                    />
                  ) : null;
                })}
              </div>

              {/* Pagination */}
              {Math.ceil(filteredResults.length / pageSize) > 1 && (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {Math.ceil(filteredResults.length / pageSize)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={(currentPage + 1) * pageSize >= filteredResults.length}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="charts">
              <ComparisonCharts results={filteredResults} />
            </TabsContent>

            <TabsContent value="statistics">
              <StatisticsBreakdown statistics={statistics} comparison={comparison} />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

/**
 * ComparisonSummary Component
 * Shows high-level comparison metrics
 */
function ComparisonSummary({ 
  results, 
  ruleSetA, 
  ruleSetB,
  showDetails 
}: ComparisonSummaryProps) {
  const improvements = results.filter(r => r.difference > 0).length;
  const regressions = results.filter(r => r.difference < 0).length;
  const unchanged = results.filter(r => Math.abs(r.difference) < 0.1).length;

  const averageDiff = results.reduce((sum, r) => sum + r.difference, 0) / results.length;
  const improvementRate = (improvements / results.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Comparison Summary</CardTitle>
        <CardDescription className="flex items-center gap-4">
          <span>A: {ruleSetA.name}</span>
          <span>vs</span>
          <span>B: {ruleSetB.name}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{improvements}</div>
            <div className="text-xs text-muted-foreground">Improvements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{regressions}</div>
            <div className="text-xs text-muted-foreground">Regressions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">{unchanged}</div>
            <div className="text-xs text-muted-foreground">Unchanged</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{results.length}</div>
            <div className="text-xs text-muted-foreground">Total Posts</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Improvement Rate:</span>
            <span className="font-medium">{improvementRate.toFixed(1)}%</span>
          </div>
          <Progress value={improvementRate} className="h-2" />
          
          <div className="flex items-center justify-between text-sm">
            <span>Average Score Change:</span>
            <span className={cn(
              "font-medium",
              averageDiff > 0 ? "text-green-600" : averageDiff < 0 ? "text-red-600" : "text-muted-foreground"
            )}>
              {averageDiff > 0 ? '+' : ''}{averageDiff.toFixed(2)} pts
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * ComparisonResultCard Component
 * Shows individual post comparison result
 */
function ComparisonResultCard({
  result,
  post,
  showBreakdown,
  isSelected,
  onClick,
}: ComparisonResultCardProps) {
  const isImprovement = result.difference > 0;
  const isSignificant = Math.abs(result.difference) > 5; // 5+ point difference

  return (
    <Card 
      className={cn(
        "transition-colors cursor-pointer hover:bg-muted/30",
        isSelected && "ring-2 ring-primary bg-primary/5",
        isSignificant && (isImprovement ? "border-green-200" : "border-red-200")
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Post Info */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">{post.platform.name}</Badge>
                <Badge variant="outline">{post.author.username}</Badge>
                {isSignificant && (
                  <Badge 
                    variant={isImprovement ? "default" : "destructive"}
                    className="gap-1"
                  >
                    {isImprovement ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    Significant
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {post.content}
              </p>
            </div>
          </div>

          {/* Score Comparison */}
          <div className="grid grid-cols-3 gap-4 py-2 bg-muted/30 rounded-lg px-3">
            <div className="text-center">
              <div className="text-lg font-semibold">{result.scoreA.totalScore.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Rule Set A</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                {result.difference > 0 ? (
                  <ArrowUp className="h-4 w-4 text-green-600" />
                ) : result.difference < 0 ? (
                  <ArrowDown className="h-4 w-4 text-red-600" />
                ) : (
                  <Minus className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  result.difference > 0 ? "text-green-600" : 
                  result.difference < 0 ? "text-red-600" : "text-muted-foreground"
                )}>
                  {result.difference > 0 ? '+' : ''}{result.difference.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Difference</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{result.scoreB.totalScore.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Rule Set B</div>
            </div>
          </div>

          {/* Breakdown Preview */}
          {showBreakdown && (
            <div className="text-xs text-muted-foreground">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">A: </span>
                  {result.scoreA.appliedRules.length} rules applied
                </div>
                <div>
                  <span className="font-medium">B: </span>
                  {result.scoreB.appliedRules.length} rules applied
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * ComparisonCharts Component
 * Visual charts for comparison analysis
 */
function ComparisonCharts({ results }: { results: ComparisonResult[] }) {
  const scatterData = results.map(r => ({
    x: r.scoreA.totalScore,
    y: r.scoreB.totalScore,
    label: r.postId.slice(0, 8),
  }));

  const histogramData = results.reduce((acc, r) => {
    const bucket = Math.floor(r.difference / 5) * 5; // 5-point buckets
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div className="space-y-6">
      {/* Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Correlation</CardTitle>
          <CardDescription>Rule Set A vs Rule Set B scores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            {/* Chart would go here - using placeholder for now */}
            <div className="flex items-center justify-center h-full bg-muted/30 rounded">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <div className="text-sm">Scatter Plot Chart</div>
                <div className="text-xs">{scatterData.length} data points</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Difference Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Score Difference Distribution</CardTitle>
          <CardDescription>Histogram of score differences (B - A)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <div className="flex items-center justify-center h-full bg-muted/30 rounded">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                <div className="text-sm">Histogram Chart</div>
                <div className="text-xs">{Object.keys(histogramData).length} buckets</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * StatisticsBreakdown Component
 */
function StatisticsBreakdown({ 
  statistics, 
  comparison 
}: { 
  statistics: ComparisonStatistics; 
  comparison: any; 
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries({
          "Average Difference": `${statistics.averageDifference.toFixed(2)} pts`,
          "Median Difference": `${statistics.medianDifference.toFixed(2)} pts`,
          "Standard Deviation": `${statistics.standardDeviation.toFixed(2)} pts`,
          "Max Improvement": `${statistics.maxImprovement.toFixed(2)} pts`,
          "Max Regression": `${statistics.maxRegression.toFixed(2)} pts`,
          "Correlation": statistics.correlation.toFixed(3),
        }).map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * InsightCard Component
 */
function InsightCard({ insight }: { insight: ComparisonInsight }) {
  const getInsightIcon = (type: string) => {
    switch (insight.severity) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "error": return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <Card className={cn(
      "border-l-4",
      insight.severity === "success" && "border-l-green-500",
      insight.severity === "warning" && "border-l-yellow-500", 
      insight.severity === "error" && "border-l-red-500",
      insight.severity === "info" && "border-l-blue-500"
    )}>
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {getInsightIcon(insight.type)}
          <div className="flex-1">
            <h4 className="font-medium text-sm">{insight.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {Math.round(insight.confidence * 100)}% confidence
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Utility functions
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

function generateComparisonInsights(
  statistics: ComparisonStatistics, 
  comparison: any
): ComparisonInsight[] {
  const insights: ComparisonInsight[] = [];

  // Significant improvement insight
  if (statistics.averageDifference > 5) {
    insights.push({
      type: "significant_improvement",
      title: "Significant Overall Improvement",
      description: `Rule Set B shows an average improvement of ${statistics.averageDifference.toFixed(1)} points across all posts.`,
      confidence: 0.9,
      severity: "success",
    });
  }

  // High variance insight
  if (statistics.standardDeviation > 10) {
    insights.push({
      type: "high_variance",
      title: "High Score Variance",
      description: `Large variation in score differences (σ=${statistics.standardDeviation.toFixed(1)}) suggests rules may behave inconsistently.`,
      confidence: 0.8,
      severity: "warning",
    });
  }

  // Low correlation insight
  if (statistics.correlation < 0.5) {
    insights.push({
      type: "systematic_bias",
      title: "Low Score Correlation",
      description: `Weak correlation (r=${statistics.correlation.toFixed(2)}) between rule sets suggests systematic differences in scoring approach.`,
      confidence: 0.7,
      severity: "info",
    });
  }

  return insights;
}
