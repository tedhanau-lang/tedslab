# Article Generation & Linking Guide

## Overview

This guide explains how to generate all articles from topics and ensure they're properly linked with article cards throughout the site.

## Current Status

✅ **RelatedArticles Component**: Automatically displays linked articles on article detail pages  
✅ **ArticleCard Component**: Fully implemented and used across all pages  
✅ **Dynamic Article Routes**: `/articles/{slug}` handles all article views  
✅ **Admin Panel**: Available at `/admin/articles` for managing articles  

## What Needs to Be Done

### Step 1: Generate Articles from Topics

You have **two options**:

#### Option A: Using Supabase SQL Editor (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `utujxjjclxvztonjqwgy`
3. Open **SQL Editor** (left sidebar)
4. Click **"New Query"**
5. Copy the entire contents of: `entitles/seed-articles-comprehensive.sql`
6. Click **"Run"**
7. Articles will be created immediately

**Expected Result**: 
- Hundreds of articles created (one per topic)
- All articles linked via `topic_slug` field
- All articles published and visible on the site

#### Option B: Using Node.js Script

```bash
cd /Users/ted/Downloads/study-hub-tedslab
node scripts/seed-and-verify-articles.mjs
```

This script will:
- Generate articles from all topics
- Verify they're properly linked
- Report statistics about created articles

### Step 2: Verify Article Links

After creating articles, verify they're properly linked:

**In Admin Panel** (`/admin/articles`):
- Should show 100+ published articles
- Each article has `topic_slug` populated
- Status shows "published"

**On Article Pages** (`/articles/{slug}`):
- Article detail page displays
- **Related Articles** section appears below body
- Shows 6 articles from same topic + 3 from same section
- All related articles clickable

**On All Articles Page** (`/articles`):
- Lists all published articles
- Each article card is clickable
- Links to `/articles/{slug}`

## Article Linking Architecture

### How Articles Are Linked

```
Topics → Articles → Related Articles
  ↓         ↓           ↓
topic.slug = article.topic_slug = RelatedArticles component filter
```

### The Flow

1. **Database**: Each article has a `topic_slug` field
2. **Route**: `/articles/{slug}` displays article with `RelatedArticles` component
3. **Component**: `RelatedArticles` filters articles by matching `topic_slug`
4. **Display**: Shows matching articles as clickable `ArticleCard` components

### Article Fields

```typescript
interface ArticleRow {
  slug: string;              // Unique identifier (e.g., "cells-mitochondria")
  title: string;             // Article title
  excerpt: string;           // Short summary
  body: string;              // Full HTML content
  minutes: number;           // Read time estimate
  tone: string;              // Category badge (e.g., "Cellular Biology")
  
  // Linking Fields
  topic_slug: string;        // ← KEY: Links to topic
  section_slug: string;      // Parent section
  subject_slug: string;      // Parent subject (e.g., "biology")
  
  image_key: string;         // Image identifier
  published: boolean;        // Visibility flag
  status: 'draft' | 'review' | 'published';
}
```

## Files Involved

### Core Components
- **`src/components/biopedia/ArticleCard.tsx`** - Displays individual article cards
- **`src/components/biopedia/RelatedArticles.tsx`** - Shows linked articles on detail pages
- **`src/components/biopedia/ContentLayout.tsx`** - Article detail page layout

### Routes
- **`src/routes/articles.tsx`** - All articles listing page
- **`src/routes/articles.$slug.tsx`** - Individual article detail page (with RelatedArticles)
- **`src/routes/_authenticated/admin.articles.tsx`** - Admin panel for managing articles

### Seeding
- **`entitles/seed-articles-comprehensive.sql`** - Comprehensive SQL seeding script
- **`scripts/seed-and-verify-articles.mjs`** - Node.js verification & generation script

## About "10 Newly Added Articles"

If you're referring to the 10 example articles that were hardcoded:

They were:
- `articles.cellular-respiration.tsx`
- `articles.enzyme-catalysis.tsx`
- `articles.evolution-natural-selection.tsx`
- `articles.food-chains-energy-flow.tsx`
- `articles.human-anatomy-systems.tsx`
- `articles.meiosis-gamete-formation.tsx`
- `articles.mitosis-cell-division.tsx`
- `articles.photosynthesis-light-reactions.tsx`
- Plus routes for photosynthesis and biology pages

These are now superseded by the dynamic article system. You can:

**Option 1**: Keep them as legacy routes (no changes needed)

**Option 2**: Remove them and use dynamic articles instead
```bash
rm src/routes/articles.*.tsx  # Remove hardcoded article routes
rm src/routes/photosynthese.tsx
rm src/routes/photosynthesis.tsx
```

**Recommendation**: Use the dynamic system and create articles via the seeding process.

## Testing the System

### Test 1: View All Articles
1. Go to `/articles`
2. Should see grid of 100+ article cards
3. Click any card → goes to `/articles/{slug}`

### Test 2: View Article with Related Articles
1. Go to `/articles/cells-mitochondria` (or any article)
2. Scroll down → see "Related Articles" section
3. Should show 6+ related articles from same topic
4. Click related article → navigates to new article

### Test 3: Admin Management
1. Login and go to `/admin/articles`
2. Should see all published articles
3. Can toggle publish status, edit content
4. Changes appear immediately on site

## Troubleshooting

### Articles Not Appearing

**Check 1**: Are articles in database?
```sql
SELECT COUNT(*) FROM articles WHERE published = true;
```

**Check 2**: Do articles have `topic_slug`?
```sql
SELECT * FROM articles WHERE topic_slug IS NULL LIMIT 5;
```

**Check 3**: Are topics created?
```sql
SELECT COUNT(*) FROM topics;
```

### Related Articles Not Showing

**Check**: Article has `topic_slug` matching another article
```sql
SELECT slug, topic_slug FROM articles WHERE published = true LIMIT 5;
```

### ArticleCard Not Displaying

**Check**: Is `article.image_url` set?
- Image keys are resolved via `resolveImage()` function
- Falls back gracefully if image not found

## Next Steps

1. **Generate Articles**: Run SQL script or Node script above
2. **Test Navigation**: Visit `/articles` and click around
3. **Check Admin**: Verify in `/admin/articles`
4. **Verify Linking**: View article detail pages, check Related Articles section
5. **Monitor**: Use admin panel to edit/manage articles as needed

## Commands Reference

### Generate Articles
```bash
# Option 1: SQL (via Supabase dashboard)
# Copy entitles/seed-articles-comprehensive.sql and run

# Option 2: Node script
node scripts/seed-and-verify-articles.mjs
```

### Verify Articles
```sql
-- See all published articles
SELECT COUNT(*) as total, COUNT(DISTINCT topic_slug) as unique_topics 
FROM articles 
WHERE published = true;

-- See articles by subject
SELECT subject_slug, COUNT(*) 
FROM articles 
WHERE published = true 
GROUP BY subject_slug;
```

### View Related Articles Query
```sql
-- See what's related to a specific article
SELECT a2.* 
FROM articles a1
JOIN articles a2 ON a1.topic_slug = a2.topic_slug
WHERE a1.slug = 'cells-mitochondria' 
  AND a2.slug != a1.slug 
  AND a2.published = true;
```

## Support

For issues or questions:
1. Check admin panel at `/admin/articles`
2. Verify SQL query results in Supabase
3. Check browser console for errors (F12)
4. Verify database schema in `entitles/articles.sql`
