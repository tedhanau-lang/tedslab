import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { AppShell, PageHeader } from "@/components/biopedia/AppShell";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { articles } from "@/lib/biopedia-data";
import { sections } from "@/lib/biopedia-sections";

const title = "Saved Content — Ted's Lab";
const description = "Everything you bookmarked across Ted's Lab, in one place.";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavedPage,
});

function label(id: string) {
  const article = articles.find((a) => a.slug === id);
  if (article) return { name: article.title, where: "Featured article", to: "/" };
  const [slug, topic] = id.split("/");
  const section = sections.find((s) => s.slug === slug);
  return { name: topic ?? id, where: section?.title ?? "Ted's Lab", to: `/${slug ?? ""}` };
}

function SavedPage() {
  const { bookmarks, toggleBookmark } = useBookmarks();

  return (
    <AppShell>
      <PageHeader title="Saved Content" description={description} />
      {bookmarks.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Nothing saved yet — tap the bookmark icon on any topic or article.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {bookmarks.map((id) => {
            const item = label(id);
            return (
              <li key={id} className="flex items-center gap-3 bio-panel p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <Link to={item.to} className="text-xs text-primary hover:underline">
                    {item.where}
                  </Link>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => toggleBookmark(id)}
                  className="text-primary"
                >
                  <Bookmark className="size-4 fill-current" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
