import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    // Apply dark theme globally
    backgrounds: {
      default: "dark",
      values: [
        {
          name: "dark",
          value: "hsl(222 47% 11%)", // --background from globals.css
        },
        {
          name: "light", 
          value: "hsl(0 0% 100%)",
        },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: {
        base: "dark",
        colorPrimary: "hsl(210 100% 60%)", // --primary
        colorSecondary: "hsl(210 100% 60%)",
        
        // UI
        appBg: "hsl(222 47% 11%)", // --background
        appContentBg: "hsl(224 71% 4%)", // --card
        appBorderColor: "hsl(216 34% 17%)", // --border
        
        // Text colors
        textColor: "hsl(213 31% 91%)", // --foreground
        textInverseColor: "hsl(222 47% 11%)",
        
        // Toolbar colors
        barTextColor: "hsl(213 31% 91%)",
        barSelectedColor: "hsl(210 100% 60%)",
        barBg: "hsl(224 71% 4%)",
        
        // Form colors
        inputBg: "hsl(216 34% 17%)", // --input
        inputBorder: "hsl(216 34% 17%)",
        inputTextColor: "hsl(213 31% 91%)",
        inputBorderRadius: 4,
      },
    },
    // Accessibility testing
    a11y: {
      test: "todo", // Show violations but don't fail builds
      config: {
        rules: [
          {
            // Allow buttons without text content if they have aria-label
            id: "button-name",
            enabled: true,
          },
          {
            // Ensure proper color contrast for dark theme
            id: "color-contrast",
            enabled: true,
          },
        ],
      },
    },
    // Viewport configuration for responsive testing
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: {
            width: "375px",
            height: "667px",
          },
        },
        tablet: {
          name: "Tablet",
          styles: {
            width: "768px",
            height: "1024px",
          },
        },
        desktop: {
          name: "Desktop",
          styles: {
            width: "1200px",
            height: "800px",
          },
        },
        galaxyScale: {
          name: "Galaxy Scale (Large Dashboard)",
          styles: {
            width: "1920px",
            height: "1080px",
          },
        },
      },
    },
    // Story sorting by atomic design hierarchy
    options: {
      storySort: {
        order: [
          "Introduction",
          "Design System", 
          "Atoms",
          ["Button", "Input", "Badge", "*"],
          "Molecules",
          ["SearchBox", "FilterChip", "MetricCard", "*"], 
          "Organisms",
          ["DataTable", "ChartBuilder", "ScoreInspector", "*"],
          "Templates",
          ["DashboardTemplate", "ListPageTemplate", "*"],
          "Systems", 
          ["ResearchHub", "LeaderboardSystem", "*"],
          "Galaxy",
          "*",
        ],
      },
    },
  },
  // Global decorators for consistent styling
  decorators: [
    (Story, context) => {
      // Adjust container based on layout parameter
      const isCentered = context.parameters.layout === 'centered';
      const containerClasses = isCentered 
        ? "dark bg-background text-foreground min-h-[400px] p-6 flex items-center justify-center"
        : "dark bg-background text-foreground min-h-[200px] p-6";
      
      return (
        <div className={containerClasses}>
          <Story />
        </div>
      );
    },
  ],
  // Global args for component consistency
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "dark",
      toolbar: {
        title: "Theme",
        icon: "paintbrush", 
        items: [
          { value: "dark", title: "Dark Theme", icon: "moon" },
          { value: "light", title: "Light Theme", icon: "sun" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
