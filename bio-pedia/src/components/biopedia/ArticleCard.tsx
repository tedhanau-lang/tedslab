import { Bookmark, Clock, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { ArticleRow } from "@/lib/content";
import { resolveImage } from "@/lib/images";

interface ArticleCardProps {
  article: ArticleRow;
  saved?: boolean;
  onBookmarkClick?: (slug: string) => void;
  showBookmark?: boolean;
  showReadTime?: boolean;
  variant?: "featured" | "default" | "compact";
  link?: string;
}

export function ArticleCard({
  article,
  saved = false,
  onBookmarkClick,
  showBookmark = true,
  showReadTime = true,
  variant = "default",
  link,
}: ArticleCardProps) {
  const imageHeight =
    variant === "featured" ? "h-32" : variant === "compact" ? "h-20" : "h-40";
  const articleSlug = article.slug?.trim();
  const destination = link ?? (articleSlug ? `/articles/${articleSlug}` : "/articles");
  const topicLabel = article.topic_slug?.replace(/-/g, " ") ?? "Article";
  const subjectLabel = article.subject_slug?.replace(/-/g, " ") ?? "General";
  const summary =
    article.excerpt && article.excerpt.length > 140
      ? `${article.excerpt.slice(0, 140).trim()}…`
      : article.excerpt ?? "";
  const metaLine = [subjectLabel, article.minutes ? `${article.minutes} min` : null]
    .filter(Boolean)
    .join(" • ");

  return (
    <Link
      to={destination}
      className="group flex flex-col overflow-hidden bio-panel transition-all duration-200 hover:border-primary/50 hover:shadow-md"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden bg-secondary">
        <img
          src={resolveImage(article.image_url, article.image_key)}
          alt={article.title}
          loading="lazy"
          width={512}
          height={288}
          className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageHeight}`}
        />
        {article.tone && (
          <div className="absolute top-2 right-2 inline-block px-2 py-1 rounded-md text-xs font-medium bg-black/50 text-white">
            {article.tone}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-primary">
            {topicLabel}
          </span>
          {showReadTime && article.minutes && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="size-3" />
              {article.minutes} min
            </span>
          )}
        </div>

        <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
          {metaLine}
        </div>

        {summary && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {summary}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/80 pt-3">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            {article.section_slug && (
              <span className="rounded bg-secondary px-1.5 py-0.5 uppercase tracking-wide">
                {article.section_slug.replace(/-/g, " ")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {showBookmark && onBookmarkClick && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onBookmarkClick(article.slug);
                }}
                aria-pressed={saved}
                aria-label={saved ? `Remove bookmark` : `Bookmark`}
                className={`transition-colors ${
                  saved ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} />
              </button>
            )}
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
