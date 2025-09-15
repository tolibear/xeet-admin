import type { Meta, StoryObj } from '@storybook/react';
import { DashboardTemplate, DASHBOARD_LAYOUTS } from './DashboardTemplate';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Settings, RefreshCw } from 'lucide-react';

const meta = {
  title: 'Templates/DashboardTemplate',
  component: DashboardTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**DashboardTemplate** is a layout template that provides structure for dashboard pages without content.

### Features
- Flexible grid and flex layouts
- Responsive design patterns
- Header with title, description, and actions
- Sectioned and non-sectioned variants
- Grid area positioning support
- Full-width section support

### Atomic Design
This template composes Card atoms and provides structural composition for organisms and molecules without containing business logic.
        `,
      },
    },
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['grid', 'flex', 'custom'],
    },
    padded: { control: 'boolean' },
    sectioned: { control: 'boolean' },
  },
} satisfies Meta<typeof DashboardTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock components for sections
const MockMetrics = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {['Total Users', 'Active Sessions', 'Revenue', 'Growth Rate'].map((metric, i) => (
      <Card key={metric} className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{metric}</p>
            <p className="text-2xl font-bold">{(1234 * (i + 1)).toLocaleString()}</p>
          </div>
          <Badge variant={i % 2 === 0 ? 'default' : 'secondary'}>
            +{12 + i}%
          </Badge>
        </div>
      </Card>
    ))}
  </div>
);

const MockChart = ({ title }: { title: string }) => (
  <Card className="p-6">
    <h4 className="font-semibold mb-4">{title}</h4>
    <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
      <p className="text-muted-foreground">Chart Placeholder</p>
    </div>
  </Card>
);

const MockTable = () => (
  <Card className="p-6">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Recent Data</h4>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20" />
              <div>
                <p className="font-medium">Item {i + 1}</p>
                <p className="text-sm text-muted-foreground">Description {i + 1}</p>
              </div>
            </div>
            <Badge variant="outline">Active</Badge>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const MockActivity = () => (
  <Card className="p-6">
    <h4 className="font-semibold mb-4">Activity Feed</h4>
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
          <div>
            <p>User performed action {i + 1}</p>
            <p className="text-muted-foreground">{i + 1} minutes ago</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const headerActions = (
  <>
    <Button variant="outline" size="sm">
      <RefreshCw className="h-4 w-4 mr-2" />
      Refresh
    </Button>
    <Button variant="outline" size="sm">
      <Download className="h-4 w-4 mr-2" />
      Export
    </Button>
    <Button size="sm">
      <Plus className="h-4 w-4 mr-2" />
      Create
    </Button>
  </>
);

export const Standard: Story = {
  args: {
    title: 'Dashboard Overview',
    description: 'Monitor your key metrics and recent activity',
    headerActions,
    sections: [
      {
        id: 'metrics',
        component: <MockMetrics />,
        fullWidth: true,
      },
      {
        id: 'chart1',
        title: 'Performance Trends',
        component: <MockChart title="Performance Over Time" />,
      },
      {
        id: 'chart2',
        title: 'User Analytics', 
        component: <MockChart title="User Engagement" />,
      },
      {
        id: 'table',
        component: <MockTable />,
        fullWidth: true,
      },
    ],
    ...DASHBOARD_LAYOUTS.standard,
    sectioned: false,
  },
};

export const Sectioned: Story = {
  args: {
    ...Standard.args,
    sectioned: true,
  },
};

export const WideLayout: Story = {
  args: {
    title: 'Analytics Dashboard',
    description: 'Comprehensive view of all metrics and data',
    headerActions,
    sections: [
      {
        id: 'metrics',
        component: <MockMetrics />,
        fullWidth: true,
      },
      {
        id: 'chart1',
        title: 'Revenue Trends',
        component: <MockChart title="Revenue" />,
      },
      {
        id: 'chart2', 
        title: 'User Growth',
        component: <MockChart title="Users" />,
      },
      {
        id: 'chart3',
        title: 'Conversion Rate',
        component: <MockChart title="Conversions" />,
      },
      {
        id: 'activity',
        title: 'Recent Activity',
        component: <MockActivity />,
      },
      {
        id: 'table',
        component: <MockTable />,
      },
    ],
    ...DASHBOARD_LAYOUTS.wide,
    sectioned: true,
  },
};

export const FlexLayout: Story = {
  args: {
    title: 'Mobile-First Dashboard',
    description: 'Optimized for mobile and tablet viewing',
    headerActions: (
      <Button size="sm">
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
    ),
    sections: [
      {
        id: 'metrics',
        component: <MockMetrics />,
      },
      {
        id: 'chart',
        title: 'Key Chart',
        component: <MockChart title="Primary Metric" />,
      },
      {
        id: 'activity',
        title: 'Activity',
        component: <MockActivity />,
      },
    ],
    ...DASHBOARD_LAYOUTS.stacked,
    sectioned: true,
  },
};

export const CustomLayout: Story = {
  args: {
    title: 'Custom Dashboard Layout',
    description: 'Using custom children instead of sections',
    headerActions,
    layout: 'custom',
    children: (
      <div className="space-y-8">
        {/* Custom header section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MockMetrics />
        </div>
        
        {/* Custom main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MockChart title="Main Analytics" />
          </div>
          <div>
            <MockActivity />
          </div>
        </div>

        {/* Custom footer section */}
        <div>
          <MockTable />
        </div>
      </div>
    ),
  },
};

export const NoHeader: Story = {
  args: {
    sections: [
      {
        id: 'content',
        component: <MockChart title="Clean Layout" />,
        fullWidth: true,
      },
    ],
  },
};

// Enterprise Scale - Complex dashboard with many sections
export const EnterpriseScale: Story = {
  args: {
    title: 'Enterprise Dashboard',
    description: 'Comprehensive enterprise-scale dashboard for large organizations',
    headerActions: (
      <>
        <Button variant="outline" size="sm">Filters</Button>
        <Button variant="outline" size="sm">Export All</Button>
        <Button variant="outline" size="sm">Settings</Button>
        <Button size="sm">New Report</Button>
      </>
    ),
    sections: [
      {
        id: 'kpi-metrics',
        title: 'Key Performance Indicators',
        component: <MockMetrics />,
        fullWidth: true,
      },
      {
        id: 'revenue-chart',
        title: 'Revenue Analytics',
        component: <MockChart title="Revenue Trends" />,
      },
      {
        id: 'user-chart',
        title: 'User Analytics', 
        component: <MockChart title="User Growth" />,
      },
      {
        id: 'performance-chart',
        title: 'Performance Metrics',
        component: <MockChart title="System Performance" />,
      },
      {
        id: 'geographic-chart',
        title: 'Geographic Distribution',
        component: <MockChart title="Global Usage" />,
      },
      {
        id: 'conversion-chart', 
        title: 'Conversion Funnel',
        component: <MockChart title="Conversion Rates" />,
      },
      {
        id: 'retention-chart',
        title: 'Retention Analysis',
        component: <MockChart title="User Retention" />,
      },
      {
        id: 'recent-data',
        title: 'Recent Transactions',
        component: <MockTable />,
        fullWidth: true,
      },
      {
        id: 'system-activity',
        title: 'System Activity',
        component: <MockActivity />,
      },
      {
        id: 'alerts',
        title: 'System Alerts',
        component: (
          <Card className="p-6">
            <div className="space-y-3">
              {['Warning: High CPU usage', 'Info: Backup completed', 'Error: Connection timeout'].map((alert, i) => (
                <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Badge variant={i === 2 ? 'destructive' : i === 0 ? 'default' : 'secondary'}>
                    {i === 2 ? 'Error' : i === 0 ? 'Warning' : 'Info'}
                  </Badge>
                  <span className="text-sm">{alert}</span>
                </div>
              ))}
            </div>
          </Card>
        ),
      },
    ],
    layout: 'grid',
    gridConfig: { columns: 3, gap: 6 },
    sectioned: true,
  },
  parameters: {
    viewport: { defaultViewport: 'enterpriseScale' },
    docs: {
      description: {
        story: 'Enterprise-scale dashboard with multiple sections, complex layouts, and comprehensive data visualization.',
      },
    },
  },
};
