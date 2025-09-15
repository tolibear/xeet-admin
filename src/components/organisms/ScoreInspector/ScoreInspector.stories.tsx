import type { Meta, StoryObj } from "@storybook/react";
import { ScoreInspector } from "./ScoreInspector";
import { generatePost, generateScoreBreakdown } from "@/lib/mock-data";

const meta: Meta<typeof ScoreInspector> = {
  title: "Organisms/ScoreInspector",
  component: ScoreInspector,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Atomic rule breakdown visualization system for transparent scoring analysis",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScoreInspector>;

// Generate sample data
const samplePost = generatePost();
const sampleScoreBreakdown = generateScoreBreakdown(samplePost);

export const Default: Story = {
  args: {
    post: samplePost,
    scoreBreakdown: sampleScoreBreakdown,
  },
};

export const WithoutDetails: Story = {
  args: {
    post: samplePost,
    scoreBreakdown: sampleScoreBreakdown,
    showDetails: false,
  },
};

export const WithoutConfidence: Story = {
  args: {
    post: samplePost,
    scoreBreakdown: sampleScoreBreakdown,
    showConfidence: false,
  },
};

export const HighlightedCategories: Story = {
  args: {
    post: samplePost,
    scoreBreakdown: sampleScoreBreakdown,
    highlightCategories: ["engagement", "quality"],
  },
};

export const Loading: Story = {
  args: {
    post: samplePost,
    scoreBreakdown: sampleScoreBreakdown,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    post: samplePost,
    scoreBreakdown: sampleScoreBreakdown,
    error: "Failed to load score breakdown data",
  },
};

export const HighScore: Story = {
  args: {
    post: samplePost,
    scoreBreakdown: {
      ...sampleScoreBreakdown,
      totalScore: 89.5,
      baseScore: 65.2,
      appliedRules: sampleScoreBreakdown.appliedRules.map(rule => ({
        ...rule,
        impact: Math.abs(rule.impact),
      })),
    },
  },
};

export const LowScore: Story = {
  args: {
    post: samplePost,
    scoreBreakdown: {
      ...sampleScoreBreakdown,
      totalScore: 23.1,
      baseScore: 45.5,
      appliedRules: sampleScoreBreakdown.appliedRules.map(rule => ({
        ...rule,
        impact: -Math.abs(rule.impact),
      })),
    },
  },
};

export const MinimalRules: Story = {
  args: {
    post: samplePost,
    scoreBreakdown: {
      ...sampleScoreBreakdown,
      appliedRules: sampleScoreBreakdown.appliedRules.slice(0, 2),
    },
  },
};

export const ManyRules: Story = {
  args: {
    post: samplePost,
    scoreBreakdown: {
      ...sampleScoreBreakdown,
      appliedRules: [
        ...sampleScoreBreakdown.appliedRules,
        ...generateScoreBreakdown(generatePost()).appliedRules,
        ...generateScoreBreakdown(generatePost()).appliedRules,
      ],
    },
  },
};

export const Interactive: Story = {
  args: {
    post: samplePost,
    scoreBreakdown: sampleScoreBreakdown,
    onRuleClick: (rule) => {
      console.log("Rule clicked:", rule);
      alert(`Rule: ${rule.ruleName}\nImpact: ${rule.impact}\nConfidence: ${rule.confidence}`);
    },
    onExport: (format) => {
      console.log("Export requested:", format);
      alert(`Exporting score breakdown as ${format.toUpperCase()}`);
    },
  },
};
