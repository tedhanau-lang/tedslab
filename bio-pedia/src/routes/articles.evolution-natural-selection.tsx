import { createFileRoute } from "@tanstack/react-router";
import EvolutionNaturalSelectionPage from "@/components/biopedia/pages/articles/biology/evolution-natural-selection";

export const Route = createFileRoute("/articles/evolution-natural-selection")({
  component: EvolutionNaturalSelectionPage,
});
