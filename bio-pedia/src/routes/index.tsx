import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Video, BookMarked, CheckCircle, PenTool, Bookmark, Plus, Lightbulb } from "lucide-react";
import { AppShell } from "@/components/biopedia/AppShell";
import { Hero } from "@/components/biopedia/Hero";
import { CategoryGrid } from "@/components/biopedia/CategoryGrid";
import { FeaturedArticles } from "@/components/biopedia/FeaturedArticles";
import { RightRail } from "@/components/biopedia/RightRail";
import { useSubjects, useArticles, useSettings } from "@/lib/content";
import { useBookmarks } from "@/hooks/use-bookmarks";

const defaultTitle = "Ted's Lab — The Learning Encyclopedia";
const defaultDescription =
  "Explore biology, history, english, mathematics, science, and technology with illustrated articles, videos, quizzes and study tools.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: defaultTitle },
      { name: "description", content: defaultDescription },
      { property: "og:title", content: defaultTitle },
      { property: "og:description", content: defaultDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { data: subjects } = useSubjects();
  const { data: articles } = useArticles();
  const { data: settings } = useSettings();

  const categories = subjects ?? [];
  const publishedArticles = (articles ?? []).filter((a) => a.published);

  void settings;

  return (
    <AppShell rail={<RightRail />}>
      {(q) => (
        <>
          <Hero />
          <CategoryGrid
            items={
              q
                ? categories.filter((c) =>
                    `${c.title} ${c.description ?? ""}`.toLowerCase().includes(q),
                  )
                : categories
            }
          />
          <FeaturedArticles
            items={
              q
                ? publishedArticles.filter((a) =>
                    `${a.title} ${a.excerpt ?? ""}`.toLowerCase().includes(q),
                  )
                : publishedArticles
            }
            bookmarks={bookmarks}
            onToggleBookmark={toggleBookmark}
          />
          
          <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bio-panel p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <span>📰</span>
                All Articles
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse our complete collection of articles across all subjects.
              </p>
              <Link
                to="/articles"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                View all articles
                <ChevronRight className="size-4" />
              </Link>
            </div>
            
            <div className="bio-panel p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <span>📄</span>
                All Pages
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore all published pages and custom content.
              </p>
              <Link
                to="/pages"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                View all pages
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="bio-panel p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Video className="size-5" />
                Videos
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Watch curated educational videos on all topics.
              </p>
              <Link
                to="/videos"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Browse videos
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="bio-panel p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <BookMarked className="size-5" />
                Glossary
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Look up key biology terms and definitions.
              </p>
              <Link
                to="/glossary"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                View glossary
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="bio-panel p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <CheckCircle className="size-5" />
                Quizzes
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Test your knowledge with interactive quizzes.
              </p>
              <Link
                to="/quizzes"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Start a quiz
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="bio-panel p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <PenTool className="size-5" />
                Flashcards
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Study with interactive flashcard sets.
              </p>
              <Link
                to="/flashcards"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Study flashcards
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="bio-panel p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Bookmark className="size-5" />
                Saved Content
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Access all your bookmarked articles and pages.
              </p>
              <Link
                to="/saved"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                View saved content
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="bio-panel p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Plus className="size-5" />
                Custom Lists
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Create your own study lists and organize content.
              </p>
              <Link
                to="/custom-lists"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Create a list
                <ChevronRight className="size-4" />
              </Link>
            </div>

            <div className="bio-panel p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
                <Lightbulb className="size-5" />
                Notebook
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Take notes and organize your learning journey.
              </p>
              <Link
                to="/notebook"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
              >
                Open notebook
                <ChevronRight className="size-4" />
              </Link>
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
