import type { Meta, StoryObj } from "@storybook/react";
import { action } from '@storybook/addon-actions';
import { EmbeddableIframe } from "./EmbeddableIframe";

const meta = {
  title: "Templates/EmbeddableIframe",
  component: EmbeddableIframe,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
EmbeddableIframe is a comprehensive template for generating embeddable iframe code for leaderboards. It provides:

**Key Features:**
- **Complete Configuration**: Display, styling, security, and analytics settings
- **Live Preview**: Real-time preview with device simulation (desktop, tablet, mobile)
- **Embed Code Generation**: Automatic iframe code generation with security attributes
- **Security Testing**: Built-in security and performance tests
- **Analytics Integration**: Support for multiple analytics providers and custom event tracking
- **Enterprise-Scale Distribution**: Designed for high-traffic embeds across thousands of websites

**Configuration Categories:**
- **Display**: Theme, layout, branding, refresh settings
- **Style**: Custom colors, fonts, and visual properties
- **Security**: Sandbox attributes, domain restrictions, CSP
- **Analytics**: View tracking, click tracking, custom events

**Enterprise-Scale Capabilities:**
- Handles millions of embed views across thousands of domains
- Advanced security controls for safe embedding
- Performance optimization with configurable refresh rates
- Real-time analytics and monitoring
- Responsive design for all device types

**Accessibility Features:**
- Full keyboard navigation in configuration interface
- Screen reader compatible preview
- High contrast support in embed themes
- Focus management across tabs and dialogs

Use this template when you need comprehensive embed management functionality for distributing leaderboards at scale.
        `,
      },
    },
  },
  args: {
    onConfigChange: action('onConfigChange'),
    onGenerateEmbed: action('onGenerateEmbed'),
    onTestEmbed: action('onTestEmbed'),
  },
} satisfies Meta<typeof EmbeddableIframe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const CryptoLeaderboard: Story = {
  args: {
    leaderboard: {
      id: 'lb-crypto-traders',
      name: 'Top Crypto Traders',
      description: 'Leading cryptocurrency traders by performance',
      entries: [
        { id: '1', rank: 1, name: '@cryptoking_pro', score: 2847, change: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
        { id: '2', rank: 2, name: '@blockchain_master', score: 2734, change: -3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
        { id: '3', rank: 3, name: '@defi_wizard', score: 2689, change: 7, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
        { id: '4', rank: 4, name: '@nft_collector', score: 2542, change: 15, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
        { id: '5', rank: 5, name: '@trading_bot', score: 2431, change: -8, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
      ],
      lastUpdated: new Date().toISOString(),
      totalEntries: 15420,
      isPublic: true,
      isActive: true,
    },
    config: {
      leaderboardId: 'lb-crypto-traders',
      slug: 'crypto-traders',
      orgId: 'trading-hub',
      theme: 'dark',
      showHeader: true,
      showFooter: true,
      showBranding: true,
      showExportButton: true,
      showRefreshButton: true,
      maxRows: 10,
      refreshInterval: 300,
      title: 'Top Crypto Traders',
      subtitle: 'Real-time rankings updated every 5 minutes',
      customStyles: {
        primaryColor: '#f59e0b',
        backgroundColor: '#0f172a',
        textColor: '#f1f5f9',
        borderRadius: '12px',
        fontFamily: 'Roboto, sans-serif'
      },
    },
  },
};

export const GamingLeaderboard: Story = {
  args: {
    leaderboard: {
      id: 'lb-gaming-pros',
      name: 'Gaming Championship',
      description: 'Top players in the global gaming tournament',
      entries: [
        { id: '1', rank: 1, name: 'ProGamer_2024', score: 9850, change: 5, metadata: { level: 47, guild: 'Elite Squad' } },
        { id: '2', rank: 2, name: 'SpeedRunner_X', score: 9720, change: -1, metadata: { level: 45, guild: 'Velocity' } },
        { id: '3', rank: 3, name: 'StrategyMaster', score: 9680, change: 2, metadata: { level: 44, guild: 'Tactical Force' } },
        { id: '4', rank: 4, name: 'LootHunter', score: 9445, change: 8, metadata: { level: 42, guild: 'Treasure Seekers' } },
        { id: '5', rank: 5, name: 'PvP_Legend', score: 9234, change: -3, metadata: { level: 43, guild: 'Combat Masters' } },
      ],
      lastUpdated: new Date().toISOString(),
      totalEntries: 8764,
      isPublic: true,
      isActive: true,
    },
    config: {
      leaderboardId: 'lb-gaming-pros',
      slug: 'gaming-championship',
      orgId: 'esports-central',
      theme: 'light',
      showHeader: true,
      showFooter: true,
      showBranding: false,
      showExportButton: false,
      showRefreshButton: true,
      maxRows: 15,
      refreshInterval: 60,
      title: 'Gaming Championship',
      subtitle: 'Live tournament standings',
      customStyles: {
        primaryColor: '#10b981',
        backgroundColor: '#ffffff',
        textColor: '#111827',
        borderRadius: '6px',
        fontFamily: 'Poppins, sans-serif'
      },
    },
  },
};

export const MinimalEmbed: Story = {
  args: {
    config: {
      leaderboardId: 'lb-minimal',
      slug: 'minimal',
      orgId: 'minimal-org',
      theme: 'auto',
      showHeader: false,
      showFooter: false,
      showBranding: false,
      showExportButton: false,
      showRefreshButton: false,
      maxRows: 5,
      title: undefined,
      subtitle: undefined,
      customStyles: {
        primaryColor: '#6366f1',
        backgroundColor: 'transparent',
        textColor: 'inherit',
        borderRadius: '0px',
        fontFamily: 'inherit'
      },
    },
  },
};

export const HighSecurityEmbed: Story = {
  args: {
    config: {
      leaderboardId: 'lb-secure',
      slug: 'secure-leaderboard',
      orgId: 'security-first',
      theme: 'dark',
      showHeader: true,
      showFooter: true,
      showBranding: true,
      showExportButton: false,
      showRefreshButton: true,
      maxRows: 10,
      allowedDomains: ['trusted-domain.com', '*.company.com'],
      title: 'Secure Leaderboard',
      subtitle: 'Enterprise-grade security',
    },
    securityConfig: {
      allowFullscreen: false,
      allowScripts: false,
      allowSameOrigin: false,
      allowForms: false,
      referrerPolicy: 'strict-origin',
      contentSecurityPolicy: "default-src 'self'; script-src 'none'; style-src 'unsafe-inline';"
    },
  },
};

export const AnalyticsEnabled: Story = {
  args: {
    analytics: {
      trackViews: true,
      trackClicks: true,
      trackScrolling: true,
      customEvents: ['rank_click', 'export_attempt', 'share_click', 'filter_applied'],
      analyticsProvider: 'google',
      trackingId: 'G-XXXXXXXXXX'
    },
    metrics: {
      views: 125430,
      uniqueViews: 89234,
      domains: [
        { domain: 'news-site.com', views: 45230, lastSeen: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
        { domain: 'blog.example.com', views: 32140, lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
        { domain: 'forum.community.org', views: 28560, lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { domain: 'social-platform.io', views: 19500, lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      ],
      countries: [
        { country: 'United States', views: 52340 },
        { country: 'Germany', views: 23450 },
        { country: 'United Kingdom', views: 18920 },
        { country: 'France', views: 15680 },
        { country: 'Japan', views: 15040 },
      ],
      devices: {
        desktop: 67890,
        tablet: 28450,
        mobile: 29090
      },
      avgSessionTime: 187,
      bounceRate: 0.18,
      topReferrers: [
        { referrer: 'twitter.com', views: 45230 },
        { referrer: 'reddit.com', views: 28450 },
        { referrer: 'google.com', views: 23890 },
        { referrer: 'direct', views: 27860 }
      ]
    },
  },
};

export const MobileOptimized: Story = {
  args: {
    config: {
      leaderboardId: 'lb-mobile',
      slug: 'mobile-leaderboard',
      orgId: 'mobile-first',
      theme: 'dark',
      showHeader: true,
      showFooter: false,
      showBranding: true,
      showExportButton: false,
      showRefreshButton: true,
      maxRows: 8,
      refreshInterval: 120,
      title: 'Mobile Leaderboard',
      subtitle: 'Optimized for mobile devices',
      customStyles: {
        primaryColor: '#ec4899',
        backgroundColor: '#18181b',
        textColor: '#fafafa',
        borderRadius: '16px',
        fontFamily: 'system-ui, sans-serif'
      },
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
