import type { ArticleCore } from "../types";

import { CORES_A } from "./cores-philosophy-physics";
import { CORES_B } from "./cores-math-bio";
import { CORES_C } from "./cores-computing-history";
import { CORES_D } from "./cores-mind-systems";
import { CORES_ATLAS } from "./cores-atlas";
import { CORES_HUBS } from "./cores-hubs";
import { CORES_MORE } from "./cores-more";
import { CORES_GENERATED } from "./cores-generated";

export const CORES: Record<string, ArticleCore> = {
  ...CORES_HUBS,
  ...CORES_A,
  ...CORES_B,
  ...CORES_C,
  ...CORES_D,
  ...CORES_ATLAS,
  ...CORES_MORE,
  // AI Assist: written by scripts/atlas-ai-assist/generate-daily.mjs.
  ...CORES_GENERATED,
};
