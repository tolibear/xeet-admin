/**
 * FilterBar Organism - Type Definitions
 * Advanced filtering interface with molecule chip tokens
 */

import { BaseOrganismProps } from "@/lib/types";

export type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith" | "gt" | "lt" | "gte" | "lte" | "in" | "notIn";

export interface FilterCondition {
  id: string;
  field: string;
  operator: FilterOperator;
  value: any;
  label?: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "multiSelect" | "boolean";
  options?: { value: any; label: string }[];
  operators?: FilterOperator[];
}

export interface FilterGroup {
  id: string;
  name: string;
  conditions: FilterCondition[];
  logic: "and" | "or";
}

export interface FilterBarProps extends BaseOrganismProps {
  // Filter configuration
  fields: FilterField[];
  conditions: FilterCondition[];
  onConditionsChange: (conditions: FilterCondition[]) => void;
  
  // Advanced features
  enableGroups?: boolean;
  groups?: FilterGroup[];
  onGroupsChange?: (groups: FilterGroup[]) => void;
  
  // Saved filters
  enableSavedFilters?: boolean;
  savedFilters?: SavedFilter[];
  onSaveFilter?: (filter: SavedFilter) => void;
  onLoadFilter?: (filterId: string) => void;
  onDeleteFilter?: (filterId: string) => void;
  
  // UI configuration
  showAddButton?: boolean;
  showClearButton?: boolean;
  showSaveButton?: boolean;
  maxConditions?: number;
  
  // State
  loading?: boolean;
  error?: string | null;
  
  // Events
  onClear?: () => void;
  onApply?: () => void;
}

export interface SavedFilter {
  id: string;
  name: string;
  conditions: FilterCondition[];
  groups?: FilterGroup[];
  isPublic?: boolean;
  createdAt: string;
  updatedAt: string;
}
