# Article & Topic Linking - Architecture Diagram

## Complete Navigation Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         SIDEBAR                                 │
│                                                                 │
│  [Logo] → / (Home)                                              │
│  [Home]                                                         │
│                                                                 │
│  SUBJECTS                                                       │
│  ├─ 🧬 Biology              → /{biology}                        │
│  │  ├─ Human Biology        → /{biology}/{human-biology}       │
│  │  │  ├─ Neurons           → /{human-biology}/{neurons}       │
│  │  │  │   → /articles/{article-slug}                          │
│  │  │  ├─ Immune System     → /{human-biology}/{immune}        │
│  │  │  └─ ...                                                  │
│  │  ├─ Organisms           → /{biology}/{organisms}            │
│  │  │  ├─ Animal Adaptations                                   │
│  │  │  └─ ...                                                  │
│  │  └─ ... (more sections)                                     │
│  ├─ 🔢 Mathematics          → /{mathematics}                   │
│  ├─ ⚛️  Science             → /{science}                        │
│  ├─ 📚 English             → /{english}                        │
│  ├─ 🏛️  History            → /{history}                        │
│  └─ 💻 Technology          → /{technology}                     │
│                                                                 │
│  CONTENT                                                        │
│  ├─ All Articles            → /articles                        │
│  └─ All Pages               → /pages                           │
│                                                                 │
│  STUDY TOOLS                                                    │
│  ├─ Notebook                → /notebook                        │
│  ├─ Flashcards             → /flashcards                      │
│  ├─ Saved Content           → /saved                           │
│  └─ Create Custom List      → /custom-lists                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    ROUTE ARCHITECTURE                            │
│                                                                  │
│  /$subject                                                       │
│    Display subject overview + all sections                       │
│    └─ (click section card)                                       │
│       │                                                          │
│  /$subject/$section                                              │
│    Display section overview + all articles in section            │
│    ├─ (back button) → /$subject                                  │
│    └─ (click article card) → /articles/{slug}                   │
│       │                                                          │
│  /$section/$topic                                                │
│    Display topic details + related articles                      │
│    ├─ (back button) → /$section                                  │
│    └─ (click article card) → /articles/{slug}                   │
│       │                                                          │
│  /articles/{slug}                                                │
│    Display full article with title, image, body                  │
│    └─ (back button) → /articles                                  │
│                                                                  │
│  /articles                                                       │
│    Display all published articles                                │
│    └─ (click article) → /articles/{slug}                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     DATA RELATIONSHIPS                           │
│                                                                  │
│  Subject                                                         │
│    ├─ id                                                         │
│    ├─ slug (unique)                                              │
│    ├─ title                                                      │
│    └─ description                                                │
│       │                                                          │
│       └─→ Section (subject_id)                                   │
│            ├─ id                                                 │
│            ├─ slug (unique within subject)                       │
│            ├─ title                                              │
│            ├─ description                                        │
│            └─ body                                               │
│               │                                                  │
│               └─→ Topic (section_id)                             │
│                    ├─ id                                         │
│                    ├─ slug (unique within section)               │
│                    ├─ title                                      │
│                    ├─ blurb                                      │
│                    └─ body                                       │
│                       │                                          │
│                       └─→ Article (topic_slug) ← NEW             │
│                            ├─ id                                 │
│                            ├─ slug (unique)                      │
│                            ├─ title                              │
│                            ├─ excerpt                            │
│                            ├─ body                               │
│                            ├─ subject_slug (FK)                  │
│                            ├─ section_slug (FK)                  │
│                            └─ topic_slug (FK) ← NEW              │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    NAVIGATION EXAMPLES                           │
│                                                                  │
│  EXAMPLE 1: Via Sidebar                                          │
│  1. Click "Biology" in sidebar                                   │
│     → Navigate to /biology                                       │
│  2. Expand "Human Biology" section                               │
│     → Breadcrumb/button takes you to /biology/human-biology      │
│  3. See topics listed, click "Neurons"                           │
│     → Navigate to /human-biology/neurons (via TopicGrid)         │
│  4. Click article card "Neurons: Communication Network"          │
│     → Navigate to /articles/neurons                              │
│  5. Read article, click "Back to articles"                       │
│     → Return to /articles                                        │
│                                                                  │
│  EXAMPLE 2: Via Direct Article Search                            │
│  1. Click "All Articles" in sidebar                              │
│     → Navigate to /articles                                      │
│  2. Search for "neurons"                                         │
│  3. Click matching article card                                  │
│     → Navigate to /articles/neurons                              │
│  4. Read article with full context                               │
│                                                                  │
│  EXAMPLE 3: Via Topic Deep Link                                  │
│  1. Direct URL access: /biology/human-biology                    │
│     → See all articles in section                                │
│  2. Or: /human-biology/neurons                                   │
│     → See topic details + related articles                       │
│  3. Click any article                                            │
│     → Navigate to /articles/{slug}                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       FILE LOCATIONS                             │
│                                                                  │
│  Route Files:                                                    │
│  ├─ src/routes/$subject.tsx              (Subject overview)      │
│  ├─ src/routes/$subject.$section.tsx     (Section + Articles)    │
│  ├─ src/routes/$section.$topic.tsx       (Topic + Articles)      │
│  ├─ src/routes/articles.tsx              (All articles)          │
│  └─ src/routes/articles.$slug.tsx        (Article detail)        │
│                                                                  │
│  Component Files:                                                │
│  ├─ src/components/biopedia/Sidebar.tsx  (Navigation)            │
│  ├─ src/components/biopedia/TopicGrid.tsx (Topic cards)          │
│  └─ src/components/biopedia/AppShell.tsx (Layout wrapper)        │
│                                                                  │
│  Type/Hooks:                                                     │
│  ├─ src/lib/content.ts                   (Data types + hooks)    │
│  └─ src/lib/images.ts                    (Image resolution)      │
│                                                                  │
│  Admin:                                                          │
│  └─ src/routes/_authenticated/admin.articles.tsx (Article CMS)   │
│                                                                  │
│  Scripts:                                                        │
│  └─ scripts/generate-articles.mjs        (Data generation)       │
│                                                                  │
│  Documentation:                                                  │
│  └─ LINKING_STRUCTURE.md                 (This guide)            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Search & Filter Flow

```
User enters search query in TopBar
         ↓
Query passed to AppShell (query: string)
         ↓
Passed to child route component as callback
         ↓
Each route filters its data based on query:
  - Articles: title + excerpt
  - Topics: title + blurb
  - Sections: title + description
         ↓
Filtered results displayed instantly
```

## Key Implementation Details

### URL Structure
- Subjects: `/{subject_slug}` (e.g., `/biology`)
- Sections: `/{subject_slug}/{section_slug}` (e.g., `/biology/human-biology`)
- Topics: `/{section_slug}/{topic_slug}` (e.g., `/human-biology/neurons`)
- Articles: `/articles/{article_slug}` (e.g., `/articles/neurons`)

### Data Generation
Run this command to generate all articles:
```bash
node scripts/generate-articles.mjs
```

This creates one article per topic with:
- Unique slug combining section + topic slug
- Full article body based on topic information
- Links to subject, section, and topic
- Randomized read time (4-11 minutes)
- Randomized tone color for visual variety

### Performance Optimization
- Server-side data loading with React Query
- Initial data passed via loader
- Optimistic UI updates
- Search filtering happens client-side
- Lazy loading of images
