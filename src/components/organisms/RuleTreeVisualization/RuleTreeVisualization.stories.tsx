import type { Meta, StoryObj } from "@storybook/react";
import { RuleTreeVisualization } from "./RuleTreeVisualization";
import { generateRuleSet } from "@/lib/mock-data";

const meta: Meta<typeof RuleTreeVisualization> = {
  title: "Organisms/RuleTreeVisualization",
  component: RuleTreeVisualization,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Hierarchical visualization system for scoring rules with multiple view modes and interactive navigation",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RuleTreeVisualization>;

// Generate sample data
const sampleRuleSet = generateRuleSet("sample-org");
const largeSampleRuleSet = {
  ...sampleRuleSet,
  rules: [
    ...sampleRuleSet.rules,
    ...generateRuleSet("sample-org-2").rules,
    ...generateRuleSet("sample-org-3").rules,
  ],
};

export const Default: Story = {
  args: {
    ruleSet: sampleRuleSet,
  },
};

export const CategoryView: Story = {
  args: {
    ruleSet: sampleRuleSet,
    viewMode: "category",
    showStatistics: true,
  },
};

export const PriorityView: Story = {
  args: {
    ruleSet: sampleRuleSet,
    viewMode: "priority",
  },
};

export const ExecutionView: Story = {
  args: {
    ruleSet: sampleRuleSet,
    viewMode: "execution",
  },
};

export const DependencyView: Story = {
  args: {
    ruleSet: sampleRuleSet,
    viewMode: "dependency",
    showConnections: true,
  },
};

export const WithSelectedRules: Story = {
  args: {
    ruleSet: sampleRuleSet,
    selectedRuleIds: [sampleRuleSet.rules[0]?.id, sampleRuleSet.rules[2]?.id].filter(Boolean),
    viewMode: "category",
  },
};

export const CollapsedCategories: Story = {
  args: {
    ruleSet: sampleRuleSet,
    collapsedCategories: ["engagement", "sentiment"],
    viewMode: "category",
  },
};

export const WithoutStatistics: Story = {
  args: {
    ruleSet: sampleRuleSet,
    showStatistics: false,
  },
};

export const LargeRuleSet: Story = {
  args: {
    ruleSet: largeSampleRuleSet,
    viewMode: "category",
    showStatistics: true,
  },
};

export const Loading: Story = {
  args: {
    ruleSet: sampleRuleSet,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    ruleSet: sampleRuleSet,
    error: "Failed to load rule set hierarchy",
  },
};

export const Interactive: Story = {
  args: {
    ruleSet: sampleRuleSet,
    onRuleSelect: (rule) => {
      console.log("Rule selected:", rule);
      alert(`Selected rule: ${rule.name}\nCategory: ${rule.category}\nPriority: ${rule.priority}`);
    },
    onCategoryToggle: (category) => {
      console.log("Category toggled:", category);
    },
    onViewModeChange: (mode) => {
      console.log("View mode changed:", mode);
    },
  },
};

export const EmptyRuleSet: Story = {
  args: {
    ruleSet: {
      ...sampleRuleSet,
      rules: [],
    },
  },
};
