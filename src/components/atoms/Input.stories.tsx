import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index';

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Input** is an enhanced atomic form component built on shadcn/ui with comprehensive state handling.

### Atomic Design Principles
- ✅ **Zero Dependencies**: Works in complete isolation
- ✅ **All States**: Loading, error, success, disabled, and focus states
- ✅ **Perfect Accessibility**: WCAG 2.1 AA compliant with ARIA attributes
- ✅ **Error Handling**: Built-in error messaging with screen reader support
- ✅ **Size Variants**: Small, default, and large sizes

### Usage
Foundation for all form inputs, composes into molecules like SearchBox and form organisms.
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: 'Visual variant of the input',
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      description: 'Size of the input',
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables input',
    },
    error: {
      control: 'text',
      description: 'Error message to display below input',
    },
    success: {
      control: 'boolean',
      description: 'Shows success state styling',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    variant: 'default',
    size: 'default',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <label className="block text-sm font-medium mb-1">Small Input</label>
        <Input size="sm" placeholder="Small input..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Default Input</label>
        <Input size="default" placeholder="Default input..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Large Input</label>
        <Input size="lg" placeholder="Large input..." />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different input sizes for various contexts and hierarchies.',
      },
    },
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <label className="block text-sm font-medium mb-1">Default State</label>
        <Input placeholder="Type something..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Error State</label>
        <Input error="This field is required" placeholder="Email address..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Success State</label>
        <Input success placeholder="Valid email entered" defaultValue="user@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Loading State</label>
        <Input loading placeholder="Validating..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Disabled State</label>
        <Input disabled placeholder="Cannot edit this field" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All possible states showing visual feedback and accessibility features.',
      },
    },
  },
};

export const InputTypes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <label className="block text-sm font-medium mb-1">Text Input</label>
        <Input type="text" placeholder="Enter your name..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email Input</label>
        <Input type="email" placeholder="user@example.com" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password Input</label>
        <Input type="password" placeholder="Enter password..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Number Input</label>
        <Input type="number" placeholder="0" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Search Input</label>
        <Input type="search" placeholder="Search..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">URL Input</label>
        <Input type="url" placeholder="https://example.com" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different input types with appropriate keyboard and validation behavior.',
      },
    },
  },
};

export const WithLabelsAndHelpers: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">
          Username *
        </label>
        <Input 
          id="username"
          placeholder="Enter username..."
          aria-describedby="username-help"
        />
        <p id="username-help" className="text-xs text-muted-foreground mt-1">
          Must be at least 3 characters long
        </p>
      </div>
      
      <div>
        <label htmlFor="email-error" className="block text-sm font-medium mb-1">
          Email Address *
        </label>
        <Input 
          id="email-error"
          type="email"
          error="Please enter a valid email address"
          defaultValue="invalid-email"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone Number
        </label>
        <Input 
          id="phone"
          type="tel"
          success
          defaultValue="+1 (555) 123-4567"
          aria-describedby="phone-help"
        />
        <p id="phone-help" className="text-xs text-success mt-1">
          ✓ Valid phone number format
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Proper form patterns with labels, help text, and error handling.',
      },
    },
  },
};

export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <label className="block text-sm font-medium mb-1">Validating Input</label>
        <Input loading placeholder="Checking availability..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Processing Payment</label>
        <Input loading size="lg" defaultValue="4*** **** **** 1234" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Small Loading</label>
        <Input loading size="sm" placeholder="Saving..." />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Loading states with spinner indicators for async validation or processing.',
      },
    },
  },
};

export const ValidationFlow: Story = {
  render: () => {
    const [value, setValue] = React.useState('');
    const [isValidating, setIsValidating] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    const validateEmail = (email: string) => {
      if (!email) {
        setError('Email is required');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address');
        return false;
      }
      return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      setError('');
      setSuccess(false);
      
      if (newValue) {
        setIsValidating(true);
        // Simulate async validation
        setTimeout(() => {
          setIsValidating(false);
          if (validateEmail(newValue)) {
            setSuccess(true);
          }
        }, 1000);
      }
    };

    return (
      <div className="w-80">
        <label htmlFor="dynamic-email" className="block text-sm font-medium mb-1">
          Email Address *
        </label>
        <Input
          id="dynamic-email"
          type="email"
          value={value}
          onChange={handleChange}
          loading={isValidating}
          error={error}
          success={success}
          placeholder="Enter your email..."
        />
        <p className="text-xs text-muted-foreground mt-1">
          Try typing an email to see validation in action
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive validation flow showing loading, error, and success states.',
      },
    },
  },
};
