import type { ClusterId, NodeKind } from "./types";
import type { MoreSeed } from "./catalog-more";
import generated from "./generated-data.json";

/**
 * AI Assist — generated content.
 *
 * The actual data lives in `generated-data.json`, a plain JSON file
 * rewritten by `scripts/atlas-ai-assist/generate-daily.mjs`, which runs
 * once a day (see .github/workflows/atlas-daily-articles.yml) and adds
 * up to 10 new nodes per subject (cluster) using a small local language
 * model -- no xAI, no Anthropic, and no API key of any kind. See
 * scripts/atlas-ai-assist/README.md for how it works and how to run it
 * manually.
 *
 * This file just reshapes that JSON into the `MoreSeed` records the rest
 * of the Atlas already knows how to render -- it never needs hand-editing.
 */
export type GeneratedEntry = {
  id: string;
  title: string;
  cluster: ClusterId;
  kind: NodeKind;
  tags: string[];
  summary: string;
  related: string[];
  core: { lede: string; idea: string; lineage: string; tension: string };
  generatedAt: string;
};

const entries = generated as GeneratedEntry[];

export const GENERATED_BY_CLUSTER: Record<ClusterId, MoreSeed[]> = {
  philosophy: [],
  physics: [],
  mathematics: [],
  biology: [],
  computing: [],
  history: [],
  mind: [],
  systems: [],
};

for (const e of entries) {
  GENERATED_BY_CLUSTER[e.cluster].push({
    id: e.id,
    title: e.title,
    kind: e.kind,
    tags: e.tags,
    summary: e.summary,
    related: e.related,
  });
}
