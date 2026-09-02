CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  body TEXT DEFAULT '',
  minutes INTEGER DEFAULT 0,
  tone TEXT DEFAULT '',
  subject_slug TEXT,
  section_slug TEXT,
  topic_slug TEXT,
  image_key TEXT,
  image_url TEXT,
  video_url TEXT,
  published BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published')),
  sort INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_published ON articles(published);
CREATE INDEX idx_articles_subject_slug ON articles(subject_slug);
CREATE INDEX idx_articles_section_slug ON articles(section_slug);
CREATE INDEX idx_articles_topic_slug ON articles(topic_slug);
