-- Migration: Add articles data for all topics
-- This SQL file creates articles for each topic in the database
-- Admin can edit these articles later via the admin panel

-- Clear existing articles (optional - comment out if you want to preserve existing)
-- DELETE FROM public.articles;

-- Insert articles for Biology: Organisms section
INSERT INTO public.articles (slug, title, excerpt, body, minutes, tone, subject_slug, section_slug, topic_slug, image_key, published, status, sort) 
SELECT 
  'organisms-' || t.slug,
  t.title || ': Full Guide',
  t.blurb,
  t.body,
  FLOOR(RANDOM() * 6 + 5)::INTEGER as minutes,
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER] as tone,
  'biology' as subject_slug,
  'organisms' as section_slug,
  t.slug as topic_slug,
  'cat-organisms' as image_key,
  true as published,
  'published' as status,
  ROW_NUMBER() OVER (ORDER BY t.sort) as sort
FROM public.topics t
WHERE t.section_id = (SELECT id FROM public.sections WHERE slug = 'organisms')
ON CONFLICT (slug) DO NOTHING;

-- Insert articles for Biology: Cells & Microscopy section  
INSERT INTO public.articles (slug, title, excerpt, body, minutes, tone, subject_slug, section_slug, topic_slug, image_key, published, status, sort)
SELECT 
  'cells-' || t.slug,
  t.title || ': Full Guide',
  t.blurb,
  t.body,
  FLOOR(RANDOM() * 6 + 5)::INTEGER as minutes,
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER] as tone,
  'biology' as subject_slug,
  'cells-microscopy' as section_slug,
  t.slug as topic_slug,
  'hero-cell' as image_key,
  true as published,
  'published' as status,
  ROW_NUMBER() OVER (ORDER BY t.sort) + 100 as sort
FROM public.topics t
WHERE t.section_id = (SELECT id FROM public.sections WHERE slug = 'cells-microscopy')
ON CONFLICT (slug) DO NOTHING;

-- Insert articles for Biology: Human Biology section
INSERT INTO public.articles (slug, title, excerpt, body, minutes, tone, subject_slug, section_slug, topic_slug, image_key, published, status, sort)
SELECT 
  'human-' || t.slug,
  t.title || ': Full Guide',
  t.blurb,
  t.body,
  FLOOR(RANDOM() * 6 + 5)::INTEGER as minutes,
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER] as tone,
  'biology' as subject_slug,
  'human-biology' as section_slug,
  t.slug as topic_slug,
  'cat-human' as image_key,
  true as published,
  'published' as status,
  ROW_NUMBER() OVER (ORDER BY t.sort) + 200 as sort
FROM public.topics t
WHERE t.section_id = (SELECT id FROM public.sections WHERE slug = 'human-biology')
ON CONFLICT (slug) DO NOTHING;

-- Insert articles for Biology: Genetics & DNA section
INSERT INTO public.articles (slug, title, excerpt, body, minutes, tone, subject_slug, section_slug, topic_slug, image_key, published, status, sort)
SELECT 
  'genetics-' || t.slug,
  t.title || ': Full Guide',
  t.blurb,
  t.body,
  FLOOR(RANDOM() * 6 + 5)::INTEGER as minutes,
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER] as tone,
  'biology' as subject_slug,
  'genetics-dna' as section_slug,
  t.slug as topic_slug,
  'cat-genetics' as image_key,
  true as published,
  'published' as status,
  ROW_NUMBER() OVER (ORDER BY t.sort) + 300 as sort
FROM public.topics t
WHERE t.section_id = (SELECT id FROM public.sections WHERE slug = 'genetics-dna')
ON CONFLICT (slug) DO NOTHING;

-- Insert articles for all other Biology sections
INSERT INTO public.articles (slug, title, excerpt, body, minutes, tone, subject_slug, section_slug, topic_slug, image_key, published, status, sort)
SELECT 
  s.slug || '-' || t.slug,
  t.title || ': Full Guide',
  t.blurb,
  t.body,
  FLOOR(RANDOM() * 6 + 5)::INTEGER as minutes,
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER] as tone,
  'biology' as subject_slug,
  s.slug as section_slug,
  t.slug as topic_slug,
  COALESCE(s.image_key, 'hero-cell') as image_key,
  true as published,
  'published' as status,
  ROW_NUMBER() OVER (ORDER BY t.sort) + 400 as sort
FROM public.topics t
INNER JOIN public.sections s ON t.section_id = s.id
WHERE s.subject_id = (SELECT id FROM public.subjects WHERE slug = 'biology')
  AND s.slug NOT IN ('organisms', 'cells-microscopy', 'human-biology', 'genetics-dna', 'plants', 'ecology-environment', 'evolution', 'biological-processes', 'anatomy', 'biotechnology')
ON CONFLICT (slug) DO NOTHING;

-- Insert articles for all Mathematics sections
INSERT INTO public.articles (slug, title, excerpt, body, minutes, tone, subject_slug, section_slug, topic_slug, image_key, published, status, sort)
SELECT 
  s.slug || '-' || t.slug,
  t.title || ': Full Guide',
  t.blurb,
  t.body,
  FLOOR(RANDOM() * 6 + 5)::INTEGER as minutes,
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER] as tone,
  'mathematics' as subject_slug,
  s.slug as section_slug,
  t.slug as topic_slug,
  'math-algebra' as image_key,
  true as published,
  'published' as status,
  ROW_NUMBER() OVER (ORDER BY t.sort) + 500 as sort
FROM public.topics t
INNER JOIN public.sections s ON t.section_id = s.id
WHERE s.subject_id = (SELECT id FROM public.subjects WHERE slug = 'mathematics')
ON CONFLICT (slug) DO NOTHING;

-- Insert articles for all Science sections
INSERT INTO public.articles (slug, title, excerpt, body, minutes, tone, subject_slug, section_slug, topic_slug, image_key, published, status, sort)
SELECT 
  s.slug || '-' || t.slug,
  t.title || ': Full Guide',
  t.blurb,
  t.body,
  FLOOR(RANDOM() * 6 + 5)::INTEGER as minutes,
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER] as tone,
  'science' as subject_slug,
  s.slug as section_slug,
  t.slug as topic_slug,
  'sci-physics' as image_key,
  true as published,
  'published' as status,
  ROW_NUMBER() OVER (ORDER BY t.sort) + 600 as sort
FROM public.topics t
INNER JOIN public.sections s ON t.section_id = s.id
WHERE s.subject_id = (SELECT id FROM public.subjects WHERE slug = 'science')
ON CONFLICT (slug) DO NOTHING;

-- Insert articles for all English sections
INSERT INTO public.articles (slug, title, excerpt, body, minutes, tone, subject_slug, section_slug, topic_slug, image_key, published, status, sort)
SELECT 
  s.slug || '-' || t.slug,
  t.title || ': Full Guide',
  t.blurb,
  t.body,
  FLOOR(RANDOM() * 6 + 5)::INTEGER as minutes,
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER] as tone,
  'english' as subject_slug,
  s.slug as section_slug,
  t.slug as topic_slug,
  'eng-literature' as image_key,
  true as published,
  'published' as status,
  ROW_NUMBER() OVER (ORDER BY t.sort) + 700 as sort
FROM public.topics t
INNER JOIN public.sections s ON t.section_id = s.id
WHERE s.subject_id = (SELECT id FROM public.subjects WHERE slug = 'english')
ON CONFLICT (slug) DO NOTHING;

-- Insert articles for all History sections
INSERT INTO public.articles (slug, title, excerpt, body, minutes, tone, subject_slug, section_slug, topic_slug, image_key, published, status, sort)
SELECT 
  s.slug || '-' || t.slug,
  t.title || ': Full Guide',
  t.blurb,
  t.body,
  FLOOR(RANDOM() * 6 + 5)::INTEGER as minutes,
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER] as tone,
  'history' as subject_slug,
  s.slug as section_slug,
  t.slug as topic_slug,
  'his-ancient' as image_key,
  true as published,
  'published' as status,
  ROW_NUMBER() OVER (ORDER BY t.sort) + 800 as sort
FROM public.topics t
INNER JOIN public.sections s ON t.section_id = s.id
WHERE s.subject_id = (SELECT id FROM public.subjects WHERE slug = 'history')
ON CONFLICT (slug) DO NOTHING;

-- Insert articles for all Technology sections
INSERT INTO public.articles (slug, title, excerpt, body, minutes, tone, subject_slug, section_slug, topic_slug, image_key, published, status, sort)
SELECT 
  s.slug || '-' || t.slug,
  t.title || ': Full Guide',
  t.blurb,
  t.body,
  FLOOR(RANDOM() * 6 + 5)::INTEGER as minutes,
  ARRAY['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'][FLOOR(RANDOM() * 8 + 1)::INTEGER] as tone,
  'technology' as subject_slug,
  s.slug as section_slug,
  t.slug as topic_slug,
  'tech-computing' as image_key,
  true as published,
  'published' as status,
  ROW_NUMBER() OVER (ORDER BY t.sort) + 900 as sort
FROM public.topics t
INNER JOIN public.sections s ON t.section_id = s.id
WHERE s.subject_id = (SELECT id FROM public.subjects WHERE slug = 'technology')
ON CONFLICT (slug) DO NOTHING;

-- Verify articles were created
SELECT COUNT(*) as total_articles, COUNT(DISTINCT topic_slug) as topics_covered 
FROM public.articles 
WHERE published = true;
