import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { TopicEditor } from './TopicEditor';
import { sampleData } from '@/lib/mock-data';

/**
 * TopicEditor Organism Stories
 * 
 * Comprehensive topic management interface with atomic keyword components.
 * Demonstrates the power of atomic composition in complex forms.
 */
const meta = {
  title: 'Organisms/Topics/TopicEditor',
  component: TopicEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
TopicEditor is a comprehensive organism for managing topics with keywords, synonyms, and stop words.

**Atomic Composition:**
- Built from atomic ColorPicker, Input, Switch components
- Uses KeywordInput molecule for managing keyword arrays
- Maintains perfect atomic hierarchy throughout

**Key Features:**
- Create new topics or edit existing ones
- Visual keyword management with add/remove functionality  
- Color selection with preset and custom options
- Real-time validation with helpful error messages
- Unsaved changes detection with user warnings
- Responsive design for all screen sizes

**States Supported:**
- Loading state with skeleton UI
- Error states with clear messaging
- Form validation with inline errors
- Disabled states during submission
- Unsaved changes tracking

**Performance:**
- Optimized for enterprise-scale keyword management
- Debounced input handling for smooth UX
- Efficient re-rendering with proper state isolation
        `,
      },
    },
  },
  argTypes: {
    topic: {
      control: false,
      description: 'Topic to edit (undefined for new topic creation)',
    },
    onSave: {
      action: 'saved',
      description: 'Callback when topic is saved',
    },
    onCancel: {
      action: 'cancelled',
      description: 'Callback when editing is cancelled',
    },
    onDelete: {
      action: 'deleted',
      description: 'Callback when topic is deleted',
    },
    isSubmitting: {
      control: 'boolean',
      description: 'Whether the form is in a submitting state',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the component is loading',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
  },
} satisfies Meta<typeof TopicEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample topic data for stories
const sampleTopic = sampleData.sampleTopic;

const enhancedTopic = {
  ...sampleTopic,
  name: 'Artificial Intelligence',
  keywords: ['ai', 'machine learning', 'deep learning', 'neural networks', 'automation'],
  synonyms: ['artificial intelligence', 'ml', 'dl', 'ai technology'],
  stopWords: ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'],
  color: '#3b82f6',
  isActive: true
};

/**
 * Create New Topic
 * Shows the editor in creation mode with empty fields ready for input
 */
export const CreateNew: Story = {
  args: {
    onSave: action('topic-saved'),
    onCancel: action('topic-cancelled'),
    isSubmitting: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
Creating a new topic with the TopicEditor organism.

**Atomic Behavior:**
- All atomic components start in their default states
- Form validation prevents submission until required fields are filled
- Real-time feedback guides user through the creation process
- Keywords can be added by typing and pressing Enter, comma, or semicolon
        `,
      },
    },
  },
};

/**
 * Edit Existing Topic  
 * Shows the editor populated with existing topic data
 */
export const EditExisting: Story = {
  args: {
    topic: enhancedTopic,
    onSave: action('topic-saved'),
    onCancel: action('topic-cancelled'),
    onDelete: action('topic-deleted'),
    isSubmitting: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
Editing an existing topic with all fields populated.

**Atomic Features:**
- Form initializes with existing topic data
- Changes are tracked to show "unsaved changes" warning
- Delete button appears for existing topics
- All atomic components maintain their enhanced states
- Color picker shows current topic color with preview
        `,
      },
    },
  },
};

/**
 * Submitting State
 * Shows the editor in a submitting/saving state
 */
export const Submitting: Story = {
  args: {
    topic: enhancedTopic,
    onSave: action('topic-saved'),
    onCancel: action('topic-cancelled'),
    onDelete: action('topic-deleted'),
    isSubmitting: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
Form in submitting state showing proper loading behavior.

**Atomic States:**
- All interactive components become disabled
- Save button shows "Saving..." text with loading state
- Form prevents multiple submissions
- User cannot modify fields during submission
        `,
      },
    },
  },
};

/**
 * Loading State
 * Shows the skeleton UI while topic data is being loaded
 */
export const Loading: Story = {
  args: {
    onSave: action('topic-saved'),
    onCancel: action('topic-cancelled'),
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
Loading state with skeleton UI for better perceived performance.

**Atomic Loading:**
- Clean skeleton animation matches final content structure
- No flash of empty content
- Maintains consistent spacing and proportions
- Provides visual feedback while data loads
        `,
      },
    },
  },
};

/**
 * With Error
 * Shows how the editor handles and displays error states
 */
export const WithError: Story = {
  args: {
    topic: enhancedTopic,
    onSave: action('topic-saved'),
    onCancel: action('topic-cancelled'),
    onDelete: action('topic-deleted'),
    error: 'Failed to save topic. Please check your connection and try again.',
    isSubmitting: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
Error state showing proper error handling and user feedback.

**Error Handling:**
- Clear error message displayed at top of form
- Form remains editable so user can make corrections
- Error styling draws attention without being overwhelming
- User can retry submission after addressing errors
        `,
      },
    },
  },
};

/**
 * Inactive Topic
 * Shows an inactive topic being edited
 */
export const InactiveTopic: Story = {
  args: {
    topic: {
      ...enhancedTopic,
      isActive: false,
      name: 'Deprecated Technology',
    },
    onSave: action('topic-saved'),
    onCancel: action('topic-cancelled'),
    onDelete: action('topic-deleted'),
    isSubmitting: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
Editing an inactive topic with the active toggle in off position.

**State Management:**
- Active/inactive state clearly visible with toggle
- Inactive topics can still be edited and managed
- All atomic components respect the inactive state
- Form behavior remains consistent regardless of active state
        `,
      },
    },
  },
};

/**
 * Complex Topic
 * Shows a topic with many keywords and complex configuration
 */
export const ComplexTopic: Story = {
  args: {
    topic: {
      ...enhancedTopic,
      name: 'Climate Change & Environmental Science',
      keywords: [
        'climate change', 'global warming', 'environmental science', 'carbon emissions',
        'renewable energy', 'sustainability', 'greenhouse gases', 'biodiversity',
        'conservation', 'pollution', 'deforestation', 'ocean acidification'
      ],
      synonyms: [
        'climate crisis', 'environmental crisis', 'global climate change',
        'climate emergency', 'ecological crisis', 'environmental degradation'
      ],
      stopWords: [
        'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
        'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had'
      ],
      color: '#16a34a',
    },
    onSave: action('topic-saved'),
    onCancel: action('topic-cancelled'),
    onDelete: action('topic-deleted'),
    isSubmitting: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
A complex topic with many keywords demonstrating scalability.

**Enterprise-Scale Features:**
- Handles large numbers of keywords efficiently
- Keyword management remains smooth with many items
- Color-coded organization helps with visual management
- All atomic components maintain performance
        `,
      },
    },
  },
};

/**
 * Interactive Demo
 * Interactive story for testing all functionality
 */
export const InteractiveDemo: Story = {
  args: {
    topic: {
      ...enhancedTopic,
      name: 'Interactive Demo Topic',
      keywords: ['demo', 'interactive', 'test'],
      synonyms: ['example', 'sample'],
    },
    onSave: action('topic-saved'),
    onCancel: action('topic-cancelled'),
    onDelete: action('topic-deleted'),
    isSubmitting: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
Interactive demo for testing all TopicEditor functionality.

**Try These Features:**
1. Modify the topic name and see real-time validation
2. Add/remove keywords using Enter, comma, or semicolon
3. Change the topic color using the color picker
4. Toggle the active state on/off
5. Try submitting with empty required fields
6. Test the cancel button with unsaved changes
        `,
      },
    },
  },
};
