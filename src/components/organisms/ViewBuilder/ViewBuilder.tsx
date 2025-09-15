'use client';

import React, { useState } from 'react';
import { Button } from '@/components';
import { Card } from '@/components';
import { Input } from '@/components';
import { Badge } from '@/components';
import { FilterChip } from '@/components/molecules/FilterChip';
import { SearchBox } from '@/components/molecules/SearchBox';
import { Plus, Save, Play, Settings, Eye, Code } from 'lucide-react';

export interface ViewFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface ViewConfig {
  id?: string;
  name: string;
  description?: string;
  filters: ViewFilter[];
  columns: string[];
  sorting: Array<{ field: string; direction: 'asc' | 'desc' }>;
  groupBy?: string;
  limit?: number;
}

export interface ViewBuilderProps {
  /** Current view configuration */
  view?: ViewConfig;
  /** Available fields for filtering and columns */
  availableFields: Array<{ 
    field: string; 
    label: string; 
    type: 'string' | 'number' | 'date' | 'boolean';
  }>;
  /** Callback when view is saved */
  onSave?: (view: ViewConfig) => void;
  /** Callback when view is run/applied */
  onRun?: (view: ViewConfig) => void;
  /** Whether the builder is in editing mode */
  isEditing?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** CSS classes */
  className?: string;
}

export const ViewBuilder: React.FC<ViewBuilderProps> = ({
  view,
  availableFields = [],
  onSave,
  onRun,
  isEditing = false,
  isLoading = false,
  className = '',
}) => {
  const [config, setConfig] = useState<ViewConfig>(() => ({
    name: view?.name || 'Untitled View',
    description: view?.description || '',
    filters: view?.filters || [],
    columns: view?.columns || [],
    sorting: view?.sorting || [],
    groupBy: view?.groupBy,
    limit: view?.limit || 100,
    ...view,
  }));

  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const addFilter = () => {
    if (availableFields.length === 0) return;
    
    const newFilter: ViewFilter = {
      id: `filter-${Date.now()}`,
      field: availableFields[0]?.field || '',
      operator: 'equals',
      value: '',
    };
    
    setConfig(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter],
    }));
  };

  const updateFilter = (filterId: string, updates: Partial<ViewFilter>) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.map(filter => 
        filter.id === filterId ? { ...filter, ...updates } : filter
      ),
    }));
  };

  const removeFilter = (filterId: string) => {
    setConfig(prev => ({
      ...prev,
      filters: prev.filters.filter(filter => filter.id !== filterId),
    }));
  };

  const toggleColumn = (field: string) => {
    setConfig(prev => ({
      ...prev,
      columns: prev.columns.includes(field) 
        ? prev.columns.filter(col => col !== field)
        : [...prev.columns, field],
    }));
  };

  const handleSave = () => {
    onSave?.(config);
  };

  const handleRun = () => {
    onRun?.(config);
  };

  const getOperatorOptions = (fieldType: string) => {
    const baseOptions = ['equals', 'not_equals'];
    
    switch (fieldType) {
      case 'string':
        return [...baseOptions, 'contains', 'starts_with', 'ends_with'];
      case 'number':
        return [...baseOptions, 'greater_than', 'less_than', 'between'];
      case 'date':
        return [...baseOptions, 'after', 'before', 'between'];
      case 'boolean':
        return ['is_true', 'is_false'];
      default:
        return baseOptions;
    }
  };

  return (
    <Card className={`p-6 space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Input
            value={config.name}
            onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
            className="text-xl font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0"
            placeholder="View name..."
          />
          <Input
            value={config.description}
            onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
            className="text-sm text-muted-foreground border-none p-0 h-auto bg-transparent focus-visible:ring-0"
            placeholder="Add a description..."
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Advanced
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRun}
            disabled={isLoading}
          >
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading || !config.name.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Filters</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={addFilter}
            disabled={availableFields.length === 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </div>

        {config.filters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No filters added yet</p>
            <p className="text-sm">Add filters to narrow down your results</p>
          </div>
        ) : (
          <div className="space-y-3">
            {config.filters.map((filter) => {
              const field = availableFields.find(f => f.field === filter.field);
              const operators = getOperatorOptions(field?.type || 'string');

              return (
                <div key={filter.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <select
                    value={filter.field}
                    onChange={(e) => updateFilter(filter.id, { field: e.target.value })}
                    className="bg-background border rounded px-3 py-1 min-w-[120px]"
                  >
                    {availableFields.map(field => (
                      <option key={field.field} value={field.field}>
                        {field.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={filter.operator}
                    onChange={(e) => updateFilter(filter.id, { operator: e.target.value })}
                    className="bg-background border rounded px-3 py-1 min-w-[120px]"
                  >
                    {operators.map(op => (
                      <option key={op} value={op}>
                        {op.replace('_', ' ')}
                      </option>
                    ))}
                  </select>

                  <Input
                    value={filter.value}
                    onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                    placeholder="Value..."
                    className="flex-1"
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(filter.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Columns Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Columns</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowColumnSelector(!showColumnSelector)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Select Columns
          </Button>
        </div>

        {showColumnSelector && (
          <Card className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {availableFields.map((field) => (
                <label
                  key={field.field}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={config.columns.includes(field.field)}
                    onChange={() => toggleColumn(field.field)}
                    className="rounded"
                  />
                  <span className="text-sm">{field.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {field.type}
                  </Badge>
                </label>
              ))}
            </div>
          </Card>
        )}

        {config.columns.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {config.columns.map((column) => {
              const field = availableFields.find(f => f.field === column);
              return (
                <FilterChip
                  key={column}
                  label={field?.label || column}
                  onRemove={() => toggleColumn(column)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-medium">Advanced Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Group By</label>
              <select
                value={config.groupBy || ''}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  groupBy: e.target.value || undefined 
                }))}
                className="w-full bg-background border rounded px-3 py-2"
              >
                <option value="">No grouping</option>
                {availableFields
                  .filter(f => ['string', 'boolean'].includes(f.type))
                  .map(field => (
                    <option key={field.field} value={field.field}>
                      {field.label}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Limit Results</label>
              <Input
                type="number"
                value={config.limit}
                onChange={(e) => setConfig(prev => ({ 
                  ...prev, 
                  limit: parseInt(e.target.value) || 100 
                }))}
                min={1}
                max={10000}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Preview */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <Code className="h-4 w-4" />
          <span className="text-sm font-medium">Query Preview</span>
        </div>
        <pre className="text-xs text-muted-foreground overflow-x-auto">
          {JSON.stringify(config, null, 2)}
        </pre>
      </Card>
    </Card>
  );
};

export default ViewBuilder;
