# Ted's Lab - Study Encyclopedia

A comprehensive biology education platform built with modern web technologies. Features full-stack content management, admin dashboard, and interactive learning tools.

## 🎯 Features

### For Learners
- 📚 Browse comprehensive biology content organized by subject
- 🔍 Search across articles, glossary, and videos
- 📝 Take quizzes and flashcards for active learning
- 📺 Watch educational videos
- 🔖 Bookmark and save favorite articles
- 📱 Responsive mobile-friendly design

### For Admins
- 📊 Admin Dashboard with content statistics and monitoring
- ✏️ Content Management System (CMS) for:
  - Articles with draft/publish workflow
  - Custom pages with navigation integration
  - Sections and topics
  - Videos and hero slides
  - Navigation menus
- 📋 Draft & Publish Workflow:
  - Save as draft without publishing
  - Move through review state
  - Publish with one click
  - Real-time status indicators
- 📄 Pages List showing all published content
- 🗺️ Automatic sitemap generation for SEO
- 🔐 Role-based access control

## 🚀 Quick Start

### Development

```bash
# Clone and install
git clone <repository-url>
cd study-hub-tedslab
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Production

```bash
# Build for production
npm run build:prod

# Preview production build
npm run preview

# Deploy to your hosting provider
# See DEPLOYMENT.md for detailed instructions
```

## 📖 Documentation

- **[FEATURES.md](./FEATURES.md)** - Detailed feature documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[ADMIN_SETUP.md](./ADMIN_SETUP.md)** - Admin user setup instructions

## 🛠️ Tech Stack

- **Frontend**: React 19, TanStack Router, Tailwind CSS
- **Backend**: TanStack Start, Nitro, H3
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Deployment**: Cloudflare, Vercel, or self-hosted

## 📚 Admin Routes

Login at `/auth` with admin credentials, then access:

- `/admin` - Dashboard with statistics
- `/admin/articles` - Manage articles with draft/publish
- `/admin/pages` - Manage custom pages
- `/admin/sections` - Manage subject sections
- `/admin/topics` - Manage topics
- `/admin/videos` - Manage videos
- `/admin/hero-slides` - Manage homepage hero carousel
- `/admin/nav-links` - Manage navigation menu
- `/admin/pages-list` - View all published pages

## 🔐 Admin Setup

1. Register user account at `/signup`
2. Grant admin role via database (see [ADMIN_SETUP.md](./ADMIN_SETUP.md))
3. Login to access admin dashboard
4. Start managing content

## 🗺️ Site Navigation

**Public Routes:**
- `/` - Homepage
- `/categories` - Browse all categories
- `/organisms` - Organisms category
- `/genetics-dna` - Genetics category
- `/human-biology` - Human biology category
- `/plants` - Plants category
- `/ecology-environment` - Ecology category
- `/evolution` - Evolution category
- `/glossary` - Biology glossary
- `/timeline` - Evolution timeline
- `/flashcards` - Study flashcards
- `/quizzes` - Take quizzes
- `/videos` - Video library
- `/saved` - Saved articles (requires login)

**Auth Routes:**
- `/auth` - Sign in
- `/signup` - Create account
- `/dashboard` - User dashboard (requires login)

**Admin Routes:**
- `/admin/*` - Admin panel (requires admin role)

## 📊 Admin Dashboard

The admin dashboard displays:
- **Statistics**: Total content, published count, draft count
- **Content Breakdown**: Per-type statistics (articles, pages, videos, etc.)
- **Quick Links**: Navigate to management sections
- **Monitoring**: Real-time content status

## 📝 Draft & Publish Workflow

1. Create new article or page
2. Save as draft (default)
3. Review changes
4. Move to review status (optional)
5. Click publish when ready
6. Status updates in real-time

Draft articles don't appear on public site. Only "published" content is visible to users.

## 🔍 SEO Features

- Automatic sitemap generation at `/sitemap.xml`
- robots.txt for search engine guidance
- Meta tags for content optimization
- Structured data support

## 🔗 Environment Setup

Create `.env` file with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SITE_URL=https://your-domain.com
```

## 📦 Database

Tables managed automatically by Supabase:
- `auth.users` - User authentication
- `user_roles` - Admin role management
- `subjects` - Main categories
- `sections` - Sub-categories
- `topics` - Individual topics
- `articles` - Main content
- `pages` - Custom pages
- `videos` - Video content
- `hero_slides` - Homepage carousel
- `nav_links` - Navigation menu

## 🧪 Testing

```bash
# Build test
npm run build:dev

# Preview test
npm run preview

# Lint check
npm run lint

# Format code
npm run format
```

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with clear messages
4. Push to repository
5. Create pull request

## 📄 License

All content and code are proprietary to Ted's Lab.

## 🆘 Troubleshooting

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (requires 18+)

### Admin Access Issues
- Verify user has admin role in `user_roles` table
- Check Supabase credentials in `.env`
- Try signing out and back in

### Database Issues
- Verify Supabase connection
- Check CORS settings
- Review Supabase logs

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production troubleshooting.

## 📞 Support

- Check documentation files (FEATURES.md, DEPLOYMENT.md, ADMIN_SETUP.md)
- Review browser console for errors
- Check Supabase dashboard for database issues
- Contact development team for additional support

---

Built with ❤️ for biology education.
