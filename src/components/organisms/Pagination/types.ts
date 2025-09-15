/**
 * Pagination Organism - Type Definitions
 * Server-side cursor-based pagination for galaxy-scale datasets
 */

import { BaseOrganismProps } from "@/lib/types";

export interface PaginationInfo {
  // Cursor-based pagination (recommended for large datasets)
  cursor?: string;
  nextCursor?: string;
  prevCursor?: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  
  // Traditional pagination support (for smaller datasets)
  currentPage?: number;
  totalPages?: number;
  
  // Data counts
  itemsPerPage: number;
  totalItems?: number;
  itemsOnCurrentPage: number;
  
  // Range display
  startIndex: number;
  endIndex: number;
}

export type PaginationMode = "cursor" | "page" | "infinite";

export interface PaginationProps extends BaseOrganismProps {
  // Pagination data
  paginationInfo: PaginationInfo;
  
  // Mode configuration
  mode?: PaginationMode;
  
  // Page size options
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  
  // Navigation options
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showJumpTo?: boolean;
  showInfo?: boolean;
  
  // Button configuration
  maxVisiblePages?: number;
  showEllipsis?: boolean;
  
  // Events
  onPageChange?: (page: number) => void;
  onCursorChange?: (cursor: string | null, direction: "next" | "prev") => void;
  onPageSizeChange?: (pageSize: number) => void;
  onJumpToPage?: (page: number) => void;
  
  // State
  loading?: boolean;
  disabled?: boolean;
  
  // Accessibility
  ariaLabel?: string;
  pageAriaLabel?: (page: number) => string;
}

export interface PaginationRef {
  jumpToPage: (page: number) => void;
  jumpToFirst: () => void;
  jumpToLast: () => void;
  nextPage: () => void;
  prevPage: () => void;
  changePageSize: (size: number) => void;
}
