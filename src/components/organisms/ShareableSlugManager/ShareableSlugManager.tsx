"use client";

import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components";
import { Badge } from "@/components";
import { Button } from "@/components";
import { Input } from "@/components";
import { Textarea } from "@/components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components";
import { Switch } from "@/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components";
import { Separator } from "@/components";
import { 
  Share2,
  Plus,
  Copy,
  Eye,
  BarChart3,
  Settings,
  Link,
  QrCode,
  Globe,
  Lock,
  Calendar,
  TrendingUp,
  Users,
  ExternalLink,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Code,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Edit
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { 
  ShareableSlugManagerProps,
  ShareableUrl,
  CreateSlugConfig,
  ShareableUrlCardProps,
  CreateSlugModalProps,
  SlugAnalyticsProps,
  ShareOptionsProps,
  AnalyticsPeriod,
  SharePlatform,
  EmbedCodeGeneratorProps,
  EmbedConfig
} from "./types";

/**
 * ShareableSlugManager Organism
 * 
 * Comprehensive public URL sharing system with:
 * - Shareable URL generation and management
 * - Analytics tracking and reporting
 * - Access controls and security
 * - Social media sharing integration
 * - QR code generation
 * - Embed code generation
 */
export function ShareableSlugManager({
  leaderboard,
  shareableUrls = [],
  baseUrl = "https://leaderboards.xeet.co",
  canCreate = true,
  canEdit = true,
  canDelete = false,
  onCreateSlug,
  onUpdateSlug,
  onDeleteSlug,
  onCopySlug,
  loading = false,
  error,
  className,
  "data-testid": testId = "shareable-slug-manager",
}: ShareableSlugManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<ShareableUrl | null>(null);
  const [analyticsTab, setAnalyticsTab] = useState<AnalyticsPeriod>("7d");

  // Calculate aggregate analytics
  const totalAnalytics = useMemo(() => {
    return shareableUrls.reduce((acc, url) => ({
      totalViews: acc.totalViews + url.analytics.totalViews,
      uniqueViews: acc.uniqueViews + url.analytics.uniqueViews,
      viewsLast7d: acc.viewsLast7d + url.analytics.viewsLast7d,
    }), { totalViews: 0, uniqueViews: 0, viewsLast7d: 0 });
  }, [shareableUrls]);

  const handleCreateSlug = useCallback((config: CreateSlugConfig) => {
    onCreateSlug?.(config);
    setShowCreateModal(false);
  }, [onCreateSlug]);

  const handleCopyUrl = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      onCopySlug?.(url);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  }, [onCopySlug]);

  const handleShareToPlatform = useCallback((platform: SharePlatform, url: string) => {
    const title = encodeURIComponent(`${leaderboard.name} - Leaderboard`);
    const description = encodeURIComponent(leaderboard.description);
    
    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${title}&url=${encodeURIComponent(url)}`);
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case "email":
        window.open(`mailto:?subject=${title}&body=${description}%0A%0A${encodeURIComponent(url)}`);
        break;
      case "copy":
        handleCopyUrl(url);
        break;
    }
  }, [leaderboard.name, leaderboard.description, handleCopyUrl]);

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)} data-testid={testId}>
        <CardHeader className="space-y-2">
          <div className="h-6 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("border-destructive", className)} data-testid={testId}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)} data-testid={testId}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Share & Distribution
              </CardTitle>
              <CardDescription>
                Manage public sharing URLs for "{leaderboard.name}"
              </CardDescription>
            </div>
            {canCreate && (
              <Button onClick={() => setShowCreateModal(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Share URL
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalAnalytics.totalViews}</div>
            <div className="text-xs text-muted-foreground">Total Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalAnalytics.uniqueViews}</div>
            <div className="text-xs text-muted-foreground">Unique Visitors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{shareableUrls.length}</div>
            <div className="text-xs text-muted-foreground">Active URLs</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shareable URLs List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Link className="h-4 w-4" />
              Shareable URLs ({shareableUrls.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {shareableUrls.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Share2 className="h-8 w-8 mx-auto mb-2" />
                <div className="text-sm">No shareable URLs created yet</div>
                {canCreate && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create your first share URL
                  </Button>
                )}
              </div>
            ) : (
              shareableUrls.map(shareableUrl => (
                <ShareableUrlCard
                  key={shareableUrl.id}
                  shareableUrl={shareableUrl}
                  baseUrl={baseUrl}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  isSelected={selectedSlug?.id === shareableUrl.id}
                  onClick={() => setSelectedSlug(shareableUrl)}
                  onCopy={() => handleCopyUrl(shareableUrl.url)}
                  onDelete={() => onDeleteSlug?.(shareableUrl.id)}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Details Panel */}
        <div className="space-y-6">
          {selectedSlug ? (
            <>
              {/* Share Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Share Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShareOptions
                    url={selectedSlug.url}
                    title={`${leaderboard.name} - Leaderboard`}
                    description={leaderboard.description}
                    onShare={handleShareToPlatform}
                  />
                </CardContent>
              </Card>

              {/* Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SlugAnalytics
                    shareableUrl={selectedSlug}
                    period={analyticsTab}
                    onPeriodChange={setAnalyticsTab}
                  />
                </CardContent>
              </Card>

              {/* QR Code & Embed */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Additional Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="qr" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="qr">QR Code</TabsTrigger>
                      <TabsTrigger value="embed">Embed Code</TabsTrigger>
                    </TabsList>
                    <TabsContent value="qr">
                      <QRCodeDisplay url={selectedSlug.url} />
                    </TabsContent>
                    <TabsContent value="embed">
                      <EmbedCodeGenerator url={selectedSlug.url} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Link className="h-8 w-8 mx-auto mb-2" />
                <div className="text-sm">Select a shareable URL to view details</div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Slug Modal */}
      <CreateSlugModal
        open={showCreateModal}
        leaderboard={leaderboard}
        baseUrl={baseUrl}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSlug}
      />
    </div>
  );
}

/**
 * ShareableUrlCard Component
 */
function ShareableUrlCard({
  shareableUrl,
  baseUrl,
  canEdit,
  canDelete,
  isSelected,
  onClick,
  onCopy,
  onDelete,
}: ShareableUrlCardProps) {
  const isExpired = shareableUrl.expiresAt && new Date(shareableUrl.expiresAt) < new Date();

  return (
    <Card 
      className={cn(
        "transition-colors cursor-pointer hover:bg-muted/30",
        isSelected && "ring-2 ring-primary bg-primary/5",
        !shareableUrl.isActive && "opacity-60",
        isExpired && "border-red-200 bg-red-50/30"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{shareableUrl.name}</h4>
                <Badge variant={shareableUrl.isActive ? "default" : "secondary"}>
                  {shareableUrl.isActive ? "Active" : "Inactive"}
                </Badge>
                {isExpired && (
                  <Badge variant="destructive" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Expired
                  </Badge>
                )}
                {shareableUrl.access.requiresPassword && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    Protected
                  </Badge>
                )}
              </div>
              
              {shareableUrl.description && (
                <p className="text-xs text-muted-foreground mb-2">
                  {shareableUrl.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-mono bg-muted px-2 py-1 rounded">
                  {shareableUrl.url.replace(baseUrl || "", "")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => { e.stopPropagation(); onCopy?.(); }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => { e.stopPropagation(); window.open(shareableUrl.url); }}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              {canDelete && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="text-center">
              <div className="font-medium">{shareableUrl.analytics.totalViews}</div>
              <div className="text-muted-foreground">Views</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{shareableUrl.analytics.uniqueViews}</div>
              <div className="text-muted-foreground">Visitors</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{shareableUrl.analytics.viewsLast7d}</div>
              <div className="text-muted-foreground">7d Views</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * CreateSlugModal Component
 */
function CreateSlugModal({
  open,
  leaderboard,
  baseUrl = "",
  onClose,
  onSubmit,
}: CreateSlugModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const generatedSlug = customSlug || name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  const fullUrl = `${baseUrl}/${generatedSlug}`;

  const handleSubmit = () => {
    if (name.trim()) {
      const config: CreateSlugConfig = {
        name: name.trim(),
        description: description.trim(),
        customSlug: customSlug.trim(),
        access: {
          requiresPassword,
          ...(requiresPassword && password && { passwordHash: password }),
        },
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
      };
      
      onSubmit(config);
      
      // Reset form
      setName("");
      setDescription("");
      setCustomSlug("");
      setRequiresPassword(false);
      setPassword("");
      setExpiresAt("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Shareable URL</DialogTitle>
          <DialogDescription>
            Generate a public link to share "{leaderboard.name}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Main Public Link"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description for this share URL"
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Custom Slug (Optional)</label>
            <Input
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="custom-slug"
            />
            <div className="text-xs text-muted-foreground mt-1">
              Full URL: {fullUrl}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Password Protection</label>
              <Switch
                checked={requiresPassword}
                onCheckedChange={setRequiresPassword}
              />
            </div>

            {requiresPassword && (
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Expires At (Optional)</label>
            <Input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim()}>
              Create Share URL
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * ShareOptions Component
 */
function ShareOptions({
  url,
  title,
  description,
  onShare,
}: ShareOptionsProps) {
  const platforms: { platform: SharePlatform; icon: any; label: string; color: string }[] = [
    { platform: "twitter", icon: Twitter, label: "Twitter", color: "text-blue-500" },
    { platform: "linkedin", icon: Linkedin, label: "LinkedIn", color: "text-blue-600" },
    { platform: "facebook", icon: Facebook, label: "Facebook", color: "text-blue-700" },
    { platform: "email", icon: Mail, label: "Email", color: "text-gray-600" },
    { platform: "copy", icon: Copy, label: "Copy Link", color: "text-gray-600" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Share URL</label>
        <div className="flex items-center gap-2 mt-1">
          <Input value={url} readOnly className="font-mono text-xs" />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onShare?.("copy", url)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Share on Social Media</label>
        <div className="grid grid-cols-2 gap-2">
          {platforms.map(({ platform, icon: Icon, label, color }) => (
            <Button
              key={platform}
              variant="outline"
              size="sm"
              onClick={() => onShare?.(platform, url)}
              className="justify-start gap-2"
            >
              <Icon className={cn("h-4 w-4", color)} />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * SlugAnalytics Component
 */
function SlugAnalytics({
  shareableUrl,
  period = "7d",
  onPeriodChange,
}: SlugAnalyticsProps) {
  const analytics = shareableUrl.analytics;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Analytics</h4>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24h</SelectItem>
            <SelectItem value="7d">7d</SelectItem>
            <SelectItem value="30d">30d</SelectItem>
            <SelectItem value="90d">90d</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-center p-3 bg-muted/30 rounded">
          <div className="text-lg font-bold text-blue-600">{analytics.totalViews}</div>
          <div className="text-xs text-muted-foreground">Total Views</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded">
          <div className="text-lg font-bold text-green-600">{analytics.uniqueViews}</div>
          <div className="text-xs text-muted-foreground">Unique Visitors</div>
        </div>
      </div>

      {analytics.recentViews.length > 0 && (
        <div>
          <h5 className="text-sm font-medium mb-2">Recent Activity</h5>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {analytics.recentViews.slice(0, 5).map((view, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <span>{view.location || "Unknown"}</span>
                <span className="text-muted-foreground">
                  {new Date(view.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * QRCodeDisplay Component
 */
function QRCodeDisplay({ url }: { url: string }) {
  return (
    <div className="text-center space-y-3">
      <div className="w-32 h-32 bg-muted/50 rounded border-2 border-dashed mx-auto flex items-center justify-center">
        <QrCode className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-xs text-muted-foreground">
        QR Code for {url}
      </div>
      <Button variant="outline" size="sm" className="gap-2">
        <Download className="h-4 w-4" />
        Download QR Code
      </Button>
    </div>
  );
}

/**
 * EmbedCodeGenerator Component
 */
function EmbedCodeGenerator({
  url,
  width = 800,
  height = 600,
}: EmbedCodeGeneratorProps) {
  const embedCode = `<iframe src="${url}" width="${width}" height="${height}" frameborder="0"></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
    } catch (error) {
      console.error("Failed to copy embed code:", error);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium">Embed Code</label>
        <Textarea
          value={embedCode}
          readOnly
          rows={3}
          className="font-mono text-xs mt-1"
        />
      </div>
      <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
        <Copy className="h-4 w-4" />
        Copy Embed Code
      </Button>
    </div>
  );
}
