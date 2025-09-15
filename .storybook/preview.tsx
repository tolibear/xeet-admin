import type { Preview } from '@storybook/react';
import React from 'react';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: true,
    },
    layout: 'centered',
    // Storybook customization
    options: {
      storySort: {
        order: ['Atoms', 'Molecules', 'Organisms', 'Templates', 'Systems'],
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: 'hsl(224 71% 4%)', // Custom theme background
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const { layout } = context.parameters;
      
      return (
        <div className="dark">
          <div 
            className={`
              bg-background text-foreground min-h-[200px] p-4
              ${layout === 'centered' 
                ? 'flex items-center justify-center' 
                : 'w-full'
              }
            `}
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            }}
          >
            <Story />
          </div>
        </div>
      );
    },
  ],
  tags: ['autodocs'],
};

export default preview;