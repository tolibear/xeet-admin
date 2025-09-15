import type { Meta, StoryObj } from '@storybook/react';
import { StatusDot } from './StatusDot';

const meta: Meta<typeof StatusDot> = {
  title: 'Atoms/StatusDot',
  component: StatusDot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**StatusDot** is a foundational atomic component for displaying status indicators.

### Atomic Design Principles
- ✅ **Zero Dependencies**: Works in complete isolation
- ✅ **All States**: Handles success, warning, error, info, neutral, and primary states
- ✅ **Perfect Accessibility**: WCAG 2.1 AA compliant with proper ARIA attributes
- ✅ **Scalable**: Multiple sizes from xs to xl
- ✅ **Animated**: Supports pulse and ping animations

### Usage
Perfect for indicating status in molecules like StatePill, or in organisms like DataTable rows.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral', 'primary'],
      description: 'Visual variant representing different states',
    },
    size: {
      control: 'select', 
      options: ['sm', 'default', 'lg', 'xl'],
      description: 'Size of the status dot',
    },
    animation: {
      control: 'select',
      options: ['none', 'pulse', 'ping'],
      description: 'Animation type for the status dot',
    },
    label: {
      control: 'text',
      description: 'Accessible label for screen readers',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatusDot>;

export const Default: Story = {
  args: {
    variant: 'neutral',
    size: 'default',
    animation: 'none',
    label: 'Status indicator',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="success" label="Success status" />
        <span className="text-xs text-muted-foreground">Success</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="warning" label="Warning status" />
        <span className="text-xs text-muted-foreground">Warning</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="error" label="Error status" />
        <span className="text-xs text-muted-foreground">Error</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="info" label="Info status" />
        <span className="text-xs text-muted-foreground">Info</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="neutral" label="Neutral status" />
        <span className="text-xs text-muted-foreground">Neutral</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="primary" label="Primary status" />
        <span className="text-xs text-muted-foreground">Primary</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available status variants with semantic meanings.',
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center space-x-6">
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="primary" size="sm" label="Small status" />
        <span className="text-xs text-muted-foreground">Small</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="primary" size="default" label="Default status" />
        <span className="text-xs text-muted-foreground">Default</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="primary" size="lg" label="Large status" />
        <span className="text-xs text-muted-foreground">Large</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="primary" size="xl" label="Extra large status" />
        <span className="text-xs text-muted-foreground">Extra Large</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes for various use cases from atoms to organisms.',
      },
    },
  },
};

export const WithAnimations: Story = {
  render: () => (
    <div className="flex items-center space-x-8">
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="success" animation="none" label="Static status" />
        <span className="text-xs text-muted-foreground">Static</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="warning" animation="pulse" label="Pulsing status" />
        <span className="text-xs text-muted-foreground">Pulse</span>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <StatusDot variant="error" animation="ping" label="Pinging status" />
        <span className="text-xs text-muted-foreground">Ping</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Animations for indicating active states or drawing attention.',
      },
    },
  },
};

export const InContext: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <StatusDot variant="success" size="sm" label="Online status" />
        <span className="text-sm">User is online</span>
      </div>
      <div className="flex items-center space-x-2">
        <StatusDot variant="warning" size="sm" animation="pulse" label="Away status" />
        <span className="text-sm">User is away</span>
      </div>
      <div className="flex items-center space-x-2">
        <StatusDot variant="error" size="sm" label="Offline status" />
        <span className="text-sm">User is offline</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'StatusDot used in context as part of larger components and molecules.',
      },
    },
  },
};
