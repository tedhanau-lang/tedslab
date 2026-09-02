import { Bookmark, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { forwardRef } from "react";
import type { TopicRow } from "@/lib/content";
import { resolveImage } from "@/lib/images";

interface TopicCardProps {
  topic: Pick<TopicRow, "id" | "slug" | "title" | "blurb"> &
    Partial<Pick<TopicRow, "image_url">>;
  sectionSlug: string;
  subjectSlug?: string;
  sectionImageKey?: string | null;
  saved?: boolean;
  onBookmarkClick?: (id: string) => void;
  showBookmark?: boolean;
}

export const TopicCard = forwardRef<HTMLAnchorElement, TopicCardProps>(
  ({
    topic,
    sectionSlug,
    subjectSlug,
    sectionImageKey,
    saved = false,
    onBookmarkClick,
    showBookmark = true,
  }, ref) => {
    const topicId = `${sectionSlug}/${topic.slug}`;
    const topicLink = subjectSlug 
      ? `/${subjectSlug}/${sectionSlug}/${topic.slug}`
      : `/${sectionSlug}/${topic.slug}`;

    return (
      <Link
        ref={ref}
        to={topicLink}
        hash={topic.slug}
        className="group flex flex-col overflow-hidden bio-panel transition-all duration-200 hover:border-primary/50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {/* Image Section */}
        <div className="relative overflow-hidden bg-secondary">
          <img
            src={resolveImage(topic.image_url ?? null, sectionImageKey ?? null)}
            alt={topic.title}
            loading="lazy"
            width={512}
            height={288}
            className="h-28 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-4">
          {/* Title */}
          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {topic.title}
          </h3>

          {/* Description */}
          {topic.blurb && (
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {topic.blurb}
            </p>
          )}

          {/* Footer with bookmark and link indicator */}
          <div className="mt-auto flex items-center justify-between gap-2 pt-4">
            {showBookmark && onBookmarkClick ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onBookmarkClick(topicId);
                }}
                aria-pressed={saved}
                aria-label={saved ? `Remove bookmark` : `Bookmark`}
                className={`text-xs transition-colors ${
                  saved
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Bookmark className={`size-3.5 ${saved ? "fill-current" : ""}`} />
                  {saved ? "Saved" : "Save"}
                </div>
              </button>
            ) : (
              <div />
            )}
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </Link>
    );
  }
);
