import { createFileRoute } from "@tanstack/react-router";
import { useHeroSlides, type HeroSlideRow } from "@/lib/content";
import { AdminPageShell, AdminResourceManager, type FieldConfig } from "./-admin-shared";

export const Route = createFileRoute("/_authenticated/admin/hero-slides")({
  ssr: false,
  head: () => ({ meta: [{ title: "Hero Slides — Admin" }] }),
  component: HeroSlidesAdminPage,
});

const fields: FieldConfig<HeroSlideRow>[] = [
  { key: "subject_slug", label: "Subject slug", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "subtitle", label: "Subtitle", type: "text" },
  { key: "body", label: "Body", type: "textarea" },
  { key: "image_url", label: "Image URL", type: "text" },
  { key: "link_to", label: "Link to", type: "text" },
  { key: "video_url", label: "Video URL", type: "text" },
  { key: "sort", label: "Sort", type: "number" },
  { key: "active", label: "Active", type: "boolean" },
];

function HeroSlidesAdminPage() {
  const { data, isLoading } = useHeroSlides();

  return (
    <AdminPageShell>
      <AdminResourceManager
        table="hero_slides"
        title="Hero Slides"
        queryKey={["hero_slides"]}
        fields={fields}
        rows={data}
        isLoading={isLoading}
        titleField="title"
      />
    </AdminPageShell>
  );
}
