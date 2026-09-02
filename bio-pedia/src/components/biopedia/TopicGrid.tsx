import { useState, useEffect, useRef } from "react";
import type { TopicRow } from "@/lib/content";
import { useSections } from "@/lib/content";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { TopicCard } from "./TopicCard";

export function TopicGrid({
  topics,
  sectionSlug,
  subjectSlug,
}: {
  topics: (Pick<TopicRow, "id" | "slug" | "title" | "blurb"> &
    Partial<Pick<TopicRow, "image_url">>)[];
  sectionSlug: string;
  subjectSlug?: string;
}) {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { data: sections } = useSections();
  const section = (sections ?? []).find((s) => s.slug === sectionSlug);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const colsCount = 3; // xl:grid-cols-3

  useEffect(() => {
    // Focus the selected item
    itemRefs.current[selectedIndex]?.focus();
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gridRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1 < topics.length ? prev + 1 : prev));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev + colsCount;
            return next < topics.length ? next : prev;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const next = prev - colsCount;
            return next >= 0 ? next : prev;
          });
          break;
        case "Enter":
          e.preventDefault();
          itemRefs.current[selectedIndex]?.click();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, topics.length]);

  if (topics.length === 0) {
    return <p className="mt-6 text-sm text-muted-foreground">No topics match your search.</p>;
  }

  return (
    <div ref={gridRef} className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {topics.map((t, index) => {
        const id = `${sectionSlug}/${t.slug}`;
        const saved = bookmarks.includes(id);
        return (
          <div
            key={t.id}
            className={selectedIndex === index ? "ring-2 ring-primary rounded-lg" : ""}
          >
            <TopicCard
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              topic={t}
              sectionSlug={sectionSlug}
              subjectSlug={subjectSlug}
              sectionImageKey={section?.image_key}
              saved={saved}
              onBookmarkClick={toggleBookmark}
            />
          </div>
        );
      })}
    </div>
  );
}
