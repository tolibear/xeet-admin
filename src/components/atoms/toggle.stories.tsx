import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from './toggle';
import { Bold, Italic, Underline } from 'lucide-react';

const meta: Meta<typeof Toggle> = {
  title: 'Atoms/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    pressed: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Toggle',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Toggle',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Toggle',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Toggle',
  },
};

export const WithIcon: Story = {
  args: {
    children: <Bold className="h-4 w-4" />,
  },
};

export const Pressed: Story = {
  args: {
    pressed: true,
    children: <Bold className="h-4 w-4" />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: <Bold className="h-4 w-4" />,
  },
};

export const TextFormatting: Story = {
  render: () => (
    <div className="flex items-center space-x-1">
      <Toggle size="sm" aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" aria-label="Toggle underline">
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  ),
};
