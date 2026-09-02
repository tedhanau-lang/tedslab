import fs from 'node:fs';

const root = process.cwd();
const envPath = `${root}/.env`;
const envText = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const env = {};

for (const line of envText.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  let value = trimmed.slice(idx + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const key = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error('Missing Supabase URL or publishable key in .env');
  process.exit(1);
}

const headers = {
  apikey: key,
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Authorization: `Bearer ${key}`,
};

const fetchJson = async (path, init = {}) => {
  const response = await fetch(`${url}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers || {}) },
  });
  const text = await response.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status} ${response.statusText} ${JSON.stringify(json)}`);
  }
  return json;
};

const topics = await fetchJson('/rest/v1/topics?select=id,slug,title,blurb,body,section_id,sort&order=sort.asc');
const sections = await fetchJson('/rest/v1/sections?select=id,slug,title,subject_id,image_key,sort&order=sort.asc');
const subjects = await fetchJson('/rest/v1/subjects?select=id,slug,title,sort&order=sort.asc');

const sectionMap = new Map((sections || []).map((s) => [s.id, s]));
const subjectMap = new Map((subjects || []).map((s) => [s.id, s]));
const tones = ['cyan', 'amber', 'green', 'violet', 'rose', 'blue', 'orange', 'indigo'];
const rows = [];

for (const topic of topics || []) {
  const section = sectionMap.get(topic.section_id);
  const subject = section ? subjectMap.get(section.subject_id) : null;
  if (!section || !subject) continue;

  const title = topic.title || 'Untitled Topic';
  const excerpt = topic.blurb || `${title} overview`;
  const body = topic.body || `This article explains ${title}. It introduces the key idea, explores why it matters, and shows how it connects to related concepts.`;
  const slug = `${section.slug}-${topic.slug}`;

  rows.push({
    slug,
    title: `${title}: Full Guide`,
    excerpt,
    body,
    minutes: 5 + Math.floor(Math.random() * 6),
    tone: tones[rows.length % tones.length],
    subject_slug: subject.slug,
    section_slug: section.slug,
    topic_slug: topic.slug,
    image_key: section.image_key || 'hero-cell',
    published: true,
    status: 'published',
    sort: topic.sort ?? rows.length,
  });
}

if (!rows.length) {
  console.log('No rows generated. Topics or sections are empty.');
  process.exit(0);
}

const inserted = await fetchJson('/rest/v1/articles?on_conflict=slug', {
  method: 'POST',
  headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
  body: JSON.stringify(rows),
});

const total = await fetchJson('/rest/v1/articles?select=count&published=eq.true');
console.log(`Created/updated ${inserted.length} article records.`);
console.log(`Published article count: ${Array.isArray(total) ? total[0]?.count ?? 0 : total?.count ?? 0}`);
console.log('Sample:', (inserted || []).slice(0, 5).map((a) => a.slug));
