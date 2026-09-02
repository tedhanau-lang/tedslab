import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/biopedia/AppShell";
import { ArticleCard } from "@/components/biopedia/ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import type { SectionRow, Subject } from "@/lib/content";
import { useBookmarks } from "@/hooks/use-bookmarks";

const db = supabase as unknown as { from: (table: string) => any };

const sectionQueryOptions = (subjectSlug: string, sectionSlug: string) =>
  queryOptions({
    queryKey: ["section", subjectSlug, sectionSlug],
    queryFn: async () => {
      const { data, error } = await db
        .from("sections")
        .select("*")
        .eq("slug", sectionSlug)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as SectionRow | null;
    },
  });

const subjectQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["subject", slug],
    queryFn: async () => {
      const { data, error } = await db.from("subjects").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return (data ?? null) as Subject | null;
    },
  });

const sectionArticlesQueryOptions = (sectionSlug: string) =>
  queryOptions({
    queryKey: ["articles", "by-section", sectionSlug],
    queryFn: async () => {
      const { data, error } = await db
        .from("articles")
        .select("*")
        .eq("section_slug", sectionSlug)
        .eq("published", true)
        .order("sort", { ascending: true });
      if (error) throw error;
      return (data ?? []) as any[];
    },
  });

export const Route = createFileRoute("/$subject/$section")({
  loader: async ({ context, params }) => {
    const subject = await context.queryClient.ensureQueryData(
      subjectQueryOptions(params.subject)
    );
    if (!subject) throw notFound();
    
    const section = await context.queryClient.ensureQueryData(
      sectionQueryOptions(params.subject, params.section)
    );
    if (!section) throw notFound();
    
    const articles = await context.queryClient.ensureQueryData(
      sectionArticlesQueryOptions(params.section)
    );
    
    return { subject, section, articles };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.section.title} — Ted's Lab` : "Ted's Lab";
    const description = loaderData?.section.description ?? "";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: SectionDetailPage,
});

function SectionDetailPage() {
  const { subject: initialSubject, section: initialSection, articles: initialArticles } = Route.useLoaderData();
  const { subject } = Route.useParams();
  const { section: sectionSlug } = Route.useParams();
  const { bookmarks, toggleBookmark } = useBookmarks();
  
  const { data: sectionData } = useQuery({
    ...sectionQueryOptions(subject, sectionSlug),
    initialData: initialSection,
  });

  const { data: articles = [] } = useQuery({
    ...sectionArticlesQueryOptions(sectionSlug),
    initialData: initialArticles,
  });

  const sectionData_safe = sectionData || initialSection;

  return (
    <AppShell>
      {(q) => {
        const filtered = articles.filter(
          (a) => !q || `${a.title} ${a.excerpt ?? ""}`.toLowerCase().includes(q),
        );

        return (
          <>
            <Link
              to={`/${subject}`}
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Back to {initialSubject.title}
            </Link>
            
            <div className="mt-4">
              {/* Header Section */}
              <header className="bio-panel p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <h1 className="font-display text-3xl font-bold text-foreground break-words">
                      {sectionData_safe.title}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                      {sectionData_safe.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <Link
                        to={`/${subject}`}
                        className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {initialSubject.title}
                      </Link>
                    </div>
                  </div>
                </div>
              </header>

              {/* Body Section */}
              {sectionData_safe.body && (
                <div className="mt-6 bio-panel p-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div dangerouslySetInnerHTML={{ __html: sectionData_safe.body }} />
                  </div>
                </div>
              )}

              {/* Articles Section */}
              {articles.length > 0 && (
                <>
                  <div className="mt-8 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">
                      Articles ({filtered.length})
                    </p>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((article) => {
                      const saved = bookmarks.includes(article.slug);
                      return (
                        <ArticleCard
                          key={article.id}
                          article={article}
                          saved={saved}
                          onBookmarkClick={toggleBookmark}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        );
      }}
    </AppShell>
  );
}
