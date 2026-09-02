# Complete Article & Topic Setup Guide

## 🎯 Overview

All articles and topics are now fully linkable and openable. The system has been set up with complete navigation from homepage through subjects, sections, topics, and finally articles.

## 📋 What's Been Done

### 1. **Route Structure** ✅
- `/$subject` - Subject overview page (e.g., `/biology`)
- `/$subject/$section` - Section with all articles (e.g., `/biology/organisms`)
- `/$section/$topic` - Topic page with related articles (e.g., `/organisms/animal-kingdom`)
- `/articles/$slug` - Individual article page (e.g., `/articles/organisms-animal-kingdom`)
- `/articles` - All articles page

### 2. **Database Updates** ✅
- Added `topic_slug` field to articles table
- Created article schema in `entitles/articles.sql`
- Created migration to generate articles for all topics in `entitles/seed-articles.sql`

### 3. **Component Updates** ✅
- **FeaturedArticles** - Now links articles to `/articles/{slug}` 
- **CategoryGrid** - Links subjects to `/{subject_slug}`
- **TopicGrid** - Links topics to `/{section_slug}/{topic_slug}`

### 4. **Homepage Linking** ✅
Homepage now links to:
- Featured articles (clickable cards)
- All categories/subjects (via CategoryGrid)
- All articles page
- All pages, videos, glossary, quizzes

## 🚀 Setup Steps

### Step 1: Update Database Schema
The `entitles/articles.sql` file already has the latest schema with `topic_slug` field. If your database doesn't have this field yet, it will be created automatically.

### Step 2: Load Article Data
Run the migration to generate articles for all topics:

```sql
-- Using Supabase Dashboard
1. Go to SQL Editor
2. Copy all content from entitles/seed-articles.sql
3. Run the query
```

Or via command line:
```bash
psql -h your-host -d your-db -U your-user -f entitles/seed-articles.sql
```

### Step 3: Verify Data
After running the migration, verify that articles were created:

```sql
SELECT COUNT(*) FROM public.articles WHERE published = true;
SELECT COUNT(DISTINCT topic_slug) FROM public.articles WHERE published = true;
```

You should see one article per topic, all published.

## 🔗 Complete Navigation Flow

### From Homepage
```
Homepage
  ├─ Featured Articles → Click card → /articles/{slug}
  ├─ Explore by Category → Click category → /{subject}
  ├─ All Articles button → /articles
  │   └─ Click article card → /articles/{slug}
  └─ Study Tools (Notebook, Flashcards, etc.)
```

### From Sidebar
```
Sidebar
  ├─ Click Subject (e.g., "Biology") → /{subject}
  │   └─ Section cards appear
  │       └─ Click section → /{subject}/{section}
  │           └─ Article cards appear
  │               └─ Click article → /articles/{slug}
  ├─ All Articles → /articles
  │   └─ Click article → /articles/{slug}
  └─ Study Tools
```

### Topic Details Flow
```
Section Page (/{subject}/{section})
  └─ Topics appear (via TopicGrid)
      └─ Click topic card → /{section}/{topic}
          └─ Topic page shows with related articles
              └─ Click article → /articles/{slug}
```

## 📊 Data Structure

### Relationships
```
Subject
  └─ Section (via section.subject_id)
      └─ Topic (via topic.section_id)
          └─ Article (via article.topic_slug = topic.slug)
```

### Key Fields
- **article.topic_slug** - Links article to topic
- **article.section_slug** - Links article to section
- **article.subject_slug** - Links article to subject
- **article.published** - Must be true to show in UI
- **article.slug** - Unique identifier for URL

## 🎨 Article Features

### Auto-Generated Properties
When articles are created from topics:
- **Title**: Topic title + ": Full Guide"
- **Excerpt**: Topic blurb
- **Body**: Topic body (existing content)
- **Minutes**: Random 5-11 minutes
- **Tone**: Random color from palette
- **Image Key**: Inherited from section

### Admin Editing
Admins can edit articles via:
- `/admin/articles` - Article management
- Can change: title, excerpt, body, minutes, tone, status, published flag, etc.

## ✅ Testing Checklist

- [ ] Run the SQL migration to create articles
- [ ] Verify articles count matches topics
- [ ] Click a featured article on homepage → should open article page
- [ ] Click a subject category → should show sections
- [ ] Click a section → should show articles
- [ ] Click an article → should display full article
- [ ] Click a topic → should show topic page with articles
- [ ] Search works across all pages
- [ ] Sidebar links work
- [ ] Back buttons work
- [ ] Mobile navigation works

## 🔧 Admin Changes

Admins can modify articles at `/admin/articles`:

1. **Edit Individual Articles**
   - Click "Expand" on any article
   - Edit via Draft/Publish Manager
   - Update title, excerpt, body, etc.

2. **Bulk Upload**
   - Edit the seed SQL and rerun to update multiple articles
   - Or use admin interface for individual edits

3. **Publishing**
   - Articles must have `published = true` to show in UI
   - Status can be 'draft', 'review', or 'published'

## 📁 Files Changed/Created

### Created
- `entitles/seed-articles.sql` - Migration to create all articles
- `entitles/articles-data.sql` - Sample article data
- `src/routes/articles.$slug.tsx` - Article detail route
- `src/routes/$subject.$section.tsx` - Section detail route  
- `src/routes/$section.$topic.tsx` - Topic detail route

### Modified
- `entitles/articles.sql` - Added topic_slug field and index
- `src/lib/content.ts` - Added topic_slug to ArticleRow type
- `src/components/biopedia/FeaturedArticles.tsx` - Added links to articles
- `src/routes/_authenticated/admin.articles.tsx` - Added topic_slug field
- `src/routes/articles.tsx` - Updated to use links
- `src/routes/$subject.tsx` - Fixed section links

## 🚨 Troubleshooting

### Articles not showing?
1. Check if articles are published: `SELECT * FROM articles WHERE published = false LIMIT 5;`
2. Check if topic_slug matches: `SELECT DISTINCT topic_slug FROM articles;`
3. Check if articles have valid subject/section slugs

### Topics not opening?
1. Verify route `$section.$topic.tsx` exists
2. Check if topics have valid section_id
3. Check browser console for routing errors

### Links not working?
1. Verify routes are generated: `npm run dev` rebuilds routes
2. Check URL matches route pattern: `/{section}/{topic}`
3. Clear browser cache if needed

### Search not working?
1. Check if articles have title and excerpt
2. Verify search query is passed to component
3. Check browser console for errors

## 💡 Important Notes

### Topic Opening
Topics now open via their dedicated route `/{section}/{topic}`. The topic page displays:
- Topic title and description
- Topic body (rich content)
- Related articles for that topic
- Search functionality

### Article Opening  
Articles open via `/articles/{slug}`. The article page displays:
- Full article body
- Article metadata (minutes, subject, etc.)
- Article image
- Back navigation to articles list

### Deep Linking
All pages support deep linking:
- Direct URL: `/biology/human-biology/neurons` → Opens topic
- Direct URL: `/articles/neurons-guide` → Opens article
- Bookmarks and history work correctly

## 📚 Subject Structure

Each subject has sections with topics:

**Biology**
- Organisms (6+ topics)
- Cells & Microscopy (5+ topics)
- Human Biology (6+ topics)
- Genetics & DNA (6+ topics)
- Plants (6+ topics)
- Ecology & Environment (6+ topics)
- Evolution (6+ topics)
- Biological Processes (6+ topics)
- Anatomy (6+ topics)
- Biotechnology (6+ topics)

Similar structures for Mathematics, Science, English, History, Technology.

## 🎯 Next Steps

1. **Run Migration**: Execute `entitles/seed-articles.sql` in Supabase
2. **Test Navigation**: Try clicking through homepage → category → section → topic → article
3. **Admin Setup**: Configure admin user to edit articles
4. **Customization**: Update article titles, descriptions as needed
5. **Publishing**: Manage article status and publication

## 📞 Support

For issues:
1. Check the routing architecture in `ARCHITECTURE_DIAGRAM.md`
2. Verify database schema in `entitles/articles.sql`
3. Check component linking in specific route files
4. Review browser console for errors

---

**Status**: ✅ All routes implemented, databases updated, components linked, ready for article data loading.
