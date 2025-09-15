/**
 * System Health Dashboard Stories
 * 
 * Atomic Design Level: ORGANISM
 * Phase 5: Enterprise-Scale Operations  
 * 
 * Storybook stories for the SystemHealthDashboard organism demonstrating
 * various system health states, alert conditions, and performance scenarios
 * in an enterprise-scale admin environment.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { SystemHealthDashboard } from './SystemHealthDashboard';
import { 
  generateSystemHealthMetrics, 
  generateSystemService, 
  generateSystemHealthHistory,
  sampleData 
} from '@/lib/mock-data';
import type { SystemHealthMetrics, SystemService } from '@/lib/types';

// Generate sample data for stories
const healthyMetrics: SystemHealthMetrics = {
  ...generateSystemHealthMetrics(),
  cpu: 25.4,
  memory: 45.2,
  disk: 35.8,
  api: {
    requestRate: 1250,
    errorRate: 0.2,
    responseTime: 45.3,
  },
  database: {
    connections: 45,
    queries: 2340,
    responseTime: 12.4,
  },
  processing: {
    queueSize: 23,
    processedJobs: 15420,
    failedJobs: 2,
    throughput: 245,
  }
};

const stressedMetrics: SystemHealthMetrics = {
  ...generateSystemHealthMetrics(),
  cpu: 87.3,
  memory: 92.1,
  disk: 78.6,
  api: {
    requestRate: 4500,
    errorRate: 8.7,
    responseTime: 450.2,
  },
  database: {
    connections: 180,
    queries: 12450,
    responseTime: 1250.8,
  },
  processing: {
    queueSize: 850,
    processedJobs: 23100,
    failedJobs: 127,
    throughput: 98,
  }
};

const criticalMetrics: SystemHealthMetrics = {
  ...generateSystemHealthMetrics(),
  cpu: 96.8,
  memory: 98.2,
  disk: 95.4,
  api: {
    requestRate: 8900,
    errorRate: 25.3,
    responseTime: 2340.7,
  },
  database: {
    connections: 195,
    queries: 45600,
    responseTime: 4500.2,
  },
  processing: {
    queueSize: 2340,
    processedJobs: 12300,
    failedJobs: 890,
    throughput: 15,
  }
};

const generateHealthyServices = (): SystemService[] => [
  { ...generateSystemService(), name: 'API Gateway', status: 'healthy' },
  { ...generateSystemService(), name: 'Database Primary', status: 'healthy' },
  { ...generateSystemService(), name: 'Cache Service', status: 'healthy' },
  { ...generateSystemService(), name: 'Message Queue', status: 'healthy' },
  { ...generateSystemService(), name: 'File Storage', status: 'healthy' },
  { ...generateSystemService(), name: 'Search Index', status: 'healthy' },
];

const generateMixedServices = (): SystemService[] => [
  { ...generateSystemService(), name: 'API Gateway', status: 'healthy' },
  { ...generateSystemService(), name: 'Database Primary', status: 'warning' },
  { ...generateSystemService(), name: 'Cache Service', status: 'critical' },
  { ...generateSystemService(), name: 'Message Queue', status: 'healthy' },
  { ...generateSystemService(), name: 'File Storage', status: 'down' },
  { ...generateSystemService(), name: 'Search Index', status: 'healthy' },
  { ...generateSystemService(), name: 'Auth Service', status: 'warning' },
  { ...generateSystemService(), name: 'Notifications', status: 'healthy' },
];

const meta = {
  title: 'Organisms/SystemHealthDashboard',
  component: SystemHealthDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# System Health Dashboard Organism

A comprehensive system health monitoring dashboard for enterprise-scale operations.

## Features

- **Real-time Metrics**: Live system performance monitoring
- **Service Status**: Individual service health tracking  
- **Performance Charts**: Historical trend visualization
- **Alert Management**: Threshold-based alerting system
- **Resource Monitoring**: CPU, memory, disk, and network tracking
- **API & Database**: Response time and error rate monitoring
- **Job Processing**: Queue management and throughput metrics

## Atomic Design

This organism composes multiple molecules and atoms:
- MetricCard molecules for key performance indicators
- StatusDot atoms for service health indicators  
- Chart organisms for performance visualization
- Badge atoms for status indicators

## Usage

Ideal for admin dashboards requiring comprehensive system monitoring
and operational oversight at enterprise scale.

## Performance

Optimized for real-time updates with configurable refresh intervals
and efficient data visualization for large-scale monitoring.
        `
      }
    }
  },
  args: {
    showServiceDetails: false,
    refreshInterval: 30000,
  },
  argTypes: {
    metrics: {
      description: 'Current system health metrics',
      control: { type: 'object' }
    },
    services: {
      description: 'Array of system services with health status',
      control: { type: 'object' }
    },
    historicalMetrics: {
      description: 'Historical metrics for trend charts',
      control: { type: 'object' }
    },
    showServiceDetails: {
      description: 'Whether to show detailed service information',
      control: { type: 'boolean' }
    },
    refreshInterval: {
      description: 'Auto-refresh interval in milliseconds',
      control: { type: 'number', min: 1000, max: 300000, step: 1000 }
    },
    onAlert: {
      description: 'Callback when metric thresholds are exceeded',
      action: 'alert-triggered'
    },
    onServiceStatusChange: {
      description: 'Callback when service status changes',
      action: 'service-status-changed'
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
} satisfies Meta<typeof SystemHealthDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default healthy system state
 * All services running normally with good performance metrics
 */
export const Healthy: Story = {
  args: {
    metrics: healthyMetrics,
    services: generateHealthyServices(),
    historicalMetrics: generateSystemHealthHistory(24).map(m => ({
      ...m,
      cpu: Math.random() * 30 + 10,
      memory: Math.random() * 20 + 30,
      disk: Math.random() * 15 + 25
    }))
  }
};

/**
 * System under stress with elevated metrics
 * Some services showing warnings, higher resource usage
 */
export const UnderStress: Story = {
  args: {
    metrics: stressedMetrics,
    services: generateMixedServices(),
    historicalMetrics: generateSystemHealthHistory(24).map(m => ({
      ...m,
      cpu: Math.random() * 30 + 60,
      memory: Math.random() * 25 + 65,
      disk: Math.random() * 20 + 60
    }))
  }
};

/**
 * Critical system state requiring immediate attention  
 * Multiple service failures, resource exhaustion
 */
export const Critical: Story = {
  args: {
    metrics: criticalMetrics,
    services: generateMixedServices().map((service, index) => ({
      ...service,
      status: index < 2 ? 'down' : index < 4 ? 'critical' : service.status
    })),
    historicalMetrics: generateSystemHealthHistory(24).map(m => ({
      ...m,
      cpu: Math.random() * 15 + 85,
      memory: Math.random() * 10 + 90,
      disk: Math.random() * 8 + 92
    }))
  }
};

/**
 * Dashboard with detailed service information
 * Shows expanded service cards with additional details
 */
export const WithServiceDetails: Story = {
  args: {
    metrics: healthyMetrics,
    services: generateHealthyServices(),
    showServiceDetails: true,
    historicalMetrics: sampleData.sampleSystemHealthHistory
  }
};

/**
 * Loading state while fetching metrics
 * Displays skeleton loading UI
 */
export const Loading: Story = {
  args: {
    metrics: healthyMetrics,
    services: generateHealthyServices(),
    loading: true
  }
};

/**
 * Error state when metrics cannot be loaded
 * Shows error message with recovery options
 */
export const Error: Story = {
  args: {
    metrics: healthyMetrics,
    services: [],
    error: 'Failed to load system health metrics. Please check your connection and try again.'
  }
};

/**
 * Minimal metrics without historical data
 * Dashboard without performance charts
 */
export const MinimalMetrics: Story = {
  args: {
    metrics: healthyMetrics,
    services: generateHealthyServices().slice(0, 4),
    historicalMetrics: []
  }
};

/**
 * Large scale deployment with many services
 * Demonstrates dashboard scalability
 */
export const LargeScale: Story = {
  args: {
    metrics: stressedMetrics,
    services: [
      ...generateMixedServices(),
      ...Array.from({ length: 12 }, () => generateSystemService())
    ],
    historicalMetrics: generateSystemHealthHistory(48),
    showServiceDetails: false
  }
};

/**
 * Real-time updates simulation
 * Demonstrates auto-refresh functionality  
 */
export const RealTimeUpdates: Story = {
  args: {
    metrics: healthyMetrics,
    services: generateHealthyServices(),
    refreshInterval: 5000, // 5 second refresh
    historicalMetrics: sampleData.sampleSystemHealthHistory
  },
  parameters: {
    docs: {
      description: {
        story: 'Simulates real-time dashboard updates with a 5-second refresh interval.'
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
    metrics: healthyMetrics,
    services: generateHealthyServices().slice(0, 6),
    historicalMetrics: sampleData.sampleSystemHealthHistory
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Dashboard layout optimized for mobile devices with responsive grid and compact cards.'
      }
    }
  }
};

/**
 * Interactive demo with all callbacks
 * Demonstrates full interactivity
 */
export const Interactive: Story = {
  args: {
    metrics: stressedMetrics,
    services: generateMixedServices(),
    historicalMetrics: sampleData.sampleSystemHealthHistory,
    showServiceDetails: true,
    onAlert: (type: string, value: number, threshold: number) => {
      console.log(`Alert: ${type} at ${value} exceeds threshold ${threshold}`);
    },
    onServiceStatusChange: (service) => {
      console.log(`Service status changed:`, service);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully interactive dashboard with all callbacks enabled. Check the console for interaction logs.'
      }
    }
  }
};
