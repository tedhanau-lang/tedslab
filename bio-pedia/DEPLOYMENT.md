# Ted's Lab - Deployment Guide

## Overview

This guide covers deploying Ted's Lab (Study Hub) to production. The application is built with:
- **Frontend**: React 19 + TanStack Router
- **Backend**: Nitro (via TanStack Start)
- **Database**: Supabase PostgreSQL
- **Deployment**: Cloudflare Workers (or your preferred host)

## Prerequisites

- Node.js 18+ and Bun package manager
- Supabase project configured with environment variables
- Git repository pushed to GitHub
- Cloudflare or other hosting provider account (optional)

## Environment Setup

### 1. Local Environment Variables

Create a `.env` file in the project root with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Site Configuration
SITE_URL=https://teds-lab.com
NODE_ENV=production
```

### 2. Database Setup

Ensure all Supabase tables exist:
- `users` (managed by Supabase Auth)
- `user_roles` (admin role management)
- `subjects`
- `sections`
- `topics`
- `articles`
- `pages`
- `videos`
- `hero_slides`
- `nav_links`
- `site_settings`

## Build Process

### Development Build

```bash
npm run dev
# or
bun dev
```

### Production Build

```bash
npm run build:prod
# or
bun run build:prod
```

This will:
1. Build the Vite application
2. Generate the sitemap
3. Prepare assets for deployment

## Testing Before Deployment

### 1. Test Routes

```bash
npm run build:dev
npm run preview
```

Visit http://localhost:4173 and test:
- Homepage: `/`
- Categories: `/categories`
- Auth: `/auth`, `/signup`
- Admin Dashboard: `/admin` (login first)
- All Pages: `/admin/pages-list`

### 2. Test Authentication

1. Navigate to `/auth`
2. Sign in with test credentials (must exist in Supabase)
3. Verify redirect to dashboard
4. Verify admin panel accessible if user has admin role in `user_roles` table

### 3. Test Admin Panel

1. Login with admin account
2. Navigate to `/admin`
3. Check dashboard statistics load
4. Test each section:
   - Articles: View, add, edit, delete, draft/publish status
   - Pages: Manage custom pages
   - Sections, Topics, Videos: Manage content
5. Test page list: `/admin/pages-list`

### 4. Test Content Filtering

Verify that only published content shows on public pages:
- Articles with `published=true` appear on public routes
- Draft articles only visible to admins
- Pages with `published=false` don't appear in navigation

## Deployment Options

### Option 1: Cloudflare Workers (Recommended)

```bash
# Install Wrangler
npm install -D wrangler

# Deploy
npm run build:prod
wrangler publish
```

### Option 2: Vercel

In the Vercel project settings, configure:

- **Root Directory**: `bio-pedia` (the directory containing `package.json`)
- **Framework Preset**: `Other` (this is a TanStack Start/Vite app, not Next.js)
- **Install Command**: `npm ci`
- **Build Command**: `npm run build:prod`

Do not add `next` to `package.json`; the application does not use Next.js.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Option 3: Self-Hosted (Node.js)

```bash
npm run build:prod

# On server:
npm ci --omit=dev
npm run preview
```

### Option 4: Netlify

Create `netlify.toml`:

```toml
[build]
  command = "npm run build:prod"
  functions = "dist/server"
  publish = "dist/client"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database tables created and seeded
- [ ] Admin user created with role in `user_roles` table
- [ ] Build succeeds: `npm run build:prod`
- [ ] All routes tested locally
- [ ] Auth flow tested
- [ ] Admin panel tested
- [ ] Sitemap generated
- [ ] robots.txt accessible at `/robots.txt`
- [ ] CORS configured for Supabase
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (if using)
- [ ] Database backups enabled
- [ ] Monitoring/error tracking enabled
- [ ] Analytics configured (optional)

## Post-Deployment

### Verify Deployment

1. Visit your production domain
2. Test homepage loads
3. Test auth flow
4. Test admin panel (if applicable)
5. Verify routes work: `/categories`, `/glossary`, `/videos`, etc.
6. Check sitemap accessible: `/sitemap.xml` or `https://yourdomain.com/sitemap.xml`
7. Check robots.txt: `/robots.txt`

### Monitor

- Monitor error logs in Supabase
- Check application performance
- Monitor database query performance
- Set up alerts for failures

### Maintenance

Regular tasks:
- Backup database
- Review logs for errors
- Update dependencies monthly
- Test disaster recovery procedures
- Review admin access logs

## Troubleshooting

### Auth Not Working

- Verify Supabase credentials in `.env`
- Check CORS settings in Supabase
- Verify user exists in database

### Admin Panel Not Accessible

- Verify user has `role = "admin"` in `user_roles` table
- Check browser console for errors
- Verify authentication token valid

### Database Errors

- Check Supabase status page
- Verify connection string
- Check query in Supabase SQL editor
- Review application logs

## Support

For issues:
1. Check Lovable.dev documentation (if using)
2. Check TanStack Start documentation
3. Review Supabase documentation
4. Check error logs in browser console and server logs
