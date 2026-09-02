#!/usr/bin/env node

/**
 * Article Generation Script - Diagnostic & Generation
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateArticles() {
  console.log('\n📚 Starting Article Generation & Diagnostics\n');

  try {
    // Step 1: Get all topics
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, slug, title, blurb, body, section_id, sort')
      .order('sort', { ascending: true });

    if (topicsError) throw topicsError;
    console.log(`✓ Found ${topics?.length || 0} topics`);

    // Step 2: Get all sections
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

    // Step 4: Try to insert a test article to see which columns are available
    console.log('🔍 Checking available columns in articles table...\n');

    const testArticle = {
      slug: `test-${Date.now()}`,
      title: 'Test Article',
      excerpt: 'Test',
      body: 'Test body',
      published: true,
    };

    const { error: testError, data: testData } = await supabase
      .from('articles')
      .insert([testArticle])
      .select('*');

    if (testError) {
      console.error('❌ Error inserting basic article:');
      console.error(`   ${testError.message}`);
      
      // Try with more fields
      console.log('\n🔄 Trying with alternative field names...\n');
      
      const altArticle = {
        slug: `alt-test-${Date.now()}`,
        title: 'Alt Test Article',
        excerpt: 'Test',
        body: 'Test body',
        published: true,
        minutes: 5,
        tone: 'test',
      };

      const { error: altError } = await supabase
        .from('articles')
        .insert([altArticle])
        .select('*');

      if (altError) {
        console.error('❌ Alternative attempt also failed:');
        console.error(`   ${altError.message}`);
        
        // List available fields by trying one at a time
        console.log('\n💡 To fix this, you may need to:');
        console.log('   1. Check your Supabase SQL Editor');
        console.log('   2. Verify articles table was created');
        console.log('   3. Run: entitles/articles.sql migration');
        console.log('   4. Run: entitles/seed-articles-comprehensive.sql\n');
        
        process.exit(1);
      }
    }

    console.log('✓ Test article inserted successfully');
    
    // Clean up test article
    if (testData && testData.length > 0) {
      await supabase.from('articles').delete().eq('slug', testArticle.slug);
    }

    // Step 5: Generate all articles
    const sectionMap = new Map(sections.map(s => [s.id, s]));
    const subjectMap = new Map(subjects.map(s => [s.id, s]));

    const toInsert = [];
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
        published: true,
      });
    }

    console.log(`\n📝 Inserting ${toInsert.length} articles...\n`);

    // Insert in batches to avoid size limits
    const batchSize = 50;
    let successCount = 0;

    for (let i = 0; i < toInsert.length; i += batchSize) {
      const batch = toInsert.slice(i, i + batchSize);
      const { error, data } = await supabase
        .from('articles')
        .insert(batch)
        .select('id');

      if (error) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} failed: ${error.message}`);
      } else {
        successCount += data?.length || 0;
        console.log(`✓ Batch ${Math.floor(i / batchSize) + 1}: ${data?.length || 0} articles`);
      }
    }

    console.log(`\n✅ Successfully inserted ${successCount} articles!`);

    // Step 6: Verify
    const { data: allArticles } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .limit(5);

    console.log(`\n📊 Sample Articles Created:`);
    (allArticles || []).forEach(a => {
      console.log(`   • ${a.title} (${a.slug})`);
    });

    console.log(`\n🎉 Done! Visit:`);
    console.log(`   http://localhost:5173/articles`);
    console.log(`   http://localhost:5173/articles-debug\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

generateArticles();
