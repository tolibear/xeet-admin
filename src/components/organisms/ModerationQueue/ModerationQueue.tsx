"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";
import { Badge } from "@/components";
import { Button } from "@/components";
import { Input } from "@/components";
import { Textarea } from "@/components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components";
import { Separator } from "@/components";
import { ScrollArea } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components";
import { 
  Shield,
  Clock,
  Check,
  X,
  AlertTriangle,
  MessageSquare,
  History,
  Filter,
  Search,
  MoreVertical,
  Eye,
  ArrowUp,
  ChevronDown,
  CheckSquare,
  Square
} from "lucide-react";

import type { ModerationItem, ModerationFilters, ModerationStats, AuditEntry, BulkModerationAction } from "./types";

interface ModerationQueueProps {
  items?: ModerationItem[];
  stats?: ModerationStats;
  loading?: boolean;
  onModerate?: (itemId: string, action: 'approve' | 'reject', notes?: string) => Promise<void>;
  onBulkModerate?: (action: BulkModerationAction) => Promise<void>;
  onFiltersChange?: (filters: ModerationFilters) => void;
  className?: string;
}

const PRIORITY_COLORS = {
  low: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
  medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
  urgent: 'bg-red-500/10 text-red-700 border-red-500/20'
} as const;

const STATUS_COLORS = {
  pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-700 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-700 border-red-500/20'
} as const;

const TYPE_ICONS = {
  create: '✨',
  update: '✏️',
  delete: '🗑️'
} as const;

// Mock data generator
const generateMockModerationItems = (count: number = 50): ModerationItem[] => {
  const types: ModerationItem['type'][] = ['create', 'update', 'delete'];
  const statuses: ModerationItem['status'][] = ['pending', 'approved', 'rejected'];
  const priorities: ModerationItem['priority'][] = ['low', 'medium', 'high', 'urgent'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `mod-${i + 1}`,
    leaderboardId: `lb-${Math.floor(Math.random() * 20) + 1}`,
    leaderboardName: `${['Tech', 'Crypto', 'Gaming', 'Sports', 'Politics'][Math.floor(Math.random() * 5)]} Leaderboard ${Math.floor(Math.random() * 100)}`,
    submittedBy: `user-${Math.floor(Math.random() * 50) + 1}@example.com`,
    submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    description: [
      'Update scoring weights for better accuracy',
      'Add new data source to leaderboard',
      'Remove spam entries from rankings',
      'Modify visibility settings for public view',
      'Update leaderboard description and rules'
    ][Math.floor(Math.random() * 5)],
    moderatedBy: Math.random() > 0.6 ? `moderator-${Math.floor(Math.random() * 5) + 1}@example.com` : undefined,
    moderatedAt: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    moderationNotes: Math.random() > 0.7 ? 'Approved after verification of data sources and compliance check.' : undefined,
    auditTrail: [
      {
        id: `audit-${i}-1`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        action: 'submitted',
        userId: `user-${Math.floor(Math.random() * 50) + 1}@example.com`,
        userRole: 'user',
        details: 'Initial submission for moderation review'
      },
      ...(Math.random() > 0.5 ? [{
        id: `audit-${i}-2`,
        timestamp: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        action: 'reviewed' as const,
        userId: `moderator-${Math.floor(Math.random() * 5) + 1}@example.com`,
        userRole: 'moderator',
        details: 'Under review by moderation team'
      }] : [])
    ]
  }));
};

const generateMockStats = (): ModerationStats => ({
  total: 156,
  pending: 23,
  approved: 108,
  rejected: 25,
  avgResponseTime: 4.2,
  backlogHours: 18.5
});

export function ModerationQueue({
  items = generateMockModerationItems(),
  stats = generateMockStats(),
  loading = false,
  onModerate,
  onBulkModerate,
  onFiltersChange,
  className = ""
}: ModerationQueueProps) {
  const [filters, setFilters] = useState<ModerationFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');

  // Filter and search items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          item.leaderboardName.toLowerCase().includes(searchLower) ||
          item.submittedBy.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }
      
      // Status filter
      if (filters.status?.length && !filters.status.includes(item.status)) {
        return false;
      }
      
      // Priority filter
      if (filters.priority?.length && !filters.priority.includes(item.priority)) {
        return false;
      }
      
      // Type filter
      if (filters.type?.length && !filters.type.includes(item.type)) {
        return false;
      }
      
      return true;
    });
  }, [items, filters, searchTerm]);

  const handleFilterChange = useCallback((newFilters: ModerationFilters) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [onFiltersChange]);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  }, [selectedItems.length, filteredItems]);

  const handleSelectItem = useCallback((itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  }, []);

  const handleModerate = useCallback(async (itemId: string, action: 'approve' | 'reject') => {
    try {
      await onModerate?.(itemId, action, moderationNotes);
      setModerationNotes('');
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to moderate item:', error);
    }
  }, [onModerate, moderationNotes]);

  const handleBulkModerate = useCallback(async (action: 'approve' | 'reject' | 'escalate') => {
    if (selectedItems.length === 0) return;
    
    try {
      await onBulkModerate?.({
        itemIds: selectedItems,
        action,
        notes: moderationNotes
      });
      setSelectedItems([]);
      setModerationNotes('');
    } catch (error) {
      console.error('Failed to bulk moderate:', error);
    }
  }, [onBulkModerate, selectedItems, moderationNotes]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg Response</p>
                <p className="text-2xl font-bold">{stats.avgResponseTime}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Backlog</p>
                <p className="text-2xl font-bold">{stats.backlogHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Moderation Queue
              </CardTitle>
              <CardDescription>
                Review and approve leaderboard changes
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
              
              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleBulkModerate('approve')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve ({selectedItems.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleBulkModerate('reject')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by leaderboard, user, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Filters */}
          {showFilters && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select
                    value={filters.status?.[0] || ''}
                    onValueChange={(value) => 
                      handleFilterChange({ 
                        ...filters, 
                        status: value ? [value as ModerationItem['status']] : undefined 
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Priority</label>
                  <Select
                    value={filters.priority?.[0] || ''}
                    onValueChange={(value) => 
                      handleFilterChange({ 
                        ...filters, 
                        priority: value ? [value as ModerationItem['priority']] : undefined 
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Type</label>
                  <Select
                    value={filters.type?.[0] || ''}
                    onValueChange={(value) => 
                      handleFilterChange({ 
                        ...filters, 
                        type: value ? [value as ModerationItem['type']] : undefined 
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="create">Create</SelectItem>
                      <SelectItem value="update">Update</SelectItem>
                      <SelectItem value="delete">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({});
                      setSearchTerm('');
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardHeader>
        
        <CardContent className="p-0">
          {/* Items List */}
          <div className="space-y-0">
            {/* Header */}
            <div className="flex items-center px-6 py-3 border-b bg-muted/50 text-sm font-medium">
              <div className="flex items-center space-x-3 w-8">
                <button
                  onClick={handleSelectAll}
                  className="p-1 rounded hover:bg-background/80 transition-colors"
                >
                  {selectedItems.length === filteredItems.length && filteredItems.length > 0 ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex-1 grid grid-cols-12 gap-4">
                <div className="col-span-3">Leaderboard</div>
                <div className="col-span-2">Submitted By</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-1">Priority</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Submitted</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>
            
            <ScrollArea className="h-[600px]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-muted-foreground">Loading moderation queue...</div>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Shield className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">No items in queue</p>
                  <p className="text-sm">All submissions have been reviewed</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center px-6 py-4 border-b hover:bg-muted/50 transition-colors ${
                      selectedItems.includes(item.id) ? 'bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3 w-8">
                      <button
                        onClick={() => handleSelectItem(item.id)}
                        className="p-1 rounded hover:bg-background/80 transition-colors"
                      >
                        {selectedItems.includes(item.id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-3">
                        <div className="font-medium text-sm">{item.leaderboardName}</div>
                        <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="text-sm">{item.submittedBy}</div>
                      </div>
                      
                      <div className="col-span-1">
                        <div className="flex items-center gap-1 text-sm">
                          <span>{TYPE_ICONS[item.type]}</span>
                          <span className="capitalize">{item.type}</span>
                        </div>
                      </div>
                      
                      <div className="col-span-1">
                        <Badge className={`text-xs ${PRIORITY_COLORS[item.priority]}`}>
                          {item.priority}
                          {item.priority === 'urgent' && <ArrowUp className="h-3 w-3 ml-1" />}
                        </Badge>
                      </div>
                      
                      <div className="col-span-1">
                        <Badge className={`text-xs ${STATUS_COLORS[item.status]}`}>
                          {item.status}
                        </Badge>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="text-sm">{new Date(item.submittedAt).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.submittedAt).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedItem(item)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Review
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Shield className="h-5 w-5" />
                                  Review Moderation Item
                                </DialogTitle>
                                <DialogDescription>
                                  {item.leaderboardName} - {item.type} request
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedItem && (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Request Details</h4>
                                        <div className="space-y-2 text-sm">
                                          <div><strong>Type:</strong> {TYPE_ICONS[item.type]} {item.type}</div>
                                          <div><strong>Priority:</strong> <Badge className={`text-xs ${PRIORITY_COLORS[item.priority]}`}>{item.priority}</Badge></div>
                                          <div><strong>Submitted by:</strong> {item.submittedBy}</div>
                                          <div><strong>Submitted at:</strong> {new Date(item.submittedAt).toLocaleString()}</div>
                                          <div><strong>Description:</strong> {item.description}</div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Current Status</h4>
                                        <div className="space-y-2 text-sm">
                                          <div><strong>Status:</strong> <Badge className={`text-xs ${STATUS_COLORS[item.status]}`}>{item.status}</Badge></div>
                                          {item.moderatedBy && <div><strong>Moderated by:</strong> {item.moderatedBy}</div>}
                                          {item.moderatedAt && <div><strong>Moderated at:</strong> {new Date(item.moderatedAt).toLocaleString()}</div>}
                                          {item.moderationNotes && <div><strong>Notes:</strong> {item.moderationNotes}</div>}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <Separator />
                                  
                                  <div>
                                    <h4 className="font-medium mb-4 flex items-center gap-2">
                                      <History className="h-4 w-4" />
                                      Audit Trail
                                    </h4>
                                    <div className="space-y-3">
                                      {item.auditTrail.map((entry) => (
                                        <div key={entry.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                          <div className="mt-1">
                                            {entry.action === 'submitted' && <Clock className="h-4 w-4 text-blue-500" />}
                                            {entry.action === 'reviewed' && <Eye className="h-4 w-4 text-yellow-500" />}
                                            {entry.action === 'approved' && <Check className="h-4 w-4 text-green-500" />}
                                            {entry.action === 'rejected' && <X className="h-4 w-4 text-red-500" />}
                                            {entry.action === 'escalated' && <ArrowUp className="h-4 w-4 text-orange-500" />}
                                            {entry.action === 'commented' && <MessageSquare className="h-4 w-4 text-purple-500" />}
                                          </div>
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 text-sm">
                                              <span className="font-medium capitalize">{entry.action}</span>
                                              <span className="text-muted-foreground">by {entry.userId}</span>
                                              <span className="text-muted-foreground">({entry.userRole})</span>
                                              <span className="text-muted-foreground">•</span>
                                              <span className="text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1">{entry.details}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  {item.status === 'pending' && (
                                    <>
                                      <Separator />
                                      <div className="space-y-4">
                                        <div>
                                          <label className="text-sm font-medium mb-2 block">Moderation Notes</label>
                                          <Textarea
                                            placeholder="Add notes about your decision..."
                                            value={moderationNotes}
                                            onChange={(e) => setModerationNotes(e.target.value)}
                                            rows={3}
                                          />
                                        </div>
                                        
                                        <div className="flex items-center gap-2 justify-end">
                                          <Button
                                            onClick={() => handleModerate(item.id, 'approve')}
                                            className="bg-green-600 hover:bg-green-700"
                                          >
                                            <Check className="h-4 w-4 mr-2" />
                                            Approve
                                          </Button>
                                          <Button
                                            variant="destructive"
                                            onClick={() => handleModerate(item.id, 'reject')}
                                          >
                                            <X className="h-4 w-4 mr-2" />
                                            Reject
                                          </Button>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {item.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleModerate(item.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700 text-xs px-2"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleModerate(item.id, 'reject')}
                                className="text-xs px-2"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ModerationQueue;
