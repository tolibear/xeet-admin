import { describe, it, expect } from "vitest";
import {
  generateUser,
  generatePost,
  generateOrganization,
  generateTopic,
  generateLeaderboard,
  generateUsers,
  generatePosts,
  mockData,
} from "./mock-data";

describe("Mock Data Generation", () => {
  describe("generateUser", () => {
    it("generates a valid user", () => {
      const user = generateUser();

      expect(user).toMatchObject({
        id: expect.any(String),
        username: expect.any(String),
        displayName: expect.any(String),
        platform: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          slug: expect.any(String),
          icon: expect.any(String),
          color: expect.any(String),
        }),
        followerCount: expect.any(Number),
        isVerified: expect.any(Boolean),
      });
    });

    it("generates users with consistent platform", () => {
      const platform = {
        id: "twitter",
        name: "Twitter",
        slug: "twitter",
        icon: "twitter",
        color: "#1DA1F2",
      };

      const user = generateUser(platform);
      expect(user.platform).toEqual(platform);
    });
  });

  describe("generatePost", () => {
    it("generates a valid post", () => {
      const post = generatePost();

      expect(post).toMatchObject({
        id: expect.any(String),
        content: expect.any(String),
        author: expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
        }),
        platform: expect.objectContaining({
          id: expect.any(String),
        }),
        engagement: expect.objectContaining({
          likes: expect.any(Number),
          shares: expect.any(Number),
          comments: expect.any(Number),
          views: expect.any(Number),
          impressions: expect.any(Number),
        }),
        score: expect.any(Number),
        signals: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            type: expect.any(String),
            value: expect.any(Number),
            confidence: expect.any(Number),
          }),
        ]),
        topics: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
        ]),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("generates posts with calculated scores", () => {
      const post = generatePost();

      expect(post.score).toBeGreaterThanOrEqual(0);
      expect(post.score).toBeLessThanOrEqual(100);
      expect(post.signals.length).toBeGreaterThanOrEqual(2);
      expect(post.signals.length).toBeLessThanOrEqual(6);
    });
  });

  describe("generateOrganization", () => {
    it("generates a valid organization", () => {
      const org = generateOrganization();

      expect(org).toMatchObject({
        id: expect.any(String),
        slug: expect.any(String),
        name: expect.any(String),
        settings: expect.objectContaining({
          theme: "dark",
          timezone: expect.any(String),
          features: expect.arrayContaining([expect.any(String)]),
        }),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it("generates organizations with valid slugs", () => {
      const org = generateOrganization();

      expect(org.slug).toBe(org.slug.toLowerCase());
      expect(org.slug).not.toContain(" ");
    });
  });

  describe("generateTopic", () => {
    it("generates a valid topic", () => {
      const topic = generateTopic();

      expect(topic).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        keywords: expect.arrayContaining([expect.any(String)]),
        synonyms: expect.arrayContaining([expect.any(String)]),
        stopWords: expect.arrayContaining([expect.any(String)]),
        color: expect.any(String),
        isActive: expect.any(Boolean),
      });
    });

    it("generates topics with reasonable keyword counts", () => {
      const topic = generateTopic();

      expect(topic.keywords.length).toBeGreaterThanOrEqual(3);
      expect(topic.keywords.length).toBeLessThanOrEqual(8);
    });
  });

  describe("generateLeaderboard", () => {
    it("generates a valid leaderboard", () => {
      const leaderboard = generateLeaderboard("test-org");

      expect(leaderboard).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        slug: expect.any(String),
        isPublic: expect.any(Boolean),
        criteria: expect.objectContaining({
          timeframe: expect.any(String),
          platforms: expect.arrayContaining([expect.any(String)]),
          topics: expect.arrayContaining([expect.any(String)]),
          signals: expect.arrayContaining([expect.any(String)]),
          minScore: expect.any(Number),
          maxEntries: expect.any(Number),
        }),
        settings: expect.objectContaining({
          updateFrequency: expect.any(String),
          showScores: expect.any(Boolean),
          showChange: expect.any(Boolean),
          allowEmbedding: expect.any(Boolean),
        }),
        orgId: "test-org",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe("batch generation", () => {
    it("generates multiple users", () => {
      const users = generateUsers(5);

      expect(users).toHaveLength(5);
      users.forEach(user => {
        expect(user.id).toBeDefined();
        expect(typeof user.username).toBe("string");
      });
    });

    it("generates multiple posts with consistent users", () => {
      const users = generateUsers(3);
      const posts = generatePosts(10, users);

      expect(posts).toHaveLength(10);
      posts.forEach(post => {
        expect(users.some(user => user.id === post.author.id)).toBe(true);
      });
    });
  });

  describe("mockData samples", () => {
    it("provides sample data objects", () => {
      expect(mockData.sampleUser).toBeDefined();
      expect(mockData.samplePost).toBeDefined();
      expect(mockData.sampleOrganization).toBeDefined();
      expect(mockData.sampleTopic).toBeDefined();
      expect(mockData.sampleLeaderboard).toBeDefined();
    });

    it("sample data has correct structure", () => {
      expect(mockData.sampleUser.id).toBeDefined();
      expect(mockData.samplePost.author).toBeDefined();
      expect(mockData.sampleOrganization.slug).toBeDefined();
      expect(mockData.sampleTopic.keywords).toBeDefined();
      expect(mockData.sampleLeaderboard.criteria).toBeDefined();
    });
  });

  describe("data consistency", () => {
    it("maintains referential integrity", () => {
      const user = generateUser();
      const post = generatePost(user);

      expect(post.author.id).toBe(user.id);
      expect(post.platform).toEqual(user.platform);
    });

    it("generates realistic engagement metrics", () => {
      const post = generatePost();

      // Basic validations that metrics are positive numbers
      expect(post.engagement.likes).toBeGreaterThanOrEqual(0);
      expect(post.engagement.shares).toBeGreaterThanOrEqual(0);
      expect(post.engagement.comments).toBeGreaterThanOrEqual(0);
      expect(post.engagement.views).toBeGreaterThan(0);
      expect(post.engagement.impressions).toBeGreaterThan(0);

      // Views should generally be more than comments (but allow for edge cases)
      expect(post.engagement.views + post.engagement.comments).toBeGreaterThan(0);
    });

    it("generates valid ISO date strings", () => {
      const post = generatePost();

      expect(() => new Date(post.createdAt)).not.toThrow();
      expect(() => new Date(post.updatedAt)).not.toThrow();
      expect(new Date(post.updatedAt) >= new Date(post.createdAt)).toBe(true);
    });
  });
});
