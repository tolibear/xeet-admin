'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FilterChip } from '@/components/molecules/FilterChip';
import { 
  Download, 
  FileText, 
  FileSpreadsheet,
  Database,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  Package
} from 'lucide-react';

export type ExportFormat = 'csv' | 'json' | 'excel' | 'pdf';
export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ExportConfig {
  format: ExportFormat;
  filename?: string;
  includeHeaders: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
  columns?: string[];
  filters?: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  compression?: boolean;
  maxRows?: number;
}

export interface ExportJob {
  id: string;
  name: string;
  status: ExportStatus;
  config: ExportConfig;
  progress?: number;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  fileSize?: number;
  rowCount?: number;
  error?: string;
}

export interface ExportBuilderProps {
  /** Current export configuration */
  config?: ExportConfig;
  /** Available columns for export */
  availableColumns?: Array<{ field: string; label: string; type: string }>;
  /** Recent export jobs */
  recentJobs?: ExportJob[];
  /** Whether export is currently running */
  isExporting?: boolean;
  /** Callback when starting export */
  onStartExport?: (config: ExportConfig) => void;
  /** Callback when downloading completed export */
  onDownload?: (jobId: string) => void;
  /** Callback when canceling export job */
  onCancel?: (jobId: string) => void;
  /** CSS classes */
  className?: string;
}

export const ExportBuilder: React.FC<ExportBuilderProps> = ({
  config: initialConfig,
  availableColumns = [],
  recentJobs = [],
  isExporting = false,
  onStartExport,
  onDownload,
  onCancel,
  className = '',
}) => {
  const [config, setConfig] = useState<ExportConfig>(() => ({
    format: 'csv',
    includeHeaders: true,
    compression: false,
    maxRows: 10000,
    columns: [],
    ...initialConfig,
  }));

  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatIcons = {
    csv: FileSpreadsheet,
    json: Database,
    excel: FileSpreadsheet,
    pdf: FileText,
  };

  const statusIcons = {
    pending: Clock,
    processing: Loader2,
    completed: CheckCircle,
    failed: AlertCircle,
  };

  const statusColors = {
    pending: 'text-yellow-500',
    processing: 'text-blue-500',
    completed: 'text-green-500',
    failed: 'text-red-500',
  };

  const handleFormatChange = (format: ExportFormat) => {
    setConfig(prev => ({
      ...prev,
      format,
      filename: prev.filename?.replace(/\.[^.]+$/, '') + 
        (format === 'csv' ? '.csv' : format === 'json' ? '.json' : 
         format === 'excel' ? '.xlsx' : '.pdf'),
    }));
  };

  const toggleColumn = (field: string) => {
    setConfig(prev => ({
      ...prev,
      columns: prev.columns?.includes(field)
        ? prev.columns.filter(col => col !== field)
        : [...(prev.columns || []), field],
    }));
  };

  const handleStartExport = () => {
    onStartExport?.(config);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEstimatedSize = () => {
    const rowCount = config.maxRows || 10000;
    const columnCount = config.columns?.length || availableColumns.length;
    const avgCellSize = 20; // bytes
    const estimatedBytes = rowCount * columnCount * avgCellSize;
    return formatFileSize(estimatedBytes);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Export Configuration */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h3 className="text-lg font-semibold">Export Configuration</h3>
            <p className="text-muted-foreground">Configure your data export settings</p>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Export Format</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['csv', 'json', 'excel', 'pdf'] as ExportFormat[]).map((format) => {
                const Icon = formatIcons[format];
                const isSelected = config.format === format;
                return (
                  <Button
                    key={format}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleFormatChange(format)}
                    className="h-16 flex-col gap-2"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="capitalize">{format}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Filename */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Filename</label>
            <Input
              value={config.filename || ''}
              onChange={(e) => setConfig(prev => ({ ...prev, filename: e.target.value }))}
              placeholder={`export-${new Date().toISOString().split('T')[0]}.${config.format}`}
            />
          </div>

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Columns to Export</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const allSelected = availableColumns.length === config.columns?.length;
                  setConfig(prev => ({
                    ...prev,
                    columns: allSelected ? [] : availableColumns.map(col => col.field),
                  }));
                }}
              >
                {availableColumns.length === config.columns?.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {availableColumns.map((column) => (
                <label
                  key={column.field}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={config.columns?.includes(column.field)}
                    onChange={() => toggleColumn(column.field)}
                    className="rounded"
                  />
                  <span className="text-sm truncate flex-1">{column.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {column.type}
                  </Badge>
                </label>
              ))}
            </div>

            {config.columns && config.columns.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {config.columns.map((column) => {
                  const field = availableColumns.find(f => f.field === column);
                  return (
                    <FilterChip
                      key={column}
                      label={field?.label || column}
                      onRemove={() => toggleColumn(column)}
                      size="sm"
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Advanced Options */}
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="p-0 h-auto"
            >
              <Settings className="h-4 w-4 mr-2" />
              Advanced Options
            </Button>

            {showAdvanced && (
              <Card className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Maximum Rows</label>
                    <Input
                      type="number"
                      value={config.maxRows}
                      onChange={(e) => setConfig(prev => ({ 
                        ...prev, 
                        maxRows: parseInt(e.target.value) || 10000 
                      }))}
                      min={1}
                      max={1000000}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.includeHeaders}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          includeHeaders: e.target.checked 
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Include Headers</span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={config.compression}
                        onChange={(e) => setConfig(prev => ({ 
                          ...prev, 
                          compression: e.target.checked 
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Compress File (.zip)</span>
                    </label>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Export Summary */}
          <Card className="p-4 bg-muted/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Format:</span>
                <div className="font-medium uppercase">{config.format}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Columns:</span>
                <div className="font-medium">{config.columns?.length || availableColumns.length}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Max Rows:</span>
                <div className="font-medium">{config.maxRows?.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Est. Size:</span>
                <div className="font-medium">{getEstimatedSize()}</div>
              </div>
            </div>
          </Card>

          {/* Export Action */}
          <div className="flex justify-end">
            <Button
              onClick={handleStartExport}
              disabled={isExporting || (config.columns?.length === 0 && availableColumns.length > 0)}
              className="min-w-32"
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Start Export
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Exports */}
      {recentJobs.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Exports</h3>
              <Badge variant="secondary">
                {recentJobs.length} jobs
              </Badge>
            </div>

            <div className="space-y-3">
              {recentJobs.map((job) => {
                const StatusIcon = statusIcons[job.status];
                const statusColor = statusColors[job.status];

                return (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <StatusIcon className={`h-5 w-5 ${statusColor} ${
                        job.status === 'processing' ? 'animate-spin' : ''
                      }`} />
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{job.name}</span>
                          <Badge variant="outline" className="text-xs uppercase">
                            {job.config.format}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <span>Started {formatDate(job.createdAt)}</span>
                          {job.completedAt && (
                            <span> • Completed {formatDate(job.completedAt)}</span>
                          )}
                          {job.fileSize && (
                            <span> • {formatFileSize(job.fileSize)}</span>
                          )}
                          {job.rowCount && (
                            <span> • {job.rowCount.toLocaleString()} rows</span>
                          )}
                        </div>

                        {job.status === 'processing' && job.progress && (
                          <div className="w-48 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        )}

                        {job.error && (
                          <div className="text-sm text-red-600">{job.error}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {job.status === 'completed' && job.downloadUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDownload?.(job.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      
                      {job.status === 'processing' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCancel?.(job.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ExportBuilder;
