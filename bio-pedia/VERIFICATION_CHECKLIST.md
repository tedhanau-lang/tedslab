# ✅ Implementation Checklist & Verification

## Phase 1: Database Setup

- [ ] **Add topic_slug field to articles table**
  ```sql
  -- Should already exist in articles.sql schema
  -- Verify: \d articles (shows all columns including topic_slug)
  ```

- [ ] **Load article seed data**
  ```sql
  -- File: entitles/seed-articles.sql
  -- Copy entire SQL and run in Supabase SQL Editor
  -- Or: psql -f entitles/seed-articles.sql
  ```

- [ ] **Verify data loaded**
  ```sql
  SELECT COUNT(*) as total_articles, 
         COUNT(DISTINCT topic_slug) as topics_with_articles,
         COUNT(DISTINCT section_slug) as sections_covered
  FROM articles WHERE published = true;
  
  -- Expected: ~200+ articles, ~180+ topics, ~60+ sections
  ```

## Phase 2: Routes Verification

- [ ] **Check routes file exists**
  - [ ] `src/routes/$section.$topic.tsx` - ✅ Created
  - [ ] `src/routes/articles.$slug.tsx` - ✅ Created  
  - [ ] `src/routes/$subject.$section.tsx` - ✅ Created

- [ ] **No compilation errors**
  ```bash
  npm run dev
  # Check terminal for "No errors" message
  ```

- [ ] **Routes are registered**
  - [ ] Can navigate to `http://localhost:5173/biology`
  - [ ] Can navigate to `http://localhost:5173/biology/human-biology`
  - [ ] Can navigate to `http://localhost:5173/human-biology/neurons` (once data loaded)
  - [ ] Can navigate to `http://localhost:5173/articles` (once articles created)

## Phase 3: Component Updates

- [ ] **FeaturedArticles component has links**
  - File: `src/components/biopedia/FeaturedArticles.tsx`
  - Should wrap articles in `<Link to={`/articles/${a.slug}`}>`
  - ✅ Already updated

- [ ] **CategoryGrid has links**
  - File: `src/components/biopedia/CategoryGrid.tsx`
  - Links to `/${c.slug}` (subject pages)
  - ✅ Already working

- [ ] **TopicGrid has links**
  - File: `src/components/biopedia/TopicGrid.tsx`
  - Links to `/${sectionSlug}/${t.slug}` (topic pages)
  - ✅ Already working

## Phase 4: Navigation Testing

### Homepage Testing
- [ ] Homepage loads without errors
- [ ] **Featured Articles section**
  - [ ] Shows article cards
  - [ ] Cards are clickable (hover shows pointer)
  - [ ] Click opens article page (`/articles/{slug}`)
  - [ ] Article page displays full content
  - [ ] "Back to articles" button works

- [ ] **Explore by Category section**
  - [ ] Shows subject cards
  - [ ] Click opens subject page (`/{subject}`)
  - [ ] Subject page shows sections

- [ ] **All Articles button**
  - [ ] Clicking opens `/articles`
  - [ ] Page shows all published articles
  - [ ] Each article card is clickable

### Sidebar Navigation Testing
- [ ] Sidebar appears on all pages
- [ ] **Subject links** work
  - [ ] Click "Biology" → `/biology`
  - [ ] Click "Mathematics" → `/mathematics`
  - [ ] etc.

- [ ] **Section expansion works**
  - [ ] Expand "Biology" → shows sections
  - [ ] Click section → `/biology/organisms`
  - [ ] Section page shows articles

- [ ] **All Articles link**
  - [ ] Click "All Articles" → `/articles`
  - [ ] Shows all published articles

### Topic Navigation Testing
- [ ] **Via subject section**
  - [ ] Go to `/biology/organisms`
  - [ ] See topic cards (Animal Kingdom, Fungi, etc.)
  - [ ] Click topic → `/organisms/animal-kingdom`
  - [ ] Topic page loads with content

- [ ] **Via sidebar (when expanded)**
  - [ ] Expand biology section
  - [ ] Click organism subsection
  - [ ] Shows topics with animals, fungi, etc.

- [ ] **Direct deep link**
  - [ ] Visit `/organisms/animal-kingdom` directly
  - [ ] Page loads correctly

### Article Navigation Testing
- [ ] **Via Featured Articles**
  - [ ] Homepage featured articles are clickable
  - [ ] Click → `/articles/{slug}`
  - [ ] Article page shows full content

- [ ] **Via All Articles page**
  - [ ] Go to `/articles`
  - [ ] See grid of all articles
  - [ ] Click any article → opens correctly

- [ ] **Via Topic page**
  - [ ] Go to `/organisms/animal-kingdom`
  - [ ] See "Articles" section with related articles
  - [ ] Click article → `/articles/organisms-animal-kingdom`

- [ ] **Direct deep link**
  - [ ] Visit `/articles/organisms-animal-kingdom` directly
  - [ ] Article loads correctly

## Phase 5: Search & Filter Testing

- [ ] **Search on homepage**
  - [ ] Type in search bar
  - [ ] Featured articles filtered
  - [ ] Categories filtered
  - [ ] Clear search → shows all

- [ ] **Search on `/articles` page**
  - [ ] Type in search bar
  - [ ] Articles filtered by title/excerpt
  - [ ] Results update instantly

- [ ] **Search on section pages**
  - [ ] Go to `/biology/organisms`
  - [ ] Type in search bar
  - [ ] Topics filtered
  - [ ] Articles filtered

- [ ] **Search on topic page**
  - [ ] Go to `/organisms/animal-kingdom`
  - [ ] Type in search bar
  - [ ] Related articles filtered

## Phase 6: Links & Back Navigation

- [ ] **Back buttons work**
  - [ ] Article page → "Back to articles" → `/articles`
  - [ ] Topic page → "Back to..." → section page
  - [ ] Section page → "Back to..." → subject page

- [ ] **Breadcrumb navigation**
  - [ ] Can navigate back multiple levels
  - [ ] URLs correctly reflect hierarchy

- [ ] **Browser back button**
  - [ ] Browser back/forward works correctly
  - [ ] History preserved

## Phase 7: Admin Testing

- [ ] **Admin login**
  - [ ] Go to `/auth`
  - [ ] Login with admin credentials
  - [ ] Successfully authenticated

- [ ] **Admin dashboard**
  - [ ] Go to `/admin`
  - [ ] See dashboard with stats
  - [ ] Stats show correct article count

- [ ] **Admin article editor**
  - [ ] Go to `/admin/articles`
  - [ ] See list of articles
  - [ ] Can expand an article
  - [ ] Can edit article details
  - [ ] Can change published status
  - [ ] Changes save correctly
  - [ ] Changes visible on published site

## Phase 8: Mobile Testing

- [ ] **Responsive layout**
  - [ ] Resize to mobile (375px wide)
  - [ ] Sidebar collapses/hides
  - [ ] All content readable
  - [ ] All buttons clickable

- [ ] **Touch navigation**
  - [ ] Cards are large enough to tap
  - [ ] Links have proper tap targets
  - [ ] No horizontal scroll needed

- [ ] **Mobile search**
  - [ ] Search bar accessible
  - [ ] Keyboard appears when needed
  - [ ] Search works correctly

## Phase 9: Data Verification

- [ ] **Article count per subject**
  ```sql
  SELECT subject_slug, COUNT(*) 
  FROM articles 
  GROUP BY subject_slug 
  ORDER BY subject_slug;
  ```
  Expected: Biology ~60, Math ~30, Science ~36, English ~30, History ~30, Tech ~30+

- [ ] **All articles published**
  ```sql
  SELECT COUNT(*) FROM articles WHERE published = false;
  ```
  Expected: 0 (or minimal draft articles)

- [ ] **All articles linked to topics**
  ```sql
  SELECT COUNT(*) FROM articles WHERE topic_slug IS NULL;
  ```
  Expected: 0

- [ ] **All topics have articles**
  ```sql
  SELECT COUNT(DISTINCT topic_slug) 
  FROM articles 
  WHERE topic_slug IS NOT NULL;
  ```
  Should match approximate topic count

## Phase 10: Performance Testing

- [ ] **Page loads quickly**
  - [ ] Homepage loads in < 2 seconds
  - [ ] Article pages load in < 1 second
  - [ ] No loading jank or delays

- [ ] **Search is responsive**
  - [ ] Typing in search updates results instantly
  - [ ] No lag on filtering

- [ ] **Images load**
  - [ ] Article images appear
  - [ ] Section images appear
  - [ ] No broken image links

## Sign-Off Checklist

### Before Production
- [ ] All automated tests pass
- [ ] No console errors in dev tools
- [ ] No TypeScript errors
- [ ] Database backup created
- [ ] SQL migration backed up

### After Deployment
- [ ] Test on production URL
- [ ] Admin can edit articles
- [ ] Search works on production
- [ ] All navigation works
- [ ] Mobile version works
- [ ] Analytics tracking works (if applicable)

## Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Routes not working | Run `npm run dev` to regenerate routes |
| Articles not showing | Check `published = true` in DB |
| Topic pages 404 | Verify `$section.$topic.tsx` exists |
| Links broken | Check URL pattern matches route |
| Search not working | Clear browser cache, restart dev server |
| Images not loading | Check image_key and resolveImage function |

## Support Scripts

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild routes
npm run dev

# Check TypeScript errors
npm run type-check

# Check ESLint errors
npm run lint

# Rebuild everything
npm install && npm run dev
```

## Completion

✅ When all checkboxes are marked:
- Topics can be opened and viewed
- Articles can be opened and viewed
- Complete navigation from homepage to articles works
- Admin can edit all content
- System is production-ready
- Users can explore content through multiple paths

---

**Last Updated**: 2026-08-14  
**Status**: Ready for testing
