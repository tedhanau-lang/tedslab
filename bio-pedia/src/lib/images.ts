import heroCell from "@/assets/hero-cell.jpg";
import catOrganisms from "@/assets/cat-organisms.jpg";
import catGenetics from "@/assets/cat-genetics.jpg";
import catHuman from "@/assets/cat-human.jpg";
import catPlants from "@/assets/cat-plants.jpg";
import catEcology from "@/assets/cat-ecology.jpg";
import catEvolution from "@/assets/cat-evolution.jpg";
import discoveryLeaf from "@/assets/discovery-leaf.jpg";
import mathAlgebra from "@/assets/math-algebra.jpg";
import mathGeometry from "@/assets/math-geometry.jpg";
import mathCalculus from "@/assets/math-calculus.jpg";
import mathStatistics from "@/assets/math-statistics.jpg";
import sciPhysics from "@/assets/sci-physics.jpg";
import sciChemistry from "@/assets/sci-chemistry.jpg";
import sciEarth from "@/assets/sci-earth.jpg";
import sciMethod from "@/assets/sci-method.jpg";
import engLiterature from "@/assets/eng-literature.jpg";
import engPoetry from "@/assets/eng-poetry.jpg";
import engGrammar from "@/assets/eng-grammar.jpg";
import engWriting from "@/assets/eng-writing.jpg";
import hisAncient from "@/assets/his-ancient.jpg";
import hisMedieval from "@/assets/his-medieval.jpg";
import hisRevolutions from "@/assets/his-revolutions.jpg";
import hisWars from "@/assets/his-wars.jpg";
import techComputing from "@/assets/tech-computing.jpg";
import techProgramming from "@/assets/tech-programming.jpg";
import techAi from "@/assets/tech-ai.jpg";
import techSecurity from "@/assets/tech-security.jpg";
import logo from "@/assets/logo-tedslab.png";

export const logoSrc = logo;

export const imageMap: Record<string, string> = {
  "hero-cell": heroCell,
  "cat-organisms": catOrganisms,
  "cat-genetics": catGenetics,
  "cat-human": catHuman,
  "cat-plants": catPlants,
  "cat-ecology": catEcology,
  "cat-evolution": catEvolution,
  "discovery-leaf": discoveryLeaf,
  "math-algebra": mathAlgebra,
  "math-geometry": mathGeometry,
  "math-calculus": mathCalculus,
  "math-statistics": mathStatistics,
  "sci-physics": sciPhysics,
  "sci-chemistry": sciChemistry,
  "sci-earth": sciEarth,
  "sci-method": sciMethod,
  "eng-literature": engLiterature,
  "eng-poetry": engPoetry,
  "eng-grammar": engGrammar,
  "eng-writing": engWriting,
  "his-ancient": hisAncient,
  "his-medieval": hisMedieval,
  "his-revolutions": hisRevolutions,
  "his-wars": hisWars,
  "tech-computing": techComputing,
  "tech-programming": techProgramming,
  "tech-ai": techAi,
  "tech-security": techSecurity,
};

export const imageKeys = Object.keys(imageMap);

/** Default artwork key per subject, used when a row has no image of its own. */
export const subjectImageKey: Record<string, string> = {
  biology: "hero-cell",
  mathematics: "math-algebra",
  science: "sci-physics",
  english: "eng-literature",
  history: "his-ancient",
  technology: "tech-computing",
};

/** Resolve an image: an explicit URL wins, then a built-in key, then a fallback. */
export function resolveImage(imageUrl?: string | null, imageKey?: string | null): string {
  const url = imageUrl?.trim();
  // Ignore leftover placeholder-service URLs; prefer the bundled artwork instead.
  if (url && !url.includes("placehold.co")) return url;
  if (imageKey && imageMap[imageKey]) return imageMap[imageKey]!;
  return heroCell;
}
