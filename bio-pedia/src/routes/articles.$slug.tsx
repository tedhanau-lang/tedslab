import { createFileRoute } from "@tanstack/react-router";
import { ContentLayout } from "@/components/biopedia/ContentLayout";
import { RelatedArticles } from "@/components/biopedia/RelatedArticles";
import { fallbackArticles, useArticles, useSubjects } from "@/lib/content";
import { resolveImage } from "@/lib/images";

export const Route = createFileRoute("/articles/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Article — Ted's Lab` },
      { name: "description", content: `Read article on Ted's Lab` },
    ],
  }),
  component: ArticleDetailPage,
});

function ArticleDetailPage() {
  const { slug } = Route.useParams();
  const { data: articles = [], isLoading } = useArticles();
  const { data: subjects = [] } = useSubjects();

  const article = (articles.length > 0 ? articles : fallbackArticles).find((a) => a.slug === slug) ?? fallbackArticles.find((a) => a.slug === slug);
  const subject = article ? subjects.find((s) => s.slug === article.subject_slug) : null;

  if (isLoading) {
    return <ContentLayout
      title="Loading..."
      description=""
      backLink="/articles"
      backLabel="articles"
    />;
  }

  if (!article) {
    return <ContentLayout
      title="Article Not Found"
      description="The article you're looking for doesn't exist or has been removed."
      backLink="/articles"
      backLabel="articles"
    />;
  }

  return (
    <ContentLayout
      title={article.title}
      description={article.excerpt ?? ""}
      image={resolveImage(article.image_url, article.image_key)}
      imageAlt={article.title}
      backLink="/articles"
      backLabel="articles"
      subject={subject ? { title: subject.title, slug: subject.slug } : undefined}
      metadata={[
        ...(article.minutes ? [{ label: "Read Time", value: `${article.minutes} min read` }] : []),
        ...(article.tone ? [{ label: "Topic", value: article.tone }] : []),
      ]}
      body={article.body}
    >
      <RelatedArticles currentArticle={article} allArticles={articles} />
    </ContentLayout>
  );
}
