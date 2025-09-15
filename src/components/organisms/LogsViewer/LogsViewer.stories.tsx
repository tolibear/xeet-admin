/**
 * Logs Viewer Stories
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Enterprise-Scale Operations
 * 
 * Storybook stories for the LogsViewer organism demonstrating
 * various logging scenarios, filtering capabilities, and real-time
 * monitoring conditions in an enterprise-scale operations environment.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { LogsViewer } from './LogsViewer';
import { 
  generateLogEntry,
  sampleData 
} from '@/lib/mock-data';
import type { LogEntry } from '@/lib/types';

// Generate different types of sample logs
const generateInfoLogs = (count: number): LogEntry[] => 
  Array.from({ length: count }, () => ({
    ...generateLogEntry(),
    level: 'info',
    message: `User ${Math.random().toString(36).substr(2, 9)} logged in successfully`,
    service: 'auth'
  }));

const generateErrorLogs = (count: number): LogEntry[] => 
  Array.from({ length: count }, () => ({
    ...generateLogEntry(),
    level: 'error',
    message: `Database connection failed: Connection timeout after 30 seconds`,
    service: 'database',
    metadata: {
      errorCode: 'CONN_TIMEOUT',
      retryCount: Math.floor(Math.random() * 3),
      query: 'SELECT * FROM posts WHERE created_at > ?'
    }
  }));

const generateWarningLogs = (count: number): LogEntry[] => 
  Array.from({ length: count }, () => ({
    ...generateLogEntry(),
    level: 'warn',
    message: `High memory usage detected: ${Math.floor(Math.random() * 20 + 80)}% of available memory`,
    service: 'worker',
    metadata: {
      memoryUsage: Math.floor(Math.random() * 1000 + 7000),
      threshold: 8000,
      processId: Math.floor(Math.random() * 10000)
    }
  }));

const generateDebugLogs = (count: number): LogEntry[] => 
  Array.from({ length: count }, () => ({
    ...generateLogEntry(),
    level: 'debug',
    message: `Cache hit for key: user_profile_${Math.random().toString(36).substr(2, 9)}`,
    service: 'cache'
  }));

const mixedLogs: LogEntry[] = [
  ...generateInfoLogs(50),
  ...generateErrorLogs(15),
  ...generateWarningLogs(25),
  ...generateDebugLogs(30)
].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

const realtimeLogs: LogEntry[] = Array.from({ length: 200 }, (_, i) => ({
  ...generateLogEntry(),
  timestamp: new Date(Date.now() - (200 - i) * 1000).toISOString(),
  level: ['info', 'warn', 'error', 'debug'][Math.floor(Math.random() * 4)] as LogEntry['level'],
  service: ['api', 'worker', 'database', 'cache', 'auth'][Math.floor(Math.random() * 5)]
}));

const errorHeavyLogs: LogEntry[] = Array.from({ length: 100 }, () => ({
  ...generateLogEntry(),
  level: Math.random() > 0.4 ? 'error' : 'warn',
  message: Math.random() > 0.5 
    ? 'Internal server error: Unable to process request'
    : 'Rate limit exceeded for user',
  service: Math.random() > 0.5 ? 'api' : 'auth'
}));

const structuredLogs: LogEntry[] = Array.from({ length: 80 }, () => ({
  ...generateLogEntry(),
  level: 'info',
  service: 'api',
  message: `API request processed: ${Math.random() > 0.5 ? 'POST' : 'GET'} /api/v1/posts`,
  metadata: {
    method: Math.random() > 0.5 ? 'POST' : 'GET',
    endpoint: '/api/v1/posts',
    statusCode: Math.random() > 0.8 ? 500 : 200,
    responseTime: Math.floor(Math.random() * 1000 + 50),
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ip: `192.168.1.${Math.floor(Math.random() * 255)}`
  }
}));

const meta = {
  title: 'Organisms/LogsViewer',
  component: LogsViewer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Logs Viewer Organism

A comprehensive log viewing system for enterprise-scale operations monitoring.

## Features

- **Real-time Streaming**: Live log updates with tail mode
- **Advanced Filtering**: Multi-level filtering by service, level, time range
- **Full-text Search**: Powerful search with regex support and highlighting
- **Log Analytics**: Statistics, error rates, and service breakdown
- **Export Capabilities**: JSON, CSV, and plain text export options
- **Performance Optimized**: Virtual scrolling for large log volumes
- **Request Tracing**: Correlation by request ID and user context
- **Auto-scroll Control**: Manual and automatic scrolling modes

## Atomic Design

This organism composes multiple molecules and atoms:
- SearchBox molecule for log search functionality
- FilterChip molecules for filter selection
- StatusDot atoms for log level indicators
- Badge atoms for log statistics and counts
- Card atoms for structured layout sections

## Usage

Essential for admin dashboards requiring comprehensive log monitoring,
debugging, and operational oversight at enterprise scale.

## Performance

Optimized for high-volume log processing with virtual scrolling,
efficient filtering, and real-time streaming capabilities.
        `
      }
    }
  },
  args: {
    tailMode: false,
    autoScroll: false,
    maxLogs: 1000,
    showStats: true,
    showExport: true,
  },
  argTypes: {
    logs: {
      description: 'Array of log entries to display',
      control: { type: 'object' }
    },
    tailMode: {
      description: 'Whether to enable real-time tail mode',
      control: { type: 'boolean' }
    },
    autoScroll: {
      description: 'Whether to auto-scroll to new logs',
      control: { type: 'boolean' }
    },
    maxLogs: {
      description: 'Maximum number of logs to display',
      control: { type: 'number', min: 100, max: 10000, step: 100 }
    },
    levelFilter: {
      description: 'Log levels to show by default',
      control: { type: 'object' }
    },
    serviceFilter: {
      description: 'Services to show by default',
      control: { type: 'object' }
    },
    searchQuery: {
      description: 'Default search query',
      control: { type: 'text' }
    },
    showStats: {
      description: 'Whether to show log statistics panel',
      control: { type: 'boolean' }
    },
    showExport: {
      description: 'Whether to show export controls',
      control: { type: 'boolean' }
    },
    onFiltersChange: {
      description: 'Callback when filters change',
      action: 'filters-changed'
    },
    onSearchChange: {
      description: 'Callback when search query changes',
      action: 'search-changed'
    },
    onTailToggle: {
      description: 'Callback when tail mode is toggled',
      action: 'tail-toggled'
    },
    onExport: {
      description: 'Callback when logs are exported',
      action: 'logs-exported'
    },
    onLogClick: {
      description: 'Callback when log entry is clicked',
      action: 'log-clicked'
    },
    loading: {
      description: 'Loading state',
      control: { type: 'boolean' }
    },
    error: {
      description: 'Error message to display',
      control: { type: 'text' }
    }
  }
} satisfies Meta<typeof LogsViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default logs viewer with mixed log levels
 * Shows typical log monitoring scenario
 */
export const Default: Story = {
  args: {
    logs: mixedLogs
  }
};

/**
 * Real-time tail mode demonstration
 * Shows live log streaming with auto-scroll
 */
export const RealtimeTailMode: Story = {
  args: {
    logs: realtimeLogs,
    tailMode: true,
    autoScroll: true
  }
};

/**
 * Error-heavy logs for debugging scenarios
 * High concentration of errors and warnings
 */
export const ErrorDebugging: Story = {
  args: {
    logs: errorHeavyLogs,
    levelFilter: ['error', 'warn']
  }
};

/**
 * Large volume log monitoring
 * Demonstrates performance with high log count
 */
export const HighVolume: Story = {
  args: {
    logs: Array.from({ length: 2000 }, () => generateLogEntry()),
    maxLogs: 2000
  }
};

/**
 * Filtered view showing only specific services
 * Demonstrates service-specific monitoring
 */
export const ServiceFiltered: Story = {
  args: {
    logs: mixedLogs,
    serviceFilter: ['api', 'database']
  }
};

/**
 * Search functionality demonstration
 * Shows search highlighting and filtering
 */
export const WithSearch: Story = {
  args: {
    logs: structuredLogs,
    searchQuery: 'POST'
  }
};

/**
 * Minimal logs viewer without extra features
 * Clean interface focusing on log display
 */
export const Minimal: Story = {
  args: {
    logs: mixedLogs.slice(0, 50),
    showStats: false,
    showExport: false
  }
};

/**
 * Debug-level logs for development
 * Shows detailed debugging information
 */
export const DebugLogs: Story = {
  args: {
    logs: generateDebugLogs(100),
    levelFilter: ['debug']
  }
};

/**
 * System monitoring view
 * Mix of system-level logs and metrics
 */
export const SystemMonitoring: Story = {
  args: {
    logs: [
      ...generateInfoLogs(40).map(log => ({
        ...log,
        service: 'system',
        message: `System health check passed: All services operational`
      })),
      ...generateWarningLogs(20).map(log => ({
        ...log,
        service: 'monitor',
        message: `CPU usage elevated: ${Math.floor(Math.random() * 20 + 70)}%`
      }))
    ]
  }
};

/**
 * Loading state while fetching logs
 * Shows skeleton loading interface
 */
export const Loading: Story = {
  args: {
    logs: [],
    loading: true
  }
};

/**
 * Error state when logs cannot be loaded
 * Shows error message and recovery options
 */
export const Error: Story = {
  args: {
    logs: [],
    error: 'Failed to connect to log service. Please check your connection and try again.'
  }
};

/**
 * Empty logs state
 * No logs available for current filters
 */
export const Empty: Story = {
  args: {
    logs: []
  }
};

/**
 * API-focused logs with structured data
 * Shows request/response logging patterns
 */
export const APILogs: Story = {
  args: {
    logs: structuredLogs,
    serviceFilter: ['api']
  }
};

/**
 * Authentication logs monitoring
 * Security-focused log monitoring
 */
export const AuthLogs: Story = {
  args: {
    logs: [
      ...generateInfoLogs(30).map(log => ({
        ...log,
        service: 'auth',
        message: 'User authentication successful'
      })),
      ...generateErrorLogs(10).map(log => ({
        ...log,
        service: 'auth',
        message: 'Authentication failed: Invalid credentials'
      }))
    ]
  }
};

/**
 * Mobile responsive layout
 * Optimized for smaller screens
 */
export const MobileLayout: Story = {
  args: {
    logs: mixedLogs.slice(0, 50),
    showStats: false
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Logs viewer layout optimized for mobile devices with responsive design and compact interface.'
      }
    }
  }
};

/**
 * Interactive demo with all features
 * Demonstrates full log viewer functionality
 */
export const Interactive: Story = {
  args: {
    logs: mixedLogs,
    tailMode: true,
    autoScroll: true,
    showStats: true,
    showExport: true,
    onFiltersChange: (filters) => {
      console.log('Filters changed:', filters);
    },
    onSearchChange: (query) => {
      console.log('Search query:', query);
    },
    onTailToggle: (enabled) => {
      console.log('Tail mode:', enabled);
    },
    onExport: (format, logs) => {
      console.log(`Export ${logs.length} logs as ${format}`);
    },
    onLogClick: (log) => {
      console.log('Log clicked:', log);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive logs viewer with all features enabled. Check the console for interaction logs.'
      }
    }
  }
};
