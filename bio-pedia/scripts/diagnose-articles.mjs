#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseArticles() {
  console.log('\n🔍 Diagnosing Article Issues\n');

  try {
    // Get a sample article with all fields
    const { data: article, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching article:', error.message);
      return;
    }

    if (!article) {
      console.error('No articles found!');
      return;
    }

    console.log('📄 Sample Article Structure:\n');
    
    // Check which fields are populated
    const fields = [
      'id', 'slug', 'title', 'excerpt', 'body', 'minutes', 'tone',
      'subject_slug', 'section_slug', 'topic_slug', 'image_key', 'image_url',
      'published', 'status', 'sort'
    ];

    fields.forEach(field => {
      const value = article[field];
      const status = value !== null && value !== undefined && value !== '' ? '✓' : '✗';
      const display = value ? `${String(value).substring(0, 50)}...` : '(empty)';
      console.log(`${status} ${field.padEnd(20)} : ${display}`);
    });

    console.log('\n⚠️  Issues Found:\n');

    const issues = [];

    if (!article.body || article.body === '') {
      issues.push('❌ body is empty - articles will have no content');
    }

    if (!article.image_key && !article.image_url) {
      issues.push('⚠️  No image - articles will display without images');
    }

    if (!article.excerpt) {
      issues.push('⚠️  excerpt is empty - articles will have no preview');
    }

    if (!article.minutes) {
      issues.push('⚠️  minutes is not set - read time won\'t show');
    }

    if (issues.length === 0) {
      console.log('✅ No critical issues found!');
    } else {
      issues.forEach(issue => console.log(issue));
    }

    console.log('\n✅ Article ID for testing: ' + article.id);
    console.log('   Slug: ' + article.slug);
    console.log('   Title: ' + article.title);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

diagnoseArticles();
