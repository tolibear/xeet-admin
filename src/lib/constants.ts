/**
 * Xeet Admin Platform - Application Constants
 * Enterprise-scale configuration and constants
 */

// Performance Targets (from PRD)
export const PERFORMANCE = {
  INITIAL_TTI_TARGET: 3000, // 3 seconds
  TABLE_INTERACTION_TARGET: 250, // 250ms for 100k rows
  LIVE_FEED_LATENCY: 2000, // 2s from ingest to UI
  VIRTUALIZATION_THRESHOLD: 1000, // virtualize tables > 1k rows
  SEARCH_DEBOUNCE: 300, // 300ms debounce
  PAGINATION_LIMIT: 50, // standard page size
} as const;

// Scale Targets
export const SCALE = {
  POSTS: 500000, // 500k+ posts
  SIGNALS: 1900000, // 1.9M signals
  USERS: 493000, // 493k users
} as const;

// Atomic Component States
export const COMPONENT_STATES = {
  LOADING: "loading",
  ERROR: "error",
  SUCCESS: "success",
  IDLE: "idle",
  DISABLED: "disabled",
} as const;

// Atomic Design Levels
export const ATOMIC_LEVELS = {
  ATOM: "atom",
  MOLECULE: "molecule",
  ORGANISM: "organism",
  TEMPLATE: "template",
  SYSTEM: "system",
  APPLICATION: "application",
} as const;

// Multi-tenancy
export const ORG_ROUTES = {
  OVERVIEW: "/{org}",
  RESEARCH: "/{org}/research",
  LEADERBOARDS: "/{org}/leaderboards",
  SYSTEM: "/{org}/system",
} as const;

// Data Table Configuration
export const TABLE_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  VIRTUAL_ROW_HEIGHT: 50,
  OVERSCAN: 10,
} as const;
