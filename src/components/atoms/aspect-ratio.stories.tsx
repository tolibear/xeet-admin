import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './aspect-ratio';

const meta: Meta<typeof AspectRatio> = {
  title: 'Atoms/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
      description: 'The aspect ratio (width/height)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ratio: 16 / 9,
    children: (
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Photo by Drew Beamer"
        className="h-full w-full rounded-md object-cover"
      />
    ),
  },
};

export const Square: Story = {
  args: {
    ratio: 1 / 1,
    children: (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
        <span className="text-sm text-muted-foreground">Square (1:1)</span>
      </div>
    ),
  },
};

export const Portrait: Story = {
  args: {
    ratio: 3 / 4,
    children: (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
        <span className="text-sm text-muted-foreground">Portrait (3:4)</span>
      </div>
    ),
  },
};

export const Widescreen: Story = {
  args: {
    ratio: 21 / 9,
    children: (
      <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
        <span className="text-sm text-muted-foreground">Widescreen (21:9)</span>
      </div>
    ),
  },
};
