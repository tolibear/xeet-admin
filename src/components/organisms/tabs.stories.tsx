import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Button } from '../atoms';
import { Input } from '../atoms';
import { Label } from '../atoms';

const meta: Meta<typeof Tabs> = {
  title: 'Organisms/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    defaultValue: {
      control: 'text',
    },
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
    <Tabs {...args} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="Pedro Duarte" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue="@peduarte" />
        </div>
      </TabsContent>
      <TabsContent value="password" className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="current">Current password</Label>
          <Input id="current" type="password" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="new">New password</Label>
          <Input id="new" type="password" />
        </div>
      </TabsContent>
    </Tabs>
  ),
  args: {
    defaultValue: 'account',
  },
};

export const Dashboard: Story = {
  render: (args) => (
    <Tabs {...args} className="w-[600px]">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Total Users</h3>
            <p className="text-2xl font-bold">1,234</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Revenue</h3>
            <p className="text-2xl font-bold">$12,345</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Growth</h3>
            <p className="text-2xl font-bold text-green-600">+12%</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="mt-4">
        <div className="rounded-lg border p-8 text-center">
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-muted-foreground">Your analytics data would be here</p>
        </div>
      </TabsContent>
      <TabsContent value="reports" className="mt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Reports</h3>
            <Button>Generate Report</Button>
          </div>
          <div className="rounded-lg border p-4">
            <p>No reports generated yet</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="notifications" className="mt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">New user registered</p>
              <p className="text-sm text-muted-foreground">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="font-medium">Payment processed</p>
              <p className="text-sm text-muted-foreground">1 hour ago</p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
  args: {
    defaultValue: 'overview',
  },
};

export const Vertical: Story = {
  render: (args) => (
    <Tabs {...args} orientation="vertical" className="w-[600px]">
      <div className="flex">
        <TabsList className="grid h-auto w-full max-w-[200px] grid-rows-4">
          <TabsTrigger value="general" className="w-full justify-start">
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="w-full justify-start">
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations" className="w-full justify-start">
            Integrations
          </TabsTrigger>
          <TabsTrigger value="support" className="w-full justify-start">
            Support
          </TabsTrigger>
        </TabsList>
        <div className="flex-1 ml-4">
          <TabsContent value="general">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">General Settings</h3>
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input placeholder="Your organization name" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="security">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Security Settings</h3>
              <div className="space-y-2">
                <Label>Two-factor authentication</Label>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="integrations">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Integrations</h3>
              <p className="text-muted-foreground">Connect your favorite tools</p>
            </div>
          </TabsContent>
          <TabsContent value="support">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Support</h3>
              <p className="text-muted-foreground">Get help when you need it</p>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  ),
  args: {
    defaultValue: 'general',
  },
};
