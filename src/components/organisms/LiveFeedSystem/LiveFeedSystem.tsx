'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Circle, 
  CheckCircle, 
  AlertCircle,
  Filter,
  MoreVertical,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import type { LiveFeedSystemProps, DeduplicationConfig } from './types';
import type { LiveFeedItem, LiveFeedConnection } from '@/lib/types';

/**
 * LiveFeedSystem Organism
 * Real-time data streaming with WebSocket/SSE support
 * Built with atomic deduplication logic and comprehensive filtering
 */
export const LiveFeedSystem: React.FC<LiveFeedSystemProps> = ({
  connectionUrl,
  connectionType = 'websocket',
  orgId,
  filters,
  onFiltersChange,
  onItemClick,
  onMarkAsRead,
  onBulkAction,
  maxItems = 500,
  autoScroll = true,
  showConnectionStatus = true,
  compact = false,
  loading = false,
  error = null,
  className
}) => {
  // State management
  const [items, setItems] = useState<LiveFeedItem[]>([]);
  const [connection, setConnection] = useState<LiveFeedConnection | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const duplicateTracker = useRef<Map<string, number>>(new Map());

  // Deduplication configuration
  const deduplicationConfig: DeduplicationConfig = {
    enabled: true,
    fields: ['content', 'source'],
    timeWindow: 5000, // 5 seconds
    strategy: 'hash',
  };

  // Generate hash for deduplication
  const generateItemHash = useCallback((item: LiveFeedItem): string => {
    const hashData = deduplicationConfig.fields
      .map(field => {
        switch (field) {
          case 'content':
            return item.content;
          case 'title':
            return item.title;
          case 'source':
            return item.source;
          case 'data':
            return JSON.stringify(item.data);
          default:
            return '';
        }
      })
      .join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < hashData.length; i++) {
      const char = hashData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(36);
  }, [deduplicationConfig.fields]);

  // Check for duplicates
  const isDuplicate = useCallback((item: LiveFeedItem): boolean => {
    if (!deduplicationConfig.enabled) return false;

    const hash = generateItemHash(item);
    const now = Date.now();
    const lastSeen = duplicateTracker.current.get(hash);
    
    if (lastSeen && (now - lastSeen) < deduplicationConfig.timeWindow) {
      return true;
    }
    
    duplicateTracker.current.set(hash, now);
    
    // Cleanup old entries
    const cutoff = now - deduplicationConfig.timeWindow;
    for (const [key, timestamp] of duplicateTracker.current.entries()) {
      if (timestamp < cutoff) {
        duplicateTracker.current.delete(key);
      }
    }
    
    return false;
  }, [deduplicationConfig, generateItemHash]);

  // Add new item with deduplication
  const addItem = useCallback((newItem: LiveFeedItem) => {
    if (isPaused) return;
    
    if (isDuplicate(newItem)) {
      console.log('Duplicate item filtered:', newItem.id);
      return;
    }

    setItems(prevItems => {
      const updated = [newItem, ...prevItems];
      return updated.slice(0, maxItems); // Limit total items
    });

    // Auto-scroll to new items
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [isPaused, isDuplicate, maxItems, autoScroll]);

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`${connectionUrl}?org=${orgId}`);
    wsRef.current = ws;

    setConnection({
      id: `ws-${Date.now()}`,
      status: 'connecting',
      type: 'websocket',
      url: connectionUrl,
      lastActivity: new Date().toISOString(),
      metrics: {
        messagesReceived: 0,
        bytesReceived: 0,
        connectionTime: Date.now(),
        reconnectCount: 0,
      },
    });

    ws.onopen = () => {
      setConnection(prev => prev ? {
        ...prev,
        status: 'connected',
        lastActivity: new Date().toISOString(),
      } : null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const feedItem: LiveFeedItem = {
          id: data.id || `item-${Date.now()}-${Math.random()}`,
          type: data.type || 'system_event',
          timestamp: data.timestamp || new Date().toISOString(),
          title: data.title || 'Untitled',
          content: data.content || '',
          data: data.data || {},
          source: data.source || 'unknown',
          priority: data.priority || 'medium',
          tags: data.tags || [],
          read: false,
          user: data.user,
          post: data.post,
        };
        
        addItem(feedItem);
        
        setConnection(prev => prev ? {
          ...prev,
          lastActivity: new Date().toISOString(),
          metrics: {
            ...prev.metrics,
            messagesReceived: prev.metrics.messagesReceived + 1,
            bytesReceived: prev.metrics.bytesReceived + event.data.length,
          },
        } : null);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = () => {
      setConnection(prev => prev ? {
        ...prev,
        status: 'error',
        error: 'WebSocket connection error',
      } : null);
    };

    ws.onclose = () => {
      setConnection(prev => prev ? {
        ...prev,
        status: 'disconnected',
      } : null);
    };
  }, [connectionUrl, orgId, addItem]);

  // Server-Sent Events connection
  const connectSSE = useCallback(() => {
    if (sseRef.current) {
      sseRef.current.close();
    }

    const eventSource = new EventSource(`${connectionUrl}?org=${orgId}`);
    sseRef.current = eventSource;

    setConnection({
      id: `sse-${Date.now()}`,
      status: 'connecting',
      type: 'sse',
      url: connectionUrl,
      lastActivity: new Date().toISOString(),
      metrics: {
        messagesReceived: 0,
        bytesReceived: 0,
        connectionTime: Date.now(),
        reconnectCount: 0,
      },
    });

    eventSource.onopen = () => {
      setConnection(prev => prev ? {
        ...prev,
        status: 'connected',
        lastActivity: new Date().toISOString(),
      } : null);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const feedItem: LiveFeedItem = {
          id: data.id || `item-${Date.now()}-${Math.random()}`,
          type: data.type || 'system_event',
          timestamp: data.timestamp || new Date().toISOString(),
          title: data.title || 'Untitled',
          content: data.content || '',
          data: data.data || {},
          source: data.source || 'unknown',
          priority: data.priority || 'medium',
          tags: data.tags || [],
          read: false,
          user: data.user,
          post: data.post,
        };
        
        addItem(feedItem);
        
        setConnection(prev => prev ? {
          ...prev,
          lastActivity: new Date().toISOString(),
          metrics: {
            ...prev.metrics,
            messagesReceived: prev.metrics.messagesReceived + 1,
            bytesReceived: prev.metrics.bytesReceived + event.data.length,
          },
        } : null);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = () => {
      setConnection(prev => prev ? {
        ...prev,
        status: 'error',
        error: 'Server-Sent Events connection error',
      } : null);
    };
  }, [connectionUrl, orgId, addItem]);

  // Connect based on type
  const connect = useCallback(() => {
    if (connectionType === 'websocket' || connectionType === 'auto') {
      connectWebSocket();
    } else if (connectionType === 'sse') {
      connectSSE();
    }
  }, [connectionType, connectWebSocket, connectSSE]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }
    setConnection(prev => prev ? {
      ...prev,
      status: 'disconnected',
    } : null);
  }, []);

  // Initialize connection
  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  // Simulate live data for demo (remove in production)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && connection?.status === 'connected') {
        const mockItem: LiveFeedItem = {
          id: `mock-${Date.now()}-${Math.random()}`,
          type: ['post', 'user_action', 'signal', 'system_event'][Math.floor(Math.random() * 4)] as LiveFeedItem['type'],
          timestamp: new Date().toISOString(),
          title: ['New Post Published', 'User Joined', 'Signal Detected', 'System Alert'][Math.floor(Math.random() * 4)],
          content: 'This is a simulated live feed item for demonstration purposes.',
          data: { demo: true, value: Math.random() * 100 },
          source: ['twitter', 'linkedin', 'system', 'monitor'][Math.floor(Math.random() * 4)],
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as LiveFeedItem['priority'],
          tags: ['demo', 'live', 'test'],
          read: false,
        };
        addItem(mockItem);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, connection?.status, addItem]);

  // Filter items based on current filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(item.type)) {
        return false;
      }
      
      // Priority filter
      if (filters.priorities.length > 0 && !filters.priorities.includes(item.priority)) {
        return false;
      }
      
      // Source filter
      if (filters.sources.length > 0 && !filters.sources.includes(item.source)) {
        return false;
      }
      
      // Tag filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => item.tags.includes(tag))) {
        return false;
      }
      
      // Unread filter
      if (filters.unreadOnly && item.read) {
        return false;
      }
      
      return true;
    });
  }, [items, filters]);

  // Get priority color
  const getPriorityColor = (priority: LiveFeedItem['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-500';
      case 'high': return 'text-orange-500';
      case 'medium': return 'text-blue-500';
      case 'low': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card className={cn("p-6", className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Connection Status */}
      {showConnectionStatus && connection && (
        <Alert className={cn(
          connection.status === 'connected' && "border-green-500",
          connection.status === 'error' && "border-destructive"
        )}>
          <div className="flex items-center gap-2">
            {connection.status === 'connected' ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : connection.status === 'connecting' ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <WifiOff className="h-4 w-4 text-destructive" />
            )}
            <span className="font-medium capitalize">{connection.status}</span>
            {connection.status === 'connected' && (
              <Badge variant="secondary" className="text-xs">
                {connection.metrics.messagesReceived} messages
              </Badge>
            )}
          </div>
          {connection.error && (
            <AlertDescription className="mt-2">{connection.error}</AlertDescription>
          )}
        </Alert>
      )}

      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={isPaused ? "default" : "outline"}
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="gap-2"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={connect}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reconnect
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="text-sm text-muted-foreground">
              <span>{filteredItems.length} of {items.length} items</span>
              {filters.unreadOnly && (
                <span className="ml-2">• Unread only</span>
              )}
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Feed Items */}
      <Card className="p-0">
        <ScrollArea ref={containerRef} className="h-96">
          <div className="p-4 space-y-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {items.length === 0 ? (
                  <div>
                    <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Waiting for live data...</p>
                  </div>
                ) : (
                  <div>
                    <Filter className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No items match current filters</p>
                  </div>
                )}
              </div>
            ) : (
              filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors cursor-pointer",
                    "hover:bg-muted/50",
                    !item.read && "border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20",
                    selectedItems.includes(item.id) && "bg-secondary"
                  )}
                  onClick={() => onItemClick?.(item)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={cn("w-2 h-2 rounded-full", getPriorityColor(item.priority))} />
                        <span className="text-sm font-medium truncate">{item.title}</span>
                        <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {item.content}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>{item.source}</span>
                        {item.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex gap-1">
                              {item.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {item.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{item.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!item.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead?.(item.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default LiveFeedSystem;
