CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  body TEXT,
  icon TEXT,
  image_key TEXT,
  image_url TEXT,
  sort INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sections_slug ON sections(slug);
CREATE INDEX idx_sections_subject_id ON sections(subject_id);
