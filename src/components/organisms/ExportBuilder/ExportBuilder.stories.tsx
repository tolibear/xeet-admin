import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ExportBuilder } from './ExportBuilder';

const meta = {
  title: 'Organisms/ExportBuilder',
  component: ExportBuilder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**ExportBuilder** is an organism for configuring and managing data exports with multiple format options.

### Features
- Multiple export formats (CSV, JSON, Excel, PDF)
- Column selection with type indicators
- Advanced options (compression, headers, limits)
- Export job tracking and progress
- File size estimation
- Download management

### Atomic Design
This organism composes FilterChip molecules and Button, Input, Card, Badge atoms to create a comprehensive export management interface.
        `,
      },
    },
  },
  argTypes: {
    isExporting: { control: 'boolean' },
  },
  args: {
    onStartExport: fn(),
    onDownload: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof ExportBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock columns data
const mockColumns = [
  { field: 'id', label: 'ID', type: 'string' },
  { field: 'title', label: 'Title', type: 'string' },
  { field: 'author', label: 'Author', type: 'string' },
  { field: 'score', label: 'Score', type: 'number' },
  { field: 'published_at', label: 'Published Date', type: 'date' },
  { field: 'is_verified', label: 'Verified', type: 'boolean' },
  { field: 'category', label: 'Category', type: 'string' },
  { field: 'view_count', label: 'View Count', type: 'number' },
  { field: 'engagement_rate', label: 'Engagement Rate', type: 'number' },
  { field: 'comments_count', label: 'Comments', type: 'number' },
];

// Mock recent jobs
const mockJobs = [
  {
    id: 'job-1',
    name: 'High Engagement Posts Export',
    status: 'completed' as const,
    config: {
      format: 'csv' as const,
      filename: 'high-engagement-posts.csv',
      includeHeaders: true,
      maxRows: 1000,
      columns: ['title', 'author', 'engagement_rate', 'published_at'],
    },
    progress: 100,
    createdAt: '2024-01-20T10:00:00Z',
    completedAt: '2024-01-20T10:03:00Z',
    downloadUrl: '/downloads/high-engagement-posts.csv',
    fileSize: 245760, // ~240KB
    rowCount: 987,
  },
  {
    id: 'job-2',
    name: 'Full Dataset Export',
    status: 'processing' as const,
    config: {
      format: 'excel' as const,
      filename: 'full-dataset.xlsx',
      includeHeaders: true,
      maxRows: 50000,
      columns: mockColumns.map(col => col.field),
    },
    progress: 65,
    createdAt: '2024-01-20T14:30:00Z',
    rowCount: 32500,
  },
  {
    id: 'job-3',
    name: 'Analytics Report',
    status: 'failed' as const,
    config: {
      format: 'json' as const,
      filename: 'analytics-report.json',
      includeHeaders: true,
      maxRows: 10000,
      columns: ['id', 'score', 'category', 'engagement_rate'],
    },
    createdAt: '2024-01-19T16:45:00Z',
    error: 'Failed to process large dataset. Please try with fewer rows.',
  },
  {
    id: 'job-4',
    name: 'Weekly Summary',
    status: 'pending' as const,
    config: {
      format: 'pdf' as const,
      filename: 'weekly-summary.pdf',
      includeHeaders: true,
      maxRows: 500,
      columns: ['title', 'author', 'score', 'published_at'],
    },
    createdAt: '2024-01-20T15:15:00Z',
  },
];

export const Default: Story = {
  args: {
    availableColumns: mockColumns,
    recentJobs: mockJobs,
  },
};

export const WithPrefilledConfig: Story = {
  args: {
    config: {
      format: 'excel',
      filename: 'custom-export.xlsx',
      includeHeaders: true,
      compression: true,
      maxRows: 5000,
      columns: ['title', 'author', 'score', 'published_at'],
    },
    availableColumns: mockColumns,
    recentJobs: mockJobs,
  },
};

export const Exporting: Story = {
  args: {
    availableColumns: mockColumns,
    recentJobs: mockJobs,
    isExporting: true,
  },
};

export const NoColumns: Story = {
  args: {
    availableColumns: [],
    recentJobs: [],
  },
};

export const NoRecentJobs: Story = {
  args: {
    availableColumns: mockColumns,
    recentJobs: [],
  },
};

export const ProcessingJobs: Story = {
  args: {
    availableColumns: mockColumns,
    recentJobs: [
      {
        ...mockJobs[1],
        progress: 25,
      },
      {
        id: 'job-5',
        name: 'Large Dataset Export',
        status: 'processing' as const,
        config: {
          format: 'csv' as const,
          filename: 'large-dataset.csv',
          includeHeaders: true,
          maxRows: 100000,
          columns: mockColumns.map(col => col.field),
        },
        progress: 80,
        createdAt: '2024-01-20T13:00:00Z',
        rowCount: 80000,
      },
    ],
  },
};

// Galaxy Scale - Large number of columns and complex exports
export const GalaxyScale: Story = {
  args: {
    availableColumns: [
      ...mockColumns,
      { field: 'reach', label: 'Reach', type: 'number' },
      { field: 'impressions', label: 'Impressions', type: 'number' },
      { field: 'click_through_rate', label: 'Click Through Rate', type: 'number' },
      { field: 'sentiment_score', label: 'Sentiment Score', type: 'number' },
      { field: 'language', label: 'Language', type: 'string' },
      { field: 'location', label: 'Location', type: 'string' },
      { field: 'device_type', label: 'Device Type', type: 'string' },
      { field: 'traffic_source', label: 'Traffic Source', type: 'string' },
      { field: 'is_trending', label: 'Is Trending', type: 'boolean' },
      { field: 'is_promoted', label: 'Is Promoted', type: 'boolean' },
      { field: 'has_media', label: 'Has Media', type: 'boolean' },
      { field: 'media_type', label: 'Media Type', type: 'string' },
      { field: 'duration', label: 'Duration (seconds)', type: 'number' },
      { field: 'file_size', label: 'File Size (bytes)', type: 'number' },
      { field: 'encoding', label: 'Encoding', type: 'string' },
      { field: 'quality_score', label: 'Quality Score', type: 'number' },
      { field: 'content_length', label: 'Content Length', type: 'number' },
      { field: 'keyword_density', label: 'Keyword Density', type: 'number' },
      { field: 'readability_score', label: 'Readability Score', type: 'number' },
      { field: 'social_shares', label: 'Social Shares', type: 'number' },
    ],
    config: {
      format: 'csv',
      filename: 'comprehensive-export.csv',
      includeHeaders: true,
      compression: true,
      maxRows: 1000000, // 1M rows
      columns: [
        'title', 'author', 'score', 'engagement_rate', 'reach', 'impressions',
        'sentiment_score', 'language', 'location', 'published_at'
      ],
    },
    recentJobs: Array.from({ length: 20 }, (_, i) => ({
      id: `job-${i + 10}`,
      name: `Export ${i + 1}`,
      status: (['completed', 'processing', 'failed', 'pending'] as const)[i % 4],
      config: {
        format: (['csv', 'json', 'excel', 'pdf'] as const)[i % 4],
        filename: `export-${i + 1}.csv`,
        includeHeaders: true,
        maxRows: Math.floor(Math.random() * 100000) + 1000,
        columns: mockColumns.slice(0, Math.floor(Math.random() * 8) + 3).map(col => col.field),
      },
      progress: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - (i * 3600000)).toISOString(),
      completedAt: i % 4 === 0 ? new Date(Date.now() - (i * 3600000) + 300000).toISOString() : undefined,
      fileSize: Math.floor(Math.random() * 10000000) + 100000, // Random file size
      rowCount: Math.floor(Math.random() * 50000) + 1000,
      error: i % 4 === 2 ? 'Random error for demo purposes' : undefined,
    })),
  },
  parameters: {
    viewport: { defaultViewport: 'galaxyScale' },
    docs: {
      description: {
        story: 'Galaxy-scale ExportBuilder with many columns and export jobs to test performance and scalability.',
      },
    },
  },
};
