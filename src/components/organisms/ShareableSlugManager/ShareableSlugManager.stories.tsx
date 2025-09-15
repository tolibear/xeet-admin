import type { Meta, StoryObj } from "@storybook/react";
import { ShareableSlugManager } from "./ShareableSlugManager";
import { generateLeaderboard } from "@/lib/mock-data";
import type { ShareableUrl } from "./types";

const meta: Meta<typeof ShareableSlugManager> = {
  title: "Organisms/ShareableSlugManager",
  component: ShareableSlugManager,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Comprehensive public URL sharing system with analytics, access controls, and social media integration",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShareableSlugManager>;

// Generate sample data
const sampleLeaderboard = generateLeaderboard("sample-org");

const sampleShareableUrls: ShareableUrl[] = [
  {
    id: "share-1",
    slug: "top-influencers-public",
    url: "https://leaderboards.xeet.co/top-influencers-public",
    name: "Main Public Link",
    description: "Primary public sharing URL for the leaderboard",
    isActive: true,
    access: {
      requiresPassword: false,
      allowedDomains: [],
    },
    analytics: {
      totalViews: 1547,
      uniqueViews: 892,
      viewsLast24h: 47,
      viewsLast7d: 312,
      viewsLast30d: 1205,
      recentViews: [
        { timestamp: "2024-01-22T10:30:00Z", ipHash: "abc123", location: "New York, US" },
        { timestamp: "2024-01-22T09:15:00Z", ipHash: "def456", location: "London, UK" },
        { timestamp: "2024-01-22T08:45:00Z", ipHash: "ghi789", location: "Tokyo, JP" },
      ],
      referrers: {
        "twitter.com": 425,
        "linkedin.com": 312,
        "direct": 810,
      },
      geoDistribution: {
        "US": 623,
        "UK": 287,
        "CA": 156,
        "DE": 134,
      },
    },
    createdBy: "admin@xeet.co",
    createdAt: "2024-01-15T14:20:00Z",
    updatedAt: "2024-01-20T09:30:00Z",
  },
  {
    id: "share-2", 
    slug: "weekly-leaders-protected",
    url: "https://leaderboards.xeet.co/weekly-leaders-protected",
    name: "Protected Share Link",
    description: "Password-protected URL for internal sharing",
    isActive: true,
    access: {
      requiresPassword: true,
      passwordHash: "hashed-password",
      allowedDomains: ["company.com", "partner.com"],
    },
    analytics: {
      totalViews: 234,
      uniqueViews: 167,
      viewsLast24h: 12,
      viewsLast7d: 89,
      viewsLast30d: 234,
      recentViews: [
        { timestamp: "2024-01-22T11:00:00Z", ipHash: "xyz123", location: "San Francisco, US" },
        { timestamp: "2024-01-21T16:30:00Z", ipHash: "uvw456", location: "Austin, US" },
      ],
      referrers: {
        "company.com": 156,
        "partner.com": 78,
      },
      geoDistribution: {
        "US": 198,
        "CA": 36,
      },
    },
    createdBy: "manager@xeet.co",
    createdAt: "2024-01-18T11:45:00Z",
    updatedAt: "2024-01-21T15:20:00Z",
  },
  {
    id: "share-3",
    slug: "temp-preview-link",
    url: "https://leaderboards.xeet.co/temp-preview-link",
    name: "Temporary Preview",
    description: "Short-term preview link for testing",
    isActive: false,
    access: {
      requiresPassword: false,
      maxViews: 100,
    },
    analytics: {
      totalViews: 45,
      uniqueViews: 38,
      viewsLast24h: 0,
      viewsLast7d: 5,
      viewsLast30d: 45,
      recentViews: [],
      referrers: {
        "direct": 45,
      },
      geoDistribution: {
        "US": 45,
      },
    },
    createdBy: "developer@xeet.co",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-19T14:30:00Z",
    expiresAt: "2024-01-20T00:00:00Z",
  },
];

export const Default: Story = {
  args: {
    leaderboard: sampleLeaderboard,
    shareableUrls: sampleShareableUrls,
  },
};

export const WithPermissions: Story = {
  args: {
    leaderboard: sampleLeaderboard,
    shareableUrls: sampleShareableUrls,
    canCreate: true,
    canEdit: true,
    canDelete: true,
  },
};

export const ReadOnlyMode: Story = {
  args: {
    leaderboard: sampleLeaderboard,
    shareableUrls: sampleShareableUrls,
    canCreate: false,
    canEdit: false,
    canDelete: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Read-only mode for users without sharing permissions",
      },
    },
  },
};

export const EmptyState: Story = {
  args: {
    leaderboard: sampleLeaderboard,
    shareableUrls: [],
    canCreate: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no shareable URLs exist",
      },
    },
  },
};

export const SingleUrl: Story = {
  args: {
    leaderboard: sampleLeaderboard,
    shareableUrls: [sampleShareableUrls[0]],
  },
  parameters: {
    docs: {
      description: {
        story: "Simple case with a single public sharing URL",
      },
    },
  },
};

export const ManyUrls: Story = {
  args: {
    leaderboard: sampleLeaderboard,
    shareableUrls: [
      ...sampleShareableUrls,
      {
        id: "share-4",
        slug: "social-media-campaign",
        url: "https://leaderboards.xeet.co/social-media-campaign",
        name: "Social Media Campaign",
        description: "Special URL for social media marketing campaign",
        isActive: true,
        access: { requiresPassword: false },
        analytics: {
          totalViews: 2847,
          uniqueViews: 1923,
          viewsLast24h: 234,
          viewsLast7d: 1205,
          viewsLast30d: 2847,
          recentViews: [],
          referrers: { "twitter.com": 1847, "facebook.com": 1000 },
          geoDistribution: { "US": 1423, "UK": 567, "CA": 857 },
        },
        createdBy: "marketing@xeet.co",
        createdAt: "2024-01-05T10:00:00Z",
        updatedAt: "2024-01-22T08:00:00Z",
      },
      {
        id: "share-5",
        slug: "partner-exclusive",
        url: "https://leaderboards.xeet.co/partner-exclusive", 
        name: "Partner Exclusive",
        description: "Exclusive access for business partners",
        isActive: true,
        access: {
          requiresPassword: true,
          allowedDomains: ["partner1.com", "partner2.com"],
        },
        analytics: {
          totalViews: 156,
          uniqueViews: 89,
          viewsLast24h: 8,
          viewsLast7d: 34,
          viewsLast30d: 156,
          recentViews: [],
          referrers: { "partner1.com": 89, "partner2.com": 67 },
          geoDistribution: { "US": 89, "UK": 67 },
        },
        createdBy: "partnerships@xeet.co",
        createdAt: "2024-01-12T15:30:00Z",
        updatedAt: "2024-01-20T12:00:00Z",
      },
    ],
    canCreate: true,
    canEdit: true,
    canDelete: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates management of multiple sharing URLs with different configurations",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    leaderboard: sampleLeaderboard,
    shareableUrls: sampleShareableUrls,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    leaderboard: sampleLeaderboard,
    shareableUrls: sampleShareableUrls,
    error: "Failed to load shareable URLs",
  },
};

export const Interactive: Story = {
  args: {
    leaderboard: sampleLeaderboard,
    shareableUrls: sampleShareableUrls,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    onCreateSlug: (config) => {
      console.log("Create slug:", config);
      alert(`Creating new share URL: "${config.name}"`);
    },
    onUpdateSlug: (id, config) => {
      console.log("Update slug:", id, config);
      alert(`Updating share URL: ${id}`);
    },
    onDeleteSlug: (id) => {
      console.log("Delete slug:", id);
      alert(`Deleting share URL: ${id}`);
    },
    onCopySlug: (url) => {
      console.log("Copy URL:", url);
      alert(`Copied to clipboard: ${url}`);
    },
  },
};

export const HighTrafficUrl: Story = {
  args: {
    leaderboard: sampleLeaderboard,
    shareableUrls: [
      {
        ...sampleShareableUrls[0],
        name: "Viral Leaderboard Link",
        analytics: {
          ...sampleShareableUrls[0].analytics,
          totalViews: 47329,
          uniqueViews: 28471,
          viewsLast24h: 1247,
          viewsLast7d: 8934,
          viewsLast30d: 35628,
          referrers: {
            "twitter.com": 18932,
            "reddit.com": 12847,
            "hacker-news.com": 8394,
            "linkedin.com": 4728,
            "direct": 2428,
          },
        },
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Example of a high-traffic shareable URL with substantial analytics data",
      },
    },
  },
};

export const ExpiredAndInactiveUrls: Story = {
  args: {
    leaderboard: sampleLeaderboard,
    shareableUrls: [
      sampleShareableUrls[2], // Expired URL
      {
        ...sampleShareableUrls[1],
        isActive: false,
        name: "Deactivated Campaign Link",
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "Shows how expired and inactive URLs are displayed differently",
      },
    },
  },
};
