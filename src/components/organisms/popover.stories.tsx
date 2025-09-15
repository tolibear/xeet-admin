import type { Meta, StoryObj } from '@storybook/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { Button } from '../atoms';
import { Input } from '../atoms';
import { Label } from '../atoms';

const meta: Meta<typeof Popover> = {
  title: 'Organisms/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">@nextjs</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <div className="text-xs text-muted-foreground">
                Joined December 2021
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Settings: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Settings</Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Quick Settings</h4>
            <p className="text-sm text-muted-foreground">
              Adjust your preferences
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="text-sm">
                Notifications
              </Label>
              <input
                id="notifications"
                type="checkbox"
                className="h-4 w-4"
                defaultChecked
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="darkmode" className="text-sm">
                Dark Mode
              </Label>
              <input
                id="darkmode"
                type="checkbox"
                className="h-4 w-4"
                defaultChecked
              />
            </div>
          </div>
          <Button className="w-full" size="sm">
            Save Changes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const ColorPicker: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-20 h-10 p-0">
          <div className="w-full h-full bg-blue-500 rounded" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Color Picker</h4>
            <p className="text-sm text-muted-foreground">
              Choose a color
            </p>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {[
              'bg-red-500',
              'bg-orange-500', 
              'bg-yellow-500',
              'bg-green-500',
              'bg-blue-500',
              'bg-purple-500',
              'bg-pink-500',
              'bg-gray-500',
            ].map((color, i) => (
              <button
                key={i}
                className={`w-6 h-6 rounded ${color} hover:scale-110 transition-transform`}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
