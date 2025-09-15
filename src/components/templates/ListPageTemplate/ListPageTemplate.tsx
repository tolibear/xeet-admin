'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface ListPageAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost' | 'link' | 'secondary';
  disabled?: boolean;
}

export interface ListPageTemplateProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Header actions (create, import, etc.) */
  headerActions?: ListPageAction[];
  /** Filter/search component */
  filters?: React.ReactNode;
  /** Main data component (table, list, etc.) */
  children: React.ReactNode;
  /** Pagination component */
  pagination?: React.ReactNode;
  /** Sidebar content (filters, navigation) */
  sidebar?: React.ReactNode;
  /** Bulk actions when items are selected */
  bulkActions?: React.ReactNode;
  /** Summary stats component */
  summary?: React.ReactNode;
  /** Whether to show the sidebar */
  showSidebar?: boolean;
  /** Whether to add padding to the container */
  padded?: boolean;
  /** Whether to use cards for sections */
  sectioned?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state component */
  emptyState?: React.ReactNode;
  /** Error state */
  error?: string;
  /** CSS classes for the main container */
  className?: string;
}

export const ListPageTemplate: React.FC<ListPageTemplateProps> = ({
  title,
  description,
  headerActions = [],
  filters,
  children,
  pagination,
  sidebar,
  bulkActions,
  summary,
  showSidebar = false,
  padded = true,
  sectioned = false,
  isLoading = false,
  emptyState,
  error,
  className = '',
}) => {
  const ContentWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
    children, 
    className: wrapperClassName 
  }) => {
    if (sectioned) {
      return <Card className={wrapperClassName}>{children}</Card>;
    }
    return <div className={wrapperClassName}>{children}</div>;
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-background ${padded ? 'p-6' : ''} ${className}`}>
        {(title || headerActions.length > 0) && (
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-8 w-64 bg-muted animate-pulse rounded" />
                <div className="h-4 w-96 bg-muted animate-pulse rounded" />
              </div>
              <div className="flex gap-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-9 w-24 bg-muted animate-pulse rounded" />
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="h-12 bg-muted animate-pulse rounded" />
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-background ${padded ? 'p-6' : ''} ${className}`}>
        <Card className="p-12 text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className={showSidebar ? 'flex' : ''}>
        {/* Sidebar */}
        {showSidebar && sidebar && (
          <div className="w-80 flex-shrink-0 border-r bg-card">
            <div className="p-6">
              {sidebar}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`flex-1 ${padded ? 'p-6' : ''}`}>
          {/* Header */}
          {(title || description || headerActions.length > 0) && (
            <div className="mb-8">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  {title && (
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                  )}
                  {description && (
                    <p className="text-muted-foreground">{description}</p>
                  )}
                </div>
                
                {headerActions.length > 0 && (
                  <div className="flex items-center gap-3">
                    {headerActions.map((action) => (
                      <Button
                        key={action.id}
                        variant={action.variant || 'default'}
                        onClick={action.onClick}
                        disabled={action.disabled}
                        size="sm"
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Summary Stats */}
          {summary && (
            <div className="mb-6">
              <ContentWrapper className={sectioned ? 'p-6' : ''}>
                {summary}
              </ContentWrapper>
            </div>
          )}

          {/* Filters */}
          {filters && (
            <div className="mb-6">
              <ContentWrapper className={sectioned ? 'p-6' : ''}>
                {filters}
              </ContentWrapper>
            </div>
          )}

          {/* Bulk Actions */}
          {bulkActions && (
            <div className="mb-4">
              <ContentWrapper className={sectioned ? 'p-4' : 'p-4 bg-muted/50 rounded-lg'}>
                {bulkActions}
              </ContentWrapper>
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-6">
            <ContentWrapper className={sectioned ? '' : ''}>
              {children}
            </ContentWrapper>

            {/* Pagination */}
            {pagination && (
              <div className="flex justify-center">
                {pagination}
              </div>
            )}
          </div>

          {/* Empty State */}
          {emptyState && !children && (
            <ContentWrapper className={sectioned ? 'p-12' : 'p-12 text-center'}>
              {emptyState}
            </ContentWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

// Common list page configurations
export const LIST_PAGE_LAYOUTS = {
  // Standard table layout
  table: {
    sectioned: false,
    showSidebar: false,
  },
  
  // With sidebar filters
  withSidebar: {
    sectioned: true,
    showSidebar: true,
  },
  
  // Card-based sections
  sectioned: {
    sectioned: true,
    showSidebar: false,
  },
  
  // Full-width layout
  fullWidth: {
    sectioned: false,
    showSidebar: false,
    padded: false,
  },
} as const;

// Common list page components
export const createSummaryStats = (stats: Array<{ label: string; value: string | number; trend?: string }>) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((stat, i) => (
      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
        {stat.trend && (
          <Badge variant={stat.trend.startsWith('+') ? 'default' : 'secondary'}>
            {stat.trend}
          </Badge>
        )}
      </div>
    ))}
  </div>
);

export const createBulkActions = (
  selectedCount: number, 
  actions: Array<{ label: string; onClick: () => void; variant?: 'default' | 'destructive' }>
) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">
      {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
    </span>
    <div className="flex items-center gap-2">
      {actions.map((action, i) => (
        <Button
          key={i}
          variant={action.variant || 'outline'}
          size="sm"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  </div>
);

export const createEmptyState = (
  title: string,
  description: string,
  action?: { label: string; onClick: () => void }
) => (
  <div className="text-center py-12">
    <svg className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v4.01" />
    </svg>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
    {action && (
      <Button onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
);

export default ListPageTemplate;
