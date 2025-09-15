/**
 * FilterBar Organism
 * Advanced filtering interface with molecule chip tokens
 * 
 * Atomic Composition:
 * - Uses Button atoms for actions
 * - Uses Input atoms for values
 * - Uses Badge atoms for chips
 * - Uses FilterChip molecules for condition display
 * - Uses SearchBox molecule for quick filtering
 */

"use client";

import React, { useState, useCallback } from "react";
import { Plus, X, Save, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// Atomic imports
import { Button, Badge, Input } from "../../atoms";
import { Card, CardContent, CardHeader } from "../../molecules";
import { FilterChip, SearchBox } from "../../molecules";

// Types
import { FilterBarProps, FilterCondition, FilterField, FilterOperator } from "./types";

// Operator labels
const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: "equals",
  contains: "contains",
  startsWith: "starts with",
  endsWith: "ends with",
  gt: "greater than",
  lt: "less than",
  gte: "greater than or equal",
  lte: "less than or equal",
  in: "is one of",
  notIn: "is not one of",
};

export function FilterBar({
  fields,
  conditions,
  onConditionsChange,
  enableGroups = false,
  groups = [],
  onGroupsChange,
  enableSavedFilters = false,
  savedFilters = [],
  onSaveFilter,
  onLoadFilter,
  onDeleteFilter,
  showAddButton = true,
  showClearButton = true,
  showSaveButton = false,
  maxConditions = 10,
  loading = false,
  error = null,
  onClear,
  onApply,
  className,
}: FilterBarProps) {
  const [isAddingCondition, setIsAddingCondition] = useState(false);
  const [newCondition, setNewCondition] = useState<Partial<FilterCondition>>({});
  const [savedFilterName, setSavedFilterName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Add new condition
  const handleAddCondition = useCallback(() => {
    if (conditions.length >= maxConditions) return;
    setIsAddingCondition(true);
    setNewCondition({ id: `temp-${Date.now()}` });
  }, [conditions.length, maxConditions]);

  // Confirm new condition
  const handleConfirmCondition = useCallback(() => {
    if (newCondition.field && newCondition.operator && newCondition.value !== undefined) {
      const condition: FilterCondition = {
        id: `condition-${Date.now()}`,
        field: newCondition.field,
        operator: newCondition.operator,
        value: newCondition.value,
        label: newCondition.label,
      };
      onConditionsChange([...conditions, condition]);
      setIsAddingCondition(false);
      setNewCondition({});
    }
  }, [newCondition, conditions, onConditionsChange]);

  // Cancel new condition
  const handleCancelCondition = useCallback(() => {
    setIsAddingCondition(false);
    setNewCondition({});
  }, []);

  // Remove condition
  const handleRemoveCondition = useCallback((conditionId: string) => {
    onConditionsChange(conditions.filter(c => c.id !== conditionId));
  }, [conditions, onConditionsChange]);

  // Update condition
  const handleUpdateCondition = useCallback((conditionId: string, updates: Partial<FilterCondition>) => {
    onConditionsChange(conditions.map(c => 
      c.id === conditionId ? { ...c, ...updates } : c
    ));
  }, [conditions, onConditionsChange]);

  // Clear all conditions
  const handleClear = useCallback(() => {
    onConditionsChange([]);
    onClear?.();
  }, [onConditionsChange, onClear]);

  // Save filter
  const handleSaveFilter = useCallback(() => {
    if (savedFilterName.trim() && onSaveFilter) {
      const filter = {
        id: `filter-${Date.now()}`,
        name: savedFilterName.trim(),
        conditions,
        groups,
        isPublic: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onSaveFilter(filter);
      setSavedFilterName("");
      setShowSaveDialog(false);
    }
  }, [savedFilterName, conditions, groups, onSaveFilter]);

  // Get field options
  const getFieldOptions = useCallback((field: FilterField) => {
    const baseOperators: FilterOperator[] = ["equals"];
    
    switch (field.type) {
      case "text":
        return field.operators || ["equals", "contains", "startsWith", "endsWith"];
      case "number":
        return field.operators || ["equals", "gt", "lt", "gte", "lte"];
      case "date":
        return field.operators || ["equals", "gt", "lt", "gte", "lte"];
      case "select":
      case "multiSelect":
        return field.operators || ["equals", "in", "notIn"];
      case "boolean":
        return ["equals"];
      default:
        return baseOperators;
    }
  }, []);

  // Render condition chip
  const renderConditionChip = useCallback((condition: FilterCondition) => {
    const field = fields.find(f => f.key === condition.field);
    const fieldLabel = field?.label || condition.field;
    const operatorLabel = OPERATOR_LABELS[condition.operator];
    const valueLabel = condition.label || String(condition.value);

    return (
      <FilterChip
        key={condition.id}
        label={`${fieldLabel} ${operatorLabel} ${valueLabel}`}
        onRemove={() => handleRemoveCondition(condition.id)}
        variant="secondary"
        className="max-w-xs"
      />
    );
  }, [fields, handleRemoveCondition]);

  // Render new condition form
  const renderNewConditionForm = useCallback(() => {
    const selectedField = fields.find(f => f.key === newCondition.field);
    const availableOperators = selectedField ? getFieldOptions(selectedField) : [];

    return (
      <Card className="border-dashed border-2 border-primary/50">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            {/* Field Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Field</label>
              <select
                value={newCondition.field || ""}
                onChange={(e) => setNewCondition({ ...newCondition, field: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Select field...</option>
                {fields.map((field) => (
                  <option key={field.key} value={field.key}>
                    {field.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Operator Selection */}
            <div>
              <label className="block text-sm font-medium mb-1">Operator</label>
              <select
                value={newCondition.operator || ""}
                onChange={(e) => setNewCondition({ ...newCondition, operator: e.target.value as FilterOperator })}
                disabled={!selectedField}
                className="w-full px-3 py-2 border border-input rounded-md bg-background disabled:opacity-50"
              >
                <option value="">Select...</option>
                {availableOperators.map((op) => (
                  <option key={op} value={op}>
                    {OPERATOR_LABELS[op]}
                  </option>
                ))}
              </select>
            </div>

            {/* Value Input */}
            <div>
              <label className="block text-sm font-medium mb-1">Value</label>
              {selectedField?.type === "select" || selectedField?.type === "multiSelect" ? (
                <select
                  value={newCondition.value || ""}
                  onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select...</option>
                  {selectedField.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : selectedField?.type === "boolean" ? (
                <select
                  value={newCondition.value || ""}
                  onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value === "true" })}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select...</option>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              ) : (
                <Input
                  type={selectedField?.type === "number" ? "number" : selectedField?.type === "date" ? "date" : "text"}
                  value={newCondition.value || ""}
                  onChange={(e) => setNewCondition({ 
                    ...newCondition, 
                    value: selectedField?.type === "number" ? Number(e.target.value) : e.target.value 
                  })}
                  placeholder="Enter value..."
                  className="w-full"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleConfirmCondition}
                disabled={!newCondition.field || !newCondition.operator || newCondition.value === undefined}
              >
                Add
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelCondition}>
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }, [newCondition, fields, getFieldOptions, handleConfirmCondition, handleCancelCondition]);

  // Loading state
  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading filters...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("w-full border-destructive", className)}>
        <CardContent className="p-4">
          <div className="text-center text-destructive">
            <p className="font-semibold">Error loading filters</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium">Filters</h3>
            {conditions.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {conditions.length}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Saved Filters */}
            {enableSavedFilters && savedFilters.length > 0 && (
              <select
                onChange={(e) => {
                  if (e.target.value && onLoadFilter) {
                    onLoadFilter(e.target.value);
                  }
                }}
                className="px-2 py-1 text-xs border border-input rounded bg-background"
              >
                <option value="">Load saved filter...</option>
                {savedFilters.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.name}
                  </option>
                ))}
              </select>
            )}

            {/* Save Button */}
            {showSaveButton && conditions.length > 0 && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowSaveDialog(true)}
              >
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
            )}
            
            {/* Clear Button */}
            {showClearButton && conditions.length > 0 && (
              <Button size="sm" variant="outline" onClick={handleClear}>
                <RotateCcw className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
            
            {/* Add Button */}
            {showAddButton && conditions.length < maxConditions && (
              <Button size="sm" onClick={handleAddCondition} disabled={isAddingCondition}>
                <Plus className="h-3 w-3 mr-1" />
                Add Filter
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Existing Conditions */}
        {conditions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {conditions.map(renderConditionChip)}
          </div>
        )}

        {/* New Condition Form */}
        {isAddingCondition && renderNewConditionForm()}

        {/* Empty State */}
        {conditions.length === 0 && !isAddingCondition && (
          <div className="text-center py-6 text-muted-foreground">
            <p className="text-sm">No filters applied</p>
            <p className="text-xs mt-1">Add filters to refine your data</p>
          </div>
        )}

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="mt-4 p-3 border rounded bg-muted/50">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Filter name..."
                value={savedFilterName}
                onChange={(e) => setSavedFilterName(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSaveFilter} disabled={!savedFilterName.trim()}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

FilterBar.displayName = "FilterBar";
