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
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface FieldDefinition {
  field: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  description?: string;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
}

export interface SavedView extends ViewConfig {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublic?: boolean;
  tags?: string[];
  usage?: {
    viewCount: number;
    lastViewed?: string;
  };
}
