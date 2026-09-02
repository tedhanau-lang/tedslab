import { createFileRoute } from "@tanstack/react-router";
import CellularRespirationPage from "@/components/biopedia/pages/articles/biology/cellular-respiration";

export const Route = createFileRoute("/articles/cellular-respiration")({
  component: CellularRespirationPage,
});
