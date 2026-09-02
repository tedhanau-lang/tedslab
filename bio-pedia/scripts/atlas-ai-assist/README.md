# Knowledge Atlas — AI Assist

Generates up to **10 new articles per subject, every day** (8 subjects =
up to 80/day), using a small local language model. No xAI API, no
Anthropic key, no API key of any kind.

## How it works

- **Model**: [`Xenova/LaMini-Flan-T5-248M`](https://huggingface.co/Xenova/LaMini-Flan-T5-248M),
  a small instruction-tuned model running via
  [`@xenova/transformers`](https://www.npmjs.com/package/@xenova/transformers)
  (a WASM/ONNX port of Hugging Face's `transformers`). It runs entirely
  on the CPU of whatever machine executes the script — nothing is sent
  to a third-party inference API.
- **First run**: the ~250MB model file downloads once from the public
  Hugging Face Hub (a free, keyless CDN) and is cached in `.cache/transformers/`
  (gitignored). Subsequent runs reuse the cache.
- **Data flow**: `scripts/atlas-ai-assist/generator.mjs` picks new topic
  names per subject, asks the model for a one-line summary, a lede, an
  "idea" (central thesis), a "lineage" (what it builds on), and a
  "tension" (an open debate) — the same four fields (`ArticleCore`) the
  rest of Knowledge Atlas already uses to compose article bodies. Results
  are written to `src/data/atlas/generated-data.json`, which
  `src/data/atlas/catalog-generated.ts` and
  `src/data/atlas/articles/cores-generated.ts` read at build time and
  merge into the normal catalog/article pipeline. Existing article slugs
  are never overwritten, and duplicate topic names are skipped.

## Running it

```bash
# generate today's batch (10 per subject)
npm run ai:generate-daily

# generate a custom number per subject
node scripts/atlas-ai-assist/run.mjs --per 5
```

## Scheduling ("every day")

`.github/workflows/atlas-daily-articles.yml` runs this script once a day
via GitHub Actions cron (`0 6 * * *`, i.e. 06:00 UTC), caches the model
weights between runs, and commits any new articles back to the repo. This
is free and requires no secret — GitHub Actions runners have normal
internet access, unlike some sandboxed dev environments.

If you deploy somewhere other than GitHub, replace the workflow with
whatever your host's cron/scheduled-task equivalent is (e.g. a Vercel
Cron Job, a Cloudflare Cron Trigger calling a Node endpoint, or a plain
`cron` entry on a VPS) — the actual work is just `node scripts/atlas-ai-assist/run.mjs`.

## Manual trigger from the app

The Atlas toolbar has a sparkle (✨) button that calls
`POST /api/atlas/generate` (`src/routes/api/atlas.generate.ts`), which
runs the same generator on demand and reloads the page when done.

**This only works on a persistent Node runtime** (e.g. `vite preview`,
a Node/VPS host) because it needs filesystem write access and the ONNX
runtime the model depends on. It will **not** work if this app is
deployed to an edge/serverless target like Cloudflare Workers — use the
scheduled GitHub Action for those deployments instead.

## Honesty note

Model downloads happen from `huggingface.co`, which may not be reachable
from every sandboxed environment (it wasn't reachable from the sandbox
this feature was originally built in, so the generation itself could not
be executed end-to-end there — only written and reviewed for
correctness). Please run `npm run ai:generate-daily` once locally or in
CI to confirm it works in your actual environment before relying on it.
