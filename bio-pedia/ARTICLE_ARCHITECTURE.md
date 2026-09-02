# Article Generation & Linking System - Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARTICLE GENERATION SYSTEM                    │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ INPUT: Topics (in Database)                                      │
│  - biology/organisms/animal-kingdom                              │
│  - biology/cells-microscopy/mitochondria                         │
│  - etc. (~100+ topics)                                           │
└──────────────────────────────────────────────────────────────────┘
                              ↓
                   ┌──────────┴──────────┐
                   │ GENERATE ARTICLES   │
                   │ (Choose One Method) │
                   └──────────┬──────────┘
                   ↙            ↓           ↖
        ┌──────────────┐  ┌──────────┐  ┌───────────┐
        │  SQL Script  │  │ Admin UI │  │ Node Cmd  │
        │  Supabase    │  │ Button   │  │ Script    │
        │  SQL Editor  │  │ /admin   │  │ Terminal  │
        └──────────────┘  └──────────┘  └───────────┘
                              ↓
    ┌─────────────────────────────────────────────────────────┐
    │ OUTPUT: Articles Table (in Database)                    │
    │ ┌──────────────────────────────────────────────────┐    │
    │ │ id   │ slug           │ title                    │    │
    │ ├──────┼────────────────┼────────────────────────┤    │
    │ │ ... │ organisms-... │ Animal Kingdom Guide  │    │
    │ │ ... │ cells-...      │ Mitochondria Guide    │    │
    │ │ ... │ genetics-...   │ DNA Replication Guide │    │
    │ │ ... │ ...            │ ...                    │    │
    │ └──────────────────────────────────────────────────┘    │
    │                     ↓                                    │
    │ │ topic_slug │ published │ subject_slug │ minutes │     │
    │ ├────────────┼───────────┼──────────────┼─────────┤     │
    │ │ animal-... │ true      │ biology      │ 7       │     │
    │ │ mitochondr │ true      │ biology      │ 6       │     │
    │ │ dna-repli... │ true     │ biology      │ 8       │     │
    │ └──────────────────────────────────────────────────┘    │
    └─────────────────────────────────────────────────────────┘
                              ↓
    ┌─────────────────────────────────────────────────────────┐
    │ USER INTERFACE: Article Display                         │
    │                                                         │
    │ Route: /articles                                        │
    │ ┌─────────────────────────────────────────────────────┐ │
    │ │  All Articles Grid (ArticleCard)                   │ │
    │ │  ┌────────────┐ ┌────────────┐ ┌────────────┐    │ │
    │ │  │ Animal ... │ │ Mitochondr │ │ DNA Replic │... │ │
    │ │  │ [image]    │ │ [image]    │ │ [image]    │    │ │
    │ │  │ 7 min read │ │ 6 min read │ │ 8 min read │    │ │
    │ │  └────────────┘ └────────────┘ └────────────┘    │ │
    │ │        ↓ Click                        ↓ Click      │ │
    │ └─────────────────────────────────────────────────────┘ │
    │                                                         │
    │ Route: /articles/{slug}                               │
    │ ┌─────────────────────────────────────────────────────┐ │
    │ │  Article Detail Page                               │ │
    │ │  ┌─────────────────────────────────────────────┐   │ │
    │ │  │ Title: Animal Kingdom: Full Guide           │   │ │
    │ │  │ [Header Image]                              │   │ │
    │ │  │ Article Content Body...                     │   │ │
    │ │  │ More content...                             │   │ │
    │ │  └─────────────────────────────────────────────┘   │ │
    │ │  ┌─────────────────────────────────────────────┐   │ │
    │ │  │ Related Articles                            │   │ │
    │ │  │ (Same topic_slug)                           │   │ │
    │ │  │ ┌──────────┐ ┌──────────┐ ┌──────────┐     │   │ │
    │ │  │ │ Article2 │ │ Article3 │ │ Article4 │... │   │ │
    │ │  │ └──────────┘ └──────────┘ └──────────┘     │   │ │
    │ │  │    ↓ Click                      ↓ Click    │   │ │
    │ │  └─────────────────────────────────────────────┘   │ │
    │ └─────────────────────────────────────────────────────┘ │
    │        ↓ Loop: Click related → New article → ...        │
    │                                                         │
    │ Route: /admin/articles                                 │
    │ ┌─────────────────────────────────────────────────────┐ │
    │ │  Admin Panel                                        │ │
    │ │  ┌─────────────────────────────────────────────┐   │ │
    │ │  │ [Generate Articles] Button                  │   │ │
    │ │  │ Status: ✅ Created 200 articles            │   │ │
    │ │  │ Total: 200 | Published: 200                │   │ │
    │ │  └─────────────────────────────────────────────┘   │ │
    │ │  ┌─────────────────────────────────────────────┐   │ │
    │ │  │ Article 1 [Expand] Edit Publish/Draft ✓   │   │ │
    │ │  │ Article 2 [Expand] Edit Publish/Draft ✓   │   │ │
    │ │  │ Article 3 [Expand] Edit Publish/Draft ✓   │   │ │
    │ │  └─────────────────────────────────────────────┘   │ │
    │ └─────────────────────────────────────────────────────┘ │
    └─────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        React Components                          │
└──────────────────────────────────────────────────────────────────┘

AppShell (Wrapper)
  │
  ├─ ArticlesPage (/articles)
  │   └─ ArticleCard (Reusable)
  │       ├─ Image
  │       ├─ Title
  │       ├─ Excerpt
  │       ├─ Read time
  │       ├─ Tone badge
  │       └─ Link to /articles/{slug}
  │
  ├─ ArticleDetailPage (/articles/{slug})
  │   └─ ContentLayout
  │       ├─ Header
  │       ├─ Image
  │       ├─ Article body
  │       └─ RelatedArticles ✨
  │           └─ ArticleCard (Grid)
  │               ├─ Queries DB: topic_slug match
  │               ├─ Displays up to 9 articles
  │               └─ Each card links to /articles/{slug}
  │
  └─ AdminPageShell (/admin/articles)
      ├─ GenerationStatusUI
      ├─ "Generate Articles" Button
      │   ├─ Creates articles from topics
      │   ├─ Handles duplicates
      │   └─ Shows status/counts
      └─ ArticleListUI
          ├─ Lists all articles
          ├─ Edit options
          └─ Publish/Draft toggle
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       Data Flow Diagram                         │
└─────────────────────────────────────────────────────────────────┘

GENERATION PHASE:
─────────────────

Topics Table
    │
    ├─→ generateArticles() function
    │   ├─ Get all topics
    │   ├─ Create article for each topic
    │   ├─ Set topic_slug = topic.slug
    │   └─ Mark published = true
    │
    └─→ Articles Table (Populated)


DISPLAY PHASE:
──────────────

User visits /articles
    │
    └─→ useArticles() hook
        ├─ Fetches all published articles
        └─→ ArticlesPage component
            ├─ Filters articles
            └─→ ArticleCard components
                └─ Each card links to /articles/{slug}

User clicks article card
    │
    └─→ Navigate to /articles/{slug}
        ├─ ArticleDetailPage loads
        └─→ ContentLayout displays
            ├─ Article header/image/body
            └─→ RelatedArticles component
                ├─ Queries: articles WHERE topic_slug = current.topic_slug
                └─→ ArticleCard components (grid)
                    ├─ User sees related articles
                    └─ Clicking card loops back to step 1


LINKING MECHANISM:
──────────────────

Database Relationship:
  topics.slug ←→ articles.topic_slug

Query Logic:
  SELECT * FROM articles
  WHERE topic_slug = current_article.topic_slug
    AND slug != current_article.slug
    AND published = true
  LIMIT 9

Component Logic:
  RelatedArticles()
    ├─ Gets current article's topic_slug
    ├─ Finds all articles with same topic_slug
    ├─ Filters out current article
    ├─ Renders as ArticleCard grid
    └─ User clicks any card
        └─ Navigates to new article
            └─ Loop continues...
```

## File Organization

```
src/
├── routes/
│   ├── articles.tsx
│   │   └─ /articles page
│   │     └─ Uses: ArticleCard, useArticles()
│   │
│   ├── articles.$slug.tsx
│   │   └─ /articles/{slug} page
│   │     └─ Uses: ContentLayout, RelatedArticles, useArticles()
│   │
│   └── _authenticated/
│       └── admin.articles.tsx
│           └─ /admin/articles page
│             └─ Uses: Admin UI, Generate button, useArticles()
│
├── components/biopedia/
│   ├── ArticleCard.tsx
│   │   └─ Reusable article card component
│   │     └─ Props: article, variant, showBookmark, etc.
│   │
│   ├── RelatedArticles.tsx ✨ (NEW)
│   │   └─ Displays related articles on detail pages
│   │     └─ Filters by topic_slug, renders ArticleCard grid
│   │
│   └── ContentLayout.tsx
│       └─ Article detail page template
│         └─ Accepts children (for RelatedArticles)
│
└── lib/
    └── content.ts
        └─ useArticles() hook
          └─ Fetches articles from Supabase


entitles/
├── articles.sql
│   └─ Table schema (id, slug, title, topic_slug, etc.)
│
└── seed-articles-comprehensive.sql ✨ (NEW)
    └─ SQL INSERT query to create articles from topics


scripts/
└── seed-and-verify-articles.mjs ✨ (NEW)
    └─ Node.js script for article generation


Documentation/
├── ARTICLE_QUICK_START.md ✨ (NEW)
├── ARTICLE_GENERATION_GUIDE.md ✨ (NEW)
├── ARTICLE_IMPLEMENTATION_SUMMARY.md ✨ (NEW)
└── ARTICLES_READY.md ✨ (NEW)
```

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                      User Journey Map                           │
└─────────────────────────────────────────────────────────────────┘

DISCOVERY:
──────────
User visits homepage
  → Sees featured articles section
    → Clicks on article card
      → Navigates to /articles/{slug}
        → Sees article detail page
          → Scrolls down
            → Finds "Related Articles" section ✨
              → Discovers more content on same topic


EXPLORATION:
────────────
User on /articles (all articles page)
  → Sees grid of all articles
    → Uses search to filter
      → Clicks matching article
        → Goes to /articles/{slug}
          → Reads article
            → Finds related articles below
              → Clicks related article
                → Navigates to new article
                  → Process repeats (loop)


ADMIN WORKFLOW:
───────────────
Admin logs in
  → Goes to /admin/articles
    → Sees "Generate Articles" button
      → Clicks "Generate Articles"
        → Status shows "Generating..."
          → ✅ Success: "Created 200 articles"
            → Lists all articles
              → Can expand and edit any article
                → Changes appear immediately on site


LINKING IN ACTION:
──────────────────
Article A (topic: "photosynthesis")
  ↓ RelatedArticles component finds articles with same topic_slug
  ├→ Article B (topic: "photosynthesis") ✓ Linked
  ├→ Article C (topic: "photosynthesis") ✓ Linked
  ├→ Article D (topic: "photosynthesis") ✓ Linked
  └→ (Up to 6-9 related articles shown)

User clicks Article B
  ↓ Navigate to /articles/article-b-slug
  ↓ RelatedArticles component finds articles with same topic_slug
  ├→ Article A ✓ Linked
  ├→ Article C ✓ Linked
  ├→ Article D ✓ Linked
  └→ (Same topic, different main article)

Seamless topic-based navigation! 🔗
```

## Key Metrics After Generation

```
┌─────────────────────────────────────────────────────────────────┐
│                   Expected Results After                        │
│               Article Generation (by subject)                   │
└─────────────────────────────────────────────────────────────────┘

Biology:        ~60-80 articles
Mathematics:    ~20-30 articles
Science:        ~30-40 articles
English:        ~20-30 articles
History:        ~20-30 articles
Technology:     ~15-25 articles
─────────────────────────────
TOTAL:          ~165-235 articles

All articles:
  ✓ Published (visible on site)
  ✓ Linked to topics (topic_slug set)
  ✓ Sorted properly (sort field set)
  ✓ Have content (title, excerpt, body from topics)
  ✓ Have metadata (read time, tone, subject)

Each article generates:
  ✓ Article card on /articles page
  ✓ Detail page at /articles/{slug}
  ✓ Related articles connections (to 6-9 other articles)
  ✓ Admin management interface
  ✓ Full CRUD capabilities via admin panel
```

---

## Summary: Complete System Architecture ✨

The article generation and linking system consists of:

1. **Generation Layer** - Creates articles from topics (SQL, Node, or Admin UI)
2. **Storage Layer** - Articles table with topic_slug linking field
3. **Display Layer** - ArticleCard components shown in grid layouts
4. **Navigation Layer** - RelatedArticles component creates topic-based connections
5. **Management Layer** - Admin panel for CRUD operations

**Result**: Seamless topic-based article discovery with automatic linking! 🎉
