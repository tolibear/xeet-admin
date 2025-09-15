/**
 * Job Queue Manager Stories
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Enterprise-Scale Operations
 * 
 * Storybook stories for the JobQueueManager organism demonstrating
 * various queue states, job management scenarios, and operational
 * conditions in an enterprise-scale background processing environment.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { JobQueueManager } from './JobQueueManager';
import { 
  generateJobQueue, 
  generateBackfillJob,
  sampleData 
} from '@/lib/mock-data';
import type { JobQueue, BackfillJob } from '@/lib/types';

// Generate sample data for different scenarios
const healthyQueues: JobQueue[] = [
  {
    ...generateJobQueue(),
    name: 'scoring-queue',
    status: 'active',
    size: 45,
    rate: 120.5,
    priority: 'high'
  },
  {
    ...generateJobQueue(),
    name: 'indexing-queue', 
    status: 'active',
    size: 23,
    rate: 85.2,
    priority: 'normal'
  },
  {
    ...generateJobQueue(),
    name: 'notification-queue',
    status: 'active',
    size: 12,
    rate: 150.8,
    priority: 'normal'
  },
  {
    ...generateJobQueue(),
    name: 'export-queue',
    status: 'active',
    size: 8,
    rate: 45.3,
    priority: 'low'
  },
  {
    ...generateJobQueue(),
    name: 'analytics-queue',
    status: 'active', 
    size: 67,
    rate: 95.7,
    priority: 'critical'
  },
  {
    ...generateJobQueue(),
    name: 'cleanup-queue',
    status: 'active',
    size: 5,
    rate: 25.1,
    priority: 'low'
  }
];

const problemQueues: JobQueue[] = [
  {
    ...generateJobQueue(),
    name: 'scoring-queue',
    status: 'paused',
    size: 2340,
    rate: 0,
    priority: 'high',
    jobTypes: [
      { name: 'score_post', count: 1200, avgProcessingTime: 5500, failureRate: 15.2 },
      { name: 'update_metrics', count: 890, avgProcessingTime: 3200, failureRate: 8.7 },
      { name: 'calculate_trends', count: 250, avgProcessingTime: 12000, failureRate: 25.8 }
    ]
  },
  {
    ...generateJobQueue(),
    name: 'indexing-queue',
    status: 'stopped',
    size: 0,
    rate: 0,
    priority: 'critical',
    jobTypes: []
  },
  {
    ...generateJobQueue(),
    name: 'notification-queue',
    status: 'active',
    size: 1890,
    rate: 12.3,
    priority: 'normal',
    jobTypes: [
      { name: 'send_email', count: 1200, avgProcessingTime: 2100, failureRate: 35.5 },
      { name: 'push_notification', count: 690, avgProcessingTime: 800, failureRate: 12.1 }
    ]
  }
];

const sampleRunningJobs: BackfillJob[] = [
  {
    ...generateBackfillJob(),
    name: 'Historical Post Scoring',
    status: 'running',
    progress: 65,
    recordsProcessed: 650000,
    totalRecords: 1000000,
    startTime: new Date(Date.now() - 3600000).toISOString(),
    duration: 3600
  },
  {
    ...generateBackfillJob(),
    name: 'User Index Rebuild',
    status: 'running',
    progress: 23,
    recordsProcessed: 115000,
    totalRecords: 500000,
    startTime: new Date(Date.now() - 1800000).toISOString(),
    duration: 1800
  },
  {
    ...generateBackfillJob(),
    name: 'Analytics Recalculation',
    status: 'completed',
    progress: 100,
    recordsProcessed: 250000,
    totalRecords: 250000,
    startTime: new Date(Date.now() - 7200000).toISOString(),
    endTime: new Date(Date.now() - 3600000).toISOString(),
    duration: 3600
  },
  {
    ...generateBackfillJob(),
    name: 'Topic Migration',
    status: 'failed',
    progress: 15,
    recordsProcessed: 75000,
    totalRecords: 500000,
    startTime: new Date(Date.now() - 5400000).toISOString(),
    endTime: new Date(Date.now() - 4800000).toISOString(),
    duration: 600,
    error: 'Database connection timeout during batch processing'
  },
  {
    ...generateBackfillJob(),
    name: 'Cache Refresh',
    status: 'pending',
    progress: 0,
    recordsProcessed: 0,
    totalRecords: 100000
  }
];

const largeScaleJobs: BackfillJob[] = Array.from({ length: 25 }, (_, i) => ({
  ...generateBackfillJob(),
  name: `Batch Job ${i + 1}`,
  progress: Math.floor(Math.random() * 100)
}));

const meta = {
  title: 'Organisms/JobQueueManager',
  component: JobQueueManager,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Job Queue Manager Organism

A comprehensive job queue management system for enterprise-scale background processing operations.

## Features

- **Multi-Queue Monitoring**: Real-time status of multiple job queues
- **Job Lifecycle Tracking**: Complete visibility into job execution states
- **Queue Management Controls**: Pause, resume, stop, and clear queue operations
- **Performance Metrics**: Throughput, failure rates, and processing statistics
- **Bulk Operations**: Batch job management and bulk actions
- **Retry Mechanisms**: Intelligent job retry and failure recovery
- **Priority Management**: Priority-based queue processing
- **Real-time Updates**: Live monitoring with configurable refresh intervals

## Atomic Design

This organism composes multiple molecules and atoms:
- MetricCard molecules for key performance indicators
- DataTable organism for detailed job management
- StatusDot atoms for queue health indicators
- Progress atoms for job completion tracking
- Badge atoms for status and priority indicators

## Usage

Essential for admin dashboards requiring comprehensive background job
monitoring and management at enterprise scale.

## Performance

Optimized for real-time updates, large-scale job processing monitoring,
and efficient bulk operations management.
        `
      }
    }
  },
  args: {
    autoRefresh: true,
    refreshInterval: 5000,
    showControls: true,
  },
  argTypes: {
    queues: {
      description: 'Array of job queues to monitor',
      control: { type: 'object' }
    },
    jobs: {
      description: 'Array of jobs for monitoring and management',
      control: { type: 'object' }
    },
    autoRefresh: {
      description: 'Whether to auto-refresh queue data',
      control: { type: 'boolean' }
    },
    refreshInterval: {
      description: 'Auto-refresh interval in milliseconds',
      control: { type: 'number', min: 1000, max: 60000, step: 1000 }
    },
    showControls: {
      description: 'Whether to show queue management controls',
      control: { type: 'boolean' }
    },
    onQueueToggle: {
      description: 'Callback when queue is paused/resumed/stopped',
      action: 'queue-action'
    },
    onJobRetry: {
      description: 'Callback when job is retried',
      action: 'job-retry'
    },
    onJobCancel: {
      description: 'Callback when job is cancelled',
      action: 'job-cancel'
    },
    onBulkAction: {
      description: 'Callback when bulk action is performed',
      action: 'bulk-action'
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
} satisfies Meta<typeof JobQueueManager>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default healthy queue management state
 * All queues running normally with good performance
 */
export const Healthy: Story = {
  args: {
    queues: healthyQueues,
    jobs: sampleRunningJobs
  }
};

/**
 * Queues experiencing problems
 * Some queues paused, stopped, or backing up
 */
export const ProblematicQueues: Story = {
  args: {
    queues: problemQueues,
    jobs: sampleRunningJobs.map(job => ({
      ...job,
      status: Math.random() > 0.7 ? 'failed' : job.status
    }))
  }
};

/**
 * High volume processing scenario
 * Many queues with high throughput and job counts
 */
export const HighVolume: Story = {
  args: {
    queues: healthyQueues.map(queue => ({
      ...queue,
      size: queue.size * 10,
      rate: queue.rate * 3
    })),
    jobs: largeScaleJobs
  }
};

/**
 * Queue management without controls
 * Read-only monitoring interface
 */
export const ReadOnlyMonitoring: Story = {
  args: {
    queues: healthyQueues,
    jobs: sampleRunningJobs,
    showControls: false
  }
};

/**
 * System under maintenance
 * Most queues stopped or paused for maintenance
 */
export const MaintenanceMode: Story = {
  args: {
    queues: healthyQueues.map((queue, index) => ({
      ...queue,
      status: index < 2 ? 'stopped' : 'paused',
      size: 0,
      rate: 0
    })),
    jobs: sampleRunningJobs.map(job => ({
      ...job,
      status: job.status === 'running' ? 'cancelled' : job.status
    }))
  }
};

/**
 * Loading state while fetching queue data
 * Displays skeleton loading UI
 */
export const Loading: Story = {
  args: {
    queues: healthyQueues,
    jobs: sampleRunningJobs,
    loading: true
  }
};

/**
 * Error state when queue data cannot be loaded
 * Shows error message with recovery options
 */
export const Error: Story = {
  args: {
    queues: [],
    jobs: [],
    error: 'Failed to connect to job queue service. Please check the service status and try again.'
  }
};

/**
 * Minimal queues for focused monitoring
 * Small number of queues for specific use cases
 */
export const MinimalQueues: Story = {
  args: {
    queues: healthyQueues.slice(0, 3),
    jobs: sampleRunningJobs.slice(0, 3)
  }
};

/**
 * Critical queue failures
 * Multiple queues down with failed jobs
 */
export const CriticalFailures: Story = {
  args: {
    queues: problemQueues.map(queue => ({
      ...queue,
      status: 'stopped',
      size: Math.max(queue.size, 500),
      jobTypes: queue.jobTypes.map(jt => ({
        ...jt,
        failureRate: Math.min(jt.failureRate * 2, 45)
      }))
    })),
    jobs: sampleRunningJobs.map(job => ({
      ...job,
      status: Math.random() > 0.8 ? 'completed' : 'failed',
      error: job.status === 'failed' || Math.random() > 0.8 ? 'System overload - processing timeout' : undefined
    }))
  }
};

/**
 * Fast refresh for real-time monitoring
 * Very frequent updates for critical monitoring
 */
export const FastRefresh: Story = {
  args: {
    queues: healthyQueues,
    jobs: sampleRunningJobs,
    refreshInterval: 1000, // 1 second refresh
    autoRefresh: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates high-frequency real-time monitoring with 1-second refresh interval.'
      }
    }
  }
};

/**
 * Mobile responsive layout
 * Optimized for smaller screens
 */
export const MobileLayout: Story = {
  args: {
    queues: healthyQueues.slice(0, 4),
    jobs: sampleRunningJobs.slice(0, 5)
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Queue manager layout optimized for mobile devices with responsive cards and compact tables.'
      }
    }
  }
};

/**
 * Interactive demo with all callbacks
 * Demonstrates full queue management functionality
 */
export const Interactive: Story = {
  args: {
    queues: problemQueues,
    jobs: sampleRunningJobs,
    showControls: true,
    onQueueToggle: (queueId: string, action: string) => {
      console.log(`Queue ${action}:`, queueId);
    },
    onJobRetry: (jobId: string) => {
      console.log('Job retry:', jobId);
    },
    onJobCancel: (jobId: string) => {
      console.log('Job cancel:', jobId);
    },
    onBulkAction: (action: string, jobIds: string[]) => {
      console.log(`Bulk ${action}:`, jobIds);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive job queue manager with all controls enabled. Check the console for interaction logs.'
      }
    }
  }
};
