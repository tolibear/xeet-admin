"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";
import { Badge } from "@/components";
import { Button } from "@/components";
import { Input } from "@/components";
import { Textarea } from "@/components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components";
import { Switch } from "@/components";
import { Slider } from "@/components";
import { Separator } from "@/components";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components";
import { 
  Trophy,
  Settings,
  Eye,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Info,
  Users,
  Clock,
  Target,
  BarChart3,
  Globe,
  Lock,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { 
  LeaderboardBuilderProps,
  LeaderboardBasicInfoProps,
  LeaderboardCriteriaProps,
  LeaderboardSettingsProps,
  LeaderboardPreviewProps,
  LeaderboardFormData,
  LeaderboardBasicInfo,
  FormSectionProps,
  FormValidationErrors,
  TimeframeSelectProps,
  PlatformMultiSelectProps,
  SignalTypeMultiSelectProps,
  VisibilityToggleProps,
  SlugInputProps
} from "./types";
import type { 
  LeaderboardCriteria, 
  LeaderboardSettings, 
  Platform, 
  Topic, 
  SignalType,
  Leaderboard 
} from "@/lib/types";

/**
 * LeaderboardBuilder Organism
 * 
 * Comprehensive leaderboard creation system built from atomic form components:
 * - Multi-step form with validation
 * - Real-time preview capability
 * - Atomic form components composition
 * - Auto-slug generation
 * - Platform/topic/signal selection
 * - Advanced configuration options
 */
export function LeaderboardBuilder({
  initialData,
  platforms,
  topics,
  signalTypes,
  showPreview = true,
  isEditing = false,
  readOnly = false,
  onSubmit,
  onCancel,
  onPreview,
  onChange,
  loading = false,
  error,
  className,
  "data-testid": testId = "leaderboard-builder",
}: LeaderboardBuilderProps) {
  // Form state management
  const [formData, setFormData] = useState<LeaderboardFormData>(() => ({
    basicInfo: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      slug: initialData?.slug || "",
      isPublic: initialData?.isPublic || false,
    },
    criteria: initialData?.criteria || {
      timeframe: "week",
      platforms: [],
      topics: [],
      signals: ["engagement", "quality"],
      minScore: 0,
      maxEntries: 50,
    },
    settings: initialData?.settings || {
      updateFrequency: "hourly",
      showScores: true,
      showChange: true,
      allowEmbedding: false,
    },
  }));

  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.basicInfo.name && !touched.slug) {
      const slug = generateSlug(formData.basicInfo.name);
      setFormData(prev => ({
        ...prev,
        basicInfo: { ...prev.basicInfo, slug }
      }));
    }
  }, [formData.basicInfo.name, touched.slug]);

  // Validation
  const validateForm = useCallback((): FormValidationErrors => {
    const newErrors: FormValidationErrors = {};

    // Basic info validation
    if (!formData.basicInfo.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.basicInfo.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.basicInfo.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.basicInfo.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.basicInfo.slug)) {
      newErrors.slug = "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    // Criteria validation
    if (formData.criteria.platforms.length === 0) {
      newErrors.platforms = "At least one platform must be selected";
    }

    if (formData.criteria.signals.length === 0) {
      newErrors.signals = "At least one signal type must be selected";
    }

    if (formData.criteria.maxEntries < 5 || formData.criteria.maxEntries > 1000) {
      newErrors.maxEntries = "Max entries must be between 5 and 1000";
    }

    return newErrors;
  }, [formData]);

  const isFormValid = useMemo(() => {
    const validationErrors = validateForm();
    return Object.keys(validationErrors).length === 0;
  }, [validateForm]);

  // Update errors when form data changes
  useEffect(() => {
    const newErrors = validateForm();
    setErrors(newErrors);
  }, [validateForm]);

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      const leaderboardData: Partial<Leaderboard> = {
        ...formData.basicInfo,
        criteria: formData.criteria,
        settings: formData.settings,
      };
      onChange(leaderboardData);
    }
  }, [formData, onChange]);

  const handleBasicInfoChange = useCallback((basicInfo: LeaderboardBasicInfo) => {
    setFormData(prev => ({ ...prev, basicInfo }));
    setTouched(prev => ({ ...prev, name: true, description: true, slug: true }));
  }, []);

  const handleCriteriaChange = useCallback((criteria: LeaderboardCriteria) => {
    setFormData(prev => ({ ...prev, criteria }));
    setTouched(prev => ({ ...prev, platforms: true, signals: true }));
  }, []);

  const handleSettingsChange = useCallback((settings: LeaderboardSettings) => {
    setFormData(prev => ({ ...prev, settings }));
  }, []);

  const handleSubmit = useCallback(() => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const allFields = ['name', 'description', 'slug', 'platforms', 'signals'];
    setTouched(allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    if (Object.keys(validationErrors).length === 0 && onSubmit) {
      const leaderboardData: Partial<Leaderboard> = {
        ...formData.basicInfo,
        criteria: formData.criteria,
        settings: formData.settings,
      };
      onSubmit(leaderboardData);
    }
  }, [formData, validateForm, onSubmit]);

  const handlePreview = useCallback(() => {
    if (onPreview) {
      onPreview(formData.criteria);
    }
  }, [formData.criteria, onPreview]);

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)} data-testid={testId}>
        <CardHeader className="space-y-2">
          <div className="h-6 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-destructive", className)} data-testid={testId}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)} data-testid={testId}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                {isEditing ? "Edit Leaderboard" : "Create Leaderboard"}
              </CardTitle>
              <CardDescription>
                Configure your leaderboard settings and criteria
              </CardDescription>
            </div>
            {showPreview && (
              <Button 
                variant="outline" 
                onClick={handlePreview}
                className="gap-2"
                disabled={!isFormValid}
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <FormSection
            title="Basic Information"
            description="Name, description, and visibility settings"
            collapsed={collapsedSections.basicInfo}
            onToggle={(collapsed) => setCollapsedSections(prev => ({ ...prev, basicInfo: collapsed }))}
          >
            <LeaderboardBasicInfo
              values={formData.basicInfo}
              errors={errors}
              disabled={readOnly}
              onChange={handleBasicInfoChange}
            />
          </FormSection>

          {/* Criteria */}
          <FormSection
            title="Leaderboard Criteria"
            description="Define what content and metrics to include"
            collapsed={collapsedSections.criteria}
            onToggle={(collapsed) => setCollapsedSections(prev => ({ ...prev, criteria: collapsed }))}
          >
            <LeaderboardCriteria
              criteria={formData.criteria}
              platforms={platforms}
              topics={topics}
              signalTypes={signalTypes}
              errors={errors}
              disabled={readOnly}
              onChange={handleCriteriaChange}
            />
          </FormSection>

          {/* Settings */}
          <FormSection
            title="Display & Update Settings"
            description="Control how the leaderboard updates and displays"
            collapsed={collapsedSections.settings}
            onToggle={(collapsed) => setCollapsedSections(prev => ({ ...prev, settings: collapsed }))}
          >
            <LeaderboardSettings
              settings={formData.settings}
              errors={errors}
              disabled={readOnly}
              onChange={handleSettingsChange}
            />
          </FormSection>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Form Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Form Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {isFormValid ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
                <span className={cn(
                  "text-sm",
                  isFormValid ? "text-green-600" : "text-red-600"
                )}>
                  {isFormValid ? "Ready to submit" : "Form has errors"}
                </span>
              </div>
              
              {Object.keys(errors).length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">Errors:</div>
                  {Object.values(errors).map((error, index) => (
                    <div key={index} className="text-xs text-destructive">
                      • {error}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-medium">{formData.criteria.platforms.length}</div>
                  <div className="text-xs text-muted-foreground">Platforms</div>
                </div>
                <div>
                  <div className="font-medium">{formData.criteria.topics.length}</div>
                  <div className="text-xs text-muted-foreground">Topics</div>
                </div>
                <div>
                  <div className="font-medium">{formData.criteria.signals.length}</div>
                  <div className="text-xs text-muted-foreground">Signals</div>
                </div>
                <div>
                  <div className="font-medium">{formData.criteria.maxEntries}</div>
                  <div className="text-xs text-muted-foreground">Max Entries</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  {formData.basicInfo.isPublic ? (
                    <Globe className="h-3 w-3 text-green-600" />
                  ) : (
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className="text-xs">
                    {formData.basicInfo.isPublic ? "Public" : "Private"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs capitalize">
                    {formData.settings.updateFrequency} updates
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-3 w-3" />
                  <span className="text-xs capitalize">
                    {formData.criteria.timeframe} timeframe
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {!readOnly && (
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button 
                  onClick={handleSubmit}
                  disabled={!isFormValid || loading}
                  className="w-full"
                >
                  {isEditing ? "Update Leaderboard" : "Create Leaderboard"}
                </Button>
                {onCancel && (
                  <Button 
                    variant="outline" 
                    onClick={onCancel}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * FormSection Component
 * Collapsible section wrapper for form sections
 */
function FormSection({
  title,
  description,
  collapsed = false,
  collapsible = true,
  children,
  onToggle,
}: FormSectionProps) {
  return (
    <Card>
      {collapsible ? (
        <Collapsible open={!collapsed} onOpenChange={(open) => onToggle?.(!open)}>
          <CollapsibleTrigger className="w-full">
            <CardHeader className="hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <CardTitle className="text-base">{title}</CardTitle>
                  {description && (
                    <CardDescription>{description}</CardDescription>
                  )}
                </div>
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>{children}</CardContent>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </>
      )}
    </Card>
  );
}

/**
 * LeaderboardBasicInfo Component
 */
function LeaderboardBasicInfo({
  values,
  errors,
  disabled,
  onChange,
}: LeaderboardBasicInfoProps) {
  const handleChange = (field: keyof LeaderboardBasicInfo, value: any) => {
    onChange({ ...values, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name *</label>
        <Input
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter leaderboard name"
          disabled={disabled}
        />
        {errors?.name && (
          <div className="text-xs text-destructive mt-1">{errors.name}</div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium">Description *</label>
        <Textarea
          value={values.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Describe what this leaderboard tracks"
          disabled={disabled}
          rows={3}
        />
        {errors?.description && (
          <div className="text-xs text-destructive mt-1">{errors.description}</div>
        )}
      </div>

      <SlugInput
        value={values.slug}
        baseName={values.name}
        onChange={(slug) => handleChange("slug", slug)}
        disabled={disabled}
        error={errors?.slug}
      />

      <VisibilityToggle
        isPublic={values.isPublic}
        onChange={(isPublic) => handleChange("isPublic", isPublic)}
        disabled={disabled}
      />
    </div>
  );
}

/**
 * LeaderboardCriteria Component
 */
function LeaderboardCriteria({
  criteria,
  platforms,
  topics,
  signalTypes,
  errors,
  disabled,
  onChange,
}: LeaderboardCriteriaProps) {
  const handleChange = (field: keyof LeaderboardCriteria, value: any) => {
    onChange({ ...criteria, [field]: value });
  };

  return (
    <div className="space-y-6">
      <TimeframeSelect
        value={criteria.timeframe}
        onChange={(timeframe) => handleChange("timeframe", timeframe)}
        disabled={disabled}
      />

      <PlatformMultiSelect
        value={criteria.platforms}
        platforms={platforms}
        onChange={(platformIds) => handleChange("platforms", platformIds)}
        disabled={disabled}
      />
      {errors?.platforms && (
        <div className="text-xs text-destructive">{errors.platforms}</div>
      )}

      <div>
        <label className="text-sm font-medium">Topics (Optional)</label>
        <div className="mt-1">
          <TopicMultiSelect
            value={criteria.topics}
            topics={topics}
            onChange={(topicNames) => handleChange("topics", topicNames)}
            disabled={disabled}
          />
        </div>
      </div>

      <SignalTypeMultiSelect
        value={criteria.signals}
        signalTypes={signalTypes}
        onChange={(signals) => handleChange("signals", signals)}
        disabled={disabled}
      />
      {errors?.signals && (
        <div className="text-xs text-destructive">{errors.signals}</div>
      )}

      <div>
        <label className="text-sm font-medium">
          Minimum Score: {criteria.minScore}
        </label>
        <div className="mt-2">
          <Slider
            value={[criteria.minScore]}
            onValueChange={([minScore]) => handleChange("minScore", minScore)}
            max={100}
            step={1}
            disabled={disabled}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Maximum Entries</label>
        <Select
          value={criteria.maxEntries.toString()}
          onValueChange={(value) => handleChange("maxEntries", parseInt(value))}
          disabled={disabled}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100, 250, 500].map(num => (
              <SelectItem key={num} value={num.toString()}>
                {num} entries
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors?.maxEntries && (
          <div className="text-xs text-destructive mt-1">{errors.maxEntries}</div>
        )}
      </div>
    </div>
  );
}

/**
 * LeaderboardSettings Component
 */
function LeaderboardSettings({
  settings,
  errors,
  disabled,
  onChange,
}: LeaderboardSettingsProps) {
  const handleChange = (field: keyof LeaderboardSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Update Frequency</label>
        <Select
          value={settings.updateFrequency}
          onValueChange={(value) => handleChange("updateFrequency", value)}
          disabled={disabled}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realtime">Real-time</SelectItem>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Show Scores</label>
          <Switch
            checked={settings.showScores}
            onCheckedChange={(checked) => handleChange("showScores", checked)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Show Rank Changes</label>
          <Switch
            checked={settings.showChange}
            onCheckedChange={(checked) => handleChange("showChange", checked)}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Allow Embedding</label>
          <Switch
            checked={settings.allowEmbedding}
            onCheckedChange={(checked) => handleChange("allowEmbedding", checked)}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * TimeframeSelect Component
 */
function TimeframeSelect({ value, onChange, disabled }: TimeframeSelectProps) {
  return (
    <div>
      <label className="text-sm font-medium">Timeframe</label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="mt-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hour">Last Hour</SelectItem>
          <SelectItem value="day">Last Day</SelectItem>
          <SelectItem value="week">Last Week</SelectItem>
          <SelectItem value="month">Last Month</SelectItem>
          <SelectItem value="year">Last Year</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/**
 * PlatformMultiSelect Component
 */
function PlatformMultiSelect({
  value,
  platforms,
  onChange,
  disabled,
  maxSelections = 5,
}: PlatformMultiSelectProps) {
  const togglePlatform = (platformId: string) => {
    if (value.includes(platformId)) {
      onChange(value.filter(id => id !== platformId));
    } else if (value.length < maxSelections) {
      onChange([...value, platformId]);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium">Platforms *</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {platforms.map(platform => (
          <Badge
            key={platform.id}
            variant={value.includes(platform.id) ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-colors",
              !disabled && "hover:bg-primary/80"
            )}
            onClick={disabled ? undefined : () => togglePlatform(platform.id)}
          >
            <span className="mr-1" style={{ color: platform.color }}>●</span>
            {platform.name}
          </Badge>
        ))}
      </div>
      {value.length >= maxSelections && (
        <div className="text-xs text-muted-foreground mt-1">
          Maximum {maxSelections} platforms selected
        </div>
      )}
    </div>
  );
}

/**
 * TopicMultiSelect Component
 */
function TopicMultiSelect({
  value,
  topics,
  onChange,
  disabled,
}: { value: string[]; topics: Topic[]; onChange: (topics: string[]) => void; disabled?: boolean; }) {
  const toggleTopic = (topicName: string) => {
    if (value.includes(topicName)) {
      onChange(value.filter(name => name !== topicName));
    } else {
      onChange([...value, topicName]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {topics.slice(0, 10).map(topic => (
        <Badge
          key={topic.id}
          variant={value.includes(topic.name) ? "default" : "outline"}
          className={cn(
            "cursor-pointer transition-colors",
            !disabled && "hover:bg-primary/80"
          )}
          onClick={disabled ? undefined : () => toggleTopic(topic.name)}
        >
          {topic.name}
        </Badge>
      ))}
    </div>
  );
}

/**
 * SignalTypeMultiSelect Component
 */
function SignalTypeMultiSelect({
  value,
  signalTypes,
  onChange,
  disabled,
}: SignalTypeMultiSelectProps) {
  const toggleSignal = (signal: SignalType) => {
    if (value.includes(signal)) {
      onChange(value.filter(s => s !== signal));
    } else {
      onChange([...value, signal]);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium">Signal Types *</label>
      <div className="mt-2 flex flex-wrap gap-2">
        {signalTypes.map(signal => (
          <Badge
            key={signal}
            variant={value.includes(signal) ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-colors capitalize",
              !disabled && "hover:bg-primary/80"
            )}
            onClick={disabled ? undefined : () => toggleSignal(signal)}
          >
            {signal}
          </Badge>
        ))}
      </div>
    </div>
  );
}

/**
 * VisibilityToggle Component
 */
function VisibilityToggle({ isPublic, onChange, disabled }: VisibilityToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <div className="flex items-center gap-2">
          {isPublic ? (
            <Globe className="h-4 w-4 text-green-600" />
          ) : (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-medium">
            {isPublic ? "Public" : "Private"}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {isPublic 
            ? "Anyone can view this leaderboard"
            : "Only organization members can view this leaderboard"
          }
        </div>
      </div>
      <Switch
        checked={isPublic}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

/**
 * SlugInput Component
 */
function SlugInput({
  value,
  baseName,
  onChange,
  disabled,
  error,
  autoGenerate = true,
}: SlugInputProps) {
  const handleNameToSlug = () => {
    if (baseName) {
      const slug = generateSlug(baseName);
      onChange(slug);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">URL Slug *</label>
        {autoGenerate && baseName && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNameToSlug}
            disabled={disabled}
            className="h-auto p-1 text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Generate
          </Button>
        )}
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
        placeholder="url-friendly-name"
        disabled={disabled}
      />
      {error && (
        <div className="text-xs text-destructive mt-1">{error}</div>
      )}
    </div>
  );
}

// Utility functions
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}
