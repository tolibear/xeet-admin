import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboards",
};

interface LeaderboardsPageProps {
  params: {
    org: string;
  };
}

export default function LeaderboardsPage({ params }: LeaderboardsPageProps) {
  const orgSlug = params.org;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Leaderboards</h1>
          <p className="text-muted-foreground mt-2">
            Create, manage, and publish public and private leaderboards
          </p>
        </div>

        {/* Placeholder Content */}
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Leaderboard Management Coming Soon</h2>
          <p className="text-muted-foreground mb-4">
            This will include leaderboard builders, public/private visibility controls,
            embeddable templates, and moderation tools.
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>🏗️ LeaderboardBuilder organism</p>
            <p>🔒 Public/private visibility toggle</p>
            <p>🔗 Shareable public slugs</p>
            <p>📋 Embeddable iframe templates</p>
            <p>⚖️ Moderation queue with audit trail</p>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Organization: <code className="bg-background px-2 py-1 rounded">{orgSlug}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
