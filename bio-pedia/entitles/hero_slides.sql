-- Hero slides for the homepage banner
-- These slides rotate every 6 seconds

INSERT INTO public.hero_slides (id, subject_slug, title, subtitle, body, image_key, image_url, link_to, video_url, sort, active, created_at, updated_at) VALUES
  (gen_random_uuid(), 'biology', 'Photosynthesis', 'Light reactions and the Calvin cycle', 'Explore how plants convert sunlight into chemical energy, the foundation of nearly all life on Earth.', 'discovery-leaf', NULL, '/photosynthesis', NULL, 0, true, NOW(), NOW()),
  (gen_random_uuid(), 'biology', 'Cell Structure', 'Organelles and compartmentalization', 'Discover the incredible architecture of cells, from the nucleus to the powerhouse mitochondria.', 'hero-cell', NULL, '/cells-microscopy', NULL, 1, true, NOW(), NOW()),
  (gen_random_uuid(), 'biology', 'Evolution', 'Adaptation and natural selection', 'Understand how species change over time through the mechanism of natural selection.', 'hero-cell', NULL, '/evolution', NULL, 2, true, NOW(), NOW()),
  (gen_random_uuid(), 'biology', 'Genetics', 'DNA and inheritance', 'Learn how traits are passed from parents to offspring through the elegant code of DNA.', 'hero-cell', NULL, '/genetics-dna', NULL, 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'biology', 'Ecology', 'Food chains and ecosystems', 'Explore how organisms interact and energy flows through the natural world.', 'hero-cell', NULL, '/ecology-environment', NULL, 4, true, NOW(), NOW())
ON CONFLICT DO NOTHING;
