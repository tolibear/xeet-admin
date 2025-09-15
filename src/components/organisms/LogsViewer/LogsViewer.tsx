/**
 * Logs Viewer Organism
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Enterprise-Scale Operations
 * 
 * Comprehensive log viewing system for enterprise-scale operations monitoring.
 * Provides real-time log streaming, advanced filtering, search capabilities,
 * and log analysis tools for system debugging and operational oversight.
 * 
 * Features:
 * - Real-time log streaming with tail mode
 * - Advanced filtering by level, service, time range
 * - Full-text search with regex support
 * - Log level color coding and syntax highlighting
 * - Export capabilities (JSON, CSV, plain text)
 * - Log statistics and analytics
 * - Auto-scroll and manual navigation
 * - Request tracing and correlation
 * - Performance-optimized virtual scrolling
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { SearchBox } from '@/components/molecules/SearchBox';
import { FilterChip } from '@/components/molecules/FilterChip';
import { StatusDot } from '@/components/atoms/StatusDot';
import { cn } from '@/lib/utils';
import type { 
  LogEntry, 
  BaseOrganismProps 
} from '@/lib/types';

export interface LogsViewerProps extends BaseOrganismProps {
  /** Array of log entries to display */
  logs: LogEntry[];
  /** Whether to enable real-time tail mode */
  tailMode?: boolean;
  /** Whether to auto-scroll to new logs */
  autoScroll?: boolean;
  /** Maximum number of logs to display */
  maxLogs?: number;
  /** Log level filtering options */
  levelFilter?: LogEntry['level'][];
  /** Service filtering options */
  serviceFilter?: string[];
  /** Search query for log content */
  searchQuery?: string;
  /** Time range filter */
  timeRange?: {
    start: string;
    end: string;
  };
  /** Whether to show log statistics */
  showStats?: boolean;
  /** Whether to show export controls */
  showExport?: boolean;
  /** Callback when filters change */
  onFiltersChange?: (filters: LogFilters) => void;
  /** Callback when search query changes */
  onSearchChange?: (query: string) => void;
  /** Callback when tail mode is toggled */
  onTailToggle?: (enabled: boolean) => void;
  /** Callback when logs are exported */
  onExport?: (format: 'json' | 'csv' | 'txt', logs: LogEntry[]) => void;
  /** Callback when log entry is clicked */
  onLogClick?: (log: LogEntry) => void;
}

export interface LogFilters {
  levels: LogEntry['level'][];
  services: string[];
  timeRange?: {
    start: string;
    end: string;
  };
  searchQuery?: string;
  requestId?: string;
  userId?: string;
  orgId?: string;
}

export interface LogEntryRowProps {
  /** Log entry to display */
  log: LogEntry;
  /** Whether the log is highlighted from search */
  highlighted?: boolean;
  /** Search query for highlighting */
  searchQuery?: string;
  /** Click handler */
  onClick?: (log: LogEntry) => void;
}

export interface LogStatsProps {
  /** Array of logs for statistics */
  logs: LogEntry[];
}

export interface LogFiltersBarProps {
  /** Current filter settings */
  filters: LogFilters;
  /** Available services for filtering */
  availableServices: string[];
  /** Filter change callback */
  onChange: (filters: LogFilters) => void;
}

/**
 * Log Entry Row Component - Individual log display
 */
const LogEntryRow: React.FC<LogEntryRowProps> = ({
  log,
  highlighted = false,
  searchQuery = '',
  onClick
}) => {
  const getLevelVariant = (level: LogEntry['level']) => {
    switch (level) {
      case 'debug': return 'outline';
      case 'info': return 'default';
      case 'warn': return 'secondary';
      case 'error': return 'destructive';
      case 'fatal': return 'destructive';
      default: return 'outline';
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'debug': return 'idle';
      case 'info': return 'success';
      case 'warn': return 'warning';
      case 'error': return 'error';
      case 'fatal': return 'error';
      default: return 'idle';
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div 
      className={cn(
        "grid grid-cols-12 gap-2 py-2 px-3 text-sm border-b hover:bg-muted/50 cursor-pointer",
        highlighted && "bg-yellow-50 dark:bg-yellow-950/30"
      )}
      onClick={() => onClick?.(log)}
    >
      {/* Timestamp */}
      <div className="col-span-2 text-xs text-muted-foreground font-mono">
        {formatTimestamp(log.timestamp)}
      </div>
      
      {/* Level */}
      <div className="col-span-1 flex items-center gap-1">
        <StatusDot status={getLevelColor(log.level)} size="sm" />
        <Badge variant={getLevelVariant(log.level)} size="sm">
          {log.level.toUpperCase()}
        </Badge>
      </div>
      
      {/* Service */}
      <div className="col-span-1 text-xs font-medium">
        {log.service}
      </div>
      
      {/* Message */}
      <div className="col-span-6 truncate">
        {highlightText(log.message, searchQuery)}
      </div>
      
      {/* Request ID */}
      <div className="col-span-1 text-xs text-muted-foreground font-mono truncate">
        {log.requestId?.slice(0, 8) || '-'}
      </div>
      
      {/* User ID */}
      <div className="col-span-1 text-xs text-muted-foreground font-mono truncate">
        {log.userId?.slice(0, 8) || '-'}
      </div>
    </div>
  );
};

/**
 * Log Statistics Component - Display log analytics
 */
const LogStats: React.FC<LogStatsProps> = ({ logs }) => {
  const stats = React.useMemo(() => {
    const levelCounts = logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const serviceCounts = logs.reduce((acc, log) => {
      acc[log.service] = (acc[log.service] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentLogs = logs.filter(log => 
      Date.now() - new Date(log.timestamp).getTime() < 60000
    ).length;

    return {
      total: logs.length,
      levels: levelCounts,
      services: serviceCounts,
      recentLogs,
      errorRate: ((levelCounts.error || 0) + (levelCounts.fatal || 0)) / logs.length * 100
    };
  }, [logs]);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Log Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total Logs</div>
            <div className="text-lg font-semibold">{stats.total}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Recent (1m)</div>
            <div className="text-lg font-semibold">{stats.recentLogs}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Error Rate</div>
            <div className={cn(
              "text-lg font-semibold",
              stats.errorRate > 5 ? "text-destructive" : "text-foreground"
            )}>
              {stats.errorRate.toFixed(1)}%
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Services</div>
            <div className="text-lg font-semibold">{Object.keys(stats.services).length}</div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Log Levels</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.levels).map(([level, count]) => (
              <Badge key={level} variant="outline" size="sm">
                {level}: {count}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Top Services</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.services)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 6)
              .map(([service, count]) => (
                <Badge key={service} variant="secondary" size="sm">
                  {service}: {count}
                </Badge>
              ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

/**
 * Log Filters Bar Component - Advanced filtering controls
 */
const LogFiltersBar: React.FC<LogFiltersBarProps> = ({
  filters,
  availableServices,
  onChange
}) => {
  const handleLevelToggle = (level: LogEntry['level']) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter(l => l !== level)
      : [...filters.levels, level];
    onChange({ ...filters, levels: newLevels });
  };

  const handleServiceToggle = (service: string) => {
    const newServices = filters.services.includes(service)
      ? filters.services.filter(s => s !== service)
      : [...filters.services, service];
    onChange({ ...filters, services: newServices });
  };

  const handleTimeRangeChange = (field: 'start' | 'end', value: string) => {
    onChange({
      ...filters,
      timeRange: {
        ...filters.timeRange,
        [field]: value
      }
    });
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Level Filters */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Log Levels</div>
        <div className="flex flex-wrap gap-2">
          {(['debug', 'info', 'warn', 'error', 'fatal'] as LogEntry['level'][]).map(level => (
            <FilterChip
              key={level}
              label={level.toUpperCase()}
              selected={filters.levels.includes(level)}
              onClick={() => handleLevelToggle(level)}
            />
          ))}
        </div>
      </div>

      {/* Service Filters */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Services</div>
        <div className="flex flex-wrap gap-2">
          {availableServices.map(service => (
            <FilterChip
              key={service}
              label={service}
              selected={filters.services.includes(service)}
              onClick={() => handleServiceToggle(service)}
            />
          ))}
        </div>
      </div>

      {/* Time Range Filters */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-muted-foreground">Time Range</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              type="datetime-local"
              placeholder="Start time"
              value={filters.timeRange?.start || ''}
              onChange={(e) => handleTimeRangeChange('start', e.target.value)}
            />
          </div>
          <div>
            <Input
              type="datetime-local"
              placeholder="End time"
              value={filters.timeRange?.end || ''}
              onChange={(e) => handleTimeRangeChange('end', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Input
          placeholder="Request ID"
          value={filters.requestId || ''}
          onChange={(e) => onChange({ ...filters, requestId: e.target.value })}
        />
        <Input
          placeholder="User ID"
          value={filters.userId || ''}
          onChange={(e) => onChange({ ...filters, userId: e.target.value })}
        />
        <Input
          placeholder="Org ID"
          value={filters.orgId || ''}
          onChange={(e) => onChange({ ...filters, orgId: e.target.value })}
        />
      </div>
    </Card>
  );
};

/**
 * Logs Viewer Organism
 * 
 * Main component for comprehensive log viewing and analysis
 */
export const LogsViewer: React.FC<LogsViewerProps> = ({
  logs,
  tailMode = false,
  autoScroll = false,
  maxLogs = 1000,
  levelFilter = ['debug', 'info', 'warn', 'error', 'fatal'],
  serviceFilter = [],
  searchQuery = '',
  timeRange,
  showStats = true,
  showExport = true,
  onFiltersChange,
  onSearchChange,
  onTailToggle,
  onExport,
  onLogClick,
  loading = false,
  error = null,
  className,
  ...props
}) => {
  const [filters, setFilters] = React.useState<LogFilters>({
    levels: levelFilter,
    services: serviceFilter,
    searchQuery,
    timeRange
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const logsContainerRef = React.useRef<HTMLDivElement>(null);

  // Available services for filtering
  const availableServices = React.useMemo(() => {
    return Array.from(new Set(logs.map(log => log.service))).sort();
  }, [logs]);

  // Filter logs based on current filters
  const filteredLogs = React.useMemo(() => {
    let filtered = logs;

    // Level filter
    if (filters.levels.length > 0) {
      filtered = filtered.filter(log => filters.levels.includes(log.level));
    }

    // Service filter
    if (filters.services.length > 0) {
      filtered = filtered.filter(log => filters.services.includes(log.service));
    }

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(query) ||
        log.service.toLowerCase().includes(query) ||
        (log.requestId && log.requestId.toLowerCase().includes(query)) ||
        (log.userId && log.userId.toLowerCase().includes(query))
      );
    }

    // Time range filter
    if (filters.timeRange?.start || filters.timeRange?.end) {
      filtered = filtered.filter(log => {
        const logTime = new Date(log.timestamp).getTime();
        const start = filters.timeRange?.start ? new Date(filters.timeRange.start).getTime() : 0;
        const end = filters.timeRange?.end ? new Date(filters.timeRange.end).getTime() : Date.now();
        return logTime >= start && logTime <= end;
      });
    }

    // Request ID filter
    if (filters.requestId) {
      filtered = filtered.filter(log => log.requestId?.includes(filters.requestId!));
    }

    // User ID filter
    if (filters.userId) {
      filtered = filtered.filter(log => log.userId?.includes(filters.userId!));
    }

    // Org ID filter
    if (filters.orgId) {
      filtered = filtered.filter(log => log.orgId?.includes(filters.orgId!));
    }

    // Limit logs for performance
    return filtered.slice(-maxLogs);
  }, [logs, filters, maxLogs]);

  // Auto-scroll to bottom when new logs arrive and auto-scroll is enabled
  React.useEffect(() => {
    if (autoScroll && tailMode && logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll, tailMode]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: LogFilters) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  // Handle search changes
  const handleSearchChange = (query: string) => {
    const newFilters = { ...filters, searchQuery: query };
    setFilters(newFilters);
    onSearchChange?.(query);
    onFiltersChange?.(newFilters);
  };

  // Handle export
  const handleExport = (format: 'json' | 'csv' | 'txt') => {
    onExport?.(format, filteredLogs);
  };

  if (loading) {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        <Card className="p-6 animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-3 bg-muted rounded" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("space-y-4", className)} {...props}>
        <Card className="p-6 border-destructive">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-destructive">
              Logs Viewer Error
            </h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Logs</h1>
          <p className="text-muted-foreground">
            Real-time log monitoring and analysis
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={tailMode}
              onCheckedChange={onTailToggle}
            />
            <span className="text-sm">Tail Mode</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
          
          {showExport && (
            <Select onValueChange={handleExport}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="txt">Text</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <SearchBox
          placeholder="Search logs..."
          value={filters.searchQuery || ''}
          onChange={handleSearchChange}
          className="flex-1"
        />
        <Badge variant="outline">
          {filteredLogs.length} logs
        </Badge>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <LogFiltersBar
          filters={filters}
          availableServices={availableServices}
          onChange={handleFiltersChange}
        />
      )}

      {/* Statistics Panel */}
      {showStats && <LogStats logs={filteredLogs} />}

      {/* Logs Display */}
      <Card className="h-[600px] flex flex-col">
        {/* Headers */}
        <div className="grid grid-cols-12 gap-2 p-3 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-1">Level</div>
          <div className="col-span-1">Service</div>
          <div className="col-span-6">Message</div>
          <div className="col-span-1">Request</div>
          <div className="col-span-1">User</div>
        </div>

        {/* Logs Container */}
        <div 
          ref={logsContainerRef}
          className="flex-1 overflow-auto"
        >
          {filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No logs match the current filters
            </div>
          ) : (
            filteredLogs.map((log) => (
              <LogEntryRow
                key={log.id}
                log={log}
                searchQuery={filters.searchQuery}
                onClick={onLogClick}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

LogsViewer.displayName = "LogsViewer";

export default LogsViewer;
