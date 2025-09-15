/**
 * DataTable Organism - Type Definitions
 * Galaxy-scale virtualized data table for large datasets
 */

import { ColumnDef, Table } from "@tanstack/react-table";
import { BaseOrganismProps } from "@/lib/types";

export interface DataTableColumn<T = any> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: ({ row, getValue }: { row: { original: T }; getValue: () => any }) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sticky?: "left" | "right" | false;
  enableSorting?: boolean;
  enableHiding?: boolean;
  size?: number;
}

export interface DataTableProps<T = any> extends BaseOrganismProps {
  data: T[];
  columns: DataTableColumn<T>[];
  
  // Galaxy-scale performance options
  virtualized?: boolean;
  rowHeight?: number;
  overscan?: number;
  
  // Selection
  enableSelection?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  
  // Sorting & Filtering  
  enableSorting?: boolean;
  enableFiltering?: boolean;
  globalFilter?: string;
  onGlobalFilterChange?: (filter: string) => void;
  
  // Pagination
  enablePagination?: boolean;
  pageSize?: number;
  pageIndex?: number;
  pageCount?: number;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  
  // State management
  loading?: boolean;
  error?: string | null;
  emptyState?: React.ReactNode;
  
  // Events
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  
  // Accessibility
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export interface DataTableRef {
  table: Table<any>;
  scrollToTop: () => void;
  scrollToRow: (index: number) => void;
  selectAll: () => void;
  clearSelection: () => void;
}
