import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ViewBuilder } from './ViewBuilder';

const meta = {
  title: 'Organisms/ViewBuilder',
  component: ViewBuilder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**ViewBuilder** is a complex organism that allows users to create and modify data views through a visual interface.

### Features
- Visual query composition with filters
- Column selection with type indicators  
- Advanced options (grouping, limits)
- Real-time query preview
- Save and run functionality

### Atomic Design
This organism composes multiple molecules (FilterChip, SearchBox) and atoms (Button, Input, Badge) to create a complete view building experience.
        `,
      },
    },
  },
  argTypes: {
    isEditing: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    onSave: { action: 'saved' },
    onRun: { action: 'run' },
  },
  args: {
    onSave: fn(),
    onRun: fn(),
  },
} satisfies Meta<typeof ViewBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock field definitions
const mockFields = [
  { field: 'id', label: 'ID', type: 'string' as const },
  { field: 'title', label: 'Title', type: 'string' as const },
  { field: 'author', label: 'Author', type: 'string' as const },
  { field: 'score', label: 'Score', type: 'number' as const },
  { field: 'published_at', label: 'Published', type: 'date' as const },
  { field: 'is_verified', label: 'Verified', type: 'boolean' as const },
  { field: 'category', label: 'Category', type: 'string' as const },
  { field: 'view_count', label: 'Views', type: 'number' as const },
];

// Mock existing view
const mockView = {
  id: 'view-123',
  name: 'High Score Posts',
  description: 'Posts with score above 80 from verified authors',
  filters: [
    {
      id: 'filter-1',
      field: 'score',
      operator: 'greater_than',
      value: '80',
    },
    {
      id: 'filter-2', 
      field: 'is_verified',
      operator: 'is_true',
      value: '',
    },
  ],
  columns: ['title', 'author', 'score', 'published_at'],
  sorting: [{ field: 'score', direction: 'desc' as const }],
  limit: 50,
};

export const NewView: Story = {
  args: {
    availableFields: mockFields,
    isEditing: true,
  },
};

export const ExistingView: Story = {
  args: {
    view: mockView,
    availableFields: mockFields,
    isEditing: true,
  },
};

export const ReadOnlyView: Story = {
  args: {
    view: mockView,
    availableFields: mockFields,
    isEditing: false,
  },
};

export const LoadingState: Story = {
  args: {
    view: mockView,
    availableFields: mockFields,
    isEditing: true,
    isLoading: true,
  },
};

export const NoFields: Story = {
  args: {
    availableFields: [],
    isEditing: true,
  },
};

export const ComplexView: Story = {
  args: {
    view: {
      id: 'view-456',
      name: 'Complex Analysis View',
      description: 'Multi-criteria analysis with grouping and advanced filters',
      filters: [
        {
          id: 'filter-1',
          field: 'score',
          operator: 'between',
          value: '70,90',
        },
        {
          id: 'filter-2',
          field: 'category',
          operator: 'contains',
          value: 'tech',
        },
        {
          id: 'filter-3',
          field: 'published_at',
          operator: 'after',
          value: '2024-01-01',
        },
      ],
      columns: ['title', 'author', 'score', 'category', 'published_at', 'view_count'],
      sorting: [
        { field: 'score', direction: 'desc' as const },
        { field: 'published_at', direction: 'desc' as const },
      ],
      groupBy: 'category',
      limit: 100,
    },
    availableFields: mockFields,
    isEditing: true,
  },
};

// Enterprise Scale - Large dataset with many fields
export const EnterpriseScale: Story = {
  args: {
    availableFields: [
      ...mockFields,
      { field: 'engagement_rate', label: 'Engagement Rate', type: 'number' as const },
      { field: 'comments_count', label: 'Comments', type: 'number' as const },
      { field: 'shares_count', label: 'Shares', type: 'number' as const },
      { field: 'reach', label: 'Reach', type: 'number' as const },
      { field: 'impressions', label: 'Impressions', type: 'number' as const },
      { field: 'click_through_rate', label: 'CTR', type: 'number' as const },
      { field: 'sentiment_score', label: 'Sentiment', type: 'number' as const },
      { field: 'language', label: 'Language', type: 'string' as const },
      { field: 'location', label: 'Location', type: 'string' as const },
      { field: 'device_type', label: 'Device', type: 'string' as const },
      { field: 'traffic_source', label: 'Source', type: 'string' as const },
      { field: 'is_trending', label: 'Trending', type: 'boolean' as const },
      { field: 'is_promoted', label: 'Promoted', type: 'boolean' as const },
      { field: 'has_media', label: 'Has Media', type: 'boolean' as const },
    ],
    view: {
      name: 'Comprehensive Analysis',
      description: 'Enterprise-scale view with extensive filtering and column selection',
      filters: [
        { id: 'f1', field: 'score', operator: 'greater_than', value: '60' },
        { id: 'f2', field: 'engagement_rate', operator: 'greater_than', value: '5' },
        { id: 'f3', field: 'is_verified', operator: 'is_true', value: '' },
        { id: 'f4', field: 'language', operator: 'equals', value: 'en' },
      ],
      columns: [
        'title', 'author', 'score', 'engagement_rate', 'comments_count', 
        'shares_count', 'published_at', 'category', 'sentiment_score'
      ],
      sorting: [{ field: 'engagement_rate', direction: 'desc' as const }],
      groupBy: 'category',
      limit: 1000,
    },
    isEditing: true,
  },
  parameters: {
    viewport: { defaultViewport: 'enterpriseScale' },
    docs: {
      description: {
        story: 'Enterprise-scale ViewBuilder with extensive field options and complex filtering capabilities.',
      },
    },
  },
};
