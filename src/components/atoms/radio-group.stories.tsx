import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';

const meta: Meta<typeof RadioGroup> = {
  title: 'Atoms/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3">Compact</Label>
      </div>
    </RadioGroup>
  ),
  args: {},
};

export const Disabled: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2">Comfortable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" disabled />
        <Label htmlFor="r3">Compact (disabled)</Label>
      </div>
    </RadioGroup>
  ),
  args: {},
};

export const PaymentMethod: Story = {
  render: (args) => (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Payment Method</h3>
      <RadioGroup {...args} defaultValue="card">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card">Credit Card</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal">PayPal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="apple" id="apple" />
          <Label htmlFor="apple">Apple Pay</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="google" id="google" />
          <Label htmlFor="google">Google Pay</Label>
        </div>
      </RadioGroup>
    </div>
  ),
  args: {},
};

export const WithDescriptions: Story = {
  render: (args) => (
    <div className="space-y-3">
      <h3 className="text-lg font-medium">Subscription Plan</h3>
      <RadioGroup {...args} defaultValue="pro">
        <div className="flex items-start space-x-3 space-y-0">
          <RadioGroupItem value="free" id="free" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="free" className="text-sm font-medium leading-none">
              Free
            </Label>
            <p className="text-xs text-muted-foreground">
              Perfect for trying out our service
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 space-y-0">
          <RadioGroupItem value="pro" id="pro" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="pro" className="text-sm font-medium leading-none">
              Pro ($9/month)
            </Label>
            <p className="text-xs text-muted-foreground">
              Best for professionals who need advanced features
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3 space-y-0">
          <RadioGroupItem value="enterprise" id="enterprise" className="mt-1" />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="enterprise" className="text-sm font-medium leading-none">
              Enterprise ($29/month)
            </Label>
            <p className="text-xs text-muted-foreground">
              For large teams with custom requirements
            </p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
  args: {},
};
