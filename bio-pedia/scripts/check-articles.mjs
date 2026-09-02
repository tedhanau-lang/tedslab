#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkArticles() {
  console.log('\n🔍 Checking if articles exist in database...\n');

  try {
    const { data, error, count } = await supabase
      .from('articles')
      .select('id, slug, title, published', { count: 'exact' })
      .eq('published', true);

    if (error) {
      console.error('Error:', error.message);
      return;
    }

    console.log(`✅ Total Published Articles: ${count}`);
    
    if (count > 0) {
      console.log(`\n📄 First 5 Articles:\n`);
      data.slice(0, 5).forEach((a, i) => {
        console.log(`${i + 1}. ${a.title}`);
        console.log(`   URL: /articles/${a.slug}\n`);
      });

      console.log('🎉 SUCCESS! Articles are in the database!');
      console.log('\nYour articles are now accessible at:');
      console.log('  • /articles - See all articles');
      console.log('  • /articles/{slug} - View specific article');
      console.log('  • /articles-debug - Debug/test page\n');
    } else {
      console.log('⚠️  No published articles found');
      console.log('\nTo generate articles, run this SQL in Supabase SQL Editor:');
      console.log('  1. Disable RLS: ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;');
      console.log('  2. Insert articles: (see entitles/GENERATE_ARTICLES_COMPLETE.sql)\n');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkArticles();
