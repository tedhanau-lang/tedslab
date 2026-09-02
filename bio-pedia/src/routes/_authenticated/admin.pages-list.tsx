import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getPagesList } from "@/lib/sitemap-generator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminNav } from "./-admin-shared";

export const Route = createFileRoute("/_authenticated/admin/pages-list")({
  ssr: false,
  head: () => ({ meta: [{ title: "All Pages — Admin" }] }),
  component: PagesListPage,
});

function PagesListPage() {
  const { user, isAdmin, loading } = useAuth();
  const [pages, setPages] = useState<{ label: string; url: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAdmin) {
      getPagesList()
        .then(setPages)
        .finally(() => setIsLoading(false));
    }
  }, [isAdmin]);

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <h1 className="text-lg font-semibold text-foreground">Unauthorized</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You are signed in as {user?.email ?? "unknown"}, but this account does not have admin access.
        </p>
      </div>
    );
  }

  const filteredPages = pages.filter(
    (page) =>
      page.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <AdminNav />
      <div>
        <h2 className="text-xl font-bold">All Pages</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Total pages: {pages.length}
        </p>
      </div>

      <div className="space-y-3">
        <Input
          placeholder="Search pages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading pages...</p>
        ) : (
          <div className="space-y-2">
            {filteredPages.map((page) => (
              <a
                key={page.url}
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3 hover:bg-accent"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">{page.label}</span>
                  <span className="text-xs text-muted-foreground">{page.url}</span>
                </div>
                <Button variant="ghost" size="sm">
                  Visit →
                </Button>
              </a>
            ))}
            {filteredPages.length === 0 && (
              <p className="text-sm text-muted-foreground">No pages found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
