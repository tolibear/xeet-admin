export interface ModerationItem {
  id: string;
  leaderboardId: string;
  leaderboardName: string;
  submittedBy: string;
  submittedAt: string;
  type: 'create' | 'update' | 'delete';
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  changes?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
  };
  moderatedBy?: string;
  moderatedAt?: string;
  moderationNotes?: string;
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'escalated' | 'commented';
  userId: string;
  userRole: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface ModerationFilters {
  status?: ModerationItem['status'][];
  priority?: ModerationItem['priority'][];
  type?: ModerationItem['type'][];
  dateRange?: {
    from: string;
    to: string;
  };
  submittedBy?: string;
  moderatedBy?: string;
}

export interface ModerationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  avgResponseTime: number;
  backlogHours: number;
}

export interface BulkModerationAction {
  itemIds: string[];
  action: 'approve' | 'reject' | 'escalate';
  notes?: string;
}
