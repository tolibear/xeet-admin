'use client';

import React from 'react';
import { Card } from '@/components';
import { Button } from '@/components';
import { Badge } from '@/components';
import { ArrowLeft } from 'lucide-react';

export interface DetailPageAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost' | 'link' | 'secondary';
  disabled?: boolean;
}

export interface DetailPageTab {
  id: string;
  label: string;
  content: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface DetailPageSection {
  id: string;
  title?: string;
  content: React.ReactNode;
  actions?: DetailPageAction[];
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface DetailPageTemplateProps {
  /** Page title */
  title?: string;
  /** Subtitle or description */
  subtitle?: string;
  /** Status badge */
  status?: {
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  /** Back navigation */
  backAction?: {
    label: string;
    onClick: () => void;
  };
  /** Header actions (edit, delete, etc.) */
  headerActions?: DetailPageAction[];
  /** Main content tabs */
  tabs?: DetailPageTab[];
  /** Sections for non-tabbed content */
  sections?: DetailPageSection[];
  /** Sidebar content */
  sidebar?: React.ReactNode;
  /** Whether to show the sidebar */
  showSidebar?: boolean;
  /** Layout variant */
  layout?: 'tabs' | 'sections' | 'custom';
  /** Whether to add padding to the container */
  padded?: boolean;
  /** Whether to use cards for sections */
  sectioned?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string;
  /** Not found state */
  notFound?: boolean;
  /** Children for custom layouts */
  children?: React.ReactNode;
  /** CSS classes for the main container */
  className?: string;
}

export const DetailPageTemplate: React.FC<DetailPageTemplateProps> = ({
  title,
  subtitle,
  status,
  backAction,
  headerActions = [],
  tabs = [],
  sections = [],
  sidebar,
  showSidebar = false,
  layout = 'sections',
  padded = true,
  sectioned = true,
  isLoading = false,
  error,
  notFound = false,
  children,
  className = '',
}) => {
  const [activeTab, setActiveTab] = React.useState(tabs[0]?.id || '');
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(sections.filter(s => s.defaultCollapsed).map(s => s.id))
  );

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const ContentWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
    children, 
    className: wrapperClassName 
  }) => {
    if (sectioned) {
      return <Card className={`p-6 ${wrapperClassName || ''}`}>{children}</Card>;
    }
    return <div className={wrapperClassName}>{children}</div>;
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-background ${padded ? 'p-6' : ''} ${className}`}>
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-9 w-20 bg-muted animate-pulse rounded" />
            <div className="flex-1">
              <div className="h-8 w-80 bg-muted animate-pulse rounded mb-2" />
              <div className="h-4 w-96 bg-muted animate-pulse rounded" />
            </div>
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-9 w-24 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="h-96 bg-muted animate-pulse rounded" />
              <div className="h-64 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-80 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-background ${padded ? 'p-6' : ''} ${className}`}>
        <div className="max-w-6xl mx-auto">
          <Card className="p-12 text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              {backAction && (
                <Button variant="outline" onClick={backAction.onClick}>
                  {backAction.label}
                </Button>
              )}
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className={`min-h-screen bg-background ${padded ? 'p-6' : ''} ${className}`}>
        <div className="max-w-6xl mx-auto">
          <Card className="p-12 text-center">
            <div className="text-muted-foreground mb-4">
              <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Item not found</h3>
            <p className="text-muted-foreground mb-4">
              The item you're looking for doesn't exist or has been removed.
            </p>
            {backAction && (
              <Button onClick={backAction.onClick}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {backAction.label}
              </Button>
            )}
          </Card>
        </div>
      </div>
    );
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

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
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-start gap-6">
              {/* Back Navigation */}
              {backAction && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={backAction.onClick}
                  className="mt-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {backAction.label}
                </Button>
              )}

              {/* Title & Status */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {title && (
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                  )}
                  {status && (
                    <Badge variant={status.variant || 'default'}>
                      {status.label}
                    </Badge>
                  )}
                </div>
                {subtitle && (
                  <p className="text-muted-foreground">{subtitle}</p>
                )}
              </div>

              {/* Header Actions */}
              {headerActions.length > 0 && (
                <div className="flex items-center gap-3">
                  {headerActions.map((action) => (
                    <Button
                      key={action.id}
                      variant={action.variant || 'default'}
                      size="sm"
                      onClick={action.onClick}
                      disabled={action.disabled}
                    >
                      {action.icon}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs Navigation */}
            {layout === 'tabs' && tabs.length > 0 && (
              <div className="border-b">
                <div className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      disabled={tab.disabled}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                      } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        {tab.label}
                        {tab.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {tab.badge}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className={showSidebar ? 'lg:col-span-4' : 'lg:col-span-3'}>
                {/* Custom Children */}
                {layout === 'custom' && children}

                {/* Tab Content */}
                {layout === 'tabs' && activeTabContent && (
                  <ContentWrapper>
                    {activeTabContent}
                  </ContentWrapper>
                )}

                {/* Sections Content */}
                {layout === 'sections' && (
                  <div className="space-y-6">
                    {sections.map((section) => {
                      const isCollapsed = collapsedSections.has(section.id);
                      
                      return (
                        <ContentWrapper key={section.id} className={section.className}>
                          {section.title && (
                            <div className="flex items-center justify-between mb-4 pb-3 border-b">
                              <div className="flex items-center gap-3">
                                {section.collapsible && (
                                  <button
                                    onClick={() => toggleSection(section.id)}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    <svg
                                      className={`h-4 w-4 transition-transform ${
                                        isCollapsed ? '-rotate-90' : ''
                                      }`}
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </button>
                                )}
                                <h2 className="text-xl font-semibold">{section.title}</h2>
                              </div>
                              
                              {section.actions && (
                                <div className="flex items-center gap-2">
                                  {section.actions.map((action) => (
                                    <Button
                                      key={action.id}
                                      variant={action.variant || 'outline'}
                                      size="sm"
                                      onClick={action.onClick}
                                      disabled={action.disabled}
                                    >
                                      {action.icon}
                                      {action.label}
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {(!section.collapsible || !isCollapsed) && (
                            <div>{section.content}</div>
                          )}
                        </ContentWrapper>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Sidebar (when not using left sidebar) */}
              {!showSidebar && sidebar && (
                <div className="lg:col-span-1">
                  <ContentWrapper>
                    {sidebar}
                  </ContentWrapper>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Common detail page configurations
export const DETAIL_PAGE_LAYOUTS = {
  // Tabbed layout
  tabs: {
    layout: 'tabs' as const,
    sectioned: true,
    showSidebar: false,
  },
  
  // Section-based layout
  sections: {
    layout: 'sections' as const,
    sectioned: true,
    showSidebar: false,
  },
  
  // With sidebar
  withSidebar: {
    layout: 'sections' as const,
    sectioned: true,
    showSidebar: true,
  },
  
  // Full-width custom
  custom: {
    layout: 'custom' as const,
    sectioned: false,
    showSidebar: false,
  },
} as const;

export default DetailPageTemplate;
