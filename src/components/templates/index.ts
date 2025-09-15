/**
 * Atomic Design Level: TEMPLATES
 *
 * Page-level layouts without content.
 * Define page structure and component placement.
 * Responsive and accessible layout patterns.
 * No business logic, only structural composition.
 *
 * Examples: DashboardTemplate, ListPageTemplate, DetailPageTemplate
 *
 * Principles:
 * - Structural composition only
 * - No business logic or data fetching
 * - Responsive layout patterns
 * - Accessibility built-in
 * - Compose organisms, molecules, and atoms
 * - Flexible and reusable across contexts
 * - Support multiple layout variants
 */

// Dashboard Templates (Phase 2)
export { DashboardTemplate } from './DashboardTemplate';
export type { 
  DashboardTemplateProps, 
  DashboardSection 
} from './DashboardTemplate';
export { 
  DASHBOARD_LAYOUTS,
  createMetricsSection,
  createChartsSection,
  createTableSection,
  createActivitySection
} from './DashboardTemplate';

// List Page Templates (Phase 2)
export { ListPageTemplate } from './ListPageTemplate';
export type { 
  ListPageTemplateProps, 
  ListPageAction 
} from './ListPageTemplate';
export { 
  LIST_PAGE_LAYOUTS,
  createSummaryStats,
  createBulkActions,
  createEmptyState
} from './ListPageTemplate';

// Detail Page Templates (Phase 2)
export { DetailPageTemplate } from './DetailPageTemplate';
export type { 
  DetailPageTemplateProps, 
  DetailPageAction,
  DetailPageTab,
  DetailPageSection 
} from './DetailPageTemplate';
export { DETAIL_PAGE_LAYOUTS } from './DetailPageTemplate';

// Embeddable Templates (Phase 3)
export { EmbeddableIframe } from './EmbeddableIframe';
export type {
  EmbedConfig,
  EmbedSecurityConfig,
  EmbedAnalytics,
  EmbedPreview,
  LeaderboardData,
  EmbedMetrics
} from './EmbeddableIframe';

// Future Templates (Phase 3+)
// export { FormPageTemplate } from './FormPageTemplate';
// export { SettingsPageTemplate } from './SettingsPageTemplate';