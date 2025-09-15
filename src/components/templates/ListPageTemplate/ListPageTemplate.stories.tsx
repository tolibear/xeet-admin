import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ListPageTemplate, LIST_PAGE_LAYOUTS, createSummaryStats, createBulkActions, createEmptyState } from './ListPageTemplate';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Download, Filter, Search, Trash2, Edit, Archive } from 'lucide-react';

const meta = {
  title: 'Templates/ListPageTemplate',
  component: ListPageTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**ListPageTemplate** is a layout template for data listing pages like tables, grids, and lists.

### Features
- Header with title, description, and actions
- Filter and search sections
- Bulk actions for selected items
- Sidebar support for advanced filtering
- Summary statistics display
- Pagination support
- Loading, error, and empty states

### Atomic Design
This template provides structural layout without business logic, composing Card atoms and organizing space for organisms and molecules.
        `,
      },
    },
  },
  argTypes: {
    showSidebar: { control: 'boolean' },
    sectioned: { control: 'boolean' },
    padded: { control: 'boolean' },
    isLoading: { control: 'boolean' },
  },
  args: {
    title: 'Data Management',
    description: 'Manage and organize your data efficiently',
  },
} satisfies Meta<typeof ListPageTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock components
const MockTable = () => (
  <div className="border rounded-lg overflow-hidden">
    <div className="bg-muted/50 p-4 border-b">
      <div className="grid grid-cols-5 gap-4 font-medium text-sm">
        <span>Name</span>
        <span>Status</span>
        <span>Created</span>
        <span>Updated</span>
        <span>Actions</span>
      </div>
    </div>
    <div className="divide-y">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="p-4 hover:bg-muted/30">
          <div className="grid grid-cols-5 gap-4 items-center text-sm">
            <div className="flex items-center gap-3">
              <input type="checkbox" className="rounded" />
              <span className="font-medium">Item {i + 1}</span>
            </div>
            <Badge variant={i % 3 === 0 ? 'default' : i % 3 === 1 ? 'secondary' : 'outline'}>
              {i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Inactive'}
            </Badge>
            <span className="text-muted-foreground">2024-01-{(i + 1).toString().padStart(2, '0')}</span>
            <span className="text-muted-foreground">{(i + 5)} hours ago</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MockFilters = () => (
  <div className="flex items-center gap-4">
    <div className="flex-1 max-w-sm">
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        <Input placeholder="Search items..." className="pl-10" />
      </div>
    </div>
    <Button variant="outline" size="sm">
      <Filter className="h-4 w-4 mr-2" />
      Filters
    </Button>
    <select className="bg-background border rounded px-3 py-2 text-sm">
      <option>All Status</option>
      <option>Active</option>
      <option>Pending</option>
      <option>Inactive</option>
    </select>
    <select className="bg-background border rounded px-3 py-2 text-sm">
      <option>Date Created</option>
      <option>Date Updated</option>
      <option>Name</option>
    </select>
  </div>
);

const MockSidebar = () => (
  <div className="space-y-6">
    <div>
      <h3 className="font-semibold mb-3">Quick Filters</h3>
      <div className="space-y-2">
        {['All Items', 'Active', 'Pending', 'Inactive', 'Recently Created'].map((filter, i) => (
          <button
            key={filter}
            className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
              i === 0 ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
    
    <div>
      <h3 className="font-semibold mb-3">Categories</h3>
      <div className="space-y-2">
        {['Technology', 'Business', 'Design', 'Marketing'].map((category) => (
          <label key={category} className="flex items-center space-x-2 text-sm">
            <input type="checkbox" className="rounded" />
            <span>{category}</span>
          </label>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-3">Date Range</h3>
      <div className="space-y-2">
        <Input type="date" className="text-sm" />
        <Input type="date" className="text-sm" />
      </div>
    </div>
  </div>
);

const MockPagination = () => (
  <div className="flex items-center justify-between">
    <p className="text-sm text-muted-foreground">
      Showing 1 to 10 of 247 results
    </p>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" disabled>
        Previous
      </Button>
      <Button variant="outline" size="sm">1</Button>
      <Button size="sm">2</Button>
      <Button variant="outline" size="sm">3</Button>
      <Button variant="outline" size="sm">...</Button>
      <Button variant="outline" size="sm">25</Button>
      <Button variant="outline" size="sm">
        Next
      </Button>
    </div>
  </div>
);

const headerActions = [
  {
    id: 'create',
    label: 'Create New',
    icon: <Plus className="h-4 w-4 mr-2" />,
    onClick: fn(),
  },
  {
    id: 'import',
    label: 'Import',
    icon: <Download className="h-4 w-4 mr-2" />,
    onClick: fn(),
    variant: 'outline' as const,
  },
];

export const Default: Story = {
  args: {
    headerActions,
    filters: <MockFilters />,
    children: <MockTable />,
    pagination: <MockPagination />,
    summary: createSummaryStats([
      { label: 'Total Items', value: 247, trend: '+12%' },
      { label: 'Active', value: 186, trend: '+8%' },
      { label: 'Pending', value: 41, trend: '-3%' },
      { label: 'Inactive', value: 20 },
    ]),
    ...LIST_PAGE_LAYOUTS.table,
  },
};

export const WithSidebar: Story = {
  args: {
    ...Default.args,
    sidebar: <MockSidebar />,
    ...LIST_PAGE_LAYOUTS.withSidebar,
  },
};

export const Sectioned: Story = {
  args: {
    ...Default.args,
    ...LIST_PAGE_LAYOUTS.sectioned,
  },
};

export const WithBulkActions: Story = {
  args: {
    ...Default.args,
    bulkActions: createBulkActions(3, [
      { label: 'Archive', onClick: fn() },
      { label: 'Export', onClick: fn() },
      { label: 'Delete', onClick: fn(), variant: 'destructive' },
    ]),
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    ...Default.args,
    error: 'Failed to load data. Please check your connection and try again.',
  },
};

export const Empty: Story = {
  args: {
    headerActions,
    filters: <MockFilters />,
    children: null,
    emptyState: createEmptyState(
      'No items found',
      'Get started by creating your first item or importing existing data.',
      {
        label: 'Create First Item',
        onClick: fn(),
      }
    ),
  },
};

export const FullWidth: Story = {
  args: {
    title: 'Analytics Dashboard',
    description: 'Full-width layout for maximum data visibility',
    headerActions,
    children: (
      <div className="bg-card border rounded-lg p-6">
        <MockTable />
      </div>
    ),
    pagination: <MockPagination />,
    ...LIST_PAGE_LAYOUTS.fullWidth,
  },
};

// Enterprise Scale - Complex data management interface
export const EnterpriseScale: Story = {
  args: {
    title: 'Enterprise Data Management',
    description: 'Manage large-scale datasets with advanced filtering and bulk operations',
    headerActions: [
      ...headerActions,
      {
        id: 'export-all',
        label: 'Export All',
        icon: <Download className="h-4 w-4 mr-2" />,
        onClick: fn(),
        variant: 'outline' as const,
      },
      {
        id: 'settings',
        label: 'Settings',
        onClick: fn(),
        variant: 'ghost' as const,
      },
    ],
    sidebar: (
      <div className="space-y-6">
        <MockSidebar />
        
        {/* Additional filters for enterprise scale */}
        <div>
          <h3 className="font-semibold mb-3">Advanced Filters</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">User Role</label>
              <select className="w-full mt-1 bg-background border rounded px-3 py-2 text-sm">
                <option>All Roles</option>
                <option>Admin</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Department</label>
              <select className="w-full mt-1 bg-background border rounded px-3 py-2 text-sm">
                <option>All Departments</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>Sales</option>
                <option>Support</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {['High', 'Medium', 'Low', 'Critical'].map(priority => (
                  <label key={priority} className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>{priority}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Saved Views</h3>
          <div className="space-y-2">
            {['My Recent Items', 'High Priority Tasks', 'Team Assignments', 'Weekly Report'].map(view => (
              <button
                key={view}
                className="w-full text-left p-2 rounded-lg text-sm hover:bg-muted transition-colors"
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>
    ),
    summary: createSummaryStats([
      { label: 'Total Records', value: '1.2M', trend: '+5.2%' },
      { label: 'Active Users', value: '45.8K', trend: '+12%' },
      { label: 'Daily Transactions', value: '2.8M', trend: '+8.4%' },
      { label: 'System Health', value: '99.9%', trend: '+0.1%' },
      { label: 'Processing Queue', value: '12.4K', trend: '-15%' },
      { label: 'Error Rate', value: '0.03%', trend: '-22%' },
    ]),
    filters: (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input placeholder="Search across all fields..." className="pl-10" />
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced
          </Button>
          <Button variant="outline" size="sm">Save View</Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {['Active: 45.8K', 'Priority: High', 'Department: Engineering', 'Role: Admin'].map((filter, i) => (
            <Badge key={i} variant="secondary" className="px-3 py-1">
              {filter}
              <button className="ml-2 hover:text-destructive">×</button>
            </Badge>
          ))}
        </div>
      </div>
    ),
    bulkActions: createBulkActions(1247, [
      { label: 'Bulk Edit', onClick: fn() },
      { label: 'Archive', onClick: fn() },
      { label: 'Export Selected', onClick: fn() },
      { label: 'Delete', onClick: fn(), variant: 'destructive' },
    ]),
    children: (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 p-4 border-b">
          <div className="grid grid-cols-8 gap-4 font-medium text-sm">
            <span className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              Name
            </span>
            <span>Status</span>
            <span>Priority</span>
            <span>Department</span>
            <span>Assigned To</span>
            <span>Created</span>
            <span>Last Updated</span>
            <span>Actions</span>
          </div>
        </div>
        <div className="divide-y max-h-96 overflow-y-auto">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="p-4 hover:bg-muted/30">
              <div className="grid grid-cols-8 gap-4 items-center text-sm">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" />
                  <span className="font-medium">Record {i + 1}</span>
                </div>
                <Badge variant={i % 4 === 0 ? 'default' : i % 4 === 1 ? 'secondary' : i % 4 === 2 ? 'destructive' : 'outline'}>
                  {i % 4 === 0 ? 'Active' : i % 4 === 1 ? 'Pending' : i % 4 === 2 ? 'Critical' : 'Inactive'}
                </Badge>
                <Badge variant={i % 3 === 0 ? 'destructive' : i % 3 === 1 ? 'default' : 'secondary'}>
                  {i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low'}
                </Badge>
                <span className="text-muted-foreground">
                  {['Engineering', 'Marketing', 'Sales', 'Support'][i % 4]}
                </span>
                <span className="text-muted-foreground">User {((i % 10) + 1)}</span>
                <span className="text-muted-foreground">2024-01-{((i % 28) + 1).toString().padStart(2, '0')}</span>
                <span className="text-muted-foreground">{i + 1}h ago</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    pagination: (
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1 to 25 of 1,247,832 results
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">1</Button>
          <Button size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">...</Button>
          <Button variant="outline" size="sm">49,913</Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    ),
    showSidebar: true,
    sectioned: false,
  },
  parameters: {
    viewport: { defaultViewport: 'enterpriseScale' },
    docs: {
      description: {
        story: 'Enterprise-scale list page with extensive filtering, bulk operations, and large dataset management capabilities.',
      },
    },
  },
};
