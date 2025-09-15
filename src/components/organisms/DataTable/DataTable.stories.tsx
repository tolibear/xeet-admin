/**
 * DataTable Organism - Storybook Stories
 * Galaxy-scale data table testing and documentation
 */

import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import type { DataTableProps, DataTableColumn } from './types';
import { faker } from '@faker-js/faker';
import { Badge } from '../../atoms';

// Mock data types
interface MockPost {
  id: string;
  author: string;
  content: string;
  platform: string;
  score: number;
  engagement: number;
  createdAt: string;
  status: 'active' | 'pending' | 'archived';
}

// Generate mock data
const generateMockPosts = (count: number): MockPost[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    author: faker.internet.username(),
    content: faker.lorem.paragraph(),
    platform: faker.helpers.arrayElement(['Twitter', 'Instagram', 'TikTok', 'LinkedIn']),
    score: faker.number.float({ min: 0, max: 100, multipleOf: 0.1 }),
    engagement: faker.number.int({ min: 0, max: 10000 }),
    createdAt: faker.date.recent().toISOString(),
    status: faker.helpers.arrayElement(['active', 'pending', 'archived'] as const),
  }));
};

// Column definitions
const postColumns: DataTableColumn<MockPost>[] = [
  {
    id: 'author',
    header: 'Author',
    accessorKey: 'author',
    sortable: true,
    filterable: true,
  },
  {
    id: 'content',
    header: 'Content',
    accessorKey: 'content',
    cell: ({ getValue }) => {
      const content = getValue() as string;
      return (
        <div className="max-w-xs truncate" title={content}>
          {content}
        </div>
      );
    },
    sortable: false,
    filterable: true,
  },
  {
    id: 'platform',
    header: 'Platform',
    accessorKey: 'platform',
    cell: ({ getValue }) => {
      const platform = getValue() as string;
      const colors = {
        Twitter: 'bg-blue-100 text-blue-800',
        Instagram: 'bg-pink-100 text-pink-800',
        TikTok: 'bg-black text-white',
        LinkedIn: 'bg-blue-600 text-white',
      };
      return (
        <Badge className={colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
          {platform}
        </Badge>
      );
    },
    sortable: true,
    filterable: true,
  },
  {
    id: 'score',
    header: 'Score',
    accessorKey: 'score',
    cell: ({ getValue }) => {
      const score = getValue() as number;
      return (
        <div className="font-mono text-right">
          {score.toFixed(1)}
        </div>
      );
    },
    sortable: true,
    filterable: false,
  },
  {
    id: 'engagement',
    header: 'Engagement',
    accessorKey: 'engagement',
    cell: ({ getValue }) => {
      const engagement = getValue() as number;
      return (
        <div className="font-mono text-right">
          {engagement.toLocaleString()}
        </div>
      );
    },
    sortable: true,
    filterable: false,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ getValue }) => {
      const status = getValue() as MockPost['status'];
      const colors = {
        active: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        archived: 'bg-gray-100 text-gray-800',
      };
      return (
        <Badge className={colors[status]}>
          {status}
        </Badge>
      );
    },
    sortable: true,
    filterable: true,
  },
  {
    id: 'createdAt',
    header: 'Created',
    accessorKey: 'createdAt',
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      );
    },
    sortable: true,
    filterable: false,
  },
];

const meta = {
  title: 'Organisms/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
DataTable is a galaxy-scale organism that handles large datasets efficiently using virtualization.

**Key Features:**
- Virtualized rendering for 100k+ rows
- Built-in sorting, filtering, and pagination
- Row selection with keyboard support
- Atomic composition with Button, Input, Badge atoms
- SearchBox molecule integration
- Full accessibility compliance (WCAG 2.1 AA)
- TanStack Table + Virtual performance optimization

**Atomic Composition:**
- Uses Button atoms for pagination controls
- Uses SearchBox molecule for global filtering
- Uses Badge atoms for status indicators
- Uses Card atoms for structure
- Implements proper ARIA attributes and keyboard navigation
        `,
      },
    },
  },
  argTypes: {
    data: { control: false },
    columns: { control: false },
    virtualized: { control: 'boolean' },
    enableSelection: { control: 'boolean' },
    enableSorting: { control: 'boolean' },
    enableFiltering: { control: 'boolean' },
    enablePagination: { control: 'boolean' },
    loading: { control: 'boolean' },
    error: { control: 'text' },
  },
} satisfies Meta<DataTableProps<MockPost>>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic table
export const Default: Story = {
  args: {
    data: generateMockPosts(50),
    columns: postColumns,
  },
};

// Galaxy-scale virtualized table
export const GalaxyScale: Story = {
  args: {
    data: generateMockPosts(5000),
    columns: postColumns,
    virtualized: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Virtualized table handling 5,000 rows efficiently for galaxy-scale performance.',
      },
    },
  },
};

// With selection
export const WithSelection: Story = {
  args: {
    data: generateMockPosts(20),
    columns: postColumns,
    enableSelection: true,
  },
};

// With all features
export const FullFeatured: Story = {
  args: {
    data: generateMockPosts(100),
    columns: postColumns,
    enableSelection: true,
    enableSorting: true,
    enableFiltering: true,
    enablePagination: true,
    pageSize: 10,
  },
};

// Loading state
export const Loading: Story = {
  args: {
    data: [],
    columns: postColumns,
    loading: true,
  },
};

// Error state
export const Error: Story = {
  args: {
    data: [],
    columns: postColumns,
    error: 'Failed to fetch data from the server. Please try again.',
  },
};

// Empty state
export const Empty: Story = {
  args: {
    data: [],
    columns: postColumns,
    emptyState: (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-semibold mb-2">No posts found</h3>
        <p className="text-muted-foreground">Get started by creating your first post.</p>
      </div>
    ),
  },
};

// Minimal columns
export const MinimalColumns: Story = {
  args: {
    data: generateMockPosts(25),
    columns: [
      {
        id: 'author',
        header: 'Author',
        accessorKey: 'author',
      },
      {
        id: 'score',
        header: 'Score',
        accessorKey: 'score',
        cell: ({ getValue }) => (getValue() as number).toFixed(1),
      },
    ],
  },
};
