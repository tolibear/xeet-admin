import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Xeet Admin Platform</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Atomic design system foundation with professional dark theme
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">Phase 0</Badge>
            <Badge className="bg-success text-success-foreground">Complete</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">🏢 Enterprise Scale</CardTitle>
              <CardDescription>Built for 500k+ posts, 1.9M signals, 493k users</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Performance targets: TTI &lt; 3s, interactions &lt; 250ms
              </p>
              <div className="flex gap-2">
                <Badge className="bg-chart-1 text-xs text-white">Scalable</Badge>
                <Badge className="bg-chart-2 text-xs text-white">Fast</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">⚛️ Atomic Design</CardTitle>
              <CardDescription>Component hierarchy from atoms to systems</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Modular, reusable, perfect at every scale
              </p>
              <div className="flex gap-2">
                <Badge className="bg-chart-3 text-xs text-white">Modular</Badge>
                <Badge className="bg-chart-4 text-xs text-white">Reusable</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">🎨 Dark Theme</CardTitle>
              <CardDescription>Professional admin platform styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Custom color palette optimized for data visualization
              </p>
              <div className="flex gap-2">
                <Badge className="bg-chart-5 text-xs text-white">Beautiful</Badge>
                <Badge className="bg-chart-6 text-xs text-white">Accessible</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button size="lg" className="mr-4">
            Explore Dashboard
          </Button>
          <Button variant="outline" size="lg">
            View Components
          </Button>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>✅ Phase 0 Complete</CardTitle>
            <CardDescription>Foundation ready for atomic component development</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-success text-success-foreground">✓</Badge>
              <span className="text-sm">Next.js 14+ with TypeScript initialized</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-success text-success-foreground">✓</Badge>
              <span className="text-sm">Tailwind CSS with atomic design tokens</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-success text-success-foreground">✓</Badge>
              <span className="text-sm">shadcn/ui with custom dark theme</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">⚡</Badge>
              <span className="text-sm text-muted-foreground">
                Ready for Phase 1: Atomic Components
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
