import type { ArticleCore } from "../types";
import type { GeneratedEntry } from "../catalog-generated";
import generated from "../generated-data.json";

/**
 * AI Assist -- generated article cores, keyed by node id.
 * Derived from the same generated-data.json as catalog-generated.ts.
 * See scripts/atlas-ai-assist/README.md.
 */
const entries = generated as GeneratedEntry[];

export const CORES_GENERATED: Record<string, ArticleCore> = Object.fromEntries(
  entries.map((e) => [e.id, e.core]),
);
