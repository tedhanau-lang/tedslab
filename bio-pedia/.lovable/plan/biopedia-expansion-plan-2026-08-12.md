# BioPedia Expansion Plan

## Goal
Transform the remixed biology encyclopedia into a multi-subject learning platform (History, English, Mathematics, Science, Technology, plus Biology) with a working admin area where the admin can edit pages, articles, banners, videos, images, and navigation.

## Phase 1 — Foundation & Data Model
1. Restructure the database so Biology is one subject alongside History, English, Mathematics, Science, and Technology.
2. Add/update tables: `subjects`, `sections`, `topics`, `articles`, `pages`, `hero_slides`, `videos`, `nav_links`, `site_settings`, `profiles`, `user_roles`.
3. Ensure RLS policies already support admin-only writes and public reads.
4. Confirm the `handle_new_user` trigger auto-assigns the `admin` role to `admin@tedslab.learn`.
5. Replace the static `src/lib/biopedia-data.ts` and `src/lib/biopedia-sections.ts` content with database-driven queries, while keeping the existing UI components.

## Phase 2 — Content Seeding
1. Seed the six subjects with sections and topics.
2. Move existing biology topics under the Biology subject/section in the sidebar.
3. Create 24 hero slides (4 per subject) with distinct images and copy.
4. Add sample articles, pages, and videos for each subject so every page has real content.
5. Add site settings for brand name, logo URL, and favicon URL.

## Phase 3 — Auth & Admin Shell
1. Build `/auth` login page (email/password + Google) using the existing Supabase integration.
2. Create a protected `_authenticated/admin` route subtree.
3. Build an admin dashboard shell with navigation to:
   - Content editor (articles, pages, topics, sections, subjects)
   - Banner/slide manager
   - Video manager
   - Navigation links editor
   - Site settings editor
   - User/profile monitor (read-only for admins)

## Phase 4 — Admin Editing Features
1. **Content editor**: create/update/delete subjects, sections, topics, articles, and pages with live previews.
2. **Image uploads**: integrate Supabase Storage (`media` bucket) for subject/section/topic/article/page/hero images.
3. **Banner manager**: edit the 24 hero slides, swap images, set links.
4. **Video manager**: add/edit video entries with title, description, URL, poster, and subject association.
5. **Navigation editor**: edit sidebar and top nav links.
6. **Site settings editor**: update brand name, logo, favicon, and footer text.
7. **User monitor**: admin read-only view of `profiles` and `user_roles`.

## Phase 5 — Public Site Updates
1. Update the sidebar to group links by subject (Biology, History, English, Mathematics, Science, Technology).
2. Update the home page hero to pull slides from `hero_slides`.
3. Make category/topic cards link to real detail pages.
4. Create a `/videos` page listing all videos and a `/video/$slug` detail page.
5. Apply custom favicon and logo from site settings.
6. Ensure every public route has unique `head()` metadata.

## Phase 6 — Polish & Deploy
1. Run the build and fix any type/runtime issues.
2. Verify admin login flow end to end.
3. Verify public pages load and images/videos render.
4. Publish the site.

## Technical Notes
- Use `createServerFn` for all admin write operations, protected by `requireSupabaseAuth` and the existing `has_role` check.
- Use Supabase Storage for uploads; keep the `media` bucket private and serve via signed URLs or make it public if the workspace policy allows.
- Continue using the existing `AppShell`, `Sidebar`, `TopBar`, and card components; only wire them to database data.
- Do not expose `SUPABASE_SERVICE_ROLE_KEY` in client code; privileged admin actions go through authenticated server functions that load `supabaseAdmin` inside the handler.
