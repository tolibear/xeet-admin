/**
 * FilterBar Organism - Storybook Stories
 * Advanced filtering interface testing and documentation
 */

import type { Meta, StoryObj } from '@storybook/react';
import { FilterBar } from './FilterBar';
import type { FilterBarProps, FilterField, FilterCondition, SavedFilter } from './types';
import { useState } from 'react';

// Mock filter fields for different data types
const mockFields: FilterField[] = [
  {
    key: 'author',
    label: 'Author',
    type: 'text',
    operators: ['equals', 'contains', 'startsWith'],
  },
  {
    key: 'platform',
    label: 'Platform',
    type: 'select',
    options: [
      { value: 'twitter', label: 'Twitter' },
      { value: 'instagram', label: 'Instagram' },
      { value: 'tiktok', label: 'TikTok' },
      { value: 'linkedin', label: 'LinkedIn' },
    ],
    operators: ['equals', 'in', 'notIn'],
  },
  {
    key: 'score',
    label: 'Score',
    type: 'number',
    operators: ['equals', 'gt', 'lt', 'gte', 'lte'],
  },
  {
    key: 'createdAt',
    label: 'Created Date',
    type: 'date',
    operators: ['equals', 'gt', 'lt', 'gte', 'lte'],
  },
  {
    key: 'isVerified',
    label: 'Verified User',
    type: 'boolean',
  },
  {
    key: 'topics',
    label: 'Topics',
    type: 'multiSelect',
    options: [
      { value: 'tech', label: 'Technology' },
      { value: 'sports', label: 'Sports' },
      { value: 'entertainment', label: 'Entertainment' },
      { value: 'news', label: 'News' },
    ],
    operators: ['in', 'notIn'],
  },
];

// Mock saved filters
const mockSavedFilters: SavedFilter[] = [
  {
    id: 'filter-1',
    name: 'High Engagement Posts',
    conditions: [
      {
        id: 'cond-1',
        field: 'score',
        operator: 'gte',
        value: 80,
      },
    ],
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
  },
  {
    id: 'filter-2',
    name: 'Recent Twitter Posts',
    conditions: [
      {
        id: 'cond-2',
        field: 'platform',
        operator: 'equals',
        value: 'twitter',
      },
      {
        id: 'cond-3',
        field: 'createdAt',
        operator: 'gte',
        value: '2023-12-01',
      },
    ],
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
  },
];

// Wrapper component for interactive stories
function FilterBarWrapper(props: Partial<FilterBarProps>) {
  const [conditions, setConditions] = useState<FilterCondition[]>(props.conditions || []);
  
  return (
    <FilterBar
      {...props}
      fields={mockFields}
      conditions={conditions}
      onConditionsChange={setConditions}
    />
  );
}

const meta = {
  title: 'Organisms/FilterBar',
  component: FilterBar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
FilterBar is an advanced filtering organism that composes molecular chip tokens for complex data filtering.

**Key Features:**
- Multiple field types (text, number, date, select, boolean)
- Dynamic operator selection based on field type
- FilterChip molecule integration for visual condition display
- Saved filter management
- Real-time condition building
- Maximum condition limits
- Atomic composition with Button, Input, Badge atoms

**Atomic Composition:**
- Uses Button atoms for actions (Add, Save, Clear)
- Uses Input atoms for value entry
- Uses Badge atoms for condition counts
- Uses FilterChip molecules for condition display
- Uses Card atoms for structure
- Implements proper ARIA attributes and keyboard navigation
        `,
      },
    },
  },
  argTypes: {
    fields: { control: false },
    conditions: { control: false },
    onConditionsChange: { action: 'conditions changed' },
    enableGroups: { control: 'boolean' },
    enableSavedFilters: { control: 'boolean' },
    showAddButton: { control: 'boolean' },
    showClearButton: { control: 'boolean' },
    showSaveButton: { control: 'boolean' },
    maxConditions: { control: { type: 'range', min: 1, max: 20, step: 1 } },
    loading: { control: 'boolean' },
    error: { control: 'text' },
  },
} satisfies Meta<FilterBarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic filter bar
export const Default: Story = {
  render: (args) => <FilterBarWrapper {...args} />,
  args: {
    fields: mockFields,
    conditions: [],
    onConditionsChange: () => {},
  },
};

// With existing conditions
export const WithConditions: Story = {
  render: (args) => <FilterBarWrapper {...args} />,
  args: {
    fields: mockFields,
    conditions: [
      {
        id: 'cond-1',
        field: 'author',
        operator: 'contains',
        value: 'john',
        label: 'john',
      },
      {
        id: 'cond-2',
        field: 'score',
        operator: 'gte',
        value: 85,
        label: '85',
      },
      {
        id: 'cond-3',
        field: 'platform',
        operator: 'equals',
        value: 'twitter',
        label: 'Twitter',
      },
    ],
    onConditionsChange: () => {},
  },
};

// With saved filters enabled
export const WithSavedFilters: Story = {
  render: (args) => <FilterBarWrapper {...args} />,
  args: {
    fields: mockFields,
    conditions: [],
    onConditionsChange: () => {},
    enableSavedFilters: true,
    savedFilters: mockSavedFilters,
    showSaveButton: true,
  },
};

// With all features enabled
export const FullFeatured: Story = {
  render: (args) => <FilterBarWrapper {...args} />,
  args: {
    fields: mockFields,
    conditions: [
      {
        id: 'cond-1',
        field: 'score',
        operator: 'gt',
        value: 75,
        label: '75',
      },
    ],
    onConditionsChange: () => {},
    enableGroups: true,
    enableSavedFilters: true,
    savedFilters: mockSavedFilters,
    showAddButton: true,
    showClearButton: true,
    showSaveButton: true,
    maxConditions: 5,
  },
};

// Loading state
export const Loading: Story = {
  render: (args) => <FilterBarWrapper {...args} />,
  args: {
    fields: mockFields,
    conditions: [],
    onConditionsChange: () => {},
    loading: true,
  },
};

// Error state
export const Error: Story = {
  render: (args) => <FilterBarWrapper {...args} />,
  args: {
    fields: mockFields,
    conditions: [],
    onConditionsChange: () => {},
    error: 'Failed to load filter configuration. Please try again.',
  },
};

// Minimal configuration
export const Minimal: Story = {
  render: (args) => <FilterBarWrapper {...args} />,
  args: {
    fields: [
      {
        key: 'name',
        label: 'Name',
        type: 'text',
      },
      {
        key: 'score',
        label: 'Score',
        type: 'number',
      },
    ],
    conditions: [],
    onConditionsChange: () => {},
    showAddButton: true,
    showClearButton: false,
    showSaveButton: false,
    enableSavedFilters: false,
  },
};

// With condition limit reached
export const MaxConditions: Story = {
  render: (args) => <FilterBarWrapper {...args} />,
  args: {
    fields: mockFields,
    conditions: [
      { id: 'c1', field: 'author', operator: 'contains', value: 'test1' },
      { id: 'c2', field: 'score', operator: 'gt', value: 80 },
      { id: 'c3', field: 'platform', operator: 'equals', value: 'twitter' },
    ],
    onConditionsChange: () => {},
    maxConditions: 3,
  },
};
