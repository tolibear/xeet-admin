import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './slider';

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    step: {
      control: { type: 'number' },
    },
    min: {
      control: { type: 'number' },
    },
    max: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
};

export const WithRange: Story = {
  args: {
    defaultValue: [25, 75],
    max: 100,
    step: 1,
  },
};

export const WithSteps: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 10,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
  },
};

export const Volume: Story = {
  render: (args) => (
    <div className="w-full max-w-sm space-y-2">
      <label className="text-sm font-medium">Volume</label>
      <Slider {...args} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  ),
  args: {
    defaultValue: [75],
    max: 100,
    step: 1,
  },
};

export const PriceRange: Story = {
  render: (args) => (
    <div className="w-full max-w-sm space-y-2">
      <label className="text-sm font-medium">Price Range</label>
      <Slider {...args} />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>$0</span>
        <span>$1000</span>
      </div>
    </div>
  ),
  args: {
    defaultValue: [200, 800],
    max: 1000,
    step: 50,
  },
};
