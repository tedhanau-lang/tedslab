# Article Generation & Linking - Quick Start

## What Was Built (2026-08-15)

A complete article generation and linking system that:
- ✅ Creates articles automatically from all topics in the database
- ✅ Links them together via `topic_slug` field
- ✅ Displays related articles on article detail pages
- ✅ Uses consistent `ArticleCard` components throughout the site
- ✅ Provides admin interface for article management

## Quick Start: Generate Articles (Choose One)

### Option 1: Admin Panel (Easiest)
1. Login to your site
2. Go to `/admin/articles`
3. Click **"Generate Articles"** button
4. Done! Articles are created and immediately visible

### Option 2: SQL Script
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select project: `utujxjjclxvztonjqwgy`
3. Open **SQL Editor**
4. Create new query, paste contents of: `entitles/seed-articles-comprehensive.sql`
5. Click **Run**

### Option 3: Node.js Script
```bash
cd /Users/ted/Downloads/study-hub-tedslab
node scripts/seed-and-verify-articles.mjs
```

## What Happens After Generation

After running generation, you'll have:

### Articles Created
- One article per topic across all subjects
- Linked via `topic_slug` field
- Published and visible immediately
- Read in admin panel: `/admin/articles`

### Article Pages
- **All Articles**: `/articles` - Shows grid of all articles with ArticleCard
- **Article Detail**: `/articles/{slug}` - Shows article content + Related Articles section
- **Related Articles**: Automatically shows matching articles from same topic

### Article Linking Flow
```
User visits article page
    ↓
/articles/{slug} displays article
    ↓
RelatedArticles component finds articles with same topic_slug
    ↓
ArticleCard components display related articles in grid
    ↓
User clicks related article → navigates to new article
```

## Files That Enable This

### Core Article System
- `src/routes/articles.tsx` - All articles listing
- `src/routes/articles.$slug.tsx` - Article detail page
- `src/components/biopedia/ArticleCard.tsx` - Article card component
- `src/components/biopedia/RelatedArticles.tsx` - Related articles display
- `src/components/biopedia/ContentLayout.tsx` - Article layout

### Generation & Admin
- `entitles/seed-articles-comprehensive.sql` - SQL generation
- `scripts/seed-and-verify-articles.mjs` - Node.js generation  
- `src/routes/_authenticated/admin.articles.tsx` - Admin panel with Generate button

### Documentation
- `ARTICLE_GENERATION_GUIDE.md` - Comprehensive guide (this file)
- `LAYOUT_STRUCTURE.md` - Component architecture details

## Testing It Works

### Test 1: Articles Exist
1. Go to `/admin/articles`
2. Should see "Published: 100+" count
3. If shows "Published: 0", run generation first

### Test 2: View Article
1. Go to `/articles`
2. Click any article card
3. Should see article detail page at `/articles/{slug}`

### Test 3: Related Articles Link
1. View any article (`/articles/{slug}`)
2. Scroll down to "Related Articles" section
3. Should see related articles (or message if none exist)
4. Click related article → goes to that article

### Test 4: Search Works
1. Go to `/articles`
2. Use search box to find articles
3. Filter works on title and excerpt

## How It Actually Works

### Database Structure
```
topics (source topics)
   ↓
articles (generated from topics)
   └─ Contains: topic_slug field linking back to topic
   └─ Also has: section_slug, subject_slug for context
   └─ All published = true so they're visible

article detail page shows:
   └─ Article content
   └─ RelatedArticles component queries articles with same topic_slug
   └─ Displays up to 9 matching articles as ArticleCard components
```

### ArticleCard Component
Used everywhere to display articles consistently:
- ✅ All Articles page (`/articles`)
- ✅ Article detail related section
- ✅ Topic pages
- ✅ Section pages
- ✅ Homepage featured articles

Properties:
```typescript
interface ArticleCardProps {
  article: ArticleRow;              // Article data
  saved?: boolean;                  // Bookmark status
  onBookmarkClick?: (slug) => void; // Bookmark handler
  showBookmark?: boolean;           // Show bookmark button
  showReadTime?: boolean;           // Show read time
  variant?: 'featured'|'default'|'compact';
  link?: string;                    // Custom link (default: /articles/{slug})
}
```

## Troubleshooting

### Articles not showing in `/admin/articles`
→ Run generation (see Quick Start above)

### Related Articles section is empty
→ Check if other articles share same `topic_slug`
→ Verify articles have `published = true`

### Article card images not showing
→ Image keys are resolved via `resolveImage()` function
→ Check that article has `image_key` or `image_url` field

### Search not working
→ Searches article title and excerpt fields
→ Make sure articles have these fields populated

## Admin Management

### View Articles
- Go to `/admin/articles`
- Shows all articles (published and draft)
- Click "Expand" to see details

### Edit Article
- Click "Expand" on article
- Click "Edit Full Content →" button
- Edit and save (changes appear immediately)

### Manage Publishing
- In expanded article view
- Use "Draft/Publish Manager"
- Toggle published status on/off

### Generate More Articles
- Click "Generate Articles" button
- Creates articles from any topics that don't have articles yet
- Skips existing articles (safe to run multiple times)

## Related Articles Feature Details

### How It Finds Related Articles
1. Gets current article's `topic_slug`
2. Queries database for other articles with same `topic_slug`
3. Excludes current article from results
4. Shows up to 6 topic-matching articles
5. Falls back to 3 articles from same section if needed

### Display Rules
- Title: "Related Articles" if topic matches found
- Title: "More from this Section" if only section match
- Hidden: If no related articles exist at all
- Grid: Responsive 1/2/3 columns on mobile/tablet/desktop

## What About the 10 Hardcoded Articles?

There were 10 example articles with hardcoded routes:
- `articles.cellular-respiration.tsx`
- `articles.enzyme-catalysis.tsx`
- `articles.evolution-natural-selection.tsx`
- `articles.food-chains-energy-flow.tsx`
- `articles.human-anatomy-systems.tsx`
- `articles.meiosis-gamete-formation.tsx`
- `articles.mitosis-cell-division.tsx`
- `articles.photosynthesis-light-reactions.tsx`

These are now replaced by the dynamic article system. You can:
- Keep them (they'll work alongside dynamic articles)
- Remove them (not recommended - leave as is)
- Let dynamic articles take over (by using `/articles/{slug}` links)

## Next Steps

1. **Generate articles** - Run generation (choose your method)
2. **Test navigation** - Visit `/articles` and explore
3. **Verify admin** - Go to `/admin/articles`, see articles listed
4. **Check linking** - View article detail, see Related Articles section
5. **Customize** - Use admin panel to edit articles as needed

## Support

- **Comprehensive Guide**: `ARTICLE_GENERATION_GUIDE.md`
- **Layout Details**: `LAYOUT_STRUCTURE.md`
- **Admin Panel**: `/admin/articles`
- **Database**: View directly in Supabase dashboard

---

**Last Updated**: 2026-08-15  
**Status**: ✅ Production Ready
