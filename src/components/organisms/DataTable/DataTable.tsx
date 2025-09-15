/**
 * DataTable Organism
 * Enterprise-scale virtualized data table for large datasets (100k+ rows)
 * 
 * Atomic Composition:
 * - Uses Button atoms for controls
 * - Uses Input atoms for search
 * - Uses Badge atoms for status
 * - Uses SearchBox molecule for filtering
 * - Implements TanStack Table + Virtual for performance
 */

"use client";

import React, { forwardRef, useMemo, useRef, useImperativeHandle } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";
import { TABLE_CONFIG } from "@/lib/constants";

// Atomic imports
import { Button, Badge, Card, CardContent, CardHeader } from "../../atoms";
import { SearchBox } from "../../molecules";

// Types
import { DataTableProps, DataTableRef } from "./types";

export const DataTable = forwardRef<DataTableRef, DataTableProps>(({
  data,
  columns,
  virtualized = false,
  rowHeight = TABLE_CONFIG.VIRTUAL_ROW_HEIGHT,
  overscan = TABLE_CONFIG.OVERSCAN,
  enableSelection = false,
  selectedRows = [],
  onSelectionChange,
  enableSorting = true,
  enableFiltering = true,
  globalFilter = "",
  onGlobalFilterChange,
  enablePagination = true,
  pageSize = TABLE_CONFIG.DEFAULT_PAGE_SIZE,
  pageIndex = 0,
  pageCount,
  onPaginationChange,
  loading = false,
  error = null,
  emptyState,
  onRowClick,
  onRowDoubleClick,
  className,
  "aria-label": ariaLabel = "Data table",
  "aria-describedby": ariaDescribedBy,
  ...props
}, ref) => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  
  // Selection state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  
  // Table configuration
  const tableColumns = useMemo(() => {
    const baseColumns = columns.map((col) => ({
      ...col,
      enableSorting: col.sortable !== false && enableSorting,
    }));
    
    // Add selection column if enabled
    if (enableSelection) {
      return [
        {
          id: "select",
          header: ({ table }: { table: any }) => (
            <input
              type="checkbox"
              checked={table.getIsAllPageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
              aria-label="Select all rows"
              className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          ),
          cell: ({ row }: { row: any }) => (
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
              aria-label={`Select row ${row.index + 1}`}
              className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          ),
          enableSorting: false,
          enableHiding: false,
          size: 50,
        },
        ...baseColumns,
      ];
    }
    
    return baseColumns;
  }, [columns, enableSelection, enableSorting]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    enableRowSelection: enableSelection,
    pageCount,
    manualPagination: !!pageCount,
  });

  const { rows } = table.getRowModel();

  // Virtualization for enterprise-scale performance
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => rowHeight,
    overscan,
    enabled: virtualized && rows.length > 1000,
  });

  // Imperative API
  useImperativeHandle(ref, () => ({
    table,
    scrollToTop: () => {
      rowVirtualizer.scrollToIndex(0);
    },
    scrollToRow: (index: number) => {
      rowVirtualizer.scrollToIndex(index);
    },
    selectAll: () => {
      table.toggleAllRowsSelected(true);
    },
    clearSelection: () => {
      table.resetRowSelection();
    },
  }), [table, rowVirtualizer]);

  // Handle selection change
  React.useEffect(() => {
    if (onSelectionChange) {
      const selected = Object.keys(rowSelection)
        .filter((key) => rowSelection[key])
        .map((key) => data[parseInt(key)]);
      onSelectionChange(selected);
    }
  }, [rowSelection, data, onSelectionChange]);

  // Loading state
  if (loading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={cn("w-full border-destructive", className)}>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p className="font-semibold">Error loading data</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (rows.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          {emptyState || (
            <div className="text-center text-muted-foreground">
              <p>No data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualItems.length > 0 ? virtualItems?.[0]?.start || 0 : 0;
  const paddingBottom = virtualItems.length > 0 
    ? totalSize - (virtualItems?.[virtualItems.length - 1]?.end || 0) 
    : 0;

  return (
    <Card className={cn("w-full", className)}>
      {/* Table Header with Search and Controls */}
      {enableFiltering && (
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between space-x-4">
            <SearchBox
              placeholder="Search all columns..."
              value={globalFilter}
              onSearch={onGlobalFilterChange || (() => {})}
              onClear={() => onGlobalFilterChange?.("")}
              className="max-w-sm"
            />
            
            {enableSelection && Object.keys(rowSelection).length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {Object.keys(rowSelection).length} selected
              </Badge>
            )}
          </div>
        </CardHeader>
      )}

      {/* Table Container */}
      <CardContent className="p-0">
        <div 
          ref={tableContainerRef}
          className={cn(
            "relative border rounded-lg overflow-auto",
            virtualized && rows.length > 1000 && "max-h-96"
          )}
          role="table"
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-muted/50 backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "px-4 py-3 text-left font-medium text-sm",
                        header.column.getCanSort() && "cursor-pointer select-none hover:bg-muted/50"
                      )}
                      style={{ width: header.getSize() }}
                      onClick={header.column.getToggleSortingHandler()}
                      role="columnheader"
                      aria-sort={
                        header.column.getIsSorted() 
                          ? header.column.getIsSorted() === "desc" ? "descending" : "ascending"
                          : "none"
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center space-x-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <span className="ml-1 text-muted-foreground">
                              {header.column.getIsSorted() === "desc" ? "↓" : 
                               header.column.getIsSorted() === "asc" ? "↑" : "↕"}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            
            <tbody className="relative">
              {/* Virtual padding top */}
              {virtualized && paddingTop > 0 && (
                <tr>
                  <td colSpan={table.getAllColumns().length} style={{ height: paddingTop }} />
                </tr>
              )}
              
              {/* Virtual rows */}
              {(virtualized && rows.length > 1000 ? virtualItems : rows.map((_, i) => ({ index: i }))).map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b hover:bg-muted/50 transition-colors",
                      row.getIsSelected() && "bg-muted"
                    )}
                    onClick={() => onRowClick?.(row.original)}
                    onDoubleClick={() => onRowDoubleClick?.(row.original)}
                    role="row"
                    aria-selected={row.getIsSelected()}
                    style={virtualized ? { height: rowHeight } : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm"
                        role="gridcell"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
              
              {/* Virtual padding bottom */}
              {virtualized && paddingBottom > 0 && (
                <tr>
                  <td colSpan={table.getAllColumns().length} style={{ height: paddingBottom }} />
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {enablePagination && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
              {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}{" "}
              of {table.getFilteredRowModel().rows.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

DataTable.displayName = "DataTable";
