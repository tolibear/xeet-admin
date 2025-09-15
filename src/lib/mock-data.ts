import { faker } from "@faker-js/faker";
import type {
  Organization,
  User,
  Post,
  Platform,
  Signal,
  SignalType,
  Topic,
  Leaderboard,
  LeaderboardEntry,
  EngagementMetrics,
  ScoringRule,
  ScoringCondition,
  ScoringAction,
  ScoringCategory,
  RuleSet,
  ScoreBreakdown,
  AppliedRule,
  ScoreComparison,
  ComparisonResult,
  RuleStatus,
  ConditionOperator,
  ActionType,
  KeywordCoverageData,
  NetworkData,
  NetworkNode,
  NetworkLink,
  NetworkCluster,
  SystemHealthMetrics,
  SystemService,
  JobQueue,
  JobType,
  BackfillJob,
  LogEntry,
  BulkOperation,
  SlashingAction,
} from "./types";

// Set a consistent seed for reproducible results in development
faker.seed(2024);

/**
 * Mock Data Generation System for Xeet Admin Platform
 *
 * Generates realistic, scalable mock data for testing and development
 * at enterprise scale (500k+ posts, 1.9M signals, 493k users)
 */

// Platform definitions
const PLATFORMS: Platform[] = [
  {
    id: "twitter",
    name: "Twitter",
    slug: "twitter",
    icon: "twitter",
    color: "#1DA1F2",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    slug: "linkedin",
    icon: "linkedin",
    color: "#0A66C2",
  },
  {
    id: "reddit",
    name: "Reddit",
    slug: "reddit",
    icon: "reddit",
    color: "#FF4500",
  },
  {
    id: "instagram",
    name: "Instagram",
    slug: "instagram",
    icon: "instagram",
    color: "#E4405F",
  },
  {
    id: "tiktok",
    name: "TikTok",
    slug: "tiktok",
    icon: "tiktok",
    color: "#000000",
  },
];

const SIGNAL_TYPES: SignalType[] = [
  "engagement",
  "sentiment",
  "reach",
  "influence",
  "relevance",
  "quality",
];

const TOPIC_NAMES = [
  "AI & Machine Learning",
  "Cryptocurrency",
  "Climate Change",
  "Tech Innovation",
  "Social Media",
  "Startup Culture",
  "Digital Marketing",
  "Remote Work",
  "Web Development",
  "Data Science",
  "Blockchain",
  "Sustainability",
  "Healthcare Tech",
  "Fintech",
  "EdTech",
];

const SCORING_CATEGORIES: ScoringCategory[] = [
  "engagement",
  "quality", 
  "relevance",
  "influence",
  "sentiment",
  "reach",
];

const CONDITION_OPERATORS: ConditionOperator[] = [
  "equals",
  "not_equals",
  "greater_than",
  "less_than",
  "contains",
  "not_contains",
  "in",
  "not_in",
];

const ACTION_TYPES: ActionType[] = ["add", "subtract", "multiply", "set_min", "set_max"];

const RULE_FIELDS = [
  "engagement.likes",
  "engagement.shares", 
  "engagement.comments",
  "engagement.views",
  "author.followerCount",
  "author.isVerified",
  "platform.name",
  "content.length",
  "topics.count",
  "signals.sentiment",
  "signals.quality",
];

const RULE_NAMES = [
  "Viral Content Boost",
  "High-Quality Author Bonus",
  "Engagement Velocity Multiplier",
  "Verified User Premium",
  "Topic Relevance Scorer",
  "Sentiment Analysis Modifier",
  "Platform Preference Weight",
  "Content Length Optimizer",
  "Influence Network Amplifier",
  "Freshness Factor Boost",
];

// Utility functions for realistic data generation
function getRandomPlatform(): Platform {
  return faker.helpers.arrayElement(PLATFORMS);
}

function generateEngagementMetrics(platform: Platform): EngagementMetrics {
  const baseMultiplier = platform.id === "twitter" ? 10 : platform.id === "linkedin" ? 5 : 15;

  return {
    likes: faker.number.int({ min: 0, max: 10000 * baseMultiplier }),
    shares: faker.number.int({ min: 0, max: 1000 * baseMultiplier }),
    comments: faker.number.int({ min: 0, max: 500 * baseMultiplier }),
    views: faker.number.int({ min: 100, max: 1000000 }),
    impressions: faker.number.int({ min: 1000, max: 5000000 }),
  };
}

function generateSignals(count: number = 3): Signal[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement(SIGNAL_TYPES),
    value: faker.number.float({ min: 0, max: 100, multipleOf: 0.1 }),
    confidence: faker.number.float({ min: 0.1, max: 1, multipleOf: 0.01 }),
    source: faker.helpers.arrayElement([
      "sentiment_analysis",
      "engagement_tracker",
      "influence_calculator",
      "quality_scorer",
    ]),
    metadata: {
      model_version: faker.git.commitSha({ length: 7 }),
      processing_time: faker.number.int({ min: 10, max: 500 }),
      features_used: faker.helpers.arrayElements(
        ["text_analysis", "user_history", "network_analysis", "temporal_features"],
        { min: 1, max: 4 }
      ),
    },
    createdAt: faker.date.recent({ days: 7 }).toISOString(),
  }));
}

// Core data generators
export function generateUser(platform?: Platform): User {
  const userPlatform = platform || getRandomPlatform();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    id: faker.string.uuid(),
    username: faker.internet.username({ firstName, lastName }),
    displayName:
      faker.helpers.maybe(() => `${firstName} ${lastName}`, { probability: 0.7 }) ||
      faker.internet.displayName({ firstName, lastName }),
    platform: userPlatform,
    followerCount: faker.number.int({ min: 10, max: 10000000 }),
    isVerified: faker.helpers.maybe(() => true, { probability: 0.1 }) || false,
    bio: faker.helpers.maybe(() => faker.lorem.sentence({ min: 5, max: 20 })),
    profileImageUrl: faker.image.avatar(),
  };
}

export function generateTopic(): Topic {
  const name = faker.helpers.arrayElement(TOPIC_NAMES);
  const keywords = faker.helpers.arrayElements(faker.lorem.words(20).split(" "), {
    min: 3,
    max: 8,
  });

  return {
    id: faker.string.uuid(),
    name,
    keywords,
    synonyms: keywords.slice(0, 3).map(k => faker.lorem.word()),
    stopWords: ["the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by"],
    color: faker.color.rgb({ format: "hex" }),
    isActive: faker.helpers.maybe(() => false, { probability: 0.1 }) || true,
  };
}

export function generatePost(user?: User, platform?: Platform): Post {
  const postUser = user || generateUser(platform);
  const postPlatform = platform || postUser.platform;
  const engagement = generateEngagementMetrics(postPlatform);
  const signals = generateSignals(faker.number.int({ min: 2, max: 6 }));

  // Calculate score based on signals
  const totalWeight = signals.reduce((sum, signal) => sum + signal.confidence, 0);
  const score =
    signals.reduce((sum, signal) => sum + signal.value * signal.confidence, 0) / totalWeight;

  return {
    id: faker.string.uuid(),
    content: faker.lorem.paragraphs({ min: 1, max: 3 }, "\n\n"),
    author: postUser,
    platform: postPlatform,
    engagement,
    score: Math.round(score * 10) / 10,
    signals,
    topics: faker.helpers.arrayElements(Array.from({ length: 5 }, generateTopic), {
      min: 1,
      max: 3,
    }),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    updatedAt: faker.date.recent({ days: 1 }).toISOString(),
  };
}

export function generateOrganization(): Organization {
  const companyName = faker.company.name();

  return {
    id: faker.string.uuid(),
    slug: faker.helpers.slugify(companyName).toLowerCase(),
    name: companyName,
    description: faker.company.catchPhrase(),
    settings: {
      theme: "dark" as const,
      timezone: faker.location.timeZone(),
      features: faker.helpers.arrayElements(
        ["research", "leaderboards", "analytics", "live_feed", "exports"],
        { min: 2, max: 5 }
      ),
    },
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
  };
}

export function generateLeaderboard(orgId: string): Leaderboard {
  const name = faker.helpers.arrayElement([
    "Top Influencers",
    "Rising Stars",
    "Weekly Leaders",
    "Content Champions",
    "Engagement Heroes",
  ]);

  return {
    id: faker.string.uuid(),
    name,
    description: faker.lorem.sentence({ min: 10, max: 20 }),
    slug: faker.helpers.slugify(name).toLowerCase(),
    isPublic: faker.helpers.maybe(() => true, { probability: 0.3 }) || false,
    criteria: {
      timeframe: faker.helpers.arrayElement(["day", "week", "month", "year", "all"] as const),
      platforms: faker.helpers.arrayElements(
        PLATFORMS.map(p => p.id),
        { min: 1, max: 3 }
      ),
      topics: faker.helpers.arrayElements(TOPIC_NAMES, { min: 1, max: 5 }),
      signals: faker.helpers.arrayElements(SIGNAL_TYPES, { min: 1, max: 4 }),
      minScore: faker.number.int({ min: 0, max: 50 }),
      maxEntries: faker.helpers.arrayElement([10, 25, 50, 100]),
    },
    entries: [], // Will be populated separately
    settings: {
      updateFrequency: faker.helpers.arrayElement(["realtime", "hourly", "daily"] as const),
      showScores: faker.helpers.maybe(() => false, { probability: 0.2 }) || true,
      showChange: faker.helpers.maybe(() => false, { probability: 0.3 }) || true,
      allowEmbedding: faker.helpers.maybe(() => true, { probability: 0.4 }) || false,
    },
    orgId,
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent({ days: 7 }).toISOString(),
  };
}

export function generateLeaderboardEntry(rank: number, posts: Post[]): LeaderboardEntry {
  const user = generateUser();
  const userPosts = posts.filter(() => faker.helpers.maybe(() => true, { probability: 0.1 }));
  const score = faker.number.float({ min: 50, max: 100, multipleOf: 0.1 });

  return {
    id: faker.string.uuid(),
    rank,
    user,
    score,
    posts: userPosts.slice(0, faker.number.int({ min: 1, max: 10 })),
    change: faker.number.int({ min: -10, max: 10 }),
  };
}

// Batch generation functions for enterprise-scale data
export function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => generateUser());
}

export function generatePosts(count: number, users?: User[]): Post[] {
  const userPool = users || generateUsers(Math.min(count / 10, 1000));

  return Array.from({ length: count }, () => {
    const user = faker.helpers.arrayElement(userPool);
    return generatePost(user);
  });
}

export function generateOrganizations(count: number): Organization[] {
  return Array.from({ length: count }, generateOrganization);
}

export function generateTopics(count: number): Topic[] {
  return Array.from({ length: count }, generateTopic);
}

// Enterprise-scale dataset generators
export function generateEnterpriseScaleData() {
  console.log("🏢 Generating enterprise-scale mock data...");

  // Generate organizations
  const organizations = generateOrganizations(10);
  console.log(`✓ Generated ${organizations.length} organizations`);

  // Generate users (493k target)
  const users = generateUsers(1000); // Smaller sample for development
  console.log(`✓ Generated ${users.length} users`);

  // Generate posts (500k target)
  const posts = generatePosts(5000, users); // Smaller sample for development
  console.log(`✓ Generated ${posts.length} posts`);

  // Generate topics
  const topics = generateTopics(50);
  console.log(`✓ Generated ${topics.length} topics`);

  // Generate leaderboards
  const leaderboards = organizations.flatMap(org =>
    Array.from({ length: faker.number.int({ min: 2, max: 8 }) }, () => generateLeaderboard(org.id))
  );
  console.log(`✓ Generated ${leaderboards.length} leaderboards`);

  console.log("🎉 Enterprise-scale mock data generation complete!");

  return {
    organizations,
    users,
    posts,
    topics,
    leaderboards,
    stats: {
      totalUsers: users.length,
      totalPosts: posts.length,
      totalSignals: posts.reduce((sum, post) => sum + post.signals.length, 0),
      totalTopics: topics.length,
      totalLeaderboards: leaderboards.length,
    },
  };
}

// Scoring System generators
export function generateScoringCondition(): ScoringCondition {
  return {
    id: faker.string.uuid(),
    field: faker.helpers.arrayElement(RULE_FIELDS),
    operator: faker.helpers.arrayElement(CONDITION_OPERATORS),
    value: faker.helpers.arrayElement([
      faker.number.int({ min: 100, max: 10000 }),
      faker.datatype.boolean(),
      faker.helpers.arrayElement(PLATFORMS.map(p => p.name)),
      faker.lorem.word(),
    ]),
    logicalOperator: faker.helpers.maybe(() => faker.helpers.arrayElement(["AND", "OR"]) as const),
  };
}

export function generateScoringAction(): ScoringAction {
  const actionType = faker.helpers.arrayElement(ACTION_TYPES);
  let value: number;

  switch (actionType) {
    case "add":
    case "subtract":
      value = faker.number.float({ min: -50, max: 50, multipleOf: 0.1 });
      break;
    case "multiply":
      value = faker.number.float({ min: 0.5, max: 3.0, multipleOf: 0.1 });
      break;
    case "set_min":
    case "set_max":
      value = faker.number.float({ min: 0, max: 100, multipleOf: 0.1 });
      break;
  }

  return {
    id: faker.string.uuid(),
    type: actionType,
    value,
    reason: faker.lorem.sentence({ min: 5, max: 12 }),
  };
}

export function generateScoringRule(): ScoringRule {
  const name = faker.helpers.arrayElement(RULE_NAMES);
  const category = faker.helpers.arrayElement(SCORING_CATEGORIES);
  
  return {
    id: faker.string.uuid(),
    name,
    description: faker.lorem.sentence({ min: 8, max: 20 }),
    category,
    weight: faker.number.float({ min: 0.1, max: 2.0, multipleOf: 0.1 }),
    conditions: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, generateScoringCondition),
    actions: Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, generateScoringAction),
    isActive: faker.helpers.maybe(() => false, { probability: 0.1 }) || true,
    priority: faker.number.int({ min: 1, max: 100 }),
    version: faker.number.int({ min: 1, max: 10 }),
    status: faker.helpers.arrayElement(["draft", "staged", "active", "archived"] as RuleStatus[]),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    metadata: {
      createdBy: faker.person.fullName(),
      lastModifiedBy: faker.person.fullName(),
      testResults: {
        accuracy: faker.number.float({ min: 0.7, max: 0.98, multipleOf: 0.01 }),
        coverage: faker.number.float({ min: 0.1, max: 1.0, multipleOf: 0.01 }),
      },
    },
  };
}

export function generateRuleSet(orgId: string): RuleSet {
  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement([
      "Production Scoring Rules",
      "Beta Test Rules",
      "Quality Enhancement v2",
      "Engagement Boost Rules",
      "Content Classification Set",
    ]),
    description: faker.lorem.sentence({ min: 10, max: 25 }),
    version: `${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}.${faker.number.int({ min: 0, max: 9 })}`,
    rules: Array.from({ length: faker.number.int({ min: 5, max: 15 }) }, generateScoringRule),
    status: faker.helpers.arrayElement(["draft", "staged", "active", "archived"] as RuleStatus[]),
    orgId,
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent({ days: 7 }).toISOString(),
  };
}

export function generateAppliedRule(rule: ScoringRule): AppliedRule {
  return {
    ruleId: rule.id,
    ruleName: rule.name,
    category: rule.category,
    impact: faker.number.float({ min: -20, max: 30, multipleOf: 0.1 }),
    reason: faker.helpers.arrayElement(rule.actions).reason,
    confidence: faker.number.float({ min: 0.6, max: 1.0, multipleOf: 0.01 }),
    appliedConditions: rule.conditions
      .filter(() => faker.helpers.maybe(() => true, { probability: 0.7 }))
      .map(c => `${c.field} ${c.operator} ${c.value}`),
  };
}

export function generateScoreBreakdown(post: Post, ruleSets?: RuleSet[]): ScoreBreakdown {
  const activeRuleSet = ruleSets?.[0] || generateRuleSet("sample-org");
  const activeRules = activeRuleSet.rules.filter(rule => rule.isActive && rule.status === "active");
  const appliedRules = activeRules
    .filter(() => faker.helpers.maybe(() => true, { probability: 0.4 }))
    .map(rule => generateAppliedRule(rule));

  const baseScore = faker.number.float({ min: 30, max: 70, multipleOf: 0.1 });
  const rulesImpact = appliedRules.reduce((sum, rule) => sum + rule.impact, 0);
  const totalScore = Math.max(0, Math.min(100, baseScore + rulesImpact));

  return {
    postId: post.id,
    totalScore: Math.round(totalScore * 10) / 10,
    baseScore: Math.round(baseScore * 10) / 10,
    appliedRules,
    computedAt: faker.date.recent({ days: 1 }).toISOString(),
    version: activeRuleSet.version,
  };
}

export function generateScoreComparison(ruleSetA: RuleSet, ruleSetB: RuleSet, testPosts: Post[]): ScoreComparison {
  const results: ComparisonResult[] = testPosts.map(post => {
    const scoreA = generateScoreBreakdown(post, [ruleSetA]);
    const scoreB = generateScoreBreakdown(post, [ruleSetB]);
    const difference = scoreB.totalScore - scoreA.totalScore;
    const percentChange = scoreA.totalScore > 0 ? (difference / scoreA.totalScore) * 100 : 0;

    return {
      postId: post.id,
      scoreA,
      scoreB,
      difference: Math.round(difference * 10) / 10,
      percentChange: Math.round(percentChange * 10) / 10,
    };
  });

  return {
    id: faker.string.uuid(),
    name: `${ruleSetA.name} vs ${ruleSetB.name}`,
    ruleSetA,
    ruleSetB,
    testPosts,
    results,
    createdAt: faker.date.recent({ days: 1 }).toISOString(),
    status: faker.helpers.arrayElement(["running", "completed", "failed"] as const),
  };
}

export function generateRuleSets(orgId: string, count: number): RuleSet[] {
  return Array.from({ length: count }, () => generateRuleSet(orgId));
}

export function generateScoringRules(count: number): ScoringRule[] {
  return Array.from({ length: count }, generateScoringRule);
}

// Phase 4: Keyword Coverage Analysis

export function generateKeywordCoverageData(topics: Topic[]): KeywordCoverageData {
  const topic = faker.helpers.arrayElement(topics);
  const keyword = faker.helpers.arrayElement(topic.keywords);
  
  const coverage = faker.number.int({ min: 5, max: 95 });
  const postCount = faker.number.int({ min: 1, max: Math.floor(coverage * 2) });
  const mentions = postCount * faker.number.int({ min: 1, max: 5 });
  const avgEngagement = faker.number.int({ min: 10, max: 5000 });
  const trend = faker.number.float({ min: -50, max: 50, fractionDigits: 1 });

  return {
    keyword,
    coverage,
    postCount,
    mentions,
    avgEngagement,
    trend,
    topicId: topic.id,
    topicName: topic.name,
    topicColor: topic.color,
  };
}

export function generateKeywordCoverageDataset(topics: Topic[], count: number = 50): KeywordCoverageData[] {
  const dataset: KeywordCoverageData[] = [];
  const usedKeywords = new Set<string>();
  
  // Generate unique keywords
  while (dataset.length < count) {
    const data = generateKeywordCoverageData(topics);
    if (!usedKeywords.has(data.keyword)) {
      usedKeywords.add(data.keyword);
      dataset.push(data);
    }
  }
  
  return dataset.sort((a, b) => b.coverage - a.coverage);
}

// Network Visualization System

export function generateNetworkNode(type: NetworkNode['type']): NetworkNode {
  const nodeColors = {
    user: '#3b82f6',
    post: '#10b981', 
    topic: '#f59e0b',
    keyword: '#8b5cf6',
    hashtag: '#ef4444',
  };

  const sizeRanges = {
    user: { min: 10, max: 30 },
    post: { min: 5, max: 20 },
    topic: { min: 15, max: 35 },
    keyword: { min: 8, max: 25 },
    hashtag: { min: 6, max: 18 },
  };

  const nameGenerators = {
    user: () => `@${faker.internet.username()}`,
    post: () => faker.lorem.sentence(3, 6),
    topic: () => faker.helpers.arrayElement(TOPIC_NAMES),
    keyword: () => faker.lorem.word(),
    hashtag: () => `#${faker.lorem.word()}`,
  };

  const range = sizeRanges[type];
  
  return {
    id: faker.string.uuid(),
    name: nameGenerators[type](),
    type,
    size: faker.number.int(range),
    color: nodeColors[type],
    data: {
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
      engagement: faker.number.int({ min: 0, max: 10000 }),
      influence: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    },
  };
}

export function generateNetworkLink(sourceNode: NetworkNode, targetNode: NetworkNode): NetworkLink {
  const linkTypes: NetworkLink['type'][] = ['follows', 'mentions', 'retweets', 'replies', 'shared_topic', 'keyword_match'];
  
  // Determine likely link type based on node types
  let possibleTypes = [...linkTypes];
  if (sourceNode.type === 'user' && targetNode.type === 'user') {
    possibleTypes = ['follows', 'mentions', 'replies'];
  } else if (sourceNode.type === 'user' && targetNode.type === 'post') {
    possibleTypes = ['retweets', 'replies'];
  } else if (sourceNode.type === 'topic' || targetNode.type === 'topic') {
    possibleTypes = ['shared_topic'];
  } else if (sourceNode.type === 'keyword' || targetNode.type === 'keyword') {
    possibleTypes = ['keyword_match'];
  }

  const linkType = faker.helpers.arrayElement(possibleTypes);
  
  const linkColors = {
    follows: '#3b82f6',
    mentions: '#10b981',
    retweets: '#f59e0b', 
    replies: '#8b5cf6',
    shared_topic: '#ef4444',
    keyword_match: '#6b7280',
  };

  return {
    source: sourceNode.id,
    target: targetNode.id,
    value: faker.number.float({ min: 0.1, max: 10, fractionDigits: 1 }),
    type: linkType,
    color: linkColors[linkType],
    data: {
      strength: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      createdAt: faker.date.recent({ days: 30 }).toISOString(),
    },
  };
}

export function generateNetworkCluster(nodes: NetworkNode[]): NetworkCluster {
  const clusterNodes = faker.helpers.arrayElements(nodes, { min: 3, max: Math.min(15, nodes.length) });
  
  return {
    id: faker.string.uuid(),
    name: faker.company.buzzNoun(),
    nodeIds: clusterNodes.map(n => n.id),
    color: faker.color.rgb({ format: 'hex' }),
    center: {
      x: faker.number.int({ min: -200, max: 200 }),
      y: faker.number.int({ min: -200, max: 200 }),
    },
    metrics: {
      density: faker.number.float({ min: 0.1, max: 0.8, fractionDigits: 2 }),
      centralityScore: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
      influence: faker.number.float({ min: 0, max: 1, fractionDigits: 2 }),
    },
  };
}

export function generateNetworkData(nodeCount: number = 50, linkDensity: number = 0.15): NetworkData {
  // Generate nodes with diverse types
  const nodeTypes: NetworkNode['type'][] = ['user', 'post', 'topic', 'keyword', 'hashtag'];
  const typeDistribution = [0.4, 0.3, 0.15, 0.1, 0.05]; // Probability distribution
  
  const nodes: NetworkNode[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    let selectedType: NetworkNode['type'] = 'user';
    
    for (let j = 0; j < nodeTypes.length; j++) {
      cumulativeProbability += typeDistribution[j];
      if (randomValue <= cumulativeProbability) {
        selectedType = nodeTypes[j];
        break;
      }
    }
    
    nodes.push(generateNetworkNode(selectedType));
  }

  // Generate links based on density
  const links: NetworkLink[] = [];
  const maxPossibleLinks = (nodeCount * (nodeCount - 1)) / 2;
  const targetLinkCount = Math.floor(maxPossibleLinks * linkDensity);

  const usedPairs = new Set<string>();
  
  for (let i = 0; i < targetLinkCount; i++) {
    let attempts = 0;
    let sourceNode, targetNode, pairKey;
    
    do {
      sourceNode = faker.helpers.arrayElement(nodes);
      targetNode = faker.helpers.arrayElement(nodes);
      pairKey = [sourceNode.id, targetNode.id].sort().join('-');
      attempts++;
    } while ((sourceNode.id === targetNode.id || usedPairs.has(pairKey)) && attempts < 100);

    if (attempts < 100 && sourceNode && targetNode) {
      usedPairs.add(pairKey);
      links.push(generateNetworkLink(sourceNode, targetNode));
    }
  }

  return { nodes, links };
}

// Phase 5: System Health Enterprise Mock Data Generators

/**
 * Generate realistic system health metrics
 */
export function generateSystemHealthMetrics(): SystemHealthMetrics {
  return {
    uptime: faker.number.int({ min: 86400, max: 2592000 }), // 1 day to 30 days
    cpu: faker.number.float({ min: 5, max: 95, fractionDigits: 1 }),
    memory: faker.number.float({ min: 20, max: 85, fractionDigits: 1 }),
    disk: faker.number.float({ min: 10, max: 75, fractionDigits: 1 }),
    network: {
      in: faker.number.int({ min: 1000000, max: 100000000 }), // 1MB to 100MB/sec
      out: faker.number.int({ min: 500000, max: 50000000 }), // 0.5MB to 50MB/sec
    },
    database: {
      connections: faker.number.int({ min: 10, max: 200 }),
      queries: faker.number.int({ min: 100, max: 10000 }),
      responseTime: faker.number.float({ min: 0.5, max: 50, fractionDigits: 2 }),
    },
    api: {
      requestRate: faker.number.int({ min: 50, max: 5000 }),
      errorRate: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
      responseTime: faker.number.float({ min: 10, max: 500, fractionDigits: 1 }),
    },
    processing: {
      queueSize: faker.number.int({ min: 0, max: 1000 }),
      processedJobs: faker.number.int({ min: 100, max: 50000 }),
      failedJobs: faker.number.int({ min: 0, max: 100 }),
      throughput: faker.number.int({ min: 10, max: 1000 }),
    },
    timestamp: faker.date.recent({ days: 1 }).toISOString(),
  };
}

/**
 * Generate system services with health statuses
 */
export function generateSystemService(): SystemService {
  const statuses: SystemService['status'][] = ['healthy', 'warning', 'critical', 'down'];
  const serviceNames = [
    'API Gateway',
    'Database Primary',
    'Database Replica',
    'Cache Service',
    'Message Queue',
    'File Storage',
    'Search Index',
    'Authentication Service',
    'Notification Service',
    'Analytics Service'
  ];

  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(serviceNames),
    status: faker.helpers.weightedArrayElement([
      { weight: 70, value: 'healthy' },
      { weight: 20, value: 'warning' },
      { weight: 8, value: 'critical' },
      { weight: 2, value: 'down' }
    ]),
    uptime: faker.number.int({ min: 3600, max: 2592000 }), // 1 hour to 30 days
    healthCheck: {
      lastCheck: faker.date.recent({ days: 1 }).toISOString(),
      responseTime: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
      endpoint: `/health/${faker.internet.domainWord()}`,
      message: faker.helpers.maybe(() => faker.lorem.sentence()) || undefined,
    },
    version: `${faker.number.int({ min: 1, max: 3 })}.${faker.number.int({ min: 0, max: 20 })}.${faker.number.int({ min: 0, max: 50 })}`,
    dependencies: faker.helpers.arrayElements(serviceNames.filter(s => s !== serviceNames[0]), { min: 0, max: 3 }),
  };
}

/**
 * Generate job queue data
 */
export function generateJobQueue(): JobQueue {
  const queueNames = [
    'scoring-queue',
    'indexing-queue',
    'notification-queue',
    'export-queue',
    'analytics-queue',
    'cleanup-queue'
  ];

  const jobTypes: JobType[] = Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => ({
    name: faker.helpers.arrayElement([
      'score_post',
      'update_index',
      'send_notification',
      'export_data',
      'calculate_metrics',
      'cleanup_old_data'
    ]),
    count: faker.number.int({ min: 1, max: 100 }),
    avgProcessingTime: faker.number.int({ min: 100, max: 5000 }),
    failureRate: faker.number.float({ min: 0, max: 10, fractionDigits: 2 }),
  }));

  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(queueNames),
    status: faker.helpers.weightedArrayElement([
      { weight: 80, value: 'active' },
      { weight: 15, value: 'paused' },
      { weight: 5, value: 'stopped' }
    ]),
    size: faker.number.int({ min: 0, max: 500 }),
    rate: faker.number.float({ min: 0.5, max: 100, fractionDigits: 1 }),
    jobTypes,
    priority: faker.helpers.arrayElement(['low', 'normal', 'high', 'critical']),
    lastActivity: faker.date.recent({ days: 1 }).toISOString(),
  };
}

/**
 * Generate backfill job data
 */
export function generateBackfillJob(): BackfillJob {
  const status = faker.helpers.arrayElement(['pending', 'running', 'completed', 'failed', 'cancelled']);
  const startTime = status !== 'pending' ? faker.date.past({ years: 0.1 }).toISOString() : undefined;
  const endTime = ['completed', 'failed', 'cancelled'].includes(status) ? 
    faker.date.between({ from: startTime || new Date(), to: new Date() }).toISOString() : undefined;

  const totalRecords = faker.number.int({ min: 1000, max: 1000000 });
  const recordsProcessed = status === 'completed' ? totalRecords : 
    status === 'running' ? faker.number.int({ min: 0, max: totalRecords }) : 0;

  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement([
      'Historical Post Scoring',
      'User Index Rebuild',
      'Topic Migration',
      'Cache Refresh',
      'Analytics Recalculation'
    ]),
    status,
    type: faker.helpers.arrayElement(['data_migration', 'scoring_update', 'index_rebuild', 'cache_refresh']),
    progress: Math.round((recordsProcessed / totalRecords) * 100),
    startTime,
    endTime,
    duration: startTime && endTime ? Math.floor((new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000) : undefined,
    recordsProcessed,
    totalRecords,
    error: status === 'failed' ? faker.lorem.sentence() : undefined,
    parameters: {
      batchSize: faker.number.int({ min: 100, max: 1000 }),
      parallelWorkers: faker.number.int({ min: 1, max: 10 }),
      dryRun: faker.datatype.boolean(),
    },
    createdBy: faker.person.fullName(),
    createdAt: faker.date.past({ years: 0.1 }).toISOString(),
  };
}

/**
 * Generate log entries
 */
export function generateLogEntry(orgId?: string): LogEntry {
  const services = ['api', 'worker', 'database', 'cache', 'auth', 'notifications'];
  const levels: LogEntry['level'][] = ['debug', 'info', 'warn', 'error', 'fatal'];
  
  return {
    id: faker.string.uuid(),
    level: faker.helpers.weightedArrayElement([
      { weight: 10, value: 'debug' },
      { weight: 50, value: 'info' },
      { weight: 25, value: 'warn' },
      { weight: 10, value: 'error' },
      { weight: 5, value: 'fatal' }
    ]),
    timestamp: faker.date.recent({ days: 1 }).toISOString(),
    service: faker.helpers.arrayElement(services),
    message: faker.lorem.sentence(),
    metadata: faker.helpers.maybe(() => ({
      requestId: faker.string.uuid(),
      endpoint: faker.internet.url(),
      duration: faker.number.int({ min: 10, max: 5000 }),
    })),
    requestId: faker.helpers.maybe(() => faker.string.uuid()),
    userId: faker.helpers.maybe(() => faker.string.uuid()),
    orgId: orgId || faker.helpers.maybe(() => faker.string.uuid()),
  };
}

/**
 * Generate bulk operation data
 */
export function generateBulkOperation(): BulkOperation {
  const status = faker.helpers.arrayElement(['queued', 'running', 'completed', 'failed', 'cancelled']);
  const total = faker.number.int({ min: 100, max: 100000 });
  const processed = status === 'completed' ? total : 
    status === 'running' ? faker.number.int({ min: 0, max: total }) : 0;

  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement([
      'Bulk Score Update',
      'Mass User Export',
      'Topic Cleanup',
      'Post Reindexing',
      'Leaderboard Refresh'
    ]),
    type: faker.helpers.arrayElement(['delete', 'update', 'rescore', 'reindex', 'export', 'import']),
    entityType: faker.helpers.arrayElement(['posts', 'users', 'topics', 'leaderboards', 'rules']),
    status,
    progress: {
      processed,
      total,
      percentage: Math.round((processed / total) * 100),
      currentItem: status === 'running' ? faker.lorem.word() : undefined,
    },
    parameters: {
      filters: { dateRange: 'last_30_days' },
      batchSize: faker.number.int({ min: 10, max: 100 }),
    },
    filters: {
      platform: faker.helpers.arrayElement(['twitter', 'linkedin', 'reddit']),
      minScore: faker.number.int({ min: 0, max: 100 }),
    },
    results: status === 'completed' ? {
      successful: faker.number.int({ min: processed * 0.8, max: processed }),
      failed: faker.number.int({ min: 0, max: processed * 0.1 }),
      skipped: faker.number.int({ min: 0, max: processed * 0.1 }),
      errors: [],
    } : undefined,
    safetyControls: {
      dryRun: faker.datatype.boolean(),
      requiresConfirmation: true,
      maxItems: faker.number.int({ min: 1000, max: 100000 }),
      timeout: faker.number.int({ min: 300, max: 3600 }),
    },
    createdBy: faker.person.fullName(),
    createdAt: faker.date.past({ years: 0.1 }).toISOString(),
    startedAt: status !== 'queued' ? faker.date.past({ years: 0.1 }).toISOString() : undefined,
    completedAt: ['completed', 'failed', 'cancelled'].includes(status) ? 
      faker.date.recent({ days: 1 }).toISOString() : undefined,
  };
}

/**
 * Generate slashing action data
 */
export function generateSlashingAction(): SlashingAction {
  const action = faker.helpers.arrayElement(['slash_score', 'boost_score', 'disable', 'flag', 'remove']);
  const status = faker.helpers.arrayElement(['pending', 'applied', 'reverted', 'failed']);

  return {
    id: faker.string.uuid(),
    targetType: faker.helpers.arrayElement(['user', 'post', 'topic']),
    targetId: faker.string.uuid(),
    action,
    amount: ['slash_score', 'boost_score'].includes(action) ? faker.number.int({ min: 1, max: 50 }) : undefined,
    reason: faker.helpers.arrayElement([
      'Spam detected',
      'Community guidelines violation',
      'Manipulated engagement',
      'False information',
      'Harassment',
      'Quality improvement needed'
    ]),
    status,
    severity: faker.helpers.arrayElement(['minor', 'moderate', 'major', 'severe']),
    audit: {
      appliedBy: faker.person.fullName(),
      appliedAt: faker.date.past({ years: 0.1 }).toISOString(),
      reviewedBy: faker.helpers.maybe(() => faker.person.fullName()),
      reviewedAt: faker.helpers.maybe(() => faker.date.recent({ days: 1 }).toISOString()),
      revertedBy: status === 'reverted' ? faker.person.fullName() : undefined,
      revertedAt: status === 'reverted' ? faker.date.recent({ days: 1 }).toISOString() : undefined,
      notes: faker.helpers.maybe(() => faker.lorem.sentence()),
    },
    originalValues: {
      score: faker.number.int({ min: 0, max: 100 }),
      status: 'active',
    },
    newValues: status === 'applied' ? {
      score: faker.number.int({ min: 0, max: 100 }),
      status: action === 'disable' ? 'disabled' : 'active',
    } : undefined,
  };
}

/**
 * Generate multiple system health metrics for historical data
 */
export function generateSystemHealthHistory(count: number = 24): SystemHealthMetrics[] {
  return Array.from({ length: count }, (_, i) => ({
    ...generateSystemHealthMetrics(),
    timestamp: faker.date.between({
      from: new Date(Date.now() - count * 60 * 60 * 1000),
      to: new Date(Date.now() - i * 60 * 60 * 1000)
    }).toISOString(),
  }));
}

// Development helpers
export const sampleData = {
  sampleOrganization: generateOrganization(),
  sampleUser: generateUser(),
  samplePost: generatePost(),
  sampleTopic: generateTopic(),
  sampleLeaderboard: generateLeaderboard("sample-org"),
  sampleScoringRule: generateScoringRule(),
  sampleRuleSet: generateRuleSet("sample-org"),
  sampleScoreBreakdown: generateScoreBreakdown(generatePost()),
  // Phase 4: Topics Management data
  sampleTopics: generateTopics(8),
  get sampleKeywordCoverageData() {
    return generateKeywordCoverageDataset(this.sampleTopics, 30);
  },
  // Phase 4: Network Visualization data
  sampleNetworkData: generateNetworkData(40, 0.12),
  get sampleNetworkClusters() {
    return Array.from({ length: 3 }, () => generateNetworkCluster(this.sampleNetworkData.nodes));
  },
  // Phase 5: System Health Enterprise data
  sampleSystemHealthMetrics: generateSystemHealthMetrics(),
  sampleSystemServices: Array.from({ length: 10 }, () => generateSystemService()),
  sampleJobQueues: Array.from({ length: 6 }, () => generateJobQueue()),
  sampleBackfillJobs: Array.from({ length: 5 }, () => generateBackfillJob()),
  get sampleLogEntries() {
    return Array.from({ length: 100 }, () => generateLogEntry('sample-org'));
  },
  sampleBulkOperations: Array.from({ length: 8 }, () => generateBulkOperation()),
  sampleSlashingActions: Array.from({ length: 12 }, () => generateSlashingAction()),
  get sampleSystemHealthHistory() {
    return generateSystemHealthHistory(24);
  },
};

// Legacy export for backward compatibility
export const mockData = sampleData;
