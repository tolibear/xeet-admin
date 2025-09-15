import type { Meta, StoryObj } from "@storybook/react";
import { RuleSetManager } from "./RuleSetManager";
import { generateRuleSets } from "@/lib/mock-data";
import type { RuleSet } from "@/lib/types";

const meta: Meta<typeof RuleSetManager> = {
  title: "Organisms/RuleSetManager",
  component: RuleSetManager,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "Comprehensive rule set lifecycle management system for draft/staged/active state management",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof RuleSetManager>;

// Generate sample data with different statuses
const sampleRuleSets: RuleSet[] = [
  { ...generateRuleSets("org-1", 1)[0], status: "active", name: "Production Rules v2.1" },
  { ...generateRuleSets("org-1", 1)[0], status: "staged", name: "Staging Rules v2.2" },
  { ...generateRuleSets("org-1", 1)[0], status: "draft", name: "Draft Enhancement Rules" },
  { ...generateRuleSets("org-1", 1)[0], status: "draft", name: "Quality Improvement Rules" },
  { ...generateRuleSets("org-1", 1)[0], status: "archived", name: "Legacy Rules v1.5" },
  { ...generateRuleSets("org-1", 1)[0], status: "archived", name: "Old Scoring System" },
];

const activeRuleSetId = sampleRuleSets.find(rs => rs.status === "active")?.id;
const stagedRuleSetId = sampleRuleSets.find(rs => rs.status === "staged")?.id;

export const Default: Story = {
  args: {
    ruleSets: sampleRuleSets,
    activeRuleSetId,
    stagedRuleSetId,
  },
};

export const WithPermissions: Story = {
  args: {
    ruleSets: sampleRuleSets,
    activeRuleSetId,
    stagedRuleSetId,
    canCreate: true,
    canEdit: true,
    canPromote: true,
  },
};

export const ReadOnlyMode: Story = {
  args: {
    ruleSets: sampleRuleSets,
    activeRuleSetId,
    stagedRuleSetId,
    canCreate: false,
    canEdit: false,
    canPromote: false,
  },
  parameters: {
    docs: {
      description: {
        story: "View-only mode for users without management permissions",
      },
    },
  },
};

export const DraftsOnly: Story = {
  args: {
    ruleSets: sampleRuleSets.filter(rs => rs.status === "draft"),
  },
  parameters: {
    docs: {
      description: {
        story: "Shows only draft rule sets for development workflow",
      },
    },
  },
};

export const ProductionFocused: Story = {
  args: {
    ruleSets: sampleRuleSets.filter(rs => ["active", "staged"].includes(rs.status)),
    activeRuleSetId,
    stagedRuleSetId,
    canPromote: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Production-focused view showing only active and staged rule sets",
      },
    },
  },
};

export const LargeDataset: Story = {
  args: {
    ruleSets: [
      ...sampleRuleSets,
      ...generateRuleSets("org-1", 15).map((rs, index) => ({
        ...rs,
        status: ["draft", "staged", "active", "archived"][index % 4] as any,
        name: `Rule Set ${index + 7}`,
      })),
    ],
    activeRuleSetId,
    stagedRuleSetId,
    canCreate: true,
    canEdit: true,
    canPromote: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Demonstrates management of many rule sets with filtering and sorting",
      },
    },
  },
};

export const Loading: Story = {
  args: {
    ruleSets: sampleRuleSets,
    loading: true,
  },
};

export const Error: Story = {
  args: {
    ruleSets: sampleRuleSets,
    error: "Failed to load rule sets",
  },
};

export const EmptyState: Story = {
  args: {
    ruleSets: [],
    canCreate: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Empty state when no rule sets exist",
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    ruleSets: sampleRuleSets,
    activeRuleSetId,
    stagedRuleSetId,
    canCreate: true,
    canEdit: true,
    canPromote: true,
    onRuleSetSelect: (ruleSet) => {
      console.log("Rule set selected:", ruleSet);
      alert(`Selected: ${ruleSet.name}\nStatus: ${ruleSet.status}\nRules: ${ruleSet.rules.length}`);
    },
    onRuleSetCreate: (name, description) => {
      console.log("Create rule set:", name, description);
      alert(`Creating new rule set: "${name}"`);
    },
    onRuleSetClone: (sourceRuleSet, newName) => {
      console.log("Clone rule set:", sourceRuleSet.name, "->", newName);
      alert(`Cloning "${sourceRuleSet.name}" as "${newName}"`);
    },
    onRuleSetPromote: (ruleSet, toStatus) => {
      console.log("Promote rule set:", ruleSet.name, "to", toStatus);
      alert(`Promoting "${ruleSet.name}" to ${toStatus}`);
    },
    onRuleSetArchive: (ruleSet) => {
      console.log("Archive rule set:", ruleSet.name);
      alert(`Archiving "${ruleSet.name}"`);
    },
    onRuleSetDelete: (ruleSet) => {
      console.log("Delete rule set:", ruleSet.name);
      alert(`Deleting "${ruleSet.name}"`);
    },
  },
};

export const DeploymentScenario: Story = {
  args: {
    ruleSets: [
      { ...sampleRuleSets[0], status: "active", name: "Production Rules v2.0", updatedAt: "2024-01-15T10:00:00Z" },
      { ...sampleRuleSets[1], status: "staged", name: "Quality Enhancement v2.1", updatedAt: "2024-01-20T14:30:00Z" },
      { ...sampleRuleSets[2], status: "draft", name: "Experimental Features v2.2", updatedAt: "2024-01-22T09:15:00Z" },
    ],
    activeRuleSetId: sampleRuleSets[0].id,
    stagedRuleSetId: sampleRuleSets[1].id,
    canPromote: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Typical deployment scenario with production, staging, and development rule sets",
      },
    },
  },
};
