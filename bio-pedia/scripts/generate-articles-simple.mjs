#!/usr/bin/env node

/**
 * Article Generation Script - Simple Version
 * No dependencies required!
 */

import { createClient } from '@supabase/supabase-js';

// Get credentials from environment (try both VITE_ and plain prefixes)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('   Environment variables needed:');
  console.error('   - SUPABASE_URL (or VITE_SUPABASE_URL)');
  console.error('   - SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY)');
  console.error('\n   Current values:');
  console.error(`   - URL: ${supabaseUrl ? '✓ set' : '✗ missing'}`);
  console.error(`   - Key: ${supabaseKey ? '✓ set' : '✗ missing'}`);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateArticles() {
  console.log('\n📚 Starting Article Generation\n');

  try {
    // Step 1: Get all topics
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, slug, title, blurb, body, section_id, sort')
      .order('sort', { ascending: true });

    if (topicsError) throw topicsError;

    console.log(`✓ Found ${topics?.length || 0} topics`);

    // Step 2: Get all sections with subject info
    const { data: sections, error: sectionsError } = await supabase
      .from('sections')
      .select('id, slug, title, subject_id, image_key')
      .order('sort', { ascending: true });

    if (sectionsError) throw sectionsError;

    console.log(`✓ Found ${sections?.length || 0} sections`);

    // Step 3: Get all subjects
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('id, slug, title')
      .order('sort', { ascending: true });

    if (subjectsError) throw subjectsError;

    console.log(`✓ Found ${subjects?.length || 0} subjects\n`);

    // Step 4: Generate articles in memory
    const toInsert = [];
    const sectionMap = new Map(sections.map(s => [s.id, s]));
    const subjectMap = new Map(subjects.map(s => [s.id, s]));

    for (const topic of topics || []) {
      const section = sectionMap.get(topic.section_id);
      const subject = section ? subjectMap.get(section.subject_id) : null;

      if (!section || !subject) continue;

      const tones = ['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'];
      const randomTone = tones[Math.floor(Math.random() * tones.length)];
      const randomMinutes = Math.floor(Math.random() * 6 + 5);

      toInsert.push({
        slug: `${section.slug}-${topic.slug}`,
        title: `${topic.title}: Full Guide`,
        excerpt: topic.blurb || '',
        body: topic.body || '',
        minutes: randomMinutes,
        tone: randomTone,
        subject_slug: subject.slug,
        section_slug: section.slug,
        topic_slug: topic.slug,
        image_key: section.image_key || 'hero-cell',
        published: true,
        sort: topic.sort || 0,
      });
    }

    console.log(`📝 Generated ${toInsert.length} articles from topics\n`);

    // Step 5: Insert articles
    if (toInsert.length > 0) {
      const { error: insertError, data: insertData } = await supabase
        .from('articles')
        .upsert(toInsert, { onConflict: 'slug' })
        .select('id, slug, title, topic_slug');

      if (insertError) {
        console.error('⚠️  Insert error:', insertError.message);
      } else {
        console.log(`✅ Successfully processed ${insertData?.length || 0} articles`);
      }
    }

    // Step 6: Verify
    const { data: allArticles } = await supabase
      .from('articles')
      .select('id, slug, title, topic_slug, subject_slug, published')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(100);

    console.log(`\n📊 Results:\n`);
    console.log(`  Total Published: ${allArticles?.length || 0}`);

    const bySubject = {};
    (allArticles || []).forEach(a => {
      bySubject[a.subject_slug] = (bySubject[a.subject_slug] || 0) + 1;
    });

    console.log('\n  By Subject:');
    Object.entries(bySubject)
      .sort(([, a], [, b]) => b - a)
      .forEach(([subject, count]) => {
        console.log(`    • ${subject}: ${count}`);
      });

    console.log('\n✅ Generation complete!\n');
    console.log('🎉 Visit your site now:');
    console.log('   http://localhost:5173/articles');
    console.log('   http://localhost:5173/articles-debug\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateArticles();
