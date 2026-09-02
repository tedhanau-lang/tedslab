import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  console.error('VITE_SUPABASE_URL:', supabaseUrl);
  console.error('VITE_SUPABASE_PUBLISHABLE_KEY:', supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const heroSlides = [
  {
    subject_slug: 'biology',
    title: 'Photosynthesis',
    subtitle: 'Light reactions and the Calvin cycle',
    body: 'Explore how plants convert sunlight into chemical energy, the foundation of nearly all life on Earth.',
    image_key: 'discovery-leaf',
    image_url: null,
    link_to: '/photosynthesis',
    video_url: null,
    sort: 0,
    active: true,
  },
  {
    subject_slug: 'biology',
    title: 'Cell Structure',
    subtitle: 'Organelles and compartmentalization',
    body: 'Discover the incredible architecture of cells, from the nucleus to the powerhouse mitochondria.',
    image_key: 'hero-cell',
    image_url: null,
    link_to: '/cells-microscopy',
    video_url: null,
    sort: 1,
    active: true,
  },
  {
    subject_slug: 'biology',
    title: 'Evolution',
    subtitle: 'Adaptation and natural selection',
    body: 'Understand how species change over time through the mechanism of natural selection.',
    image_key: 'hero-cell',
    image_url: null,
    link_to: '/evolution',
    video_url: null,
    sort: 2,
    active: true,
  },
  {
    subject_slug: 'biology',
    title: 'Genetics',
    subtitle: 'DNA and inheritance',
    body: 'Learn how traits are passed from parents to offspring through the elegant code of DNA.',
    image_key: 'hero-cell',
    image_url: null,
    link_to: '/genetics-dna',
    video_url: null,
    sort: 3,
    active: true,
  },
  {
    subject_slug: 'biology',
    title: 'Ecology',
    subtitle: 'Food chains and ecosystems',
    body: 'Explore how organisms interact and energy flows through the natural world.',
    image_key: 'hero-cell',
    image_url: null,
    link_to: '/ecology-environment',
    video_url: null,
    sort: 4,
    active: true,
  },
];

async function seedHeroSlides() {
  try {
    console.log('🌱 Seeding hero slides...');
    
    // First, clear existing slides
    const { error: deleteError } = await supabase
      .from('hero_slides')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.warn('⚠️  Warning deleting old slides:', deleteError);
    } else {
      console.log('✓ Cleared existing slides');
    }

    // Insert new slides
    const { data, error } = await supabase
      .from('hero_slides')
      .insert(heroSlides)
      .select();

    if (error) {
      console.error('❌ Error inserting hero slides:', error);
      process.exit(1);
    }

    console.log('✅ Successfully seeded hero slides!');
    console.log(`📊 Inserted ${data?.length || 0} slides:`);
    data?.forEach((slide) => {
      console.log(`   • ${slide.title} → ${slide.link_to}`);
    });
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedHeroSlides();
