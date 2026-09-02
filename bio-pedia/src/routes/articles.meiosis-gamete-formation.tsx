import { createFileRoute } from "@tanstack/react-router";
import MeiosisGameteFormationPage from "@/components/biopedia/pages/articles/biology/meiosis-gamete-formation";

export const Route = createFileRoute("/articles/meiosis-gamete-formation")({
  component: MeiosisGameteFormationPage,
});
