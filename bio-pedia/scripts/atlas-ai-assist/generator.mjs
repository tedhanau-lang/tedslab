// AI Assist generator for Knowledge Atlas.
//
// Uses @xenova/transformers (a WASM/ONNX port of Hugging Face
// transformers) to run a small open-weights model entirely on the CPU
// where this script executes. There is no xAI key, no Anthropic key,
// and no API of any kind involved -- the model file downloads once
// from the public Hugging Face Hub (a free, keyless CDN) the first
// time this runs, then is cached locally under `.cache/` and reused.
//
// Called by:
//   - `npm run ai:generate-daily` (scripts/atlas-ai-assist/run.mjs)
//   - the GitHub Actions cron in .github/workflows/atlas-daily-articles.yml
//   - the in-app "Generate today's articles" button, via
//     src/routes/api/atlas.generate.ts (Node/self-hosted deployments only)

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const DATA_PATH = path.join(ROOT, "src/data/atlas/generated-data.json");
const MODEL_ID = "Xenova/LaMini-Flan-T5-248M"; // ~250MB, small instruction-tuned model, CPU friendly

export const CLUSTERS = [
  { id: "philosophy", title: "Philosophy" },
  { id: "physics", title: "Physics" },
  { id: "mathematics", title: "Mathematics" },
  { id: "biology", title: "Biology" },
  { id: "computing", title: "Computing" },
  { id: "history", title: "History" },
  { id: "mind", title: "Mind" },
  { id: "systems", title: "Systems" },
];

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function loadExisting() {
  try {
    const raw = await readFile(DATA_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveEntries(entries) {
  await mkdir(path.dirname(DATA_PATH), { recursive: true });
  await writeFile(DATA_PATH, JSON.stringify(entries, null, 2) + "\n", "utf8");
}

let generatorPromise;
async function getGenerator() {
  if (!generatorPromise) {
    const { pipeline, env } = await import("@xenova/transformers");
    // Keep model cache inside the repo's .cache dir (gitignored) rather
    // than a global location, so CI runs are self-contained.
    env.cacheDir = path.join(ROOT, ".cache", "transformers");
    generatorPromise = pipeline("text2text-generation", MODEL_ID);
  }
  return generatorPromise;
}

async function ask(generator, prompt, maxNewTokens = 64) {
  const out = await generator(prompt, {
    max_new_tokens: maxNewTokens,
    temperature: 0.9,
    top_k: 50,
    do_sample: true,
  });
  return (out?.[0]?.generated_text ?? "").trim();
}

function cleanLine(s, fallback) {
  const cleaned = (s || "").replace(/\s+/g, " ").trim();
  return cleaned.length > 0 ? cleaned : fallback;
}

/**
 * Generate up to `perSubject` new nodes + article cores for each cluster,
 * skipping any title whose slug already exists in generated-data.json.
 * Returns the updated full entry list (existing + newly generated).
 */
export async function generateDailyArticles({ perSubject = 10, log = console.log } = {}) {
  const generator = await getGenerator();
  const existing = await loadExisting();
  const knownIds = new Set(existing.map((e) => e.id));
  const today = new Date().toISOString().slice(0, 10);
  const added = [];

  for (const cluster of CLUSTERS) {
    let created = 0;
    let attempts = 0;
    while (created < perSubject && attempts < perSubject * 3) {
      attempts += 1;

      const titleRaw = await ask(
        generator,
        `Name one specific, narrow topic, person, or concept within ${cluster.title} that would make a good short encyclopedia entry. Reply with only the name, no punctuation, no explanation.`,
        16,
      );
      const title = cleanLine(titleRaw, `${cluster.title} Topic ${Date.now()}`)
        .split(/[.\n]/)[0]
        .replace(/^["'-]+|["'-]+$/g, "")
        .slice(0, 80);
      const id = slugify(title);
      if (!title || !id || knownIds.has(id)) continue;

      const summary = cleanLine(
        await ask(generator, `In one sentence, explain what "${title}" is, in the context of ${cluster.title}.`, 48),
        `${title} is a topic within ${cluster.title}.`,
      );
      const lede = cleanLine(
        await ask(generator, `Write one vivid opening sentence for an encyclopedia article about "${title}".`, 48),
        summary,
      );
      const idea = cleanLine(
        await ask(generator, `In one or two sentences, what is the central idea behind "${title}"?`, 64),
        summary,
      );
      const lineage = cleanLine(
        await ask(
          generator,
          `In one or two sentences, what earlier ideas or figures does "${title}" build on or react against?`,
          64,
        ),
        `${title} builds on earlier work within ${cluster.title}.`,
      );
      const tension = cleanLine(
        await ask(generator, `In one or two sentences, what is a live debate, open problem, or criticism about "${title}"?`, 64),
        `There is ongoing debate about how best to understand ${title}.`,
      );
      const tagsRaw = await ask(
        generator,
        `List three short lowercase tags (comma separated, no explanation) for "${title}".`,
        24,
      );
      const tags = tagsRaw
        .split(/[,\n]/)
        .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9-]/g, ""))
        .filter(Boolean)
        .slice(0, 3);

      const entry = {
        id,
        title,
        cluster: cluster.id,
        kind: /^[A-Z][a-z]+ [A-Z]/.test(title) ? "figure" : "concept",
        tags: tags.length ? tags : [cluster.id, "ai-assist"],
        summary,
        related: [cluster.id],
        core: { lede, idea, lineage, tension },
        generatedAt: today,
      };

      existing.push(entry);
      added.push(entry);
      knownIds.add(id);
      created += 1;
      log(`  + [${cluster.id}] ${title}`);
    }
  }

  await saveEntries(existing);
  return { added, total: existing.length };
}
