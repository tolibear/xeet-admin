import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { ModerationQueue } from "./ModerationQueue";

const meta = {
  title: "Organisms/ModerationQueue",
  component: ModerationQueue,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
ModerationQueue is a comprehensive organism for managing leaderboard moderation requests. It provides:

**Key Features:**
- **Statistics Overview**: Real-time moderation queue stats and performance metrics
- **Bulk Operations**: Select multiple items for batch approval/rejection
- **Advanced Filtering**: Filter by status, priority, type, and search terms
- **Detailed Review**: Full audit trail and detailed item inspection
- **Priority Management**: Visual priority indicators with urgent flags
- **Audit Trail**: Complete history of all actions on each moderation item

**Galaxy-Scale Capabilities:**
- Handles thousands of moderation items with virtualized scrolling
- Real-time updates and notifications for new submissions
- Comprehensive search and filtering for large queues
- Bulk operations for efficient moderation workflow

**Accessibility Features:**
- Full keyboard navigation support
- Screen reader compatible with proper ARIA labels
- High contrast indicators for priorities and statuses
- Focus management in modals and dialogs

Use this organism when you need comprehensive moderation management functionality at scale.
        `,
      },
    },
  },
  args: {
    onModerate: fn(),
    onBulkModerate: fn(),
    onFiltersChange: fn(),
  },
} satisfies Meta<typeof ModerationQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const EmptyQueue: Story = {
  args: {
    items: [],
    stats: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      avgResponseTime: 0,
      backlogHours: 0,
    },
  },
};

export const HighVolumeQueue: Story = {
  args: {
    stats: {
      total: 2847,
      pending: 156,
      approved: 2341,
      rejected: 350,
      avgResponseTime: 2.3,
      backlogHours: 12.5,
    },
  },
};

export const UrgentPriority: Story = {
  args: {
    items: [
      {
        id: 'urgent-1',
        leaderboardId: 'lb-urgent',
        leaderboardName: 'Critical Security Leaderboard',
        submittedBy: 'security@company.com',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        type: 'update' as const,
        status: 'pending' as const,
        priority: 'urgent' as const,
        description: 'Emergency update to scoring weights due to security vulnerability detection',
        auditTrail: [
          {
            id: 'audit-urgent-1',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            action: 'submitted',
            userId: 'security@company.com',
            userRole: 'security_team',
            details: 'Urgent security update submitted for immediate review',
          },
        ],
      },
      {
        id: 'urgent-2',
        leaderboardId: 'lb-critical',
        leaderboardName: 'High-Impact Public Leaderboard',
        submittedBy: 'ops@company.com',
        submittedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 min ago
        type: 'delete' as const,
        status: 'pending' as const,
        priority: 'high' as const,
        description: 'Remove malicious entries detected by automated systems',
        auditTrail: [
          {
            id: 'audit-urgent-2',
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            action: 'submitted',
            userId: 'ops@company.com',
            userRole: 'operations',
            details: 'High priority removal request for content policy violations',
          },
        ],
      },
    ],
  },
};

export const WithModerationHistory: Story = {
  args: {
    items: [
      {
        id: 'moderated-1',
        leaderboardId: 'lb-complete',
        leaderboardName: 'Gaming Achievement Leaderboard',
        submittedBy: 'user@example.com',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        type: 'create' as const,
        status: 'approved' as const,
        priority: 'medium' as const,
        description: 'Create new leaderboard for gaming achievements tracking',
        moderatedBy: 'moderator@company.com',
        moderatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        moderationNotes: 'Approved after verification of game API integration and data sources. All compliance checks passed.',
        auditTrail: [
          {
            id: 'audit-complete-1',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'submitted',
            userId: 'user@example.com',
            userRole: 'user',
            details: 'Initial submission for new gaming leaderboard',
          },
          {
            id: 'audit-complete-2',
            timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'reviewed',
            userId: 'moderator@company.com',
            userRole: 'moderator',
            details: 'Under review - checking game API integration',
          },
          {
            id: 'audit-complete-3',
            timestamp: new Date(Date.now() - 2.2 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'commented',
            userId: 'moderator@company.com',
            userRole: 'moderator',
            details: 'Requested additional documentation for data sources',
          },
          {
            id: 'audit-complete-4',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            action: 'approved',
            userId: 'moderator@company.com',
            userRole: 'moderator',
            details: 'Approved - all requirements met and documentation complete',
          },
        ],
      },
    ],
  },
};
