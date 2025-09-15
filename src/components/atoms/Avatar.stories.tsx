import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Avatar** is a foundational atomic component for displaying user profile images with fallback support.

### Atomic Design Principles
- ✅ **Zero Dependencies**: Composed of atomic sub-components
- ✅ **All States**: Handles image loading, fallback states, and error conditions
- ✅ **Perfect Accessibility**: WCAG 2.1 AA compliant with proper alt text
- ✅ **Scalable**: Multiple sizes from xs to 2xl
- ✅ **Flexible**: Supports both circular and square shapes

### Usage
Perfect for user profiles, comment threads, team lists, and any user representation in molecules and organisms.
        `,
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl', '2xl'],
      description: 'Size of the avatar',
    },
    shape: {
      control: 'select',
      options: ['circle', 'square'],
      description: 'Shape of the avatar',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// Mock image URL for consistent stories
const MOCK_IMAGE_URL = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={MOCK_IMAGE_URL} alt="User avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
  args: {
    size: 'default',
    shape: 'circle',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <div className="text-center">
        <Avatar size="xs">
          <AvatarImage src={MOCK_IMAGE_URL} alt="Extra small avatar" />
          <AvatarFallback>XS</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-1">XS</p>
      </div>
      <div className="text-center">
        <Avatar size="sm">
          <AvatarImage src={MOCK_IMAGE_URL} alt="Small avatar" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-1">Small</p>
      </div>
      <div className="text-center">
        <Avatar size="default">
          <AvatarImage src={MOCK_IMAGE_URL} alt="Default avatar" />
          <AvatarFallback>DF</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-1">Default</p>
      </div>
      <div className="text-center">
        <Avatar size="lg">
          <AvatarImage src={MOCK_IMAGE_URL} alt="Large avatar" />
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-1">Large</p>
      </div>
      <div className="text-center">
        <Avatar size="xl">
          <AvatarImage src={MOCK_IMAGE_URL} alt="Extra large avatar" />
          <AvatarFallback>XL</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-1">XL</p>
      </div>
      <div className="text-center">
        <Avatar size="2xl">
          <AvatarImage src={MOCK_IMAGE_URL} alt="2X large avatar" />
          <AvatarFallback>2X</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-1">2XL</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different sizes for various contexts from inline mentions to profile headers.',
      },
    },
  },
};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center space-x-8">
      <div className="text-center">
        <Avatar shape="circle" size="lg">
          <AvatarImage src={MOCK_IMAGE_URL} alt="Circular avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-2">Circle</p>
      </div>
      <div className="text-center">
        <Avatar shape="square" size="lg">
          <AvatarImage src={MOCK_IMAGE_URL} alt="Square avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-2">Square</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Circle for user profiles, square for brand logos or organization avatars.',
      },
    },
  },
};

export const WithFallback: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <div className="text-center">
        <Avatar size="lg">
          <AvatarImage src={MOCK_IMAGE_URL} alt="User with image" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-2">With Image</p>
      </div>
      <div className="text-center">
        <Avatar size="lg">
          <AvatarImage src="/broken-image-url.jpg" alt="User with broken image" />
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-2">Fallback</p>
      </div>
      <div className="text-center">
        <Avatar size="lg">
          <AvatarFallback>XY</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-2">Only Fallback</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Graceful fallback to initials when image fails to load or is not provided.',
      },
    },
  },
};

export const FallbackVariations: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <div className="text-center">
        <Avatar size="lg">
          <AvatarFallback size="lg">JD</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-2">Initials</p>
      </div>
      <div className="text-center">
        <Avatar size="lg">
          <AvatarFallback size="lg">👤</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-2">Icon</p>
      </div>
      <div className="text-center">
        <Avatar size="lg">
          <AvatarFallback size="lg">?</AvatarFallback>
        </Avatar>
        <p className="text-xs text-muted-foreground mt-2">Unknown</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different fallback content: initials, icons, or unknown user indicators.',
      },
    },
  },
};

export const InUserList: Story = {
  render: () => (
    <div className="space-y-3">
      {[
        { name: 'John Doe', email: 'john@example.com', initials: 'JD' },
        { name: 'Alice Brown', email: 'alice@example.com', initials: 'AB' },
        { name: 'Bob Wilson', email: 'bob@example.com', initials: 'BW' },
      ].map((user, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 rounded-md border">
          <Avatar size="default">
            <AvatarImage src={index === 0 ? MOCK_IMAGE_URL : ''} alt={`${user.name}'s avatar`} />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatar used in a realistic user list context, showing mixed image and fallback states.',
      },
    },
  },
};

export const InCommentThread: Story = {
  render: () => (
    <div className="space-y-4 max-w-md">
      {[
        { author: 'Sarah Chen', initials: 'SC', comment: 'Great work on the new feature! The performance improvements are really noticeable.' },
        { author: 'Mike Johnson', initials: 'MJ', comment: 'Agreed! The user experience is much smoother now.' },
        { author: 'Emma Davis', initials: 'ED', comment: 'Should we add some analytics tracking to measure the impact?' },
      ].map((item, index) => (
        <div key={index} className="flex space-x-3">
          <Avatar size="sm">
            <AvatarImage src={index === 0 ? MOCK_IMAGE_URL : ''} alt={`${item.author}'s avatar`} />
            <AvatarFallback size="sm">{item.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-sm font-medium mb-1">{item.author}</p>
              <p className="text-sm">{item.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Avatar used in comment threads with small size for space efficiency.',
      },
    },
  },
};
