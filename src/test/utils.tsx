import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { vi } from "vitest";

// Custom render function that includes providers
const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="test-wrapper">{children}</div>;
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Test data factories for atomic design components
export const createTestAtomProps = (overrides = {}) => ({
  className: "test-class",
  "data-testid": "test-atom",
  ...overrides,
});

export const createTestMoleculeProps = (overrides = {}) => ({
  size: "md" as const,
  variant: "default" as const,
  ...createTestAtomProps(),
  ...overrides,
});

export const createTestOrganismProps = (overrides = {}) => ({
  loading: false,
  error: null,
  onError: vi.fn(),
  ...createTestMoleculeProps(),
  ...overrides,
});

// Mock data for testing
export const mockOrganization = {
  id: "test-org-1",
  slug: "test-org",
  name: "Test Organization",
  description: "A test organization for unit tests",
  settings: {
    theme: "dark" as const,
    timezone: "UTC",
    features: ["research", "leaderboards"],
  },
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

export const mockUser = {
  id: "user-1",
  username: "testuser",
  displayName: "Test User",
  platform: {
    id: "twitter",
    name: "Twitter",
    slug: "twitter",
    icon: "twitter",
    color: "#1DA1F2",
  },
  followerCount: 1000,
  isVerified: true,
  bio: "Test user for unit tests",
  profileImageUrl: "https://example.com/avatar.jpg",
};

export const mockPost = {
  id: "post-1",
  content: "This is a test post for atomic design testing",
  author: mockUser,
  platform: mockUser.platform,
  engagement: {
    likes: 100,
    shares: 50,
    comments: 25,
    views: 1000,
    impressions: 5000,
  },
  score: 85.5,
  signals: [],
  topics: [],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};
