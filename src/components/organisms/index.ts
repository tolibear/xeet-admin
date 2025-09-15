/**
 * Atomic Design Level: ORGANISMS
 *
 * Complex components serving specific business functions.
 * Can contain multiple molecules and atoms.
 * Feature-complete and functional.
 * Handle their own data and state management.
 *
 * Examples: DataTable, ChartBuilder, ScoreInspector, FilterBar, NavigationBar
 *
 * Principles:
 * - Feature-complete business logic
 * - Handle own data fetching and state
 * - Compose molecules and atoms
 * - No business logic in atoms/molecules
 * - Error handling and loading states
 * - Performance optimized (virtualization, memoization)
 * - Enterprise-scale ready (100k+ rows)
 */

// shadcn/ui Organisms - Complex components with business logic

// Layout & Structure Organisms
export { 
  Accordion, 
  AccordionItem, 
  AccordionTrigger, 
  AccordionContent 
} from "./accordion";
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./collapsible";
export { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "./resizable";
export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "./sheet";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

// Navigation Organisms
export { Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from "./command";
export { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup } from "./context-menu";
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup } from "./dropdown-menu";
export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator, MenubarLabel, MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarPortal, MenubarSubContent, MenubarSubTrigger, MenubarGroup, MenubarSub } from "./menubar";
export { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuContent, NavigationMenuTrigger, NavigationMenuLink, NavigationMenuIndicator, NavigationMenuViewport, navigationMenuTriggerStyle } from "./navigation-menu";
export { 
  Pagination as ShadcnPagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "./pagination";

// Data Display Organisms
export { Calendar } from "./calendar";
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./carousel";
export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle } from "./shadcn-chart";
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "./table";

// Form & Input Organisms
export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField } from "./form";
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton } from "./select";

// Feedback & Overlay Organisms
export { AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "./alert-dialog";
export { Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "./dialog";
export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from "./drawer";
export { HoverCard, HoverCardTrigger, HoverCardContent } from "./hover-card";
export { Popover, PopoverTrigger, PopoverContent } from "./popover";
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "./tooltip";

// Toast & Notification Organisms
export { Toaster } from "./sonner";
export { Toaster as ToastRenderer } from "./toaster";
export { 
  Toast, 
  ToastAction, 
  ToastClose, 
  ToastDescription, 
  ToastProvider, 
  ToastTitle, 
  ToastViewport,
  type ToastProps,
  type ToastActionElement
} from "./toast";

// Dashboard and Overview Organisms
export { DashboardMetrics } from "./DashboardMetrics";
export { QuickLinks } from "./QuickLinks";

// Data Table Organisms (Phase 2)
export { DataTable } from './DataTable';
export type { DataTableProps, DataTableColumn, DataTableRef } from './DataTable';

// Filter Organisms (Phase 2)
export { FilterBar } from './FilterBar';
export type { FilterBarProps, FilterCondition, FilterField, FilterOperator, FilterGroup, SavedFilter } from './FilterBar';

// Pagination Organisms (Phase 2)  
export { Pagination } from './pagination';
export type { PaginationProps, PaginationInfo, PaginationRef } from './pagination';

// Chart Organisms (Phase 2)
export { Chart } from './Chart';
export type { 
  ChartProps, 
  ChartDataPoint,
  ChartDataset,
  ChartAxis,
  LineChartProps,
  AreaChartProps,
  BarChartProps,
  PieChartProps,
  ScatterChartProps
} from './Chart';

// Research Hub System Organisms (Phase 2)
export { ViewBuilder } from './ViewBuilder';
export type { ViewBuilderProps, ViewConfig, ViewFilter } from './ViewBuilder';

export { SavedViews } from './SavedViews';
export type { SavedViewsProps, SavedView } from './SavedViews';

export { ExportBuilder } from './ExportBuilder';
export type { 
  ExportBuilderProps, 
  ExportConfig, 
  ExportJob,
  ExportFormat,
  ExportStatus 
} from './ExportBuilder';

// Scoring Hub System Organisms (Phase 3)
export { ScoreInspector } from './ScoreInspector';
export type { 
  ScoreInspectorProps,
  RuleCardProps,
  ScoreSummaryProps,
  ScoreVisualizationProps,
  RuleCategoryGroup
} from './ScoreInspector';

export { RuleTreeVisualization } from './RuleTreeVisualization';
export type {
  RuleTreeVisualizationProps,
  TreeNodeProps,
  CategoryNodeProps,
  TreeConnectionProps,
  TreeViewMode,
  CategoryStatistics,
  RuleHierarchy,
  ExecutionFlow
} from './RuleTreeVisualization';

export { ABScoreComparison } from './ABScoreComparison';
export type {
  ABScoreComparisonProps,
  ComparisonSummaryProps,
  ComparisonResultCardProps,
  ComparisonStatistics,
  ComparisonInsight,
  ComparisonFilters,
  ComparisonExportFormat
} from './ABScoreComparison';

export { RuleSetManager } from './RuleSetManager';
export type {
  RuleSetManagerProps,
  RuleSetCardProps,
  RuleSetActionsProps,
  CreateRuleSetModalProps,
  PromoteRuleSetModalProps,
  RuleSetFilters,
  RuleSetStatusBadgeProps,
  RuleSetDeploymentHistory
} from './RuleSetManager';

// Leaderboard System Organisms (Phase 3)
export { LeaderboardBuilder } from './LeaderboardBuilder';
export type {
  LeaderboardBuilderProps,
  LeaderboardBasicInfoProps,
  LeaderboardCriteriaProps,
  LeaderboardSettingsProps,
  LeaderboardFormData,
  LeaderboardBasicInfo,
  FormValidationErrors
} from './LeaderboardBuilder';

export { ShareableSlugManager } from './ShareableSlugManager';
export type {
  ShareableSlugManagerProps,
  ShareableUrl,
  ShareableUrlAccess,
  ShareableUrlAnalytics,
  CreateSlugConfig,
  UpdateSlugConfig,
  ShareableUrlCardProps
} from './ShareableSlugManager';

export { ModerationQueue } from './ModerationQueue';
export type {
  ModerationItem,
  ModerationFilters,
  ModerationStats,
  AuditEntry,
  BulkModerationAction
} from './ModerationQueue';

// Topics Management System Organisms (Phase 4)
export { TopicEditor } from './TopicEditor';
export type {
  TopicEditorProps,
  KeywordInputProps,
  KeywordChipProps,
  ColorPickerProps,
  TopicFormData
} from './TopicEditor';

export { KeywordCoverageHeatmap } from './KeywordCoverageHeatmap';
export type {
  KeywordCoverageHeatmapProps,
  KeywordCoverageData,
  HeatmapCellProps,
  HeatmapLegendProps,
  HeatmapFiltersProps
} from './KeywordCoverageHeatmap';

// Network Visualization System Organisms (Phase 4)
export { NetworkGraph } from './NetworkGraph';
export type {
  NetworkGraphProps,
  NetworkLegendProps,
  NetworkControlsProps,
  NetworkStatsProps
} from './NetworkGraph';

export { NetworkFilter } from './NetworkFilter';
export type {
  NetworkFilterProps,
  NetworkFilterSettings,
  FilterSummaryProps
} from './NetworkFilter';

export { NetworkClustering } from './NetworkClustering';
export type {
  NetworkClusteringProps,
  ClusteringParameters,
  ClusteringResult
} from './NetworkClustering';

// Live Feed System Organisms (Phase 4)
export { LiveFeedSystem } from './LiveFeedSystem';
export type {
  LiveFeedSystemProps,
  LiveFeedItemProps,
  ConnectionStatusProps,
  FeedFiltersProps,
  FeedStatsProps,
  DeduplicationConfig
} from './LiveFeedSystem';

export { CollapsibleRetweet } from './CollapsibleRetweet';
export type {
  CollapsibleRetweetProps,
  RetweetChain,
  RetweetItem,
  RetweetItemProps,
  RetweetStatsProps
} from './CollapsibleRetweet';

// System Health Enterprise Organisms (Phase 5)
export { SystemHealthDashboard } from './SystemHealthDashboard';
export type {
  SystemHealthDashboardProps,
  ServiceStatusCardProps,
  MetricsOverviewProps,
  PerformanceChartsProps
} from './SystemHealthDashboard';

export { JobQueueManager } from './JobQueueManager';
export type {
  JobQueueManagerProps,
  QueueCardProps,
  JobTableProps,
  QueueMetricsProps
} from './JobQueueManager';

export { LogsViewer } from './LogsViewer';
export type {
  LogsViewerProps,
  LogFilters,
  LogEntryRowProps,
  LogStatsProps,
  LogFiltersBarProps
} from './LogsViewer';

export { BulkOperationsManager } from './BulkOperationsManager';
export type {
  BulkOperationsManagerProps,
  CreateOperationFormProps,
  OperationCardProps,
  OperationsStatsProps
} from './BulkOperationsManager';

export { SlashingManager } from './SlashingManager';
export type {
  SlashingManagerProps,
  CreateSlashingFormProps,
  SlashingCardProps,
  SlashingStatsProps
} from './SlashingManager';

export { ReScoringManager } from './ReScoringManager';
export type {
  ReScoringManagerProps,
  ReScoringJobCardProps,
  ReScoringStatsProps,
  CreateReScoringFormProps
} from './ReScoringManager';

// Future Organisms (Phase 4+)
// export { ChartBuilder } from './ChartBuilder';
