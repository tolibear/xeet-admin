import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DetailPageTemplate, DETAIL_PAGE_LAYOUTS } from './DetailPageTemplate';
import { Button, Badge } from '../../atoms';
import { Card } from '../../molecules';
import { 
  Edit, 
  Trash2, 
  Share2, 
  Download, 
  Copy,
  Settings,
  Users,
  Clock,
  Tag,
  Star,
  MessageSquare,
  Activity,
  Plus
} from 'lucide-react';

const meta = {
  title: 'Templates/DetailPageTemplate',
  component: DetailPageTemplate,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**DetailPageTemplate** is a layout template for single item detail pages with tabs, sections, and actions.

### Features
- Header with title, status, and actions
- Tabbed and sectioned content layouts
- Collapsible sections
- Sidebar support
- Back navigation
- Loading, error, and not found states

### Atomic Design
This template provides structural layout without business logic, composing Card atoms and organizing space for organisms and molecules.
        `,
      },
    },
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['tabs', 'sections', 'custom'],
    },
    showSidebar: { control: 'boolean' },
    sectioned: { control: 'boolean' },
    padded: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    notFound: { control: 'boolean' },
  },
  args: {
    title: 'Project Alpha',
    subtitle: 'High-priority development project for Q1 2024',
    status: { label: 'Active', variant: 'default' },
    backAction: { label: 'Back to Projects', onClick: action('onClick') },
  },
} satisfies Meta<typeof DetailPageTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock content components
const MockOverview = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">Progress</p>
        <p className="text-2xl font-bold">75%</p>
      </div>
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">Team Members</p>
        <p className="text-2xl font-bold">8</p>
      </div>
      <div className="p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">Due Date</p>
        <p className="text-2xl font-bold">Mar 15</p>
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-semibold mb-3">Description</h3>
      <p className="text-muted-foreground leading-relaxed">
        This is a comprehensive project aimed at improving our platform's user experience 
        and performance. The project involves multiple teams and spans across frontend, 
        backend, and infrastructure improvements.
      </p>
    </div>

    <div>
      <h3 className="text-lg font-semibold mb-3">Key Objectives</h3>
      <ul className="space-y-2">
        {[
          'Improve page load times by 40%',
          'Implement new user dashboard',
          'Migrate to new database architecture',
          'Update mobile application',
        ].map((objective, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>{objective}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const MockActivity = () => (
  <div className="space-y-4">
    {Array.from({ length: 10 }).map((_, i) => (
      <div key={i} className="flex items-start gap-3 p-4 border rounded-lg">
        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
          <Activity className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="font-medium">Task completed: {`Feature ${i + 1}`}</p>
          <p className="text-sm text-muted-foreground">
            John completed the implementation and testing
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {i + 1} hours ago
          </p>
        </div>
      </div>
    ))}
  </div>
);

const MockTeam = () => (
  <div className="space-y-4">
    {[
      { name: 'John Doe', role: 'Project Lead', avatar: 'JD' },
      { name: 'Jane Smith', role: 'Frontend Developer', avatar: 'JS' },
      { name: 'Mike Johnson', role: 'Backend Developer', avatar: 'MJ' },
      { name: 'Sarah Wilson', role: 'Designer', avatar: 'SW' },
      { name: 'David Brown', role: 'QA Engineer', avatar: 'DB' },
    ].map((member, i) => (
      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-medium">
          {member.avatar}
        </div>
        <div className="flex-1">
          <p className="font-medium">{member.name}</p>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>
        <Button variant="ghost" size="sm">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
);

const MockFiles = () => (
  <div className="space-y-3">
    {[
      'Project Requirements.pdf',
      'Design Mockups.fig',
      'API Documentation.md',
      'Test Plan.xlsx',
      'Architecture Diagram.png',
    ].map((file, i) => (
      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
          📄
        </div>
        <div className="flex-1">
          <p className="font-medium">{file}</p>
          <p className="text-sm text-muted-foreground">
            Modified {i + 1} days ago
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
);

const MockSidebar = () => (
  <div className="space-y-6">
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Users className="h-4 w-4" />
        Project Info
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Created</p>
          <p className="text-sm text-muted-foreground">January 15, 2024</p>
        </div>
        <div>
          <p className="text-sm font-medium">Last Updated</p>
          <p className="text-sm text-muted-foreground">2 hours ago</p>
        </div>
        <div>
          <p className="text-sm font-medium">Priority</p>
          <Badge variant="destructive" className="text-xs">High</Badge>
        </div>
        <div>
          <p className="text-sm font-medium">Category</p>
          <Badge variant="outline" className="text-xs">Development</Badge>
        </div>
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {['frontend', 'backend', 'urgent', 'q1-2024'].map(tag => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Star className="h-4 w-4" />
        Actions
      </h3>
      <div className="space-y-2">
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  </div>
);

const headerActions = [
  {
    id: 'edit',
    label: 'Edit',
    icon: <Edit className="h-4 w-4 mr-2" />,
    onClick: action('onClick'),
    variant: 'default' as const,
  },
  {
    id: 'share',
    label: 'Share',
    icon: <Share2 className="h-4 w-4 mr-2" />,
    onClick: action('onClick'),
    variant: 'outline' as const,
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 className="h-4 w-4 mr-2" />,
    onClick: action('onClick'),
    variant: 'destructive' as const,
  },
];

const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    content: <MockOverview />,
  },
  {
    id: 'activity',
    label: 'Activity',
    content: <MockActivity />,
    badge: '15',
  },
  {
    id: 'team',
    label: 'Team',
    content: <MockTeam />,
    badge: '5',
  },
  {
    id: 'files',
    label: 'Files',
    content: <MockFiles />,
  },
];

const sections = [
  {
    id: 'overview',
    title: 'Overview',
    content: <MockOverview />,
    actions: [
      {
        id: 'edit-overview',
        label: 'Edit',
        icon: <Edit className="h-4 w-4 mr-2" />,
        onClick: action('onClick'),
        variant: 'outline' as const,
      },
    ],
  },
  {
    id: 'team',
    title: 'Team Members',
    content: <MockTeam />,
    actions: [
      {
        id: 'manage-team',
        label: 'Manage',
        icon: <Users className="h-4 w-4 mr-2" />,
        onClick: action('onClick'),
        variant: 'outline' as const,
      },
    ],
  },
  {
    id: 'activity',
    title: 'Recent Activity',
    content: <MockActivity />,
    collapsible: true,
  },
  {
    id: 'files',
    title: 'Project Files',
    content: <MockFiles />,
    collapsible: true,
    defaultCollapsed: true,
  },
];

export const WithTabs: Story = {
  args: {
    headerActions,
    tabs,
    sidebar: <MockSidebar />,
    ...DETAIL_PAGE_LAYOUTS.tabs,
  },
};

export const WithSections: Story = {
  args: {
    headerActions,
    sections,
    sidebar: <MockSidebar />,
    ...DETAIL_PAGE_LAYOUTS.sections,
  },
};

export const WithSidebar: Story = {
  args: {
    headerActions,
    sections,
    sidebar: <MockSidebar />,
    ...DETAIL_PAGE_LAYOUTS.withSidebar,
  },
};

export const CustomLayout: Story = {
  args: {
    title: 'Custom Dashboard',
    subtitle: 'Fully customized layout with bespoke components',
    status: { label: 'Beta', variant: 'secondary' },
    headerActions: [
      {
        id: 'settings',
        label: 'Settings',
        icon: <Settings className="h-4 w-4 mr-2" />,
        onClick: action('onClick'),
        variant: 'outline' as const,
      },
    ],
    children: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Custom Section 1</h3>
            <MockOverview />
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Custom Section 2</h3>
            <MockTeam />
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Custom Section 3</h3>
            <MockActivity />
          </Card>
        </div>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-6">Full Width Section</h3>
          <MockFiles />
        </Card>
      </div>
    ),
    ...DETAIL_PAGE_LAYOUTS.custom,
  },
};

export const Loading: Story = {
  args: {
    headerActions,
    sections,
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    headerActions,
    sections,
    error: 'Failed to load project details. Please check your connection and try again.',
  },
};

export const NotFound: Story = {
  args: {
    notFound: true,
  },
};

export const DifferentStatuses: Story = {
  args: {
    title: 'Project Status Demo',
    subtitle: 'Showcasing different status variants',
    status: { label: 'Completed', variant: 'secondary' },
    headerActions,
    tabs: [
      {
        id: 'active',
        label: 'Active Projects',
        content: (
          <div className="space-y-4">
            {[
              { name: 'Project A', status: { label: 'Active', variant: 'default' } },
              { name: 'Project B', status: { label: 'In Review', variant: 'secondary' } },
              { name: 'Project C', status: { label: 'Blocked', variant: 'destructive' } },
              { name: 'Project D', status: { label: 'Draft', variant: 'outline' } },
            ].map((project, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <span className="font-medium">{project.name}</span>
                <Badge variant={project.status.variant as any}>
                  {project.status.label}
                </Badge>
              </div>
            ))}
          </div>
        ),
      },
    ],
    ...DETAIL_PAGE_LAYOUTS.tabs,
  },
};

// Enterprise Scale - Complex detail page
export const EnterpriseScale: Story = {
  args: {
    title: 'Enterprise Project Management',
    subtitle: 'Comprehensive project overview with multi-team coordination and advanced analytics',
    status: { label: 'Critical Priority', variant: 'destructive' },
    headerActions: [
      ...headerActions,
      {
        id: 'export',
        label: 'Export',
        icon: <Download className="h-4 w-4 mr-2" />,
        onClick: action('onClick'),
        variant: 'outline' as const,
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <Settings className="h-4 w-4 mr-2" />,
        onClick: action('onClick'),
        variant: 'ghost' as const,
      },
    ],
    tabs: [
      {
        id: 'overview',
        label: 'Overview',
        content: (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Tasks', value: '247', trend: '+12%' },
                { label: 'Completed', value: '189', trend: '+8%' },
                { label: 'In Progress', value: '41', trend: '+15%' },
                { label: 'Blocked', value: '17', trend: '-23%' },
                { label: 'Team Members', value: '23', trend: '+2' },
                { label: 'Budget Used', value: '$450K', trend: '75%' },
                { label: 'Time Remaining', value: '45 days', trend: '-5 days' },
                { label: 'Risk Score', value: 'Medium', trend: '↓' },
              ].map((metric, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-green-600">{metric.trend}</p>
                </div>
              ))}
            </div>
            <MockOverview />
          </div>
        ),
        badge: '8',
      },
      {
        id: 'tasks',
        label: 'Tasks',
        content: (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Task Breakdown</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 p-4 border-b">
                <div className="grid grid-cols-5 gap-4 font-medium text-sm">
                  <span>Task</span>
                  <span>Assignee</span>
                  <span>Status</span>
                  <span>Due Date</span>
                  <span>Priority</span>
                </div>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="p-4 hover:bg-muted/30">
                    <div className="grid grid-cols-5 gap-4 items-center text-sm">
                      <span className="font-medium">Task {i + 1}</span>
                      <span className="text-muted-foreground">User {i % 5 + 1}</span>
                      <Badge variant={i % 4 === 0 ? 'default' : i % 4 === 1 ? 'secondary' : i % 4 === 2 ? 'destructive' : 'outline'}>
                        {i % 4 === 0 ? 'Done' : i % 4 === 1 ? 'In Progress' : i % 4 === 2 ? 'Blocked' : 'Todo'}
                      </Badge>
                      <span className="text-muted-foreground">2024-02-{(i % 28 + 1).toString().padStart(2, '0')}</span>
                      <Badge variant={i % 3 === 0 ? 'destructive' : i % 3 === 1 ? 'default' : 'secondary'}>
                        {i % 3 === 0 ? 'High' : i % 3 === 1 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
        badge: '247',
      },
      {
        id: 'team',
        label: 'Team & Resources',
        content: (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Team Members (23)</h3>
              <MockTeam />
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Resource Allocation</h3>
              <div className="space-y-4">
                {[
                  { role: 'Frontend Developers', count: 8, utilization: '85%' },
                  { role: 'Backend Developers', count: 6, utilization: '92%' },
                  { role: 'UI/UX Designers', count: 4, utilization: '78%' },
                  { role: 'DevOps Engineers', count: 3, utilization: '95%' },
                  { role: 'QA Engineers', count: 2, utilization: '88%' },
                ].map((resource, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">{resource.role}</p>
                      <p className="text-sm text-muted-foreground">{resource.count} members</p>
                    </div>
                    <Badge variant="outline">{resource.utilization}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ),
        badge: '23',
      },
      {
        id: 'analytics',
        label: 'Analytics',
        content: (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Performance Trends</h3>
                <div className="h-64 bg-muted/30 rounded flex items-center justify-center">
                  <p className="text-muted-foreground">Performance Chart Placeholder</p>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Team Velocity</h3>
                <div className="h-64 bg-muted/30 rounded flex items-center justify-center">
                  <p className="text-muted-foreground">Velocity Chart Placeholder</p>
                </div>
              </Card>
            </div>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Budget Analysis</h3>
              <div className="h-64 bg-muted/30 rounded flex items-center justify-center">
                <p className="text-muted-foreground">Budget Chart Placeholder</p>
              </div>
            </Card>
          </div>
        ),
      },
      {
        id: 'activity',
        label: 'Activity Feed',
        content: <MockActivity />,
        badge: '156',
      },
      {
        id: 'files',
        label: 'Files & Documents',
        content: <MockFiles />,
        badge: '89',
      },
    ],
    sidebar: (
      <div className="space-y-6">
        <MockSidebar />
        
        {/* Additional enterprise-scale sidebar content */}
        <div>
          <h3 className="font-semibold mb-3">Stakeholders</h3>
          <div className="space-y-2">
            {[
              'Executive Sponsor',
              'Product Owner', 
              'Project Manager',
              'Technical Lead',
              'Business Analyst',
            ].map(stakeholder => (
              <div key={stakeholder} className="flex items-center gap-2 p-2 text-sm">
                <div className="w-6 h-6 bg-primary/20 rounded-full" />
                <span>{stakeholder}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Dependencies</h3>
          <div className="space-y-2">
            {[
              { name: 'Project Beta', status: 'On Track' },
              { name: 'Infrastructure Update', status: 'Delayed' },
              { name: 'Security Audit', status: 'Complete' },
            ].map((dep, i) => (
              <div key={i} className="p-2 border rounded text-sm">
                <p className="font-medium">{dep.name}</p>
                <Badge 
                  variant={dep.status === 'Complete' ? 'default' : dep.status === 'Delayed' ? 'destructive' : 'secondary'}
                  className="text-xs mt-1"
                >
                  {dep.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    ...DETAIL_PAGE_LAYOUTS.tabs,
  },
  parameters: {
    viewport: { defaultViewport: 'enterpriseScale' },
    docs: {
      description: {
        story: 'Enterprise-scale detail page with comprehensive project management capabilities, extensive data, and complex interactions.',
      },
    },
  },
};
