import * as React from "react";
import { Users, TrendingUp, Activity, Globe, Clock, AlertTriangle } from "lucide-react";

import { MetricCard } from "../molecules";
import { useOrg } from "@/lib/org-context";

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  icon?: typeof Users;
  change?: {
    value: string | number;
    trend: "positive" | "negative" | "neutral";
    label?: string;
  };
  suffix?: string;
  prefix?: string;
  description?: string;
  loading?: boolean;
}

export interface DashboardMetricsProps {
  metrics?: DashboardMetric[];
  loading?: boolean;
  className?: string;
}

// Mock metrics data - in real app this would come from API
const generateMockMetrics = (orgSlug: string): DashboardMetric[] => [
  {
    id: "total-users",
    title: "Total Users",
    value: 24567,
    icon: Users,
    change: {
      value: "+12.5%",
      trend: "positive",
      label: "vs last month",
    },
    description: "Active user accounts",
  },
  {
    id: "growth-rate",
    title: "Growth Rate",
    value: 18.2,
    suffix: "%",
    icon: TrendingUp,
    change: {
      value: "+2.1%",
      trend: "positive",
      label: "vs last quarter",
    },
    description: "Monthly growth",
  },
  {
    id: "active-sessions",
    title: "Active Sessions",
    value: 1534,
    icon: Activity,
    change: {
      value: "-3.2%",
      trend: "negative",
      label: "vs yesterday",
    },
    description: "Live user sessions",
  },
  {
    id: "global-reach",
    title: "Global Reach",
    value: 47,
    suffix: " countries",
    icon: Globe,
    change: {
      value: "+3",
      trend: "positive",
      label: "new this month",
    },
    description: "International presence",
  },
  {
    id: "avg-response",
    title: "Avg Response Time",
    value: 156,
    suffix: "ms",
    icon: Clock,
    change: {
      value: "-12ms",
      trend: "positive",
      label: "vs last week",
    },
    description: "API performance",
  },
  {
    id: "error-rate",
    title: "Error Rate",
    value: 0.12,
    suffix: "%",
    icon: AlertTriangle,
    change: {
      value: "+0.03%",
      trend: "negative",
      label: "vs last week",
    },
    description: "System errors",
  },
];

const DashboardMetrics = React.forwardRef<HTMLDivElement, DashboardMetricsProps>(
  ({ metrics, loading, className }, ref) => {
    const { org } = useOrg();
    
    // Use provided metrics or generate mock data
    const displayMetrics = metrics || generateMockMetrics(org.slug);

    return (
      <div ref={ref} className={className}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayMetrics.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              change={metric.change}
              suffix={metric.suffix}
              prefix={metric.prefix}
              description={metric.description}
              loading={loading || metric.loading}
              className="hover:scale-[1.02] transition-transform"
            />
          ))}
        </div>
      </div>
    );
  }
);
DashboardMetrics.displayName = "DashboardMetrics";

export { DashboardMetrics };
