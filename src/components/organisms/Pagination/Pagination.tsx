/**
 * Pagination Organism
 * Server-side cursor-based pagination for galaxy-scale datasets
 * 
 * Atomic Composition:
 * - Uses Button atoms for navigation
 * - Uses Input atoms for jump-to functionality
 * - Uses Badge atoms for page indicators
 * - Supports both cursor-based and traditional pagination
 */

"use client";

import React, { forwardRef, useImperativeHandle, useState, useCallback } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Atomic imports
import { Button, Input, Badge } from "../../atoms";

// Types
import { PaginationProps, PaginationRef } from "./types";

export const Pagination = forwardRef<PaginationRef, PaginationProps>(({
  paginationInfo,
  mode = "page",
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeSelector = true,
  showFirstLast = true,
  showPrevNext = true,
  showJumpTo = false,
  showInfo = true,
  maxVisiblePages = 7,
  showEllipsis = true,
  onPageChange,
  onCursorChange,
  onPageSizeChange,
  onJumpToPage,
  loading = false,
  disabled = false,
  ariaLabel = "Pagination navigation",
  pageAriaLabel = (page: number) => `Go to page ${page}`,
  className,
}, ref) => {
  const [jumpToValue, setJumpToValue] = useState("");
  
  const {
    cursor,
    nextCursor,
    prevCursor,
    hasNextPage,
    hasPrevPage,
    currentPage = 1,
    totalPages = 1,
    itemsPerPage,
    totalItems,
    itemsOnCurrentPage,
    startIndex,
    endIndex,
  } = paginationInfo;

  // Imperative API
  useImperativeHandle(ref, () => ({
    jumpToPage: (page: number) => {
      if (mode === "cursor") return;
      if (page >= 1 && page <= totalPages && onPageChange) {
        onPageChange(page);
      }
    },
    jumpToFirst: () => {
      if (mode === "cursor" && prevCursor && onCursorChange) {
        // For cursor mode, we'd need to implement first page navigation
        return;
      }
      if (mode === "page" && onPageChange) {
        onPageChange(1);
      }
    },
    jumpToLast: () => {
      if (mode === "cursor") return; // Not easily supported in cursor mode
      if (mode === "page" && onPageChange) {
        onPageChange(totalPages);
      }
    },
    nextPage: () => {
      if (mode === "cursor" && hasNextPage && nextCursor && onCursorChange) {
        onCursorChange(nextCursor, "next");
      } else if (mode === "page" && currentPage < totalPages && onPageChange) {
        onPageChange(currentPage + 1);
      }
    },
    prevPage: () => {
      if (mode === "cursor" && hasPrevPage && prevCursor && onCursorChange) {
        onCursorChange(prevCursor, "prev");
      } else if (mode === "page" && currentPage > 1 && onPageChange) {
        onPageChange(currentPage - 1);
      }
    },
    changePageSize: (size: number) => {
      if (onPageSizeChange) {
        onPageSizeChange(size);
      }
    },
  }), [
    mode, currentPage, totalPages, hasNextPage, hasPrevPage, 
    nextCursor, prevCursor, onPageChange, onCursorChange, onPageSizeChange
  ]);

  // Handle page navigation
  const handlePageClick = useCallback((page: number) => {
    if (loading || disabled || page === currentPage) return;
    onPageChange?.(page);
  }, [loading, disabled, currentPage, onPageChange]);

  // Handle cursor navigation
  const handleCursorNavigation = useCallback((direction: "next" | "prev") => {
    if (loading || disabled) return;
    
    const targetCursor = direction === "next" ? nextCursor : prevCursor;
    const hasPage = direction === "next" ? hasNextPage : hasPrevPage;
    
    if (hasPage && targetCursor && onCursorChange) {
      onCursorChange(targetCursor, direction);
    }
  }, [loading, disabled, nextCursor, prevCursor, hasNextPage, hasPrevPage, onCursorChange]);

  // Handle jump to page
  const handleJumpTo = useCallback(() => {
    const page = parseInt(jumpToValue);
    if (page >= 1 && page <= totalPages && onJumpToPage) {
      onJumpToPage(page);
      setJumpToValue("");
    }
  }, [jumpToValue, totalPages, onJumpToPage]);

  // Generate page numbers for traditional pagination
  const generatePageNumbers = useCallback(() => {
    if (mode === "cursor" || totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust if we're near the start or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    } else if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2 && showEllipsis) {
        pages.push("ellipsis");
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1 && showEllipsis) {
        pages.push("ellipsis");
      }
      pages.push(totalPages);
    }

    return pages;
  }, [mode, totalPages, maxVisiblePages, currentPage, showEllipsis]);

  // Render page button
  const renderPageButton = useCallback((page: number | "ellipsis", index: number) => {
    if (page === "ellipsis") {
      return (
        <Button
          key={`ellipsis-${index}`}
          variant="ghost"
          size="sm"
          disabled
          className="w-8 h-8 p-0"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      );
    }

    const isActive = page === currentPage;
    
    return (
      <Button
        key={page}
        variant={isActive ? "default" : "outline"}
        size="sm"
        onClick={() => handlePageClick(page)}
        disabled={loading || disabled || isActive}
        className={cn("w-8 h-8 p-0", isActive && "pointer-events-none")}
        aria-label={pageAriaLabel(page)}
        aria-current={isActive ? "page" : undefined}
      >
        {page}
      </Button>
    );
  }, [currentPage, loading, disabled, handlePageClick, pageAriaLabel]);

  // Loading state for buttons
  const buttonDisabled = loading || disabled;

  return (
    <div className={cn("flex flex-col space-y-4", className)} role="navigation" aria-label={ariaLabel}>
      {/* Info Row */}
      {showInfo && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {/* Results info */}
            <span>
              Showing {startIndex.toLocaleString()} to {endIndex.toLocaleString()}
              {totalItems && ` of ${totalItems.toLocaleString()}`} results
            </span>
            
            {/* Items per page indicator */}
            <Badge variant="outline" className="text-xs">
              {itemsOnCurrentPage} items
            </Badge>
          </div>

          {/* Page size selector */}
          {showPageSizeSelector && onPageSizeChange && (
            <div className="flex items-center space-x-2">
              <span className="text-xs">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                disabled={buttonDisabled}
                className="px-2 py-1 text-xs border border-input rounded bg-background disabled:opacity-50"
                aria-label="Items per page"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Navigation Row */}
      <div className="flex items-center justify-between">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-1">
          {/* First page (page mode only) */}
          {showFirstLast && mode === "page" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageClick(1)}
              disabled={buttonDisabled || currentPage === 1}
              className="w-8 h-8 p-0"
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Previous page */}
          {showPrevNext && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => mode === "cursor" ? handleCursorNavigation("prev") : handlePageClick(currentPage - 1)}
              disabled={buttonDisabled || (mode === "cursor" ? !hasPrevPage : currentPage === 1)}
              className="flex items-center space-x-1 px-3"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
          )}

          {/* Page numbers (page mode only) */}
          {mode === "page" && (
            <div className="flex items-center space-x-1">
              {generatePageNumbers().map((page, index) => renderPageButton(page, index))}
            </div>
          )}

          {/* Cursor mode info */}
          {mode === "cursor" && (
            <div className="flex items-center space-x-2 px-3">
              <Badge variant="outline">
                Page {currentPage || "Unknown"}
              </Badge>
            </div>
          )}

          {/* Next page */}
          {showPrevNext && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => mode === "cursor" ? handleCursorNavigation("next") : handlePageClick(currentPage + 1)}
              disabled={buttonDisabled || (mode === "cursor" ? !hasNextPage : currentPage === totalPages)}
              className="flex items-center space-x-1 px-3"
              aria-label="Go to next page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          {/* Last page (page mode only) */}
          {showFirstLast && mode === "page" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageClick(totalPages)}
              disabled={buttonDisabled || currentPage === totalPages}
              className="w-8 h-8 p-0"
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Jump to page (page mode only) */}
        {showJumpTo && mode === "page" && onJumpToPage && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Go to:</span>
            <Input
              type="number"
              value={jumpToValue}
              onChange={(e) => setJumpToValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleJumpTo()}
              placeholder="Page"
              min={1}
              max={totalPages}
              disabled={buttonDisabled}
              className="w-16 text-xs"
              aria-label="Jump to page number"
            />
            <Button
              size="sm"
              onClick={handleJumpTo}
              disabled={buttonDisabled || !jumpToValue || parseInt(jumpToValue) < 1 || parseInt(jumpToValue) > totalPages}
            >
              Go
            </Button>
          </div>
        )}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex items-center justify-center py-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
        </div>
      )}
    </div>
  );
});

Pagination.displayName = "Pagination";
