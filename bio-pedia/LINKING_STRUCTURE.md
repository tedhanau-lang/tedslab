# Complete Article & Topic Linking Structure

## Overview
All content is now fully linked and navigable through the following hierarchy:

```
Subjects → Sections → Topics → Articles
```

## Routes Created

### 1. **Subject Page** (`/$subject.tsx`)
- Displays all sections within a subject
- **URL**: `/{subject_slug}` (e.g., `/biology`)
- **Links To**: Sections via `/{subject_slug}/{section_slug}`
- **Data**: Subject title, description, sections with images

### 2. **Subject + Section Page** (`/$subject.$section.tsx`)
- Displays all articles within a section
- **URL**: `/{subject_slug}/{section_slug}` (e.g., `/biology/human-biology`)
- **Links To**: 
  - Back to subject: `/{subject_slug}`
  - Articles: `/articles/{article_slug}`
- **Data**: Section title, description, body, articles with images

### 3. **Section + Topic Page** (`/$section.$topic.tsx`)
- Displays topic details and related articles
- **URL**: `/{section_slug}/{topic_slug}` (e.g., `/human-biology/neurons`)
- **Links To**: 
  - Back to section: `/{section_slug}`
  - Articles: `/articles/{article_slug}`
- **Data**: Topic title, image, blurb, body, articles

### 4. **Article Detail Page** (`/articles/$slug.tsx`)
- Displays full article content
- **URL**: `/articles/{article_slug}` (e.g., `/articles/neurons`)
- **Links To**: Back to `/articles` page
- **Data**: Article title, image, subject, read time, full body content

### 5. **All Articles Page** (`/articles.tsx`)
- Shows all published articles
- **URL**: `/articles`
- **Links To**: Individual articles via `/articles/{article_slug}`
- **Features**: Search/filter by subject

## Data Model Updates

### ArticleRow Type (`src/lib/content.ts`)
Added `topic_slug` field to link articles to specific topics:
```typescript
export type ArticleRow = {
  ...
  subject_slug: string | null;
  section_slug: string | null;
  topic_slug: string | null;      // ← NEW
  ...
};
```

### Admin Articles Form (`src/routes/_authenticated/admin.articles.tsx`)
Added field for admins to assign articles to topics:
- `topic_slug` - Link article to specific topic

## Sidebar Navigation (`src/components/biopedia/Sidebar.tsx`)
Already configured to navigate:
1. **Subject Links**: Click subject → `/{subject_slug}`
2. **Section Links** (when expanded): Click section → `/{subject_slug}/{section_slug}`
3. **Topic Links** (via TopicGrid): Click topic → `/{section_slug}/{topic_slug}`

## Complete Navigation Flow

### Path 1: Via Sidebar
```
Sidebar Subject → /{subject_slug}
                  ↓
         Sidebar Section → /{subject_slug}/{section_slug}
                           ↓
                  Click Article → /articles/{slug}
```

### Path 2: Direct from Articles Page
```
/articles → Click Article Card → /articles/{slug}
```

### Path 3: Via Topics
```
/{section_slug}/{topic_slug} → Click Article → /articles/{slug}
```

### Path 4: From Section
```
/{subject_slug}/{section_slug} → Click Article → /articles/{slug}
```

## Database Schema

### Linking Fields:
- **subjects.slug** - Unique identifier for subject
- **sections.subject_id** - Links to subject
- **sections.slug** - Unique within subject
- **topics.section_id** - Links to section
- **topics.slug** - Unique within section
- **articles.subject_slug** - Links to subject
- **articles.section_slug** - Links to section
- **articles.topic_slug** - Links to topic ← NEW

## Generating Content

### Run the Article Generator Script
```bash
node scripts/generate-articles.mjs
```

This will:
1. Generate articles for every topic in the database
2. Assign each article to its topic via `topic_slug`
3. Create SQL insert statements ready to load into Supabase
4. Output to `/tmp/seed/generate-articles.sql`

### Content Distribution
- All subjects (Biology, Mathematics, Science, English, History, Technology)
- All sections within each subject
- All topics within each section
- One article per topic (extensible to multiple)

## Status
✅ All routes implemented  
✅ All types updated  
✅ Admin forms updated  
✅ No compilation errors  
✅ Sidebar navigation ready  
✅ Article generator script created  

## Next Steps
1. Run `node scripts/generate-articles.mjs` to generate articles
2. Load SQL into Supabase to populate database
3. Test navigation through all routes
4. Verify search/filter functionality
