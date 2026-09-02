-- Complete Article Generation Script
-- Run this in Supabase SQL Editor (with Admin privileges)
-- This will disable RLS, create articles, and verify them

-- ============================================================================
-- Step 1: Check current RLS status
-- ============================================================================

-- See all RLS policies
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'articles';

-- ============================================================================
-- Step 2: Disable Row Level Security on articles table
-- ============================================================================

ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Step 3: Drop all RLS policies on articles table (if any exist)
-- ============================================================================

-- This will show existing policies
SELECT policyname, tablename 
FROM pg_policies 
WHERE tablename = 'articles';

-- Drop them (uncomment if needed)
-- DROP POLICY IF EXISTS "Enable read access for all users" ON public.articles;
-- DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.articles;
-- etc...

-- ============================================================================
-- Step 4: Insert Articles from Topics
-- ============================================================================

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
  sort
)
SELECT 
  s.slug || '-' || t.slug as slug,
  t.title || ': Full Guide' as title,
  t.blurb as excerpt,
  t.body as body,
  FLOOR(RANDOM() * 6 + 5)::INTEGER as minutes,
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER] as tone,
  sub.slug as subject_slug,
  s.slug as section_slug,
  t.slug as topic_slug,
  COALESCE(s.image_key, 'hero-cell') as image_key,
  true as published,
  ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY t.sort) as sort
FROM public.topics t
INNER JOIN public.sections s ON t.section_id = s.id
INNER JOIN public.subjects sub ON s.subject_id = sub.id
WHERE t.title IS NOT NULL AND t.title != ''
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- Step 5: Verify Articles Were Created
-- ============================================================================

-- Total count
SELECT 
  COUNT(*) as total_articles,
  COUNT(DISTINCT subject_slug) as subjects,
  COUNT(DISTINCT section_slug) as sections,
  COUNT(DISTINCT topic_slug) as topics
FROM public.articles;

-- By subject
SELECT subject_slug, COUNT(*) as count 
FROM public.articles 
GROUP BY subject_slug 
ORDER BY subject_slug;

-- Sample articles
SELECT id, slug, title, subject_slug, published 
FROM public.articles 
WHERE published = true
ORDER BY created_at DESC
LIMIT 10;

-- ============================================================================
-- DONE!
-- ============================================================================
-- Articles should now be visible on your site:
-- - /articles (grid view)
-- - /articles/{slug} (detail view)
-- - /articles-debug (diagnostic)
