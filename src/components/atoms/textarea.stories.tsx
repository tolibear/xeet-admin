import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Atoms/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message here.',
  },
};

export const WithValue: Story = {
  args: {
    value: 'This is a textarea with some content that spans multiple lines. You can edit this text and see how it behaves.',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'This textarea is disabled',
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <label htmlFor="message" className="text-sm font-medium">
        Your message
      </label>
      <Textarea {...args} id="message" />
    </div>
  ),
  args: {
    placeholder: 'Type your message here.',
  },
};

export const WithHelperText: Story = {
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <label htmlFor="message-2" className="text-sm font-medium">
        Your message
      </label>
      <Textarea {...args} id="message-2" />
      <p className="text-sm text-muted-foreground">
        Your message will be copied to the support team.
      </p>
    </div>
  ),
  args: {
    placeholder: 'Type your message here.',
  },
};

export const ResizableY: Story = {
  args: {
    placeholder: 'This textarea can be resized vertically.',
    className: 'resize-y',
  },
};

export const MinHeight: Story = {
  args: {
    placeholder: 'This textarea has a minimum height.',
    className: 'min-h-[120px]',
  },
};
