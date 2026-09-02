# Quick Reference: Article & Topic System

## 🎯 What Was Changed

### New Routes Created
| Route | Purpose | URL Example |
|-------|---------|-------------|
| `$subject.$section.tsx` | Show all articles in a section | `/biology/human-biology` |
| `$section.$topic.tsx` | Show topic with related articles | `/human-biology/neurons` |
| `articles.$slug.tsx` | Show full article details | `/articles/neurons` |

### Type Updates
**ArticleRow** (`src/lib/content.ts`) - Added `topic_slug: string | null`

This allows articles to be linked to specific topics for better organization.

### Admin Updates
**Articles Admin** (`src/routes/_authenticated/admin.articles.tsx`) - Added `topic_slug` field

Admins can now assign each article to a topic when creating/editing.

## 📍 Navigation Paths

### Path 1: Sidebar → Subject → Section → Topic → Article
```
Sidebar (click "Biology")
  ↓ /{biology}
Subject Page (shows sections)
  ↓ Click "Human Biology" section
/{biology}/{human-biology}
Section Page (shows articles)
  ↓ Click article card
/articles/{article-slug}
```

### Path 2: Direct Articles List
```
Sidebar (click "All Articles")
  ↓ /articles
Articles Page (grid of all articles)
  ↓ Click article card
/articles/{article-slug}
```

### Path 3: Topic Deep Link
```
Direct URL: /{section}/{topic}
  ↓ /{human-biology}/{neurons}
Topic Page (shows topic + related articles)
  ↓ Click article
/articles/{article-slug}
```

## 🔗 URL Patterns

```
Subject:          /{subject_slug}
Section:          /{subject_slug}/{section_slug}
Topic:            /{section_slug}/{topic_slug}
Article:          /articles/{article_slug}
All Articles:     /articles
```

## 💾 Database Schema

### Articles Table - New Fields
```sql
ALTER TABLE articles ADD COLUMN topic_slug VARCHAR(255);

-- Foreign Key relationship
-- topic_slug should match topics.slug
```

### Query Examples
```sql
-- Get all articles for a topic
SELECT * FROM articles WHERE topic_slug = 'neurons';

-- Get all articles for a section
SELECT * FROM articles WHERE section_slug = 'human-biology';

-- Get all articles for a subject
SELECT * FROM articles WHERE subject_slug = 'biology';

-- Get published articles for a topic
SELECT * FROM articles 
WHERE topic_slug = 'neurons' AND published = true;
```

## 🛠️ Generating Content

### 1. Run Article Generator
```bash
node scripts/generate-articles.mjs
```

This generates:
- One article per topic
- Unique slugs combining section + topic
- Full article bodies with context
- Links to subject, section, topic
- Read times and tone colors

### 2. Output Location
```
/tmp/seed/generate-articles.sql
```

### 3. Load into Database
```bash
# Via psql
psql -h your-db-host -d your-db-name -f /tmp/seed/generate-articles.sql

# Or via Supabase dashboard
# Copy SQL content and execute
```

## 🧭 Component Usage

### TopicGrid Component
```tsx
import { TopicGrid } from "@/components/biopedia/TopicGrid";

<TopicGrid
  sectionSlug="human-biology"
  topics={[
    { id: "1", slug: "neurons", title: "Neurons", blurb: "..." }
  ]}
/>

// Automatically links to: /{section}/{topic}
```

### AppShell Component
```tsx
import { AppShell, PageHeader } from "@/components/biopedia/AppShell";

<AppShell>
  {(q) => (
    <>
      <PageHeader title="Topic" description="..." />
      {/* Content filtered by search query q */}
    </>
  )}
</AppShell>

// Provides:
// - Sidebar with all navigation
// - TopBar with search
// - Search callback function
```

## 🔍 Search Flow

1. User types in TopBar search
2. Query passed to all child routes
3. Each route filters its data:
   - Articles: By title + excerpt
   - Topics: By title + blurb
   - Sections: By title + description
4. Filtered results displayed instantly

## 📊 Data Hierarchy

```
Subject (6 total)
  ├─ Section (2-5 per subject)
  │   ├─ Topic (6+ per section)
  │   │   ├─ Article (1-many per topic) ← NEW
  │   │   └─ ...
  │   └─ ...
  └─ ...
```

## ✅ Testing Checklist

- [ ] Sidebar links to all subjects
- [ ] Subject page shows sections
- [ ] Section cards link to `/{subject}/{section}`
- [ ] Section page shows articles
- [ ] Article cards link to `/articles/{slug}`
- [ ] Topic page shows related articles
- [ ] Search works across all routes
- [ ] Back buttons work correctly
- [ ] Mobile navigation works
- [ ] Admin can set topic_slug on articles

## 🚀 Performance Notes

- Routes use React Query for data management
- Server-side data loading via loaders
- Search filtering is client-side
- Images are lazy-loaded
- Sidebar navigation is memoized

## 📝 File Locations Quick Map

```
New Routes:
  src/routes/$subject.$section.tsx
  src/routes/$section.$topic.tsx
  src/routes/articles.$slug.tsx

Updated:
  src/lib/content.ts (ArticleRow type)
  src/routes/_authenticated/admin.articles.tsx
  src/routes/articles.tsx (now has links)
  src/routes/$subject.tsx (fixed section links)

Generated:
  scripts/generate-articles.mjs

Documentation:
  LINKING_STRUCTURE.md
  ARCHITECTURE_DIAGRAM.md
  QUICK_REFERENCE.md (this file)
```

## 🐛 Debugging

### Article not showing in topic page?
- Check `article.topic_slug` matches `topic.slug`
- Verify `article.published = true`
- Check browser console for data loading errors

### Topic page loading slowly?
- Check database query performance
- Verify topic has articles assigned
- Check image optimization settings

### Search not working?
- Verify search query is being passed
- Check that articles have title/excerpt
- Clear browser cache

## 📞 API Hooks

```typescript
import { useArticles, useSections, useTopics, useSubjects } from "@/lib/content";

// In components:
const { data: articles = [], isLoading } = useArticles();
const { data: sections = [] } = useSections();
const { data: topics = [] } = useTopics();
const { data: subjects = [] } = useSubjects();
```

## 🎨 Styling Classes

Common classes used in article/topic components:
- `bio-panel` - Card styling
- `prose prose-sm` - Article body typography
- `text-sm font-semibold` - Headers
- `text-xs text-muted-foreground` - Metadata
- `transition-colors hover:border-primary/50` - Interactive states
