import { supabase } from "@/integrations/supabase/client";

const db = supabase as unknown as {
  from: (table: string) => any;
};

export interface PageEntry {
  url: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

interface ArticleRow {
  id: string;
  slug: string;
  subject_slug: string | null;
  section_slug: string | null;
  updated_at?: string;
}

interface PageRow {
  id: string;
  slug: string;
  updated_at?: string;
}

interface SubjectRow {
  id: string;
  slug: string;
}

interface SectionRow {
  id: string;
  slug: string;
  subject_id: string;
}

interface TopicRow {
  id: string;
  slug: string;
  section_id: string;
}

export async function generateSitemapXML(baseUrl: string): Promise<string> {
  const pages = await getAllPages();

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map((page) => buildSitemapEntry(page, baseUrl)),
    "</urlset>",
  ].join("\n");

  return sitemap;
}

export async function getAllPages(): Promise<PageEntry[]> {
  const pages: PageEntry[] = [];

  // Static pages
  pages.push(
    { url: "/", priority: 1.0 },
    { url: "/categories", priority: 0.9 },
    { url: "/glossary", priority: 0.8 },
    { url: "/timeline", priority: 0.8 },
    { url: "/flashcards", priority: 0.7 },
    { url: "/quizzes", priority: 0.7 },
    { url: "/videos", priority: 0.8 }
  );

  // Dynamic subjects
  try {
    const { data: subjects } = await db
      .from("subjects")
      .select("slug")
      .returns<SubjectRow[]>();

    subjects?.forEach((subject) => {
      pages.push({
        url: `/${subject.slug}`,
        priority: 0.9,
      });
    });
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
  }

  // Dynamic sections
  try {
    const { data: sections } = await db
      .from("sections")
      .select("slug, subject_id")
      .returns<SectionRow[]>();

    // Group by subject to get subject slugs
    const { data: subjects } = await db
      .from("subjects")
      .select("id, slug")
      .returns<{ id: string; slug: string }[]>();

    const subjectMap = new Map(subjects?.map((s) => [s.id, s.slug]) ?? []);

    sections?.forEach((section) => {
      const subjectSlug = subjectMap.get(section.subject_id);
      if (subjectSlug) {
        pages.push({
          url: `/${subjectSlug}/${section.slug}`,
          priority: 0.8,
        });
      }
    });
  } catch (error) {
    console.error("Failed to fetch sections:", error);
  }

  // Dynamic articles
  try {
    const { data: articles } = await db
      .from("articles")
      .select("slug, subject_slug, updated_at")
      .eq("published", true)
      .returns<ArticleRow[]>();

    articles?.forEach((article) => {
      pages.push({
        url: `/articles/${article.slug}`,
        lastmod: article.updated_at
          ? new Date(article.updated_at).toISOString().split("T")[0]
          : undefined,
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  // Custom pages
  try {
    const { data: customPages } = await db
      .from("pages")
      .select("slug, updated_at")
      .eq("published", true)
      .returns<PageRow[]>();

    customPages?.forEach((page) => {
      pages.push({
        url: `/pages/${page.slug}`,
        lastmod: page.updated_at
          ? new Date(page.updated_at).toISOString().split("T")[0]
          : undefined,
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error("Failed to fetch pages:", error);
  }

  return pages;
}

export function buildSitemapEntry(page: PageEntry, baseUrl: string): string {
  let entry = `  <url>\n    <loc>${escapeXml(`${baseUrl}${page.url}`)}</loc>`;

  if (page.lastmod) {
    entry += `\n    <lastmod>${page.lastmod}</lastmod>`;
  }

  if (page.changefreq) {
    entry += `\n    <changefreq>${page.changefreq}</changefreq>`;
  }

  if (page.priority) {
    entry += `\n    <priority>${page.priority}</priority>`;
  }

  entry += "\n  </url>";
  return entry;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function getPagesList(): Promise<{ label: string; url: string }[]> {
  const pages: { label: string; url: string }[] = [
    { label: "Home", url: "/" },
    { label: "Categories", url: "/categories" },
    { label: "Glossary", url: "/glossary" },
    { label: "Timeline", url: "/timeline" },
    { label: "Flashcards", url: "/flashcards" },
    { label: "Quizzes", url: "/quizzes" },
    { label: "Videos", url: "/videos" },
  ];

  try {
    const { data: subjects } = await db
      .from("subjects")
      .select("slug, title")
      .returns<{ slug: string; title: string }[]>();

    subjects?.forEach((subject) => {
      pages.push({
        label: subject.title,
        url: `/${subject.slug}`,
      });
    });
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
  }

  try {
    const { data: articles } = await db
      .from("articles")
      .select("slug, title")
      .eq("published", true)
      .returns<{ slug: string; title: string }[]>();

    articles?.forEach((article) => {
      pages.push({
        label: `Article: ${article.title}`,
        url: `/articles/${article.slug}`,
      });
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  try {
    const { data: customPages } = await db
      .from("pages")
      .select("slug, title")
      .eq("published", true)
      .returns<{ slug: string; title: string }[]>();

    customPages?.forEach((page) => {
      pages.push({
        label: `Page: ${page.title}`,
        url: `/pages/${page.slug}`,
      });
    });
  } catch (error) {
    console.error("Failed to fetch pages:", error);
  }

  return pages;
}
