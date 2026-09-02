import { ArticleRow } from "@/lib/content";
import { ArticleCard } from "./ArticleCard";

interface RelatedArticlesProps {
  currentArticle: ArticleRow;
  allArticles: ArticleRow[];
  onBookmarkClick?: (slug: string) => void;
  savedArticles?: Set<string>;
}

export function RelatedArticles({
  currentArticle,
  allArticles,
  onBookmarkClick,
  savedArticles = new Set(),
}: RelatedArticlesProps) {
  // Filter articles that share the same topic_slug and exclude current article
  const relatedArticles = allArticles
    .filter(
      (article) =>
        article.topic_slug === currentArticle.topic_slug &&
        article.slug !== currentArticle.slug &&
        article.published
    )
    .slice(0, 6); // Show max 6 related articles

  // Also include articles from the same section if needed
  const sectionArticles = allArticles
    .filter(
      (article) =>
        article.section_slug === currentArticle.section_slug &&
        article.topic_slug !== currentArticle.topic_slug &&
        article.slug !== currentArticle.slug &&
        article.published
    )
    .slice(0, 3); // Show max 3 from same section

  const allRelated = [...relatedArticles, ...sectionArticles];

  if (allRelated.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 bio-panel p-6">
      <h2 className="font-display text-xl font-bold text-foreground mb-4">
        {relatedArticles.length > 0 ? "Related Articles" : "More from this Section"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allRelated.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            saved={savedArticles.has(article.slug)}
            onBookmarkClick={onBookmarkClick}
            showBookmark={!!onBookmarkClick}
            variant="default"
          />
        ))}
      </div>
    </div>
  );
}
