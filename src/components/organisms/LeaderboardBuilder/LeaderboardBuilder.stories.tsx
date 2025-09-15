import type { Meta, StoryObj } from "@storybook/react";
import { LeaderboardBuilder } from "./LeaderboardBuilder";
import { generateTopics, mockData } from "@/lib/mock-data";
import type { Platform, SignalType } from "@/lib/types";

const meta: Meta<typeof LeaderboardBuilder> = {
  title: "Organisms/LeaderboardBuilder",
  component: LeaderboardBuilder,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Comprehensive leaderboard creation system built from atomic form components with validation and preview capabilities",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LeaderboardBuilder>;

// Mock data
const samplePlatforms: Platform[] = [
  { id: "twitter", name: "Twitter", slug: "twitter", icon: "twitter", color: "#1DA1F2" },
  { id: "linkedin", name: "LinkedIn", slug: "linkedin", icon: "linkedin", color: "#0A66C2" },
  { id: "reddit", name: "Reddit", slug: "reddit", icon: "reddit", color: "#FF4500" },
  { id: "instagram", name: "Instagram", slug: "instagram", icon: "instagram", color: "#E4405F" },
  { id: "tiktok", name: "TikTok", slug: "tiktok", icon: "tiktok", color: "#000000" },
];

const sampleTopics = generateTopics(15);

const sampleSignalTypes: SignalType[] = [
  "engagement",
  "sentiment", 
  "reach",
  "influence",
  "relevance",
  "quality",
];

export const Default: Story = {
  args: {
    platforms: samplePlatforms,
    topics: sampleTopics,
    signalTypes: sampleSignalTypes,
  },
};

export const WithInitialData: Story = {
  args: {
    platforms: samplePlatforms,
    topics: sampleTopics,
    signalTypes: sampleSignalTypes,
    initialData: {
      name: "Top Influencers Weekly",
      description: "Weekly ranking of top social media influencers based on engagement and reach",
      slug: "top-influencers-weekly",
      isPublic: true,
      criteria: {
        timeframe: "week",
        platforms: ["twitter", "linkedin"],
        topics: [sampleTopics[0]?.name, sampleTopics[1]?.name].filter(Boolean),
        signals: ["engagement", "reach", "influence"],
        minScore: 25,
        maxEntries: 100,
      },
      settings: {
        updateFrequency: "daily",
        showScores: true,
        showChange: true,
        allowEmbedding: true,
      },
    },
    isEditing: true,
  },
};

export const EditMode: Story = {
  args: {
    platforms: samplePlatforms,
    topics: sampleTopics,
    signalTypes: sampleSignalTypes,
    initialData: mockData.sampleLeaderboard,
    isEditing: true,
    showPreview: true,
  },
};

export const ReadOnlyMode: Story = {
  args: {
    platforms: samplePlatforms,
    topics: sampleTopics,
    signalTypes: sampleSignalTypes,
    initialData: mockData.sampleLeaderboard,
    readOnly: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Read-only mode for viewing leaderboard configuration without editing",
      },
    },
  },
};

export const WithoutPreview: Story = {
  args: {
    platforms: samplePlatforms,
    topics: sampleTopics,
    signalTypes: sampleSignalTypes,
    showPreview: false,
  },
};

export const MinimalPlatforms: Story = {
  args: {
    platforms: samplePlatforms.slice(0, 2),
    topics: sampleTopics.slice(0, 5),
    signalTypes: sampleSignalTypes.slice(0, 3),
  },
  parameters: {
    docs: {
      description: {
        story: "Builder with minimal platform and topic options",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    platforms: samplePlatforms,
    topics: sampleTopics,
    signalTypes: sampleSignalTypes,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    platforms: samplePlatforms,
    topics: sampleTopics,
    signalTypes: sampleSignalTypes,
    error: "Failed to load leaderboard configuration",
  },
};

export const Interactive: Story = {
  args: {
    platforms: samplePlatforms,
    topics: sampleTopics,
    signalTypes: sampleSignalTypes,
    onSubmit: (leaderboard) => {
      console.log("Leaderboard submitted:", leaderboard);
      alert(`Creating leaderboard: "${leaderboard.name}"\nSlug: ${leaderboard.slug}\nPublic: ${leaderboard.isPublic}`);
    },
    onCancel: () => {
      console.log("Form cancelled");
      alert("Form cancelled");
    },
    onPreview: (criteria) => {
      console.log("Preview requested:", criteria);
      alert(`Preview leaderboard with criteria:\nTimeframe: ${criteria.timeframe}\nPlatforms: ${criteria.platforms.length}\nSignals: ${criteria.signals.length}`);
    },
    onChange: (data) => {
      console.log("Form data changed:", data);
    },
  },
};

export const PublicLeaderboard: Story = {
  args: {
    platforms: samplePlatforms,
    topics: sampleTopics,
    signalTypes: sampleSignalTypes,
    initialData: {
      name: "Global Tech Leaders",
      description: "Public ranking of technology thought leaders across all platforms",
      slug: "global-tech-leaders",
      isPublic: true,
      criteria: {
        timeframe: "month",
        platforms: ["twitter", "linkedin", "reddit"],
        topics: ["AI & Machine Learning", "Tech Innovation", "Web Development"],
        signals: ["engagement", "reach", "influence", "quality"],
        minScore: 50,
        maxEntries: 25,
      },
      settings: {
        updateFrequency: "hourly",
        showScores: true,
        showChange: true,
        allowEmbedding: true,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Example of a public leaderboard configuration with high visibility settings",
      },
    },
  },
};

export const PrivateLeaderboard: Story = {
  args: {
    platforms: samplePlatforms,
    topics: sampleTopics,
    signalTypes: sampleSignalTypes,
    initialData: {
      name: "Internal Team Performance",
      description: "Private leaderboard for tracking internal team social media performance",
      slug: "internal-team-performance",
      isPublic: false,
      criteria: {
        timeframe: "week",
        platforms: ["linkedin", "twitter"],
        topics: [],
        signals: ["engagement", "quality"],
        minScore: 10,
        maxEntries: 50,
      },
      settings: {
        updateFrequency: "daily",
        showScores: false,
        showChange: true,
        allowEmbedding: false,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Example of a private leaderboard with restricted visibility and embedding",
      },
    },
  },
};

export const HighVolumeLeaderboard: Story = {
  args: {
    platforms: samplePlatforms,
    topics: sampleTopics,
    signalTypes: sampleSignalTypes,
    initialData: {
      name: "Viral Content Tracker",
      description: "High-volume leaderboard tracking viral content across all platforms",
      slug: "viral-content-tracker",
      isPublic: true,
      criteria: {
        timeframe: "hour",
        platforms: samplePlatforms.map(p => p.id),
        topics: sampleTopics.slice(0, 8).map(t => t.name),
        signals: sampleSignalTypes,
        minScore: 80,
        maxEntries: 500,
      },
      settings: {
        updateFrequency: "realtime",
        showScores: true,
        showChange: true,
        allowEmbedding: true,
      },
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Example of a high-volume leaderboard with real-time updates and maximum entries",
      },
    },
  },
};
