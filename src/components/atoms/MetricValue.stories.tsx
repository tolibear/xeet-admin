import type { Meta, StoryObj } from '@storybook/react';
import { MetricValue } from './MetricValue';

const meta: Meta<typeof MetricValue> = {
  title: 'Atoms/MetricValue',
  component: MetricValue,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**MetricValue** is a foundational atomic component for displaying numerical metrics with perfect typography and accessibility.

### Atomic Design Principles
- ✅ **Zero Dependencies**: Works in complete isolation
- ✅ **All States**: Handles loading state and all semantic variants
- ✅ **Perfect Accessibility**: WCAG 2.1 AA compliant with screen reader support
- ✅ **Typography**: Monospace font with tabular numbers for perfect alignment
- ✅ **Semantic**: Supports prefix/suffix and automatic number formatting

### Usage
Perfect for metrics in dashboard cards, KPI displays, and data visualizations. Composes beautifully into MetricCard molecules.
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'The metric value to display (number or string)',
    },
    variant: {
      control: 'select',
      options: ['default', 'muted', 'success', 'warning', 'error', 'info', 'primary'],
      description: 'Visual variant for semantic meaning',
    },
    size: {
      control: 'select', 
      options: ['sm', 'default', 'lg', 'xl', '2xl', '3xl', '4xl'],
      description: 'Size of the metric value',
    },
    weight: {
      control: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      description: 'Font weight',
    },
    prefix: {
      control: 'text',
      description: 'Text to display before the value (e.g., "$", "+")',
    },
    suffix: {
      control: 'text',
      description: 'Text to display after the value (e.g., "%", "ms")',
    },
    loading: {
      control: 'boolean',
      description: 'Whether to show loading state',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetricValue>;

export const Default: Story = {
  args: {
    value: 1234,
    variant: 'default',
    size: 'default',
    weight: 'semibold',
  },
};

export const WithFormatting: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-center">
        <MetricValue value={1234567} size="2xl" />
        <p className="text-xs text-muted-foreground mt-1">Auto-formatted large number</p>
      </div>
      <div className="text-center">
        <MetricValue value={98.76} suffix="%" variant="success" size="xl" />
        <p className="text-xs text-muted-foreground mt-1">Percentage with suffix</p>
      </div>
      <div className="text-center">
        <MetricValue value={2500} prefix="$" variant="primary" size="xl" />
        <p className="text-xs text-muted-foreground mt-1">Currency with prefix</p>
      </div>
      <div className="text-center">
        <MetricValue value={+15.2} prefix="+" suffix="%" variant="success" size="lg" />
        <p className="text-xs text-muted-foreground mt-1">Growth with prefix and suffix</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Various formatting options with prefixes and suffixes for different metric types.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <MetricValue value={100} variant="default" size="lg" />
        <p className="text-xs text-muted-foreground mt-1">Default</p>
      </div>
      <div className="text-center">
        <MetricValue value={85} variant="muted" size="lg" />
        <p className="text-xs text-muted-foreground mt-1">Muted</p>
      </div>
      <div className="text-center">
        <MetricValue value={92} variant="success" size="lg" />
        <p className="text-xs text-muted-foreground mt-1">Success</p>
      </div>
      <div className="text-center">
        <MetricValue value={68} variant="warning" size="lg" />
        <p className="text-xs text-muted-foreground mt-1">Warning</p>
      </div>
      <div className="text-center">
        <MetricValue value={23} variant="error" size="lg" />
        <p className="text-xs text-muted-foreground mt-1">Error</p>
      </div>
      <div className="text-center">
        <MetricValue value={150} variant="info" size="lg" />
        <p className="text-xs text-muted-foreground mt-1">Info</p>
      </div>
      <div className="text-center">
        <MetricValue value={200} variant="primary" size="lg" />
        <p className="text-xs text-muted-foreground mt-1">Primary</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All semantic variants for different types of metrics and states.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-3 text-center">
      <div>
        <MetricValue value={42} size="sm" />
        <p className="text-xs text-muted-foreground">Small</p>
      </div>
      <div>
        <MetricValue value={42} size="default" />
        <p className="text-xs text-muted-foreground">Default</p>
      </div>
      <div>
        <MetricValue value={42} size="lg" />
        <p className="text-xs text-muted-foreground">Large</p>
      </div>
      <div>
        <MetricValue value={42} size="xl" />
        <p className="text-xs text-muted-foreground">Extra Large</p>
      </div>
      <div>
        <MetricValue value={42} size="2xl" />
        <p className="text-xs text-muted-foreground">2X Large</p>
      </div>
      <div>
        <MetricValue value={42} size="3xl" />
        <p className="text-xs text-muted-foreground">3X Large</p>
      </div>
      <div>
        <MetricValue value={42} size="4xl" />
        <p className="text-xs text-muted-foreground">4X Large</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes for various contexts from small inline metrics to hero numbers.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => (
    <div className="space-y-4 text-center">
      <div>
        <MetricValue value={100} loading size="2xl" />
        <p className="text-xs text-muted-foreground mt-1">Large loading state</p>
      </div>
      <div className="flex justify-center space-x-6">
        <div>
          <MetricValue value={50} loading suffix="%" />
          <p className="text-xs text-muted-foreground mt-1">With suffix</p>
        </div>
        <div>
          <MetricValue value={1000} loading prefix="$" />
          <p className="text-xs text-muted-foreground mt-1">With prefix</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading states show "--" while preserving layout and accessibility.',
      },
    },
  },
};

export const InDashboard: Story = {
  render: () => (
    <div className="bg-card rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">Analytics Overview</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <MetricValue value={24567} variant="primary" size="2xl" />
          <p className="text-sm text-muted-foreground mt-1">Total Users</p>
        </div>
        <div className="text-center">
          <MetricValue value={98.2} suffix="%" variant="success" size="2xl" />
          <p className="text-sm text-muted-foreground mt-1">Uptime</p>
        </div>
        <div className="text-center">
          <MetricValue value={+12.5} prefix="+" suffix="%" variant="success" size="xl" />
          <p className="text-sm text-muted-foreground mt-1">Growth</p>
        </div>
        <div className="text-center">
          <MetricValue value={156} suffix="ms" variant="info" size="xl" />
          <p className="text-sm text-muted-foreground mt-1">Avg Response</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'MetricValue used in a realistic dashboard context with various metric types.',
      },
    },
  },
};
