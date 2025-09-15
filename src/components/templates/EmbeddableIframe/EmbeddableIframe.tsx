"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Code,
  Copy,
  Eye,
  Download,
  Share2,
  Monitor,
  Tablet,
  Smartphone,
  Globe,
  Shield,
  BarChart,
  Palette,
  Settings,
  Link,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  MousePointer
} from "lucide-react";

import type { 
  EmbedConfig, 
  EmbedSecurityConfig, 
  EmbedAnalytics, 
  EmbedPreview, 
  LeaderboardData,
  EmbedMetrics
} from "./types";

interface EmbeddableIframeProps {
  leaderboard?: LeaderboardData;
  embedUrl?: string;
  config?: Partial<EmbedConfig>;
  securityConfig?: Partial<EmbedSecurityConfig>;
  analytics?: Partial<EmbedAnalytics>;
  metrics?: EmbedMetrics;
  onConfigChange?: (config: EmbedConfig) => void;
  onGenerateEmbed?: (config: EmbedConfig) => Promise<string>;
  onTestEmbed?: (url: string) => void;
  className?: string;
}

// Mock data generators
const generateMockLeaderboard = (): LeaderboardData => ({
  id: 'lb-crypto-influencers',
  name: 'Top Crypto Influencers',
  description: 'Leading voices in cryptocurrency and blockchain technology',
  entries: Array.from({ length: 20 }, (_, i) => ({
    id: `user-${i + 1}`,
    rank: i + 1,
    name: `@${['cryptoking', 'blockchainboss', 'defimaster', 'nftguru', 'bitcoinbull', 'ethwhale', 'altcoinhero', 'tradingpro'][i % 8]}${Math.floor(Math.random() * 100)}`,
    score: 1000 - i * 45 + Math.floor(Math.random() * 40),
    change: Math.floor(Math.random() * 21) - 10, // -10 to +10
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    metadata: {
      followers: Math.floor(Math.random() * 1000000) + 10000,
      engagement: Math.floor(Math.random() * 10) + 1,
      specialty: ['DeFi', 'NFTs', 'Trading', 'Analysis', 'News'][Math.floor(Math.random() * 5)]
    }
  })),
  lastUpdated: new Date().toISOString(),
  totalEntries: 1247,
  isPublic: true,
  isActive: true
});

const generateMockMetrics = (): EmbedMetrics => ({
  views: 45231,
  uniqueViews: 23451,
  domains: [
    { domain: 'cryptonews.com', views: 12340, lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { domain: 'defiwatch.io', views: 8932, lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
    { domain: 'blockchainblog.net', views: 5431, lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    { domain: 'tradingview.com', views: 4123, lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
    { domain: 'coindesk.com', views: 3890, lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
  ],
  countries: [
    { country: 'United States', views: 15623 },
    { country: 'United Kingdom', views: 7832 },
    { country: 'Germany', views: 6234 },
    { country: 'Japan', views: 4567 },
    { country: 'Canada', views: 3421 },
  ],
  devices: {
    desktop: 28340,
    tablet: 8932,
    mobile: 7959
  },
  avgSessionTime: 142, // seconds
  bounceRate: 0.23,
  topReferrers: [
    { referrer: 'twitter.com', views: 18923 },
    { referrer: 'reddit.com', views: 12456 },
    { referrer: 'google.com', views: 8734 },
    { referrer: 'direct', views: 5118 }
  ]
});

const defaultEmbedConfig: EmbedConfig = {
  leaderboardId: 'lb-crypto-influencers',
  slug: 'crypto-influencers',
  orgId: 'xeet',
  theme: 'dark',
  showHeader: true,
  showFooter: true,
  showBranding: true,
  showExportButton: false,
  showRefreshButton: true,
  maxRows: 10,
  refreshInterval: 300, // 5 minutes
  customStyles: {
    primaryColor: '#3b82f6',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    borderRadius: '8px',
    fontFamily: 'Inter, sans-serif'
  },
  allowedDomains: ['*'],
  title: 'Top Crypto Influencers',
  subtitle: 'Real-time rankings updated every 5 minutes'
};

const defaultSecurityConfig: EmbedSecurityConfig = {
  allowFullscreen: false,
  allowScripts: true,
  allowSameOrigin: true,
  allowForms: false,
  referrerPolicy: 'strict-origin-when-cross-origin'
};

const defaultAnalytics: EmbedAnalytics = {
  trackViews: true,
  trackClicks: true,
  trackScrolling: false,
  customEvents: ['rank_click', 'export_attempt'],
  analyticsProvider: 'custom'
};

export function EmbeddableIframe({
  leaderboard = generateMockLeaderboard(),
  embedUrl = 'https://embed.xeet.com/lb/crypto-influencers',
  config = defaultEmbedConfig,
  securityConfig = defaultSecurityConfig,
  analytics = defaultAnalytics,
  metrics = generateMockMetrics(),
  onConfigChange,
  onGenerateEmbed,
  onTestEmbed,
  className = ""
}: EmbeddableIframeProps) {
  const [currentConfig, setCurrentConfig] = useState<EmbedConfig>({ ...defaultEmbedConfig, ...config });
  const [currentSecurity, setCurrentSecurity] = useState<EmbedSecurityConfig>({ ...defaultSecurityConfig, ...securityConfig });
  const [currentAnalytics, setCurrentAnalytics] = useState<EmbedAnalytics>({ ...defaultAnalytics, ...analytics });
  const [previewSettings, setPreviewSettings] = useState<EmbedPreview>({
    width: 400,
    height: 600,
    responsive: true,
    device: 'desktop',
    showBorder: true,
    backgroundColor: '#f1f5f9'
  });
  const [embedCode, setEmbedCode] = useState('');
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string; details?: string }[]>([]);

  // Generate embed code
  const generateEmbedCode = useCallback(() => {
    const params = new URLSearchParams({
      theme: currentConfig.theme,
      maxRows: currentConfig.maxRows.toString(),
      showHeader: currentConfig.showHeader.toString(),
      showFooter: currentConfig.showFooter.toString(),
      showBranding: currentConfig.showBranding.toString(),
      showExport: currentConfig.showExportButton.toString(),
      showRefresh: currentConfig.showRefreshButton.toString(),
      ...(currentConfig.refreshInterval && { refresh: currentConfig.refreshInterval.toString() }),
      ...(currentConfig.title && { title: currentConfig.title }),
      ...(currentConfig.subtitle && { subtitle: currentConfig.subtitle })
    });

    const iframeSrc = `${embedUrl}?${params.toString()}`;
    const sandboxAttrs = [
      currentSecurity.allowScripts && 'allow-scripts',
      currentSecurity.allowSameOrigin && 'allow-same-origin',
      currentSecurity.allowForms && 'allow-forms',
      currentSecurity.allowFullscreen && 'allow-fullscreen'
    ].filter(Boolean).join(' ');

    const iframeCode = `<iframe
  src="${iframeSrc}"
  width="${previewSettings.responsive ? '100%' : previewSettings.width}"
  height="${previewSettings.height}"
  frameborder="0"
  sandbox="${sandboxAttrs}"
  referrerpolicy="${currentSecurity.referrerPolicy}"
  loading="lazy"
  title="${currentConfig.title || leaderboard.name}"
></iframe>`;

    setEmbedCode(iframeCode);
    return iframeCode;
  }, [currentConfig, currentSecurity, previewSettings, embedUrl, leaderboard.name]);

  // Test embed functionality
  const runEmbedTests = useCallback(() => {
    const tests: { passed: boolean; message: string; details?: string }[] = [];

    // Test URL accessibility
    tests.push({
      passed: embedUrl.startsWith('https://'),
      message: 'HTTPS Protocol',
      details: embedUrl.startsWith('https://') ? 'Secure connection established' : 'URL should use HTTPS for security'
    });

    // Test domain restrictions
    if (currentConfig.allowedDomains && currentConfig.allowedDomains.length > 0 && !currentConfig.allowedDomains.includes('*')) {
      tests.push({
        passed: true,
        message: 'Domain Restrictions',
        details: `Restricted to: ${currentConfig.allowedDomains.join(', ')}`
      });
    } else {
      tests.push({
        passed: false,
        message: 'Domain Restrictions',
        details: 'No domain restrictions configured - consider limiting to trusted domains'
      });
    }

    // Test content security
    tests.push({
      passed: !currentSecurity.allowScripts || !!currentSecurity.contentSecurityPolicy,
      message: 'Content Security Policy',
      details: currentSecurity.contentSecurityPolicy ? 'CSP configured' : 'Consider adding CSP for security'
    });

    // Test performance
    tests.push({
      passed: currentConfig.maxRows <= 20,
      message: 'Performance Optimization',
      details: currentConfig.maxRows <= 20 ? `Optimized with ${currentConfig.maxRows} rows` : 'Consider reducing rows for better performance'
    });

    // Test refresh interval
    tests.push({
      passed: !currentConfig.refreshInterval || currentConfig.refreshInterval >= 60,
      message: 'Refresh Rate',
      details: !currentConfig.refreshInterval 
        ? 'Manual refresh only' 
        : currentConfig.refreshInterval >= 60 
          ? `Refreshes every ${currentConfig.refreshInterval}s`
          : 'Refresh interval too short - may impact performance'
    });

    setTestResults(tests);
  }, [embedUrl, currentConfig, currentSecurity]);

  // Update config
  const updateConfig = useCallback((updates: Partial<EmbedConfig>) => {
    const newConfig = { ...currentConfig, ...updates };
    setCurrentConfig(newConfig);
    onConfigChange?.(newConfig);
  }, [currentConfig, onConfigChange]);

  // Copy embed code
  const copyEmbedCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(embedCode || generateEmbedCode());
      // You would typically show a toast notification here
    } catch (error) {
      console.error('Failed to copy embed code:', error);
    }
  }, [embedCode, generateEmbedCode]);

  // Generate embed code on mount and config changes
  useEffect(() => {
    generateEmbedCode();
  }, [generateEmbedCode]);

  // Format numbers
  const formatNumber = useCallback((num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Code className="h-6 w-6" />
            Embeddable Iframe
          </h2>
          <p className="text-muted-foreground">
            Generate embeddable iframe code for "{leaderboard.name}"
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={runEmbedTests}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Run Tests
          </Button>
          <Button
            onClick={() => onTestEmbed?.(embedUrl)}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Test Embed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="display" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="display">Display</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="display" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Theme</label>
                      <Select
                        value={currentConfig.theme}
                        onValueChange={(value: 'light' | 'dark' | 'auto') => updateConfig({ theme: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Rows</label>
                      <div className="space-y-2">
                        <Slider
                          value={[currentConfig.maxRows]}
                          onValueChange={([value]) => updateConfig({ maxRows: value })}
                          max={50}
                          min={5}
                          step={5}
                        />
                        <div className="text-sm text-muted-foreground text-center">
                          {currentConfig.maxRows} rows
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input
                        value={currentConfig.title || ''}
                        onChange={(e) => updateConfig({ title: e.target.value })}
                        placeholder="Leaderboard title"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subtitle</label>
                      <Input
                        value={currentConfig.subtitle || ''}
                        onChange={(e) => updateConfig({ subtitle: e.target.value })}
                        placeholder="Optional subtitle"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Show Header</label>
                      <Switch
                        checked={currentConfig.showHeader}
                        onCheckedChange={(checked) => updateConfig({ showHeader: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Show Footer</label>
                      <Switch
                        checked={currentConfig.showFooter}
                        onCheckedChange={(checked) => updateConfig({ showFooter: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Show Branding</label>
                      <Switch
                        checked={currentConfig.showBranding}
                        onCheckedChange={(checked) => updateConfig({ showBranding: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Show Export Button</label>
                      <Switch
                        checked={currentConfig.showExportButton}
                        onCheckedChange={(checked) => updateConfig({ showExportButton: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Show Refresh Button</label>
                      <Switch
                        checked={currentConfig.showRefreshButton}
                        onCheckedChange={(checked) => updateConfig({ showRefreshButton: checked })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Auto-refresh Interval</label>
                    <div className="space-y-2">
                      <Slider
                        value={[currentConfig.refreshInterval || 0]}
                        onValueChange={([value]) => updateConfig({ refreshInterval: value || undefined })}
                        max={3600}
                        min={0}
                        step={60}
                      />
                      <div className="text-sm text-muted-foreground text-center">
                        {currentConfig.refreshInterval 
                          ? `${Math.floor(currentConfig.refreshInterval / 60)}m ${currentConfig.refreshInterval % 60}s`
                          : 'Manual refresh only'
                        }
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="style" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={currentConfig.customStyles?.primaryColor || '#3b82f6'}
                          onChange={(e) => updateConfig({
                            customStyles: { ...currentConfig.customStyles, primaryColor: e.target.value }
                          })}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={currentConfig.customStyles?.primaryColor || '#3b82f6'}
                          onChange={(e) => updateConfig({
                            customStyles: { ...currentConfig.customStyles, primaryColor: e.target.value }
                          })}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Background Color</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={currentConfig.customStyles?.backgroundColor || '#1a1a1a'}
                          onChange={(e) => updateConfig({
                            customStyles: { ...currentConfig.customStyles, backgroundColor: e.target.value }
                          })}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={currentConfig.customStyles?.backgroundColor || '#1a1a1a'}
                          onChange={(e) => updateConfig({
                            customStyles: { ...currentConfig.customStyles, backgroundColor: e.target.value }
                          })}
                          placeholder="#1a1a1a"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Text Color</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={currentConfig.customStyles?.textColor || '#ffffff'}
                          onChange={(e) => updateConfig({
                            customStyles: { ...currentConfig.customStyles, textColor: e.target.value }
                          })}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={currentConfig.customStyles?.textColor || '#ffffff'}
                          onChange={(e) => updateConfig({
                            customStyles: { ...currentConfig.customStyles, textColor: e.target.value }
                          })}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Border Radius</label>
                      <Input
                        value={currentConfig.customStyles?.borderRadius || '8px'}
                        onChange={(e) => updateConfig({
                          customStyles: { ...currentConfig.customStyles, borderRadius: e.target.value }
                        })}
                        placeholder="8px"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Font Family</label>
                    <Input
                      value={currentConfig.customStyles?.fontFamily || 'Inter, sans-serif'}
                      onChange={(e) => updateConfig({
                        customStyles: { ...currentConfig.customStyles, fontFamily: e.target.value }
                      })}
                      placeholder="Inter, sans-serif"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="security" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Allow Scripts</label>
                        <p className="text-xs text-muted-foreground">Enable JavaScript functionality</p>
                      </div>
                      <Switch
                        checked={currentSecurity.allowScripts}
                        onCheckedChange={(checked) => setCurrentSecurity({ ...currentSecurity, allowScripts: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Allow Same Origin</label>
                        <p className="text-xs text-muted-foreground">Access parent window properties</p>
                      </div>
                      <Switch
                        checked={currentSecurity.allowSameOrigin}
                        onCheckedChange={(checked) => setCurrentSecurity({ ...currentSecurity, allowSameOrigin: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Allow Forms</label>
                        <p className="text-xs text-muted-foreground">Enable form submissions</p>
                      </div>
                      <Switch
                        checked={currentSecurity.allowForms}
                        onCheckedChange={(checked) => setCurrentSecurity({ ...currentSecurity, allowForms: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Allow Fullscreen</label>
                        <p className="text-xs text-muted-foreground">Enable fullscreen mode</p>
                      </div>
                      <Switch
                        checked={currentSecurity.allowFullscreen}
                        onCheckedChange={(checked) => setCurrentSecurity({ ...currentSecurity, allowFullscreen: checked })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Referrer Policy</label>
                    <Select
                      value={currentSecurity.referrerPolicy}
                      onValueChange={(value: any) => setCurrentSecurity({ ...currentSecurity, referrerPolicy: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-referrer">No Referrer</SelectItem>
                        <SelectItem value="no-referrer-when-downgrade">No Referrer When Downgrade</SelectItem>
                        <SelectItem value="origin">Origin</SelectItem>
                        <SelectItem value="origin-when-cross-origin">Origin When Cross Origin</SelectItem>
                        <SelectItem value="same-origin">Same Origin</SelectItem>
                        <SelectItem value="strict-origin">Strict Origin</SelectItem>
                        <SelectItem value="strict-origin-when-cross-origin">Strict Origin When Cross Origin</SelectItem>
                        <SelectItem value="unsafe-url">Unsafe URL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Allowed Domains</label>
                    <Textarea
                      value={currentConfig.allowedDomains?.join('\n') || '*'}
                      onChange={(e) => updateConfig({ 
                        allowedDomains: e.target.value.split('\n').filter(d => d.trim()) 
                      })}
                      placeholder="example.com&#10;*.trusted-domain.com&#10;* (for all domains)"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      One domain per line. Use * to allow all domains.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Track Views</label>
                      <Switch
                        checked={currentAnalytics.trackViews}
                        onCheckedChange={(checked) => setCurrentAnalytics({ ...currentAnalytics, trackViews: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Track Clicks</label>
                      <Switch
                        checked={currentAnalytics.trackClicks}
                        onCheckedChange={(checked) => setCurrentAnalytics({ ...currentAnalytics, trackClicks: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Track Scrolling</label>
                      <Switch
                        checked={currentAnalytics.trackScrolling}
                        onCheckedChange={(checked) => setCurrentAnalytics({ ...currentAnalytics, trackScrolling: checked })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Analytics Provider</label>
                    <Select
                      value={currentAnalytics.analyticsProvider || 'custom'}
                      onValueChange={(value: any) => setCurrentAnalytics({ ...currentAnalytics, analyticsProvider: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="google">Google Analytics</SelectItem>
                        <SelectItem value="mixpanel">Mixpanel</SelectItem>
                        <SelectItem value="amplitude">Amplitude</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {currentAnalytics.analyticsProvider !== 'custom' && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tracking ID</label>
                      <Input
                        value={currentAnalytics.trackingId || ''}
                        onChange={(e) => setCurrentAnalytics({ ...currentAnalytics, trackingId: e.target.value })}
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Custom Events</label>
                    <Textarea
                      value={currentAnalytics.customEvents?.join('\n') || ''}
                      onChange={(e) => setCurrentAnalytics({ 
                        ...currentAnalytics, 
                        customEvents: e.target.value.split('\n').filter(e => e.trim()) 
                      })}
                      placeholder="rank_click&#10;export_attempt&#10;share_click"
                      rows={3}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Embed Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Embed Code
              </CardTitle>
              <CardDescription>
                Copy and paste this code into your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={embedCode}
                    readOnly
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={copyEmbedCode}
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button onClick={generateEmbedCode} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button onClick={() => onGenerateEmbed?.(currentConfig)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Config
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Test Results */}
          {testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {testResults.map((test, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="mt-1">
                        {test.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{test.message}</div>
                        {test.details && (
                          <div className="text-sm text-muted-foreground mt-1">{test.details}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview & Analytics Panel */}
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Device Selection */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={previewSettings.device === 'desktop' ? 'default' : 'outline'}
                    onClick={() => setPreviewSettings({ ...previewSettings, device: 'desktop', width: 400, height: 600 })}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={previewSettings.device === 'tablet' ? 'default' : 'outline'}
                    onClick={() => setPreviewSettings({ ...previewSettings, device: 'tablet', width: 320, height: 500 })}
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={previewSettings.device === 'mobile' ? 'default' : 'outline'}
                    onClick={() => setPreviewSettings({ ...previewSettings, device: 'mobile', width: 280, height: 400 })}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Preview Frame */}
                <div 
                  className="mx-auto rounded-lg overflow-hidden"
                  style={{
                    width: previewSettings.responsive ? '100%' : `${previewSettings.width}px`,
                    height: `${previewSettings.height}px`,
                    backgroundColor: previewSettings.backgroundColor,
                    border: previewSettings.showBorder ? '1px solid #e5e7eb' : 'none',
                    maxWidth: `${previewSettings.width}px`
                  }}
                >
                  <div 
                    className="w-full h-full p-4 overflow-y-auto"
                    style={{
                      backgroundColor: currentConfig.customStyles?.backgroundColor || '#1a1a1a',
                      color: currentConfig.customStyles?.textColor || '#ffffff',
                      fontFamily: currentConfig.customStyles?.fontFamily || 'Inter, sans-serif'
                    }}
                  >
                    {/* Mock Leaderboard Content */}
                    {currentConfig.showHeader && (
                      <div className="mb-4">
                        {currentConfig.title && (
                          <h2 className="text-lg font-bold">{currentConfig.title}</h2>
                        )}
                        {currentConfig.subtitle && (
                          <p className="text-sm opacity-70">{currentConfig.subtitle}</p>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {leaderboard.entries.slice(0, currentConfig.maxRows).map((entry, index) => (
                        <div key={entry.id} className="flex items-center gap-3 p-2 rounded bg-white/5">
                          <div className="font-bold text-sm w-6 text-center">#{entry.rank}</div>
                          <div className="flex-1 text-sm truncate">{entry.name}</div>
                          <div className="text-sm font-medium">{entry.score}</div>
                        </div>
                      ))}
                    </div>
                    
                    {currentConfig.showFooter && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs opacity-70">
                          <span>Updated {new Date().toLocaleDateString()}</span>
                          {currentConfig.showBranding && (
                            <span>Powered by Xeet</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Embed Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(metrics.views)}</div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatNumber(metrics.uniqueViews)}</div>
                    <div className="text-sm text-muted-foreground">Unique Views</div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Top Domains */}
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Top Domains
                  </h4>
                  <div className="space-y-2">
                    {metrics.domains.slice(0, 3).map((domain, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1">{domain.domain}</span>
                        <span className="font-medium">{formatNumber(domain.views)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Device Breakdown */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Device Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Desktop
                      </span>
                      <span className="font-medium">{formatNumber(metrics.devices.desktop)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Tablet className="h-4 w-4" />
                        Tablet
                      </span>
                      <span className="font-medium">{formatNumber(metrics.devices.tablet)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Mobile
                      </span>
                      <span className="font-medium">{formatNumber(metrics.devices.mobile)}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4" />
                      {metrics.avgSessionTime}s
                    </div>
                    <div className="text-muted-foreground">Avg Session</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold flex items-center justify-center gap-1">
                      <MousePointer className="h-4 w-4" />
                      {Math.round((1 - metrics.bounceRate) * 100)}%
                    </div>
                    <div className="text-muted-foreground">Engagement</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default EmbeddableIframe;
