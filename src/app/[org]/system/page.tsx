'use client';

import type { Metadata } from "next";
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  SystemHealthDashboard,
  JobQueueManager, 
  LogsViewer,
  BulkOperationsManager,
  SlashingManager,
  ReScoringManager
} from '@/components/organisms';
import { sampleData } from '@/lib/mock-data';

interface SystemPageProps {
  params: {
    org: string;
  };
}

export default function SystemPage({ params }: SystemPageProps) {
  const orgSlug = params.org;

  // Mock data for Phase 5 organisms
  const systemHealthData = {
    metrics: sampleData.sampleSystemHealthMetrics,
    services: sampleData.sampleSystemServices,
    historicalMetrics: sampleData.sampleSystemHealthHistory
  };

  const queueData = {
    queues: sampleData.sampleJobQueues,
    jobs: sampleData.sampleBackfillJobs
  };

  const logsData = {
    logs: sampleData.sampleLogEntries
  };

  const bulkOpsData = {
    operations: sampleData.sampleBulkOperations
  };

  const slashingData = {
    actions: sampleData.sampleSlashingActions
  };

  const reScoringData = {
    jobs: sampleData.sampleBackfillJobs.filter(job => 
      job.type === 'scoring_update' || job.type === 'index_rebuild'
    )
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">System Health</h1>
            <p className="text-muted-foreground mt-2">
              Galaxy-scale operations monitoring and control
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default">Phase 5 Complete</Badge>
            <Badge variant="outline">Live</Badge>
          </div>
        </div>

        {/* System Overview Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="queues">Queues</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Phase 5 Galaxy Components</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>System Health Dashboard</span>
                    <Badge variant="default">✅ Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Job Queue Manager</span>
                    <Badge variant="default">✅ Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Logs Viewer</span>
                    <Badge variant="default">✅ Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bulk Operations Manager</span>
                    <Badge variant="default">✅ Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Slashing Manager</span>
                    <Badge variant="default">✅ Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Re-scoring Manager</span>
                    <Badge variant="default">✅ Operational</Badge>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">System Metrics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Uptime</span>
                    <span className="text-sm font-medium">
                      {Math.floor(systemHealthData.metrics.uptime / 86400)}d {Math.floor((systemHealthData.metrics.uptime % 86400) / 3600)}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CPU Usage</span>
                    <span className="text-sm font-medium">{systemHealthData.metrics.cpu}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Memory Usage</span>
                    <span className="text-sm font-medium">{systemHealthData.metrics.memory}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Queues</span>
                    <span className="text-sm font-medium">
                      {queueData.queues.filter(q => q.status === 'active').length}/{queueData.queues.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Running Jobs</span>
                    <span className="text-sm font-medium">
                      {queueData.jobs.filter(j => j.status === 'running').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Log Entries (1h)</span>
                    <span className="text-sm font-medium">
                      {logsData.logs.filter(log => 
                        Date.now() - new Date(log.timestamp).getTime() < 3600000
                      ).length}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                  Organization: <code className="bg-background px-2 py-1 rounded">{orgSlug}</code>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="health">
            <SystemHealthDashboard
              metrics={systemHealthData.metrics}
              services={systemHealthData.services}
              historicalMetrics={systemHealthData.historicalMetrics}
              onAlert={(type, value, threshold) => console.log('Health Alert:', { type, value, threshold })}
              onServiceStatusChange={(service) => console.log('Service Status:', service)}
            />
          </TabsContent>

          <TabsContent value="queues">
            <JobQueueManager
              queues={queueData.queues}
              jobs={queueData.jobs}
              onQueueToggle={(queueId, action) => console.log('Queue Action:', { queueId, action })}
              onJobRetry={(jobId) => console.log('Job Retry:', jobId)}
              onJobCancel={(jobId) => console.log('Job Cancel:', jobId)}
              onBulkAction={(action, jobIds) => console.log('Bulk Action:', { action, jobIds })}
            />
          </TabsContent>

          <TabsContent value="logs">
            <LogsViewer
              logs={logsData.logs}
              tailMode={false}
              showStats={true}
              showExport={true}
              onFiltersChange={(filters) => console.log('Log Filters:', filters)}
              onSearchChange={(query) => console.log('Log Search:', query)}
              onTailToggle={(enabled) => console.log('Tail Mode:', enabled)}
              onExport={(format, logs) => console.log('Export Logs:', { format, count: logs.length })}
              onLogClick={(log) => console.log('Log Clicked:', log)}
            />
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Bulk Operations</h2>
                <BulkOperationsManager
                  operations={bulkOpsData.operations}
                  onCreateOperation={(operation) => console.log('Create Operation:', operation)}
                  onCancelOperation={(operationId) => console.log('Cancel Operation:', operationId)}
                  onRetryOperation={(operationId) => console.log('Retry Operation:', operationId)}
                  onRollbackOperation={(operationId) => console.log('Rollback Operation:', operationId)}
                  onViewDetails={(operation) => console.log('View Operation:', operation)}
                />
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Re-scoring & Reindexing</h2>
                <ReScoringManager
                  jobs={reScoringData.jobs}
                  onCreateJob={(job) => console.log('Create Re-scoring Job:', job)}
                  onStartJob={(jobId) => console.log('Start Job:', jobId)}
                  onCancelJob={(jobId) => console.log('Cancel Job:', jobId)}
                  onRestartJob={(jobId) => console.log('Restart Job:', jobId)}
                  onViewDetails={(job) => console.log('View Job:', job)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Content Moderation & Slashing</h2>
                <SlashingManager
                  actions={slashingData.actions}
                  onCreateAction={(action) => console.log('Create Slashing Action:', action)}
                  onApplyAction={(actionId) => console.log('Apply Action:', actionId)}
                  onRevertAction={(actionId) => console.log('Revert Action:', actionId)}
                  onReviewAction={(actionId, notes) => console.log('Review Action:', { actionId, notes })}
                  onViewDetails={(action) => console.log('View Action:', action)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
