import type { Meta, StoryObj } from "@storybook/react";
import { ABScoreComparison } from "./ABScoreComparison";
import { generateScoreComparison, generateRuleSet, generatePosts } from "@/lib/mock-data";

const meta: Meta<typeof ABScoreComparison> = {
  title: "Organisms/ABScoreComparison",
  component: ABScoreComparison,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Comprehensive A/B testing system for scoring rule comparisons with statistical analysis and visualization",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ABScoreComparison>;

// Generate sample data
const ruleSetA = generateRuleSet("sample-org");
const ruleSetB = generateRuleSet("sample-org");
const testPosts = generatePosts(25);
const sampleComparison = generateScoreComparison(ruleSetA, ruleSetB, testPosts);

// Create a comparison with mostly improvements
const improvementComparison = {
  ...sampleComparison,
  results: sampleComparison.results.map(result => ({
    ...result,
    scoreB: {
      ...result.scoreB,
      totalScore: result.scoreA.totalScore + Math.random() * 15 + 2, // Consistent improvements
    },
    difference: Math.random() * 15 + 2,
    percentChange: ((Math.random() * 15 + 2) / result.scoreA.totalScore) * 100,
  })),
};

// Create a comparison with mixed results (high variance)
const mixedComparison = {
  ...sampleComparison,
  results: sampleComparison.results.map(result => {
    const change = (Math.random() - 0.5) * 30; // -15 to +15 point changes
    return {
      ...result,
      scoreB: {
        ...result.scoreB,
        totalScore: Math.max(0, Math.min(100, result.scoreA.totalScore + change)),
      },
      difference: change,
      percentChange: (change / result.scoreA.totalScore) * 100,
    };
  }),
};

export const Default: Story = {
  args: {
    comparison: sampleComparison,
  },
};

export const WithBreakdowns: Story = {
  args: {
    comparison: sampleComparison,
    showBreakdowns: true,
    showStatistics: true,
  },
};

export const WithoutBreakdowns: Story = {
  args: {
    comparison: sampleComparison,
    showBreakdowns: false,
  },
};

export const WithoutStatistics: Story = {
  args: {
    comparison: sampleComparison,
    showStatistics: false,
  },
};

export const SignificantImprovements: Story = {
  args: {
    comparison: improvementComparison,
    showBreakdowns: true,
    showStatistics: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows a comparison where Rule Set B consistently outperforms Rule Set A",
      },
    },
  },
};

export const MixedResults: Story = {
  args: {
    comparison: mixedComparison,
    showBreakdowns: true,
    showStatistics: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Shows a comparison with high variance - some improvements, some regressions",
      },
    },
  },
};

export const SmallPageSize: Story = {
  args: {
    comparison: sampleComparison,
    pageSize: 5,
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates pagination with smaller page size",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    comparison: sampleComparison,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    comparison: sampleComparison,
    error: "Failed to load comparison results",
  },
};

export const RunningComparison: Story = {
  args: {
    comparison: {
      ...sampleComparison,
      status: "running",
    },
  },
};

export const Interactive: Story = {
  args: {
    comparison: sampleComparison,
    onPostSelect: (post, scoreA, scoreB) => {
      console.log("Post selected:", post);
      console.log("Score A:", scoreA);
      console.log("Score B:", scoreB);
      alert(`Selected post: ${post.content.substring(0, 50)}...\nScore A: ${scoreA.totalScore}\nScore B: ${scoreB.totalScore}`);
    },
    onExport: (format) => {
      console.log("Export requested:", format);
      alert(`Exporting comparison results as ${format.toUpperCase()}`);
    },
    onNewComparison: () => {
      console.log("New comparison requested");
      alert("Starting new A/B comparison...");
    },
  },
};

export const LargeDataset: Story = {
  args: {
    comparison: {
      ...sampleComparison,
      testPosts: generatePosts(100),
      results: generateScoreComparison(ruleSetA, ruleSetB, generatePosts(100)).results,
    },
    pageSize: 10,
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates performance with larger dataset (100 posts)",
      },
    },
  },
};
