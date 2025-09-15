import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { KeywordCoverageHeatmap } from './KeywordCoverageHeatmap';
import { sampleData, generateKeywordCoverageDataset, generateTopics } from '@/lib/mock-data';

/**
 * KeywordCoverageHeatmap Organism Stories
 * 
 * Comprehensive keyword coverage visualization with atomic heatmap cells.
 * Demonstrates data-driven design and responsive visual analytics.
 */
const meta = {
  title: 'Organisms/Topics/KeywordCoverageHeatmap',
  component: KeywordCoverageHeatmap,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
KeywordCoverageHeatmap is a sophisticated data visualization organism for analyzing keyword performance and coverage patterns.

**Atomic Composition:**
- Built from HeatmapCell atoms for individual keyword visualization
- HeatmapLegend atom provides color scale reference
- Filter molecules for interactive data exploration
- Responsive grid layout scaling from mobile to desktop

**Key Features:**
- Multiple visualization modes: Coverage, Engagement, and Trend
- Interactive filtering by topics and coverage threshold
- Grid and list view modes for different use cases
- Real-time hover tooltips with detailed metrics
- Export functionality for data analysis
- Responsive design optimizing for all screen sizes

**Data Visualizations:**
- **Coverage Mode**: Shows keyword coverage percentage across content
- **Engagement Mode**: Visualizes average engagement for keyword-tagged content
- **Trend Mode**: Displays keyword performance changes over time

**Performance:**
- Optimized for enterprise-scale datasets (1000+ keywords)
- Efficient filtering and grouping with minimal re-renders
- Smooth animations and transitions for better UX
        `,
      },
    },
  },
  argTypes: {
    data: {
      control: false,
      description: 'Array of keyword coverage data to visualize',
    },
    onKeywordClick: {
      action: 'keyword-clicked',
      description: 'Callback when a keyword cell is clicked',
    },
    colorScheme: {
      control: 'select',
      options: ['coverage', 'engagement', 'trend'],
      description: 'Color scheme for the heatmap visualization',
    },
    groupByTopics: {
      control: 'boolean',
      description: 'Group keywords by their associated topics',
    },
    showTrends: {
      control: 'boolean',
      description: 'Show trend indicators on keyword cells',
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interactive features like click handlers',
    },
    maxKeywords: {
      control: { type: 'range', min: 10, max: 100, step: 5 },
      description: 'Maximum number of keywords to display',
    },
  },
} satisfies Meta<typeof KeywordCoverageHeatmap>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate sample data for stories
const sampleTopics = generateTopics(6);
const keywordData = generateKeywordCoverageDataset(sampleTopics, 40);
const smallDataset = generateKeywordCoverageDataset(sampleTopics, 15);
const largeDataset = generateKeywordCoverageDataset(sampleTopics, 80);

/**
 * Default View
 * Standard heatmap showing keyword coverage with default settings
 */
export const Default: Story = {
  args: {
    data: keywordData,
    onKeywordClick: action('keyword-clicked'),
    colorScheme: 'coverage',
    groupByTopics: false,
    showTrends: true,
    interactive: true,
    maxKeywords: 50,
  },
  parameters: {
    docs: {
      description: {
        story: `
Default keyword coverage heatmap showing coverage percentages.

**Atomic Features:**
- Each keyword displayed as an individual HeatmapCell atom
- Color intensity represents coverage percentage
- Interactive cells respond to hover and click events
- Legend provides clear mapping of colors to values
        `,
      },
    },
  },
};

/**
 * Engagement Mode
 * Heatmap showing average engagement metrics instead of coverage
 */
export const EngagementMode: Story = {
  args: {
    ...Default.args,
    colorScheme: 'engagement',
  },
  parameters: {
    docs: {
      description: {
        story: `
Engagement mode visualization showing average engagement levels.

**Atomic Behavior:**
- Green color scheme optimized for engagement metrics
- Cell values show engagement numbers instead of percentages
- Trend indicators help identify performance changes
- Filter controls remain consistent across all modes
        `,
      },
    },
  },
};

/**
 * Trend Mode
 * Heatmap highlighting keyword performance trends over time
 */
export const TrendMode: Story = {
  args: {
    ...Default.args,
    colorScheme: 'trend',
  },
  parameters: {
    docs: {
      description: {
        story: `
Trend mode emphasizes keyword performance changes over time.

**Visual Design:**
- Red/green color scheme for negative/positive trends
- Trend icons provide additional visual cues
- Zero-trend keywords shown in neutral gray
- Perfect for identifying emerging or declining keywords
        `,
      },
    },
  },
};

/**
 * Grouped by Topics
 * Shows keywords organized by their associated topics
 */
export const GroupedByTopics: Story = {
  args: {
    ...Default.args,
    groupByTopics: true,
    maxKeywords: 60,
  },
  parameters: {
    docs: {
      description: {
        story: `
Topic-grouped view for better content organization.

**Organizational Features:**
- Keywords visually grouped by topic categories
- Topic headers with color-coded indicators
- Keyword counts displayed for each topic
- Maintains all filtering and interaction capabilities
        `,
      },
    },
  },
};

/**
 * List View Mode
 * Alternative layout showing keywords in a compact list format
 */
export const ListView: Story = {
  args: {
    ...Default.args,
    // Note: viewMode is handled internally via controls in the component
    data: smallDataset,
  },
  parameters: {
    docs: {
      description: {
        story: `
Compact list view for detailed analysis of keyword metrics.

**Layout Features:**
- Space-efficient vertical layout
- Same atomic HeatmapCell components in smaller size
- Better for detailed metric reading
- Ideal for mobile devices or narrow containers
        `,
      },
    },
  },
};

/**
 * Large Dataset
 * Demonstrates performance with many keywords
 */
export const LargeDataset: Story = {
  args: {
    ...Default.args,
    data: largeDataset,
    maxKeywords: 100,
  },
  parameters: {
    docs: {
      description: {
        story: `
Enterprise-scale performance with large keyword datasets.

**Scalability Features:**
- Smooth rendering of 100+ keywords
- Efficient filtering and search capabilities
- Maintains interactive performance
- Responsive grid automatically adjusts column counts
        `,
      },
    },
  },
};

/**
 * With Date Range
 * Shows heatmap with specific date range context
 */
export const WithDateRange: Story = {
  args: {
    ...Default.args,
    dateRange: {
      start: '2024-01-01',
      end: '2024-01-31',
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Heatmap with date range context for temporal analysis.

**Contextual Information:**
- Date range displayed in header for clarity
- Trend data more meaningful with time context
- Helps users understand when the analysis was performed
- Supports historical comparison workflows
        `,
      },
    },
  },
};

/**
 * Loading State
 * Shows skeleton UI while data is being loaded
 */
export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
Loading state with skeleton UI for better perceived performance.

**Atomic Loading:**
- Skeleton animations match final grid structure
- Maintains proper spacing and proportions
- No flash of empty content
- Professional loading experience
        `,
      },
    },
  },
};

/**
 * Error State
 * Demonstrates error handling and user feedback
 */
export const ErrorState: Story = {
  args: {
    ...Default.args,
    error: 'Failed to load keyword coverage data. Please check your connection and try again.',
  },
  parameters: {
    docs: {
      description: {
        story: `
Error state with clear messaging and recovery options.

**Error Handling:**
- Clear, actionable error message
- Maintains component structure for consistency
- No broken UI or blank screens
- User-friendly language and guidance
        `,
      },
    },
  },
};

/**
 * Non-Interactive Mode
 * Heatmap configured for display-only use cases
 */
export const NonInteractive: Story = {
  args: {
    ...Default.args,
    interactive: false,
    data: smallDataset,
  },
  parameters: {
    docs: {
      description: {
        story: `
Display-only mode for presentations or embedded views.

**Display Features:**
- No hover effects or click handlers
- Clean, minimal visual design
- Perfect for dashboards or reports
- Maintains all data visualization capabilities
        `,
      },
    },
  },
};

/**
 * Interactive Demo
 * Full-featured interactive version for testing all functionality
 */
export const InteractiveDemo: Story = {
  args: {
    ...Default.args,
    data: keywordData,
  },
  parameters: {
    docs: {
      description: {
        story: `
Interactive demo showcasing all KeywordCoverageHeatmap features.

**Try These Features:**
1. Switch between Coverage, Engagement, and Trend modes
2. Toggle topic grouping on/off
3. Filter by specific topics using the topic badges
4. Adjust the coverage threshold slider
5. Switch between grid and list view modes
6. Click on keyword cells to see detailed information
7. Hover over cells for tooltips with additional metrics
        `,
      },
    },
  },
};
