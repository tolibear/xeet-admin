import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    checked: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
  args: {},
};

export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate' as any,
  },
};
