import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SavedViews } from './SavedViews';

const meta = {
  title: 'Organisms/SavedViews',
  component: SavedViews,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**SavedViews** is an organism for managing and browsing saved data views with search, filtering, and actions.

### Features
- Search and filter saved views
- Tag-based filtering
- Ownership filtering (mine/shared)
- Multiple sorting options
- View actions (run, edit, duplicate, delete)
- Usage statistics display

### Atomic Design
This organism composes SearchBox, FilterChip molecules and Button, Badge, Card atoms to create a comprehensive view management interface.
        `,
      },
    },
  },
  argTypes: {
    isLoading: { control: 'boolean' },
    currentUserId: { control: 'text' },
  },
  args: {
    onCreateView: fn(),
    onEditView: fn(),
    onRunView: fn(),
    onDuplicateView: fn(),
    onDeleteView: fn(),
    currentUserId: 'user-123',
  },
} satisfies Meta<typeof SavedViews>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock saved views data
const mockViews = [
  {
    id: 'view-1',
    name: 'High Engagement Posts',
    description: 'Posts with high engagement rates and verified authors',
    filters: [
      { id: 'f1', field: 'engagement_rate', operator: 'greater_than', value: '5' },
      { id: 'f2', field: 'is_verified', operator: 'is_true', value: '' },
    ],
    columns: ['title', 'author', 'engagement_rate', 'published_at'],
    sorting: [{ field: 'engagement_rate', direction: 'desc' as const }],
    limit: 100,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    createdBy: 'user-123',
    isPublic: true,
    tags: ['engagement', 'verified', 'trending'],
    usage: {
      viewCount: 45,
      lastViewed: '2024-01-20T14:00:00Z',
    },
  },
  {
    id: 'view-2',
    name: 'Tech Category Analysis',
    description: 'Analysis of technology category posts with sentiment scoring',
    filters: [
      { id: 'f1', field: 'category', operator: 'equals', value: 'technology' },
      { id: 'f2', field: 'sentiment_score', operator: 'greater_than', value: '0.5' },
    ],
    columns: ['title', 'category', 'sentiment_score', 'author', 'published_at'],
    sorting: [{ field: 'published_at', direction: 'desc' as const }],
    groupBy: 'author',
    limit: 200,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:45:00Z',
    createdBy: 'user-456',
    isPublic: false,
    tags: ['tech', 'sentiment', 'analysis'],
    usage: {
      viewCount: 23,
      lastViewed: '2024-01-18T10:00:00Z',
    },
  },
  {
    id: 'view-3',
    name: 'Weekly Report Data',
    description: 'Standard weekly reporting view for stakeholders',
    filters: [
      { id: 'f1', field: 'published_at', operator: 'after', value: '2024-01-01' },
      { id: 'f2', field: 'score', operator: 'greater_than', value: '50' },
    ],
    columns: ['title', 'author', 'score', 'category', 'published_at', 'view_count'],
    sorting: [
      { field: 'score', direction: 'desc' as const },
      { field: 'published_at', direction: 'desc' as const },
    ],
    limit: 500,
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-22T09:15:00Z',
    createdBy: 'user-123',
    isPublic: true,
    tags: ['report', 'weekly', 'stakeholders'],
    usage: {
      viewCount: 156,
      lastViewed: '2024-01-22T08:00:00Z',
    },
  },
  {
    id: 'view-4',
    name: 'Personal Draft Views',
    description: 'My personal collection of draft analysis views',
    filters: [
      { id: 'f1', field: 'author', operator: 'equals', value: 'my-username' },
      { id: 'f2', field: 'status', operator: 'equals', value: 'draft' },
    ],
    columns: ['title', 'status', 'updated_at'],
    sorting: [{ field: 'updated_at', direction: 'desc' as const }],
    limit: 50,
    createdAt: '2024-01-12T16:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    createdBy: 'user-123',
    isPublic: false,
    tags: ['personal', 'draft'],
    usage: {
      viewCount: 8,
      lastViewed: '2024-01-12T16:30:00Z',
    },
  },
];

export const Default: Story = {
  args: {
    views: mockViews,
  },
};

export const Empty: Story = {
  args: {
    views: [],
  },
};

export const Loading: Story = {
  args: {
    views: mockViews,
    isLoading: true,
  },
};

export const MyViewsOnly: Story = {
  args: {
    views: mockViews,
  },
  play: async ({ canvasElement }) => {
    // Auto-select "My Views" filter for this story
    const canvas = canvasElement;
    const select = canvas.querySelector('select') as HTMLSelectElement;
    if (select) {
      select.value = 'mine';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },
};

export const SearchFiltered: Story = {
  args: {
    views: mockViews,
  },
  play: async ({ canvasElement }) => {
    // Auto-search for "tech" to show filtering
    const canvas = canvasElement;
    const searchInput = canvas.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = 'tech';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};

export const DifferentUser: Story = {
  args: {
    views: mockViews,
    currentUserId: 'user-999', // Different user to show shared views
  },
};

// Galaxy Scale - Large number of views
export const GalaxyScale: Story = {
  args: {
    views: Array.from({ length: 50 }, (_, i) => ({
      id: `view-${i + 1}`,
      name: `Analysis View ${i + 1}`,
      description: `Comprehensive analysis view #${i + 1} for various data insights and reporting purposes`,
      filters: [
        { id: 'f1', field: 'score', operator: 'greater_than', value: `${30 + (i % 50)}` },
        { id: 'f2', field: 'category', operator: 'equals', value: ['tech', 'business', 'health', 'education'][i % 4] },
      ],
      columns: ['title', 'author', 'score', 'category', 'published_at'],
      sorting: [{ field: 'score', direction: (i % 2 === 0 ? 'desc' : 'asc') as const }],
      limit: 100 + (i * 10),
      createdAt: new Date(Date.now() - (i * 86400000)).toISOString(), // Spread over days
      updatedAt: new Date(Date.now() - (i * 3600000)).toISOString(), // Spread over hours
      createdBy: i % 3 === 0 ? 'user-123' : `user-${400 + (i % 5)}`,
      isPublic: i % 4 === 0,
      tags: [
        ['analysis', 'data', 'insights'][i % 3],
        ['trending', 'archived', 'experimental'][i % 3],
        ['business', 'research', 'operational'][i % 3],
      ].filter(Boolean),
      usage: {
        viewCount: Math.floor(Math.random() * 200),
        lastViewed: new Date(Date.now() - (Math.random() * 86400000 * 7)).toISOString(),
      },
    })),
    currentUserId: 'user-123',
  },
  parameters: {
    viewport: { defaultViewport: 'galaxyScale' },
    docs: {
      description: {
        story: 'Galaxy-scale SavedViews with 50+ views to test performance and filtering capabilities.',
      },
    },
  },
};
