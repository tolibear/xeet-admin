import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';
import { useEffect, useState } from 'react';

const meta: Meta<typeof Progress> = {
  title: 'Atoms/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 100, step: 1 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 33,
  },
};

export const Empty: Story = {
  args: {
    value: 0,
  },
};

export const Half: Story = {
  args: {
    value: 50,
  },
};

export const Complete: Story = {
  args: {
    value: 100,
  },
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(13);

    useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);

    return <Progress value={progress} className="w-[60%]" />;
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Upload Progress</span>
        <span className="text-sm text-muted-foreground">{args.value}%</span>
      </div>
      <Progress value={args.value} />
    </div>
  ),
  args: {
    value: 75,
  },
};
