# Admin User Setup Guide

## Overview

This guide walks through setting up admin users for Ted's Lab Study Hub.

## Prerequisites

- Supabase project created and configured
- Access to Supabase dashboard
- User registered in the application

## Step 1: Verify User Exists

1. Go to Supabase dashboard
2. Navigate to Authentication > Users
3. Verify the user is registered
4. Note the user's UUID

## Step 2: Grant Admin Role

### Option A: Using Supabase Dashboard (Recommended)

1. Go to Supabase SQL Editor
2. Run the following SQL:

```sql
-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamp DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Grant admin role to a user
INSERT INTO user_roles (user_id, role)
VALUES ('USER_UUID_HERE', 'admin')
ON CONFLICT(user_id, role) DO NOTHING;
```

Replace `USER_UUID_HERE` with the actual user UUID.

### Option B: Using SQL Query

```sql
-- After user signs up and gets their UUID:
INSERT INTO user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@example.com'),
  'admin'
);
```

## Step 3: Verify Admin Access

1. Sign out if logged in
2. Go to `/auth`
3. Sign in with the admin account
4. You should be redirected to `/admin`
5. Verify you can see:
   - Admin Dashboard with statistics
   - Navigation to manage: Articles, Pages, Sections, Topics, Videos, Hero Slides, Nav Links
   - Pages List showing all published content

## Step 4: Test Admin Features

### Test Draft/Publish Workflow

1. Go to `/admin/articles`
2. Click "Expand" on an article
3. Click "Draft" button to set it to draft status
4. Click "Review" button to set it to review status
5. Click "Published" button to publish it
6. Verify badge updates in real-time

### Test Admin Dashboard

1. Go to `/admin`
2. View statistics:
   - Total Content count
   - Published count
   - Draft count
3. View Content Breakdown showing per-type statistics
4. Click quick links to navigate to management pages

### Test Pages List

1. Go to `/admin/pages-list`
2. Search for pages
3. Click "Visit" buttons to preview pages
4. Verify only published content appears

## Multiple Admins

To grant admin role to multiple users:

```sql
-- Grant admin to multiple users
INSERT INTO user_roles (user_id, role)
VALUES 
  ((SELECT id FROM auth.users WHERE email = 'admin1@example.com'), 'admin'),
  ((SELECT id FROM auth.users WHERE email = 'admin2@example.com'), 'admin'),
  ((SELECT id FROM auth.users WHERE email = 'admin3@example.com'), 'admin')
ON CONFLICT(user_id, role) DO NOTHING;
```

## Remove Admin Role

To remove admin access from a user:

```sql
DELETE FROM user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
AND role = 'admin';
```

## Troubleshooting

### "Unauthorized" Error

If you see an "Unauthorized" message:

1. Verify user exists in `auth.users` table
2. Verify role exists in `user_roles` table with `role = 'admin'`
3. Check user UUID matches in both places
4. Try signing out and back in
5. Check browser console for errors

### No Statistics Showing

If admin dashboard doesn't show statistics:

1. Verify content tables exist and have data
2. Check browser console for API errors
3. Verify Supabase connection is working
4. Try refreshing the page

### Sitemap Not Generated

If sitemap.xml is not available:

1. Run: `npm run generate:sitemap`
2. Check console output for errors
3. Verify SITE_URL environment variable is set
4. Check that content tables are queryable

## Database Schema

The admin system requires these tables:

```sql
-- Authentication
auth.users (managed by Supabase)

-- Admin roles
user_roles (
  id: UUID,
  user_id: UUID (references auth.users),
  role: text (e.g., 'admin'),
  created_at: timestamp
)

-- Content tables
articles (
  id, slug, title, excerpt, body, minutes, tone,
  subject_slug, section_slug, image_url, video_url,
  published (boolean), status (text), sort, ...
)

pages (
  id, slug, title, description, body, image_url,
  published (boolean), status (text), show_in_nav, sort, ...
)

-- Other content tables
sections, topics, videos, hero_slides, nav_links
```

## Security Notes

- Only users with `admin` role can access `/admin` routes
- Admin users can create, read, update, and delete all content
- All changes are logged in Supabase's audit logs
- Consider using RLS (Row Level Security) policies for additional safety
- Regularly audit `user_roles` table for unauthorized access

## API Access

The admin system uses Supabase API with these operations:

```javascript
// Get user role
const { data } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id);

// Grant admin role
const { error } = await supabase
  .from('user_roles')
  .insert({ user_id: userId, role: 'admin' });

// Update content status
const { error } = await supabase
  .from('articles')
  .update({ status: 'published', published: true })
  .eq('id', articleId);

// Get statistics
const { data } = await supabase
  .from('articles')
  .select('id, published');
```

## Next Steps

1. ✅ Create admin users using steps above
2. Familiarize yourself with the admin interface
3. Create and manage content
4. Monitor statistics on admin dashboard
5. Deploy to production (see DEPLOYMENT.md)

## Support

For issues with admin setup:
1. Check database tables exist
2. Verify Supabase connection
3. Check browser console for errors
4. Review Supabase logs for database errors
5. See DEPLOYMENT.md for production setup
