/**
 * LeaderboardBuilder Organism Types
 * Atomic form components for leaderboard creation and configuration
 */

import type { 
  Leaderboard,
  LeaderboardCriteria,
  LeaderboardSettings,
  Platform,
  Topic,
  SignalType,
  BaseOrganismProps 
} from "@/lib/types";

export interface LeaderboardBuilderProps extends BaseOrganismProps {
  /** Initial leaderboard data for editing */
  initialData?: Partial<Leaderboard>;
  /** Available platforms to choose from */
  platforms: Platform[];
  /** Available topics to choose from */
  topics: Topic[];
  /** Available signal types */
  signalTypes: SignalType[];
  /** Whether to show preview section */
  showPreview?: boolean;
  /** Whether form is in edit mode */
  isEditing?: boolean;
  /** Whether form is read-only */
  readOnly?: boolean;
  /** Callback when form is submitted */
  onSubmit?: (leaderboard: Partial<Leaderboard>) => void;
  /** Callback when form is cancelled */
  onCancel?: () => void;
  /** Callback when preview is requested */
  onPreview?: (criteria: LeaderboardCriteria) => void;
  /** Callback when form data changes */
  onChange?: (data: Partial<Leaderboard>) => void;
}

export interface LeaderboardBasicInfoProps {
  /** Current form values */
  values: LeaderboardBasicInfo;
  /** Whether fields are disabled */
  disabled?: boolean;
  /** Validation errors */
  errors?: Record<string, string>;
  /** Change handler */
  onChange: (values: LeaderboardBasicInfo) => void;
}

export interface LeaderboardCriteriaProps {
  /** Current criteria values */
  criteria: LeaderboardCriteria;
  /** Available platforms */
  platforms: Platform[];
  /** Available topics */
  topics: Topic[];
  /** Available signal types */
  signalTypes: SignalType[];
  /** Whether fields are disabled */
  disabled?: boolean;
  /** Validation errors */
  errors?: Record<string, string>;
  /** Change handler */
  onChange: (criteria: LeaderboardCriteria) => void;
}

export interface LeaderboardSettingsProps {
  /** Current settings values */
  settings: LeaderboardSettings;
  /** Whether fields are disabled */
  disabled?: boolean;
  /** Validation errors */
  errors?: Record<string, string>;
  /** Change handler */
  onChange: (settings: LeaderboardSettings) => void;
}

export interface LeaderboardPreviewProps {
  /** Leaderboard configuration to preview */
  config: Partial<Leaderboard>;
  /** Sample entries for preview */
  sampleEntries?: any[];
  /** Whether preview is loading */
  loading?: boolean;
  /** Callback to refresh preview */
  onRefresh?: () => void;
}

export interface LeaderboardFormData {
  basicInfo: LeaderboardBasicInfo;
  criteria: LeaderboardCriteria;
  settings: LeaderboardSettings;
}

export interface LeaderboardBasicInfo {
  name: string;
  description: string;
  slug: string;
  isPublic: boolean;
}

export interface FormSectionProps {
  /** Section title */
  title: string;
  /** Section description */
  description?: string;
  /** Whether section is collapsed */
  collapsed?: boolean;
  /** Whether section can be collapsed */
  collapsible?: boolean;
  /** Children content */
  children: React.ReactNode;
  /** Callback when collapsed state changes */
  onToggle?: (collapsed: boolean) => void;
}

export interface TimeframeSelectProps {
  /** Current timeframe value */
  value: LeaderboardCriteria["timeframe"];
  /** Whether field is disabled */
  disabled?: boolean;
  /** Change handler */
  onChange: (timeframe: LeaderboardCriteria["timeframe"]) => void;
}

export interface PlatformMultiSelectProps {
  /** Selected platform IDs */
  value: string[];
  /** Available platforms */
  platforms: Platform[];
  /** Whether field is disabled */
  disabled?: boolean;
  /** Maximum number of platforms that can be selected */
  maxSelections?: number;
  /** Change handler */
  onChange: (platformIds: string[]) => void;
}

export interface TopicMultiSelectProps {
  /** Selected topic names */
  value: string[];
  /** Available topics */
  topics: Topic[];
  /** Whether field is disabled */
  disabled?: boolean;
  /** Maximum number of topics that can be selected */
  maxSelections?: number;
  /** Change handler */
  onChange: (topicNames: string[]) => void;
}

export interface SignalTypeMultiSelectProps {
  /** Selected signal types */
  value: SignalType[];
  /** Available signal types */
  signalTypes: SignalType[];
  /** Whether field is disabled */
  disabled?: boolean;
  /** Change handler */
  onChange: (signals: SignalType[]) => void;
}

export interface ScoreRangeSliderProps {
  /** Minimum score value */
  minScore: number;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Change handler */
  onChange: (minScore: number) => void;
}

export interface MaxEntriesSelectProps {
  /** Current max entries value */
  value: number;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Available options */
  options?: number[];
  /** Change handler */
  onChange: (maxEntries: number) => void;
}

export interface UpdateFrequencySelectProps {
  /** Current update frequency */
  value: LeaderboardSettings["updateFrequency"];
  /** Whether field is disabled */
  disabled?: boolean;
  /** Change handler */
  onChange: (frequency: LeaderboardSettings["updateFrequency"]) => void;
}

export interface VisibilityToggleProps {
  /** Whether leaderboard is public */
  isPublic: boolean;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Change handler */
  onChange: (isPublic: boolean) => void;
}

export interface SlugInputProps {
  /** Current slug value */
  value: string;
  /** Base name to generate slug from */
  baseName?: string;
  /** Whether field is disabled */
  disabled?: boolean;
  /** Validation error */
  error?: string;
  /** Whether to auto-generate from name */
  autoGenerate?: boolean;
  /** Change handler */
  onChange: (slug: string) => void;
  /** Callback to check if slug is available */
  onValidate?: (slug: string) => Promise<boolean>;
}

export interface FormValidationErrors {
  name?: string;
  description?: string;
  slug?: string;
  platforms?: string;
  topics?: string;
  signals?: string;
  minScore?: string;
  maxEntries?: string;
  updateFrequency?: string;
}

export interface LeaderboardBuilderState {
  data: LeaderboardFormData;
  errors: FormValidationErrors;
  touched: Record<string, boolean>;
  isValid: boolean;
  isDirty: boolean;
}
