import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta: Meta<typeof Separator> = {
  title: 'Atoms/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">An open-source UI component library.</p>
      </div>
      <Separator {...args} className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
  args: {
    orientation: 'horizontal',
  },
};

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-full">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Section 1</h4>
        <p className="text-sm text-muted-foreground">Content above separator</p>
      </div>
      <Separator {...args} className="my-4" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Section 2</h4>
        <p className="text-sm text-muted-foreground">Content below separator</p>
      </div>
    </div>
  ),
  args: {
    orientation: 'horizontal',
  },
};

export const Vertical: Story = {
  render: (args) => (
    <div className="flex h-20 items-center space-x-4 text-sm">
      <div>Left content</div>
      <Separator {...args} />
      <div>Middle content</div>
      <Separator {...args} />
      <div>Right content</div>
    </div>
  ),
  args: {
    orientation: 'vertical',
  },
};
