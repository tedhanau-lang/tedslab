import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { deployWebsite } from "@/lib/deploy";

interface DeploymentMetrics {
  users: number;
  visits: number;
  downloads: number;
}

async function getDeploymentMetrics(): Promise<DeploymentMetrics> {
  const { count: userCount } = await (supabase as any)
    .from("profiles")
    .select("id", { count: "exact", head: true });

  const { data: settings } = await (supabase as any)
    .from("site_settings")
    .select("key, value");

  const metrics = (settings ?? []) as Array<{ key: string; value: string }>; 
  const map = Object.fromEntries(metrics.map((item) => [item.key, item.value]));

  return {
    users: userCount ?? 0,
    visits: Number(map.total_visits ?? map.visits ?? 0) || 0,
    downloads: Number(map.total_downloads ?? map.downloads ?? 0) || 0,
  };
}

const db = supabase as unknown as {
  from: (table: string) => any;
};

interface ContentStats {
  table: string;
  label: string;
  total: number;
  published: number;
  draft: number;
}

async function getContentStats(): Promise<ContentStats[]> {
  const stats: ContentStats[] = [];

  const tables = [
    { name: "articles", label: "Articles" },
    { name: "pages", label: "Pages" },
    { name: "sections", label: "Sections" },
    { name: "topics", label: "Topics" },
    { name: "videos", label: "Videos" },
    { name: "hero_slides", label: "Hero Slides" },
  ];

  for (const table of tables) {
    try {
      const { data: allData } = await db
        .from(table.name)
        .select("id, published")
        .returns<{ id: string; published?: boolean | null }[]>();

      const total = allData?.length ?? 0;
      const published = allData?.filter((item) => item.published).length ?? 0;
      const draft = total - published;

      stats.push({
        table: table.name,
        label: table.label,
        total,
        published,
        draft,
      });
    } catch (error) {
      console.error(`Failed to get stats for ${table.name}:`, error);
    }
  }

  return stats;
}

export function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: getContentStats,
    staleTime: 60000, // 1 minute
  });

  const { data: deploymentMetrics } = useQuery({
    queryKey: ["deployment-metrics"],
    queryFn: getDeploymentMetrics,
    staleTime: 60000,
  });

  const deployMutation = useMutation({
    mutationFn: deployWebsite,
  });

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading statistics...</div>;
  }

  const totalContent = stats?.reduce((sum, s) => sum + s.total, 0) ?? 0;
  const totalPublished = stats?.reduce((sum, s) => sum + s.published, 0) ?? 0;
  const totalDraft = stats?.reduce((sum, s) => sum + s.draft, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Content</h3>
            <p className="text-3xl font-bold">{totalContent}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Published</h3>
            <p className="text-3xl font-bold text-green-600">{totalPublished}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Drafts</h3>
            <p className="text-3xl font-bold text-amber-600">{totalDraft}</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Content Breakdown</h3>
        <div className="space-y-3">
          {stats?.map((stat) => (
            <div key={stat.table} className="flex items-center justify-between rounded-md border border-border p-3">
              <div className="flex flex-col gap-1">
                <span className="font-medium">{stat.label}</span>
                <div className="flex gap-3">
                  <span className="text-xs text-muted-foreground">
                    Total: <span className="font-semibold">{stat.total}</span>
                  </span>
                  <span className="text-xs text-green-600">
                    Published: <span className="font-semibold">{stat.published}</span>
                  </span>
                  <span className="text-xs text-amber-600">
                    Draft: <span className="font-semibold">{stat.draft}</span>
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-green-700">
                  {Math.round((stat.published / Math.max(stat.total, 1)) * 100)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold">Deployment</h3>
          <Button
            size="sm"
            onClick={() => deployMutation.mutate()}
            disabled={deployMutation.isPending}
          >
            {deployMutation.isPending ? "Deploying..." : "Deploy to Internet"}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-md border border-border bg-secondary/40 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">User board</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{deploymentMetrics?.users ?? 0}</p>
          </div>
          <div className="rounded-md border border-border bg-secondary/40 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Visit board</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{deploymentMetrics?.visits ?? 0}</p>
          </div>
          <div className="rounded-md border border-border bg-secondary/40 p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Download board</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{deploymentMetrics?.downloads ?? 0}</p>
          </div>
        </div>

        {deployMutation.isSuccess && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
            Deployment started successfully. Production URL: {deployMutation.data?.url}
          </div>
        )}

        {deployMutation.isError && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {deployMutation.error instanceof Error
              ? deployMutation.error.message
              : "Deployment failed."}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
        <div className="grid gap-2 md:grid-cols-2">
          <a href="/admin/articles" className="rounded-md border border-border p-3 text-sm font-medium hover:bg-accent">
            → Manage Articles
          </a>
          <a href="/admin/pages" className="rounded-md border border-border p-3 text-sm font-medium hover:bg-accent">
            → Manage Pages
          </a>
          <a href="/admin/sections" className="rounded-md border border-border p-3 text-sm font-medium hover:bg-accent">
            → Manage Sections
          </a>
          <a href="/admin/topics" className="rounded-md border border-border p-3 text-sm font-medium hover:bg-accent">
            → Manage Topics
          </a>
          <a href="/sitemap.xml" className="rounded-md border border-border p-3 text-sm font-medium hover:bg-accent">
            → View Sitemap
          </a>
          <a href="/admin/pages-list" className="rounded-md border border-border p-3 text-sm font-medium hover:bg-accent">
            → All Pages
          </a>
        </div>
      </Card>
    </div>
  );
}
