# Layout & Navigation Structure

## Overview

A comprehensive content layout system has been implemented with reusable components, improved card styling, and consistent navigation patterns. All links are now properly integrated throughout the sidebar, cards, and detail pages.

## Component Hierarchy

```
AppShell (Main Layout)
├── Sidebar (Navigation)
│   ├── Brand
│   ├── Nav Links (Home, Subjects, Content)
│   └── Study Tools
├── TopBar (Search + Controls)
├── Main Content Area
│   ├── Content (Page-specific)
│   └── Optional Rail (Right sidebar)
└── QuoteBar
```

## New Components Created

### 1. **ContentLayout** (`ContentLayout.tsx`)
A reusable layout component for article/topic detail pages with:
- Back navigation button
- Header section with title, description, and metadata
- Optional image display
- Subject/category badge
- Metadata display (read time, tone, etc.)
- Body content with prose styling
- Flexible children support for additional sections

**Usage:**
```tsx
<ContentLayout
  title={article.title}
  description={article.excerpt}
  image={imageUrl}
  backLink="/articles"
  backLabel="articles"
  subject={{ title: "Biology", slug: "biology" }}
  metadata={[
    { label: "Read Time", value: "5 min read" },
  ]}
  body={article.body}
/>
```

### 2. **ArticleCard** (`ArticleCard.tsx`)
Reusable article card component with:
- Responsive image with hover zoom effect
- Title and excerpt with truncation
- Read time display
- Bookmark toggle button
- Chevron indicator for link
- Three variants: `featured`, `default`, `compact`
- Full Link wrapping for navigation

**Props:**
- `article`: ArticleRow
- `saved`: boolean (bookmark state)
- `onBookmarkClick`: callback function
- `showBookmark`: boolean
- `showReadTime`: boolean
- `variant`: "featured" | "default" | "compact"
- `link`: custom link (defaults to `/articles/${slug}`)

**Variants:**
- **featured** (80px height): Homepage featured section
- **default** (160px height): Standard article grids
- **compact** (80px height): Minimal space display

### 3. **TopicCard** (`TopicCard.tsx`)
Reusable topic card component with:
- Responsive image with hover effect
- Gradient overlay on hover
- Title and blurb text
- Bookmark toggle button
- Chevron indicator for link
- Full Link wrapping for navigation

**Props:**
- `topic`: TopicRow
- `sectionSlug`: string
- `sectionImageKey`: string | null
- `saved`: boolean
- `onBookmarkClick`: callback
- `showBookmark`: boolean

## Updated Components

### FeaturedArticles
**Before:** Manual card rendering with Link elements  
**After:** Uses ArticleCard component with variant="featured"

```tsx
// Old approach (inline card rendering)
<Link to={`/articles/${a.slug}`}>
  <img src={...} />
  <h3>{a.title}</h3>
  ...
</Link>

// New approach (reusable component)
<ArticleCard article={a} saved={saved} onBookmarkClick={onToggleBookmark} variant="featured" />
```

### TopicGrid
**Before:** Manual card rendering with article element  
**After:** Uses TopicCard component with consistent styling

```tsx
// Old approach
<article className="flex flex-col...">
  <Link to={`/${sectionSlug}/${t.slug}`}>
    <img src={...} />
    <h3>{t.title}</h3>
  </Link>
</article>

// New approach
<TopicCard 
  topic={t} 
  sectionSlug={sectionSlug}
  sectionImageKey={section?.image_key}
  saved={saved}
  onBookmarkClick={toggleBookmark}
/>
```

### Article Detail Route (`articles.$slug.tsx`)
**Before:** Manual layout with AppShell and PageHeader  
**After:** Uses ContentLayout component

- Cleaner code
- Consistent styling
- Better metadata display
- Improved responsiveness

### Topic Detail Route (`$section.$topic.tsx`)
**Before:** Manual card rendering for articles  
**After:** Uses ArticleCard + ContentLayout

- Uses new ContentLayout for topic header
- Uses ArticleCard for related articles
- Improved visual hierarchy
- Better bookmark integration

### Section Detail Route (`$subject.$section.tsx`)
**Before:** Manual article card rendering  
**After:** Uses ArticleCard component

- Consistent article display
- Better styling
- Improved bookmark functionality

## Layout Structure Details

### AppShell Layout
```
┌─────────────────────────────────────────┐
│  Sidebar  │  TopBar (Search + Actions)  │
│           ├─────────────────────────────┤
│ • Home    │  Main Content Area          │
│ • Biology │  ┌───────────────────────┐  │
│ • Physics │  │  Page Content         │  │
│ • etc     │  │  (Articles/Topics)    │  │
│           │  │                       │  │
│ ────────  │  │  Optional Right Rail  │  │
│ Content   │  │  (Bookmarks/Related)  │  │
│ • All ...│  │                       │  │
│ • All P..│  ├───────────────────────┤  │
│           │  QuoteBar               │  │
│ ────────  │                         │  │
│ Tools     │                         │  │
└─────────────────────────────────────────┘
```

### Content Detail Layout
```
┌────────────────────────────────────────┐
│ ← Back Link                            │
├────────────────────────────────────────┤
│ Title (Large)                          │
│ Description/Excerpt                    │
│ [Subject Badge] [Other Metadata]       │
├────────────────────────────────────────┤
│                                        │
│  Featured Image (Full Width)          │
│                                        │
├────────────────────────────────────────┤
│ Content Body (Prose Styling)           │
├────────────────────────────────────────┤
│ Related Section                        │
│ • Article Card                         │
│ • Article Card                         │
│ • Article Card                         │
└────────────────────────────────────────┘
```

### Card Layouts

#### Article Card (Featured - 5 column grid)
```
┌──────────────┐
│   Image      │  80px height
├──────────────┤
│ Title        │
│ Excerpt...   │  
│              │
│ 5 min  [📌]  │  Footer with read time + bookmark
└──────────────┘
```

#### Article Card (Default - 3 column grid)
```
┌─────────────────────┐
│                     │
│     Image           │  160px height
│                     │
├─────────────────────┤
│ Title               │
│                     │
│ Excerpt text        │  
│ continues...        │
│                     │
│ 8 min read     [📌] │
└─────────────────────┘
```

#### Topic Card
```
┌──────────────────┐
│                  │
│  Image           │  112px height
│                  │
├──────────────────┤
│ Topic Title      │
│                  │
│ Topic blurb      │
│ text...          │
│                  │
│ [📌 Save] →      │  Footer with bookmark + link indicator
└──────────────────┘
```

## Navigation Flows

### Flow 1: Homepage → Featured Articles
```
Homepage (FeaturedArticles)
  └─ Displays: [ArticleCard variant="featured"] 
  └─ Clicking card → ArticleCard wraps entire card in Link
  └─ Navigates to: /articles/{article.slug}
  └─ Loads: Article Detail Page (ContentLayout)
```

### Flow 2: Homepage → Category → Section → Article
```
Homepage (CategoryGrid)
  └─ Displays: [Link to /{subject.slug}]
  └─ Navigates to: /biology (or other subject)
  
Subject Page ($subject.tsx)
  └─ Displays: [Link to /{subject}/{section.slug}]
  └─ Navigates to: /biology/organisms
  
Section Page ($subject.$section.tsx)
  └─ Displays: [ArticleCard] grid
  └─ Clicking card → ArticleCard Link wraps entire element
  └─ Navigates to: /articles/{article.slug}
  
Article Detail Page (articles.$slug.tsx)
  └─ Uses: ContentLayout component
  └─ Shows: Full article with metadata
```

### Flow 3: Sidebar → Subject → Topic → Article
```
Sidebar
  └─ Click Subject (e.g., "Biology")
  └─ Expands to show sections dropdown
  
Sidebar (Expanded)
  └─ Click Section (e.g., "Organisms")
  └─ Navigates to: /biology/organisms
  
Section Page ($subject.$section.tsx)
  └─ Shows Topics in TopicGrid
  └─ Click Topic → TopicCard Link wraps entire card
  └─ Navigates to: /{section.slug}/{topic.slug}
  
Topic Detail Page ($section.$topic.tsx)
  └─ Uses: ContentLayout for header
  └─ Shows: [ArticleCard] grid for related articles
  └─ Click Article → ArticleCard Link
  └─ Navigates to: /articles/{article.slug}
  
Article Detail Page
  └─ Uses: ContentLayout
  └─ Shows: Full article
```

### Flow 4: All Articles Page
```
/articles (articles.tsx)
  └─ Displays: [ArticleCard] grid (all articles)
  └─ Click card → ArticleCard Link
  └─ Navigates to: /articles/{article.slug}
  
Article Detail Page
  └─ Uses: ContentLayout
```

## Styling System

### Card Hover Effects
- **Border**: Border color transitions from `border-sidebar-border` → `border-primary/50`
- **Shadow**: Box shadow appears on hover for depth
- **Image**: Image scales 105% on hover with smooth transition
- **Title**: Title color transitions to primary on hover
- **Chevron**: Chevron icon shows and changes to primary color

### Link Indicators
- **Chevron Right** (→): Appears in article/topic cards to indicate clickability
- **Subject Badge**: Pill-style badge in header showing subject category
- **Back Link**: Arrow icon + text for navigation back to parent

### Prose Styling
- Uses Tailwind's `prose-sm` for body content
- Dark mode support with `dark:prose-invert`
- Maximum width constraint (`max-w-none`)
- Proper spacing and typography

## Responsive Design

### Mobile (< 640px)
- Single column grid for cards
- Sidebar hidden (nav in mobile menu)
- Full-width images
- Smaller text sizes
- Touch-friendly tap targets

### Tablet (640px - 1024px)
- Two column grid for cards
- Sidebar still hidden
- Medium images
- Adjusted spacing

### Desktop (> 1024px)
- Three column grid for articles
- Three column grid for topics
- Five column grid for featured articles
- Sidebar visible
- Full-width layout
- All interactive elements fully visible

## Linking Strategy

### Every card is fully clickable:
1. **ArticleCard**: Entire card is wrapped in `<Link>` element
2. **TopicCard**: Entire card is wrapped in `<Link>` element
3. **CategoryGrid**: Subject cards are `<Link>` elements
4. **Bookmark buttons**: Use `onClick` with `preventDefault` to avoid navigation

### Link targets:
- Article card → `/articles/{slug}`
- Topic card → `/{section}/{topic}`
- Section card → `/{subject}/{section}`
- Subject card → `/{subject}`
- Sidebar nav → Various based on item type

## Benefits of New Structure

✅ **Reusability**: ArticleCard and TopicCard used across multiple pages  
✅ **Consistency**: Same styling and interaction patterns everywhere  
✅ **Maintainability**: Changes to card layout apply globally  
✅ **Accessibility**: Proper link semantics with full card wrapping  
✅ **Performance**: Reusable components reduce code duplication  
✅ **Scalability**: Easy to add variants or modify behavior  
✅ **Visual Hierarchy**: Clear indication of clickable elements  
✅ **Mobile Friendly**: Responsive designs work on all sizes  

## Component Usage Examples

### Using ArticleCard
```tsx
import { ArticleCard } from "@/components/biopedia/ArticleCard";

// In a component:
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {articles.map((article) => (
    <ArticleCard
      key={article.id}
      article={article}
      saved={bookmarks.includes(article.slug)}
      onBookmarkClick={toggleBookmark}
      variant="default"
    />
  ))}
</div>
```

### Using TopicCard
```tsx
import { TopicCard } from "@/components/biopedia/TopicCard";

// In a component:
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {topics.map((topic) => (
    <TopicCard
      key={topic.id}
      topic={topic}
      sectionSlug="organisms"
      sectionImageKey={section?.image_key}
      saved={bookmarks.includes(`${sectionSlug}/${topic.slug}`)}
      onBookmarkClick={toggleBookmark}
    />
  ))}
</div>
```

### Using ContentLayout
```tsx
import { ContentLayout } from "@/components/biopedia/ContentLayout";

// In a detail page component:
<ContentLayout
  title={article.title}
  description={article.excerpt}
  image={resolveImage(article.image_url, article.image_key)}
  imageAlt={article.title}
  backLink="/articles"
  backLabel="articles"
  subject={{ title: subject.title, slug: subject.slug }}
  metadata={[
    { label: "Read Time", value: `${article.minutes} min read` },
    { label: "Category", value: article.tone },
  ]}
  body={article.body}
/>
```

---

## Summary

The new layout system provides a cohesive, reusable, and maintainable structure for displaying content throughout the application. All cards have proper links, consistent styling, and improved visual hierarchy. The sidebar and all navigation elements are fully integrated with proper link patterns.

**Everything is now production-ready and fully linked! 🎉**
