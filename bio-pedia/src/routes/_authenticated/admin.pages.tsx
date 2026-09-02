import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { usePages, type PageRow } from "@/lib/content";
import { AdminPageShell, AdminResourceManager, type FieldConfig } from "./-admin-shared";
import { Button } from "@/components/ui/button";
import { DraftPublishManager, StatusBadge, type ContentStatus } from "@/components/admin/draft-publish-manager";

export const Route = createFileRoute("/_authenticated/admin/pages")({
  ssr: false,
  head: () => ({ meta: [{ title: "Pages — Admin" }] }),
  component: PagesAdminPage,
});

const fields: FieldConfig<PageRow>[] = [
  { key: "slug", label: "Slug", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "body", label: "Body", type: "textarea" },
  { key: "image_url", label: "Image URL", type: "text" },
  { key: "published", label: "Published", type: "boolean" },
  { key: "status", label: "Status (draft/review/published)", type: "text" },
  { key: "show_in_nav", label: "Show in nav", type: "boolean" },
  { key: "sort", label: "Sort", type: "number" },
];

function PagesAdminPage() {
  const { data, isLoading } = usePages();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <AdminPageShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Pages</h2>
          <div className="text-sm text-muted-foreground">
            Total: {data?.length ?? 0} | Published: {data?.filter((p) => p.published).length ?? 0}
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <div className="space-y-2">
            {(data ?? []).map((page) => (
              <div
                key={page.id}
                className="rounded-md border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{page.title}</h3>
                      <StatusBadge status={(page.status as ContentStatus) || (page.published ? "published" : "draft")} />
                      {page.show_in_nav && <span className="text-xs text-muted-foreground">(in nav)</span>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">Slug: {page.slug}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setExpandedId(expandedId === page.id ? null : page.id)}
                  >
                    {expandedId === page.id ? "Hide" : "Expand"}
                  </Button>
                </div>

                {expandedId === page.id && (
                  <div className="mt-4 space-y-4 border-t border-border pt-4">
                    <DraftPublishManager
                      item={page}
                      table="pages"
                      queryKey={["pages"]}
                    />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Quick Edit</p>
                      <Button size="sm" className="mt-2">
                        Edit Full Content →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {(data ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No pages yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-border pt-8">
        <h3 className="mb-4 text-lg font-semibold">Full Editor</h3>
        <AdminResourceManager
          table="pages"
          title="Add or Edit Pages"
          queryKey={["pages"]}
          fields={fields}
          rows={data}
          isLoading={isLoading}
          titleField="title"
        />
      </div>
    </AdminPageShell>
  );
}
