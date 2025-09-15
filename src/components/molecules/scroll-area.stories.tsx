import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './scroll-area';
import { Separator } from '../atoms/separator';

const meta: Meta<typeof ScrollArea> = {
  title: 'Molecules/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <figure key={i} className="shrink-0">
            <div className="overflow-hidden rounded-md">
              <img
                src={`https://picsum.photos/seed/${i}/150/150`}
                alt={`Photo ${i + 1}`}
                className="aspect-[3/4] h-fit w-fit object-cover"
                width={150}
                height={200}
              />
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground">
              Photo {i + 1}
            </figcaption>
          </figure>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Chat: Story = {
  render: () => (
    <div className="w-80 rounded-lg border bg-background">
      <div className="flex h-12 items-center border-b px-4">
        <h3 className="font-semibold">Chat Messages</h3>
      </div>
      <ScrollArea className="h-64 p-4">
        <div className="space-y-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-2">
              <div className="h-6 w-6 rounded-full bg-muted" />
              <div className="space-y-1">
                <p className="text-sm font-medium">User {i + 1}</p>
                <p className="text-sm text-muted-foreground">
                  This is a chat message from user {i + 1}. It might be a bit longer to show how text wraps.
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  ),
};

export const CodeBlock: Story = {
  render: () => (
    <ScrollArea className="h-72 w-96 rounded-md border bg-muted/50">
      <pre className="p-4 text-sm">
        <code>{`import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => \`v1.2.0-beta.\${a.length - i}\`
)

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <React.Fragment key={tag}>
            <div className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </React.Fragment>
        ))}
      </div>
    </ScrollArea>
  )
}`}</code>
      </pre>
    </ScrollArea>
  ),
};
