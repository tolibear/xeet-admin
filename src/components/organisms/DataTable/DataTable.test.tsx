/**
 * DataTable Organism - Tests
 * Enterprise-scale data table testing
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { DataTable } from './DataTable';
import type { DataTableColumn } from './types';

// Mock data
interface TestData {
  id: string;
  name: string;
  score: number;
  status: string;
}

const mockData: TestData[] = [
  { id: '1', name: 'John Doe', score: 95, status: 'active' },
  { id: '2', name: 'Jane Smith', score: 87, status: 'pending' },
  { id: '3', name: 'Bob Johnson', score: 92, status: 'active' },
];

const mockColumns: DataTableColumn<TestData>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    sortable: true,
  },
  {
    id: 'score',
    header: 'Score',
    accessorKey: 'score',
    sortable: true,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
  },
];

describe('DataTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders table with data', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Check data
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DataTable data={[]} columns={mockColumns} loading />);
    
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const errorMessage = 'Something went wrong';
    render(<DataTable data={[]} columns={mockColumns} error={errorMessage} />);
    
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<DataTable data={[]} columns={mockColumns} />);
    
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('shows custom empty state', () => {
    const emptyMessage = 'Custom empty message';
    render(
      <DataTable 
        data={[]} 
        columns={mockColumns} 
        emptyState={<div>{emptyMessage}</div>} 
      />
    );
    
    expect(screen.getByText(emptyMessage)).toBeInTheDocument();
  });

  it('handles search filtering when enabled', async () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        enableFiltering 
        globalFilter=""
        onGlobalFilterChange={vi.fn()}
      />
    );
    
    const searchInput = screen.getByPlaceholderText('Search all columns...');
    expect(searchInput).toBeInTheDocument();
  });

  it('handles row selection when enabled', () => {
    const onSelectionChange = vi.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        enableSelection 
        onSelectionChange={onSelectionChange}
      />
    );
    
    // Check for select all checkbox
    const selectAllCheckbox = screen.getByLabelText('Select all rows');
    expect(selectAllCheckbox).toBeInTheDocument();
    
    // Check for individual row checkboxes
    const rowCheckboxes = screen.getAllByLabelText(/Select row \d+/);
    expect(rowCheckboxes).toHaveLength(3);
  });

  it('handles row clicks', () => {
    const onRowClick = vi.fn();
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        onRowClick={onRowClick} 
      />
    );
    
    const firstRow = screen.getByText('John Doe').closest('tr');
    fireEvent.click(firstRow!);
    
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('shows pagination when enabled', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        enablePagination 
      />
    );
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText(/Showing \d+ to \d+ of \d+ results/)).toBeInTheDocument();
  });

  it('handles sorting on sortable columns', () => {
    render(<DataTable data={mockData} columns={mockColumns} enableSorting />);
    
    // Find sortable header (Name column)
    const nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');
    
    // Click to sort
    fireEvent.click(nameHeader!);
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('applies correct accessibility attributes', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-label', 'Data table');
    
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(3);
    
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(0); // Header + data rows
  });

  it('supports custom aria labels', () => {
    const customLabel = 'Posts data table';
    const customDescription = 'table-description';
    render(
      <DataTable 
        data={mockData} 
        columns={mockColumns} 
        aria-label={customLabel}
        aria-describedby={customDescription}
      />
    );
    
    const table = screen.getByRole('table');
    expect(table).toHaveAttribute('aria-label', customLabel);
    expect(table).toHaveAttribute('aria-describedby', customDescription);
  });

  it('handles large datasets with virtualization flag', () => {
    // Create a large dataset
    const largeData = Array.from({ length: 2000 }, (_, i) => ({
      id: `${i}`,
      name: `User ${i}`,
      score: Math.floor(Math.random() * 100),
      status: 'active',
    }));

    render(
      <DataTable 
        data={largeData} 
        columns={mockColumns} 
        virtualized 
      />
    );
    
    // Should render the table structure
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    
    // Virtualized table should have max-height container
    const container = screen.getByRole('table').parentElement;
    expect(container).toHaveClass('max-h-96');
  });
});
