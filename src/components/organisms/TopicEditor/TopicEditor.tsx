'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Save, X, Trash2 } from 'lucide-react';
import { Button } from '@/components';
import { Input } from '@/components';
import { Switch } from '@/components';
import { Card } from '@/components';
import { Separator } from '@/components';
import { Alert, AlertDescription } from '@/components';
import { KeywordInput } from '@/components/molecules/KeywordInput';
import { ColorPicker } from '@/components/atoms/ColorPicker';
import { cn } from '@/lib/utils';
import { Topic } from '@/lib/types';
import type { TopicEditorProps, TopicFormData } from './types';

/**
 * TopicEditor Organism
 * Comprehensive topic management interface with atomic keyword components
 * Supports creating new topics and editing existing ones
 */
export const TopicEditor: React.FC<TopicEditorProps> = ({
  topic,
  onSave,
  onCancel,
  onDelete,
  isSubmitting = false,
  loading = false,
  error = null,
  className
}) => {
  const [formData, setFormData] = useState<TopicFormData>({
    name: '',
    keywords: [],
    synonyms: [],
    stopWords: ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'],
    color: '#3b82f6',
    isActive: true
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when topic prop changes
  useEffect(() => {
    if (topic) {
      setFormData({
        name: topic.name,
        keywords: [...topic.keywords],
        synonyms: [...topic.synonyms],
        stopWords: [...topic.stopWords],
        color: topic.color,
        isActive: topic.isActive
      });
      setHasChanges(false);
    }
  }, [topic]);

  // Track changes for unsaved changes warning
  useEffect(() => {
    if (!topic) {
      const hasAnyData = formData.name.trim() || 
                        formData.keywords.length > 0 || 
                        formData.synonyms.length > 0;
      setHasChanges(hasAnyData);
    } else {
      const hasModifications = 
        formData.name !== topic.name ||
        JSON.stringify(formData.keywords) !== JSON.stringify(topic.keywords) ||
        JSON.stringify(formData.synonyms) !== JSON.stringify(topic.synonyms) ||
        JSON.stringify(formData.stopWords) !== JSON.stringify(topic.stopWords) ||
        formData.color !== topic.color ||
        formData.isActive !== topic.isActive;
      
      setHasChanges(hasModifications);
    }
  }, [formData, topic]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Topic name is required';
    }

    if (formData.keywords.length === 0) {
      errors.keywords = 'At least one keyword is required';
    }

    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(formData.color)) {
      errors.color = 'Please select a valid color';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    const topicData: Topic = {
      id: topic?.id || `topic_${Date.now()}`,
      name: formData.name.trim(),
      keywords: formData.keywords,
      synonyms: formData.synonyms,
      stopWords: formData.stopWords,
      color: formData.color,
      isActive: formData.isActive
    };

    try {
      await onSave(topicData);
      setHasChanges(false);
    } catch (err) {
      console.error('Failed to save topic:', err);
    }
  };

  const handleCancel = () => {
    if (hasChanges && !confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    onCancel();
  };

  const handleDelete = () => {
    if (topic && onDelete) {
      if (confirm(`Are you sure you want to delete the topic "${topic.name}"? This action cannot be undone.`)) {
        onDelete(topic.id);
      }
    }
  };

  const updateFormData = (updates: Partial<TopicFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear validation errors for updated fields
    if (validationErrors) {
      const newErrors = { ...validationErrors };
      Object.keys(updates).forEach(key => {
        delete newErrors[key];
      });
      setValidationErrors(newErrors);
    }
  };

  if (loading) {
    return (
      <Card className={cn("w-full max-w-2xl mx-auto p-6", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {topic ? 'Edit Topic' : 'Create Topic'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {topic 
                ? 'Modify topic settings and keywords'
                : 'Create a new topic for content categorization'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="topic-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => updateFormData({ isActive: checked })}
                disabled={isSubmitting}
              />
              <label 
                htmlFor="topic-active" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Active
              </label>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topic Name */}
            <div className="space-y-2">
              <label htmlFor="topic-name" className="text-sm font-medium leading-none">
                Topic Name *
              </label>
              <Input
                id="topic-name"
                value={formData.name}
                onChange={(e) => updateFormData({ name: e.target.value })}
                placeholder="Enter topic name..."
                disabled={isSubmitting}
                className={cn(validationErrors.name && "border-destructive")}
              />
              {validationErrors.name && (
                <p className="text-xs text-destructive">{validationErrors.name}</p>
              )}
            </div>

            {/* Color Picker */}
            <ColorPicker
              value={formData.color}
              onChange={(color) => updateFormData({ color })}
              disabled={isSubmitting}
              label="Topic Color"
              className={cn(validationErrors.color && "text-destructive")}
            />
            {validationErrors.color && (
              <p className="text-xs text-destructive">{validationErrors.color}</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Keywords Management */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Keywords & Content Matching</h3>
            <p className="text-sm text-muted-foreground">
              Configure how this topic matches content through keywords, synonyms, and stop words.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Primary Keywords */}
            <KeywordInput
              keywords={formData.keywords}
              onChange={(keywords) => updateFormData({ keywords })}
              label="Primary Keywords"
              placeholder="Add keywords that define this topic..."
              disabled={isSubmitting}
              maxKeywords={15}
              className={cn(validationErrors.keywords && "text-destructive")}
            />
            {validationErrors.keywords && (
              <p className="text-xs text-destructive">{validationErrors.keywords}</p>
            )}

            {/* Synonyms */}
            <KeywordInput
              keywords={formData.synonyms}
              onChange={(synonyms) => updateFormData({ synonyms })}
              label="Synonyms"
              placeholder="Add words that mean the same as your keywords..."
              disabled={isSubmitting}
              maxKeywords={20}
            />

            {/* Stop Words */}
            <KeywordInput
              keywords={formData.stopWords}
              onChange={(stopWords) => updateFormData({ stopWords })}
              label="Stop Words"
              placeholder="Add words to ignore when matching this topic..."
              disabled={isSubmitting}
              maxKeywords={30}
            />
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div>
            {topic && onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Topic
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !hasChanges}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : topic ? 'Update Topic' : 'Create Topic'}
            </Button>
          </div>
        </div>

        {/* Unsaved Changes Warning */}
        {hasChanges && !isSubmitting && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have unsaved changes. Don't forget to save your topic.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};

export default TopicEditor;
