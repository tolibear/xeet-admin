import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Health",
};

interface SystemPageProps {
  params: {
    org: string;
  };
}

export default function SystemPage({ params }: SystemPageProps) {
  const orgSlug = params.org;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">System Health</h1>
          <p className="text-muted-foreground mt-2">
            Monitor system health, manage jobs, and access admin tools
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">System Health Dashboard Coming Soon</h2>
          <p className="text-muted-foreground mb-4">
            This will include health monitoring, job queue management, 
            backfill controls, and administrative tools.
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>🔍 Health monitoring dashboard</p>
            <p>⚙️ Job queue management organisms</p>
            <p>🔄 Backfill job control organisms</p>
            <p>📋 Logs viewer with tail mode</p>
            <p>🛠️ Admin tools (bulk operations, slashing, re-scoring)</p>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Organization: <code className="bg-background px-2 py-1 rounded">{orgSlug}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
