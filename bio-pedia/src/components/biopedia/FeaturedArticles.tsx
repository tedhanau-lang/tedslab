import { ChevronRight } from "lucide-react";
import type { ArticleRow } from "@/lib/content";
import { ArticleCard } from "./ArticleCard";

export function FeaturedArticles({
  items,
  bookmarks,
  onToggleBookmark,
}: {
  items: ArticleRow[];
  bookmarks: string[];
  onToggleBookmark: (slug: string) => void;
}) {
  const published = items.filter((a) => a.published);

  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-1 font-display text-xl font-semibold">
        Featured Articles
        <ChevronRight className="size-5 text-muted-foreground" />
      </h2>

      {published.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No articles match your search.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {published.map((a) => {
            const saved = bookmarks.includes(a.slug);
            return (
              <ArticleCard
                key={a.id}
                article={a}
                saved={saved}
                onBookmarkClick={onToggleBookmark}
                variant="featured"
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
