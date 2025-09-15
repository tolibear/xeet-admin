'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

export interface DashboardSection {
  id: string;
  title?: string;
  component: React.ReactNode;
  className?: string;
  gridArea?: string;
  fullWidth?: boolean;
}

export interface DashboardTemplateProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Header actions */
  headerActions?: React.ReactNode;
  /** Dashboard sections to render */
  sections: DashboardSection[];
  /** Layout variant */
  layout?: 'grid' | 'flex' | 'custom';
  /** Grid configuration for grid layout */
  gridConfig?: {
    columns: number;
    gap: number;
    rows?: number;
  };
  /** Whether to add padding to the container */
  padded?: boolean;
  /** Whether to show section borders */
  sectioned?: boolean;
  /** CSS classes for the main container */
  className?: string;
  /** Children for custom layouts */
  children?: React.ReactNode;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  title,
  description,
  headerActions,
  sections = [],
  layout = 'grid',
  gridConfig = { columns: 2, gap: 6 },
  padded = true,
  sectioned = false,
  className = '',
  children,
}) => {
  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return `grid grid-cols-1 md:grid-cols-${Math.min(gridConfig.columns, 3)} lg:grid-cols-${gridConfig.columns} gap-${gridConfig.gap}`;
      case 'flex':
        return 'flex flex-col gap-6';
      case 'custom':
        return '';
      default:
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
    }
  };

  const getGridAreaStyle = (section: DashboardSection) => {
    if (layout === 'grid' && section.gridArea) {
      return { gridArea: section.gridArea };
    }
    return {};
  };

  const SectionWrapper: React.FC<{ 
    section: DashboardSection; 
    children: React.ReactNode; 
  }> = ({ section, children }) => {
    const wrapperClass = `
      ${section.className || ''}
      ${section.fullWidth ? 'col-span-full' : ''}
    `.trim();

    if (sectioned) {
      return (
        <Card 
          className={wrapperClass}
          style={getGridAreaStyle(section)}
        >
          {section.title && (
            <div className="p-6 pb-3 border-b">
              <h3 className="text-lg font-semibold">{section.title}</h3>
            </div>
          )}
          <div className={section.title ? 'p-6 pt-3' : 'p-6'}>
            {children}
          </div>
        </Card>
      );
    }

    return (
      <div 
        className={wrapperClass}
        style={getGridAreaStyle(section)}
      >
        {section.title && (
          <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
        )}
        {children}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-background ${padded ? 'p-6' : ''} ${className}`}>
      {/* Header */}
      {(title || description || headerActions) && (
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
            {headerActions && (
              <div className="flex items-center gap-3">
                {headerActions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-8">
        {/* Custom Children */}
        {children}

        {/* Sections */}
        {sections.length > 0 && (
          <div className={getLayoutClasses()}>
            {sections.map((section) => (
              <SectionWrapper key={section.id} section={section}>
                {section.component}
              </SectionWrapper>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Predefined layout configurations
export const DASHBOARD_LAYOUTS = {
  // Standard 2x2 grid
  standard: {
    layout: 'grid' as const,
    gridConfig: { columns: 2, gap: 6 },
  },
  
  // Wide layout for galaxy-scale dashboards
  wide: {
    layout: 'grid' as const,
    gridConfig: { columns: 3, gap: 6 },
  },
  
  // Stacked layout for mobile-first
  stacked: {
    layout: 'flex' as const,
  },

  // Complex grid with named areas
  complex: {
    layout: 'grid' as const,
    gridConfig: { columns: 4, gap: 4, rows: 3 },
  },
} as const;

// Common dashboard section configurations
export const createMetricsSection = (metricsComponent: React.ReactNode): DashboardSection => ({
  id: 'metrics',
  title: 'Key Metrics',
  component: metricsComponent,
  fullWidth: true,
  className: 'mb-2',
});

export const createChartsSection = (chartsComponent: React.ReactNode): DashboardSection => ({
  id: 'charts',
  title: 'Analytics',
  component: chartsComponent,
  gridArea: 'charts',
});

export const createTableSection = (tableComponent: React.ReactNode): DashboardSection => ({
  id: 'data-table',
  title: 'Recent Data',
  component: tableComponent,
  fullWidth: true,
  className: 'min-h-[400px]',
});

export const createActivitySection = (activityComponent: React.ReactNode): DashboardSection => ({
  id: 'activity',
  title: 'Recent Activity',
  component: activityComponent,
  className: 'max-h-[500px] overflow-y-auto',
});

export default DashboardTemplate;
