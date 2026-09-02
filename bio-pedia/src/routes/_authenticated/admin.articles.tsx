import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useArticles, useTopics, useSections, useSubjects, type ArticleRow } from "@/lib/content";
import { AdminPageShell, AdminResourceManager, type FieldConfig } from "./-admin-shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";
import { DraftPublishManager, StatusBadge, type ContentStatus } from "@/components/admin/draft-publish-manager";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/articles")({
  ssr: false,
  head: () => ({ meta: [{ title: "Articles — Admin" }] }),
  component: ArticlesAdminPage,
});

const fields: FieldConfig<ArticleRow>[] = [
  { key: "slug", label: "Slug", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "excerpt", label: "Excerpt", type: "textarea" },
  { key: "body", label: "Body", type: "textarea" },
  { key: "minutes", label: "Minutes", type: "number" },
  { key: "tone", label: "Tone", type: "text" },
  { key: "subject_slug", label: "Subject slug", type: "text" },
  { key: "section_slug", label: "Section slug", type: "text" },
  { key: "topic_slug", label: "Topic slug", type: "text" },
  { key: "image_url", label: "Image URL", type: "text" },
  { key: "video_url", label: "Video URL", type: "text" },
  { key: "published", label: "Published", type: "boolean" },
  { key: "status", label: "Status (draft/review/published)", type: "text" },
  { key: "sort", label: "Sort", type: "number" },
];

function ArticlesAdminPage() {
  const { data, isLoading, refetch } = useArticles();
  const { data: topics } = useTopics();
  const { data: sections } = useSections();
  const { data: subjects } = useSubjects();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<{
    status: 'idle' | 'generating' | 'success' | 'error';
    message: string;
    count?: number;
  }>({ status: 'idle', message: '' });

  const handleGenerateArticles = async () => {
    setGenerating(true);
    setGenerationStatus({ status: 'generating', message: 'Generating articles from topics...' });

    try {
      const db = supabase as unknown as { from: (table: string) => any };
      
      // Get all topics with their section and subject info
      const topicsWithContext = (topics || []).map(topic => {
        const section = (sections || []).find(s => s.id === topic.section_id);
        const subject = section ? (subjects || []).find(sub => sub.id === section.subject_id) : null;
        return { topic, section, subject };
      }).filter(t => t.section && t.subject);

      const articlesToCreate = topicsWithContext.map(({ topic, section, subject }) => {
        const tones = ['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'];
        const randomTone = tones[Math.floor(Math.random() * tones.length)];
        const randomMinutes = Math.floor(Math.random() * 6 + 5);

        return {
          slug: `${section!.slug}-${topic.slug}`,
          title: `${topic.title}: Full Guide`,
          excerpt: topic.blurb || '',
          body: topic.body || '',
          minutes: randomMinutes,
          tone: randomTone,
          subject_slug: subject!.slug,
          section_slug: section!.slug,
          topic_slug: topic.slug,
          image_key: section!.image_key || 'hero-cell',
          published: true,
          status: 'published',
          sort: topic.sort || 0,
        };
      });

      if (articlesToCreate.length === 0) {
        setGenerationStatus({ 
          status: 'error', 
          message: 'No topics found to generate articles from' 
        });
        setGenerating(false);
        return;
      }

      // Upsert articles (skip duplicates)
      const { error, data: created } = await db
        .from('articles')
        .upsert(articlesToCreate, { onConflict: 'slug' })
        .select();

      if (error) throw error;

      const createdCount = created?.length || 0;
      setGenerationStatus({
        status: 'success',
        message: `✅ Successfully created/updated ${createdCount} articles!`,
        count: createdCount,
      });

      // Refetch articles
      await refetch();
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationStatus({
        status: 'error',
        message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AdminPageShell>
      <div className="space-y-4">
        {/* Generation Status */}
        {generationStatus.status !== 'idle' && (
          <div className={`rounded-md border p-4 ${
            generationStatus.status === 'success' ? 'border-green-500/20 bg-green-50/10' : 'border-red-500/20 bg-red-50/10'
          }`}>
            <div className="flex items-start gap-3">
              {generationStatus.status === 'success' && <CheckCircle className="size-5 flex-shrink-0 text-green-500 mt-0.5" />}
              {generationStatus.status === 'error' && <AlertCircle className="size-5 flex-shrink-0 text-red-500 mt-0.5" />}
              {generationStatus.status === 'generating' && <Loader className="size-5 flex-shrink-0 text-blue-500 mt-0.5 animate-spin" />}
              <div>
                <p className="text-sm font-medium text-foreground">{generationStatus.message}</p>
                {generationStatus.count && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Total articles now: {data?.length || 0}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generation Section */}
        <div className="rounded-md border border-border bg-card/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Generate Articles from Topics</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create one article for each topic. Articles will be linked automatically and show up in "Related Articles" sections.
              </p>
            </div>
            <Button
              onClick={handleGenerateArticles}
              disabled={generating || (data?.length || 0) > 100}
              size="sm"
            >
              {generating && <Loader className="size-4 mr-2 animate-spin" />}
              {generating ? 'Generating...' : 'Generate Articles'}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline">Topics: {topics?.length || 0}</Badge>
            <Badge variant="outline">Sections: {sections?.length || 0}</Badge>
            <Badge variant="outline">Subjects: {subjects?.length || 0}</Badge>
            <Badge variant="outline">Articles: {data?.length || 0}</Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Articles</h2>
          <div className="text-sm text-muted-foreground">
            Total: {data?.length ?? 0} | Published: {data?.filter((a) => a.published).length ?? 0}
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
          <div className="space-y-2">
            {(data ?? []).map((article) => (
              <div
                key={article.id}
                className="rounded-md border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{article.title}</h3>
                      <StatusBadge status={(article.status as ContentStatus) || (article.published ? "published" : "draft")} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Slug: {article.slug} | {article.minutes ?? 0} min read
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setExpandedId(expandedId === article.id ? null : article.id)}
                  >
                    {expandedId === article.id ? "Hide" : "Expand"}
                  </Button>
                </div>

                {expandedId === article.id && (
                  <div className="mt-4 space-y-4 border-t border-border pt-4">
                    <DraftPublishManager
                      item={article}
                      table="articles"
                      queryKey={["articles"]}
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
              <p className="text-sm text-muted-foreground">No articles yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-border pt-8">
        <h3 className="mb-4 text-lg font-semibold">Full Editor</h3>
        <AdminResourceManager
          table="articles"
          title="Add or Edit Articles"
          queryKey={["articles"]}
          fields={fields}
          rows={data}
          isLoading={isLoading}
          titleField="title"
        />
      </div>
    </AdminPageShell>
  );
}
