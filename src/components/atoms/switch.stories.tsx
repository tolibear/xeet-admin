import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
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
      <Switch {...args} id="airplane-mode" />
      <label htmlFor="airplane-mode" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Airplane mode
      </label>
    </div>
  ),
  args: {},
};

export const Settings: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Email Notifications</label>
          <p className="text-xs text-muted-foreground">Receive emails about your account activity</p>
        </div>
        <Switch />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Push Notifications</label>
          <p className="text-xs text-muted-foreground">Receive push notifications on your device</p>
        </div>
        <Switch checked />
      </div>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <label className="text-sm font-medium">Marketing Emails</label>
          <p className="text-xs text-muted-foreground">Receive emails about new products and features</p>
        </div>
        <Switch disabled />
      </div>
    </div>
  ),
};
