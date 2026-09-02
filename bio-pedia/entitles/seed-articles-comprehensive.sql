-- ============================================================================
-- COMPREHENSIVE ARTICLE SEEDING SCRIPT
-- ============================================================================
-- This script creates articles for ALL topics across all subjects
-- It automatically links articles with their topics via topic_slug
-- The RelatedArticles component will display matching articles on detail pages
--
-- HOW TO USE:
-- 1. Open your Supabase project dashboard
-- 2. Go to SQL Editor
-- 3. Create a new query
-- 4. Copy and paste this entire script
-- 5. Click "Run" to execute
-- 6. Articles will be created and immediately visible on the site
--
-- ============================================================================

-- First, let's view what we're about to create (diagnostic query)
-- Uncomment to see how many articles will be created per section
-- SELECT s.slug, s.title, COUNT(*) as article_count
-- FROM public.topics t
-- INNER JOIN public.sections s ON t.section_id = s.id
-- GROUP BY s.id, s.slug, s.title
-- ORDER BY s.title;

-- ============================================================================
-- STRATEGY: Create one article per topic, with proper linking
-- Each article:
--   - slug: {section_slug}-{topic_slug}
--   - title: {topic_title}: Full Guide
--   - excerpt: {topic_blurb}
--   - body: {topic_body}
--   - topic_slug: {topic_slug} ← KEY: This links article to topic
--   - section_slug: {section_slug}
--   - subject_slug: {subject_slug}
--   - published: true
--   - status: published
-- ============================================================================

-- MASTER INSERT: Create one article per topic, across all subjects
INSERT INTO public.articles (
  slug,
  title,
  excerpt,
  body,
  minutes,
  tone,
  subject_slug,
  section_slug,
  topic_slug,
  image_key,
  published,
  status,
  sort
)
SELECT 
  s.slug || '-' || t.slug,                                                    -- unique slug
  t.title || ': Full Guide',                                                  -- article title
  t.blurb,                                                                     -- excerpt from topic
  t.body,                                                                      -- body from topic
  FLOOR(RANDOM() * 6 + 5)::INTEGER,                                            -- 5-10 min read
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER],
  sub.slug,                                                                    -- subject slug
  s.slug,                                                                      -- section slug
  t.slug,                                                                      -- TOPIC SLUG - THIS LINKS ARTICLES
  COALESCE(s.image_key, 'hero-cell'),                                          -- image key
  true,                                                                        -- published = true
  'published',                                                                 -- status = published
  ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY t.sort) as sort
FROM public.topics t
INNER JOIN public.sections s ON t.section_id = s.id
INNER JOIN public.subjects sub ON s.subject_id = sub.id
WHERE t.title IS NOT NULL AND t.title != ''  -- Only topics with titles
ON CONFLICT (slug) DO NOTHING;  -- Skip if already exists

-- ============================================================================
-- VERIFICATION QUERIES (run these to confirm articles were created)
-- ============================================================================

-- See total articles created
-- SELECT COUNT(*) as total_articles, 
--        COUNT(DISTINCT subject_slug) as subjects,
--        COUNT(DISTINCT section_slug) as sections,
--        COUNT(DISTINCT topic_slug) as topics
-- FROM public.articles
-- WHERE published = true;

-- See articles by subject
-- SELECT subject_slug, COUNT(*) as count 
-- FROM public.articles 
-- WHERE published = true
-- GROUP BY subject_slug 
-- ORDER BY subject_slug;

-- See articles for a specific topic
-- SELECT * FROM public.articles 
-- WHERE topic_slug = 'animal-kingdom' 
-- ORDER BY created_at DESC;

-- ============================================================================
-- LINKING VERIFICATION
-- ============================================================================
-- This verifies that articles are properly linked to topics:
-- SELECT 
--   a.slug,
--   a.title,
--   a.topic_slug,
--   t.title as topic_title,
--   COUNT(DISTINCT a2.id) as related_articles_count
-- FROM public.articles a
-- LEFT JOIN public.topics t ON a.topic_slug = t.slug
-- LEFT JOIN public.articles a2 ON (a2.topic_slug = a.topic_slug AND a2.slug != a.slug AND a2.published = true)
-- WHERE a.published = true
-- GROUP BY a.id, a.slug, a.title, a.topic_slug, t.title
-- ORDER BY a.created_at DESC
-- LIMIT 20;
