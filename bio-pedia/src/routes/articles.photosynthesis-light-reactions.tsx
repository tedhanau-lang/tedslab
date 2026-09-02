import { createFileRoute } from "@tanstack/react-router";
import PhotosynthesisLightReactionsPage from "@/components/biopedia/pages/articles/biology/photosynthesis-light-reactions";

export const Route = createFileRoute("/articles/photosynthesis-light-reactions")({
  component: PhotosynthesisLightReactionsPage,
});
