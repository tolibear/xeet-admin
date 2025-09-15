/**
 * TopicEditor Organism Types
 * Atomic types for topic management functionality
 */

import { Topic } from "@/lib/types";
import { BaseOrganismProps } from "@/lib/types";

export interface TopicEditorProps extends BaseOrganismProps {
  /** Topic to edit (undefined for new topic creation) */
  topic?: Topic;
  /** Callback when topic is saved */
  onSave: (topic: Topic) => void;
  /** Callback when editing is cancelled */
  onCancel: () => void;
  /** Callback when topic is deleted */
  onDelete?: (topicId: string) => void;
  /** Whether the form is in a submitting state */
  isSubmitting?: boolean;
}

export interface KeywordInputProps {
  /** Current keywords array */
  keywords: string[];
  /** Callback when keywords change */
  onChange: (keywords: string[]) => void;
  /** Placeholder text for input */
  placeholder?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Maximum number of keywords allowed */
  maxKeywords?: number;
  /** Label for the keyword section */
  label: string;
}

export interface KeywordChipProps {
  /** Keyword text */
  keyword: string;
  /** Callback when keyword is removed */
  onRemove: () => void;
  /** Whether the chip is disabled */
  disabled?: boolean;
  /** Color scheme for the chip */
  variant?: "default" | "secondary" | "destructive";
}

export interface ColorPickerProps {
  /** Current color value */
  value: string;
  /** Callback when color changes */
  onChange: (color: string) => void;
  /** Whether picker is disabled */
  disabled?: boolean;
  /** Label for the color picker */
  label?: string;
}

export interface TopicFormData {
  name: string;
  keywords: string[];
  synonyms: string[];
  stopWords: string[];
  color: string;
  isActive: boolean;
}
