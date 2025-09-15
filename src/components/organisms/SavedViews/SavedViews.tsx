'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SearchBox } from '@/components/molecules/SearchBox';
import { FilterChip } from '@/components/molecules/FilterChip';
import { 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  Plus, 
  Filter,
  Clock,
  User,
  Globe,
  Lock,
  MoreVertical,
  Play
} from 'lucide-react';

export interface SavedView {
  id: string;
  name: string;
  description?: string;
  filters: Array<{
    id: string;
    field: string;
    operator: string;
    value: string;
  }>;
  columns: string[];
  sorting: Array<{ field: string; direction: 'asc' | 'desc' }>;
  groupBy?: string;
  limit?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublic?: boolean;
  tags?: string[];
  usage?: {
    viewCount: number;
    lastViewed?: string;
  };
}

export interface SavedViewsProps {
  /** List of saved views */
  views?: SavedView[];
  /** Current user ID */
  currentUserId?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Callback when creating a new view */
  onCreateView?: () => void;
  /** Callback when editing a view */
  onEditView?: (view: SavedView) => void;
  /** Callback when running a view */
  onRunView?: (view: SavedView) => void;
  /** Callback when duplicating a view */
  onDuplicateView?: (view: SavedView) => void;
  /** Callback when deleting a view */
  onDeleteView?: (viewId: string) => void;
  /** CSS classes */
  className?: string;
}

export const SavedViews: React.FC<SavedViewsProps> = ({
  views = [],
  currentUserId,
  isLoading = false,
  onCreateView,
  onEditView,
  onRunView,
  onDuplicateView,
  onDeleteView,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filterByOwnership, setFilterByOwnership] = useState<'all' | 'mine' | 'shared'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'updated' | 'usage'>('updated');

  // Get all unique tags from views
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    views.forEach(view => {
      view.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [views]);

  // Filter and sort views
  const filteredViews = React.useMemo(() => {
    let filtered = views.filter(view => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!view.name.toLowerCase().includes(query) && 
            !view.description?.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Tag filter
      if (selectedTags.length > 0) {
        if (!view.tags?.some(tag => selectedTags.includes(tag))) {
          return false;
        }
      }

      // Ownership filter
      if (filterByOwnership === 'mine' && view.createdBy !== currentUserId) {
        return false;
      }
      if (filterByOwnership === 'shared' && view.createdBy === currentUserId) {
        return false;
      }

      return true;
    });

    // Sort views
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'usage':
          return (b.usage?.viewCount || 0) - (a.usage?.viewCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [views, searchQuery, selectedTags, filterByOwnership, sortBy, currentUserId]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-9 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="space-y-3">
                <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                <div className="flex gap-2">
                  <div className="h-5 w-12 bg-muted animate-pulse rounded-full" />
                  <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Saved Views</h2>
          <p className="text-muted-foreground">
            {filteredViews.length} of {views.length} views
          </p>
        </div>
        <Button onClick={onCreateView}>
          <Plus className="h-4 w-4 mr-2" />
          Create View
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-4">
          <SearchBox
            placeholder="Search views..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 max-w-sm"
          />

          <select
            value={filterByOwnership}
            onChange={(e) => setFilterByOwnership(e.target.value as any)}
            className="bg-background border rounded px-3 py-2"
          >
            <option value="all">All Views</option>
            <option value="mine">My Views</option>
            <option value="shared">Shared Views</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-background border rounded px-3 py-2"
          >
            <option value="updated">Recently Updated</option>
            <option value="name">Name</option>
            <option value="usage">Most Used</option>
          </select>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Tags:</span>
            {allTags.map(tag => (
              <FilterChip
                key={tag}
                label={tag}
                isSelected={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
                size="sm"
              />
            ))}
          </div>
        )}
      </Card>

      {/* Views List */}
      {filteredViews.length === 0 ? (
        <Card className="p-12 text-center">
          <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No views found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedTags.length > 0 
              ? 'Try adjusting your filters or search query.'
              : 'Create your first saved view to get started.'
            }
          </p>
          {!searchQuery && selectedTags.length === 0 && (
            <Button onClick={onCreateView}>
              <Plus className="h-4 w-4 mr-2" />
              Create View
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredViews.map((view) => (
            <Card key={view.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{view.name}</h3>
                    {view.isPublic ? (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                    {view.createdBy === currentUserId && (
                      <Badge variant="secondary" className="text-xs">
                        Mine
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  {view.description && (
                    <p className="text-muted-foreground">{view.description}</p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Filter className="h-4 w-4" />
                      {view.filters.length} filters
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {view.columns.length} columns
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Updated {formatRelativeTime(view.updatedAt)}
                    </div>
                    {view.usage && (
                      <div className="flex items-center gap-1">
                        <Play className="h-4 w-4" />
                        {view.usage.viewCount} runs
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {view.tags && view.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {view.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRunView?.(view)}
                    title="Run view"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditView?.(view)}
                    title="Edit view"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDuplicateView?.(view)}
                    title="Duplicate view"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  {view.createdBy === currentUserId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteView?.(view.id)}
                      title="Delete view"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedViews;
