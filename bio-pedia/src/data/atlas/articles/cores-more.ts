import type { ArticleCore } from "../types";
import { expandFact } from "./expand-facts";
import { FACTS_MORE } from "./facts-more";

export const CORES_MORE: Record<string, ArticleCore> = Object.fromEntries(
  FACTS_MORE.map((f) => [f.id, expandFact(f)]),
);
