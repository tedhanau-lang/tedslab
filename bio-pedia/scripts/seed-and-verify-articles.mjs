#!/usr/bin/env node

/**
 * Article Generation & Verification Script
 * 
 * Usage:
 *   node scripts/seed-and-verify-articles.mjs
 * 
 * This script:
 * 1. Connects to Supabase
 * 2. Generates articles from topics
 * 3. Verifies all articles are properly linked
 * 4. Reports on article creation status
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env');
  console.error('   Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateArticles() {
  console.log('\n📚 Starting Article Generation & Verification\n');

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
        status: 'published',
        sort: topic.sort || 0,
      });
    }

    console.log(`📝 Generated ${toInsert.length} articles from topics\n`);

    // Step 5: Insert articles (handle duplicates gracefully)
    if (toInsert.length > 0) {
      // Use upsert to handle existing articles
      const { error: insertError, data: insertData, count } = await supabase
        .from('articles')
        .upsert(toInsert, { onConflict: 'slug' })
        .select('id, slug, title, topic_slug');

      if (insertError) {
        console.error('⚠️  Insert error (may be expected for existing articles):', insertError.message);
      } else {
        console.log(`✅ Successfully processed ${insertData?.length || 0} articles`);
      }
    }

    // Step 6: Verify articles were created and linked
    const { data: allArticles, error: articlesError } = await supabase
      .from('articles')
      .select('id, slug, title, topic_slug, section_slug, subject_slug, published')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(100);

    if (articlesError) throw articlesError;

    console.log(`\n📊 Verification Results:\n`);
    console.log(`  Total Published Articles: ${allArticles?.length || 0}`);

    // Group by subject
    const bySubject = {};
    (allArticles || []).forEach(a => {
      bySubject[a.subject_slug] = (bySubject[a.subject_slug] || 0) + 1;
    });

    console.log('\n  Articles by Subject:');
    Object.entries(bySubject)
      .sort(([, a], [, b]) => b - a)
      .forEach(([subject, count]) => {
        console.log(`    • ${subject}: ${count} articles`);
      });

    // Check linking
    const linkedArticles = (allArticles || []).filter(a => a.topic_slug);
    console.log(`\n  Linked to Topics: ${linkedArticles.length}/${allArticles?.length || 0} articles`);

    // Show latest articles
    console.log(`\n  📄 Latest 5 Articles Created:`);
    (allArticles || []).slice(0, 5).forEach(a => {
      console.log(`    • ${a.title} (${a.topic_slug ? '🔗 linked' : '⚠️  no link'})`);
    });

    console.log('\n✅ Article generation complete!\n');
    console.log('🎉 Articles are now visible on:');
    console.log('   • /articles (All Articles page)');
    console.log('   • /articles/{slug} (Individual article pages)');
    console.log('   • Article detail pages show Related Articles section');
    console.log('   • Admin panel: /admin/articles\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
generateArticles();
