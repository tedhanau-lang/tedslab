import { createFileRoute } from "@tanstack/react-router";
import { useSections, type SectionRow } from "@/lib/content";
import { AdminPageShell, AdminResourceManager, type FieldConfig } from "./-admin-shared";

export const Route = createFileRoute("/_authenticated/admin/sections")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sections — Admin" }] }),
  component: SectionsAdminPage,
});

const fields: FieldConfig<SectionRow>[] = [
  { key: "subject_id", label: "Subject ID", type: "text" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "label", label: "Label", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "body", label: "Body", type: "textarea" },
  { key: "icon", label: "Icon", type: "text" },
  { key: "image_url", label: "Image URL", type: "text" },
  { key: "sort", label: "Sort", type: "number" },
];

function SectionsAdminPage() {
  const { data, isLoading } = useSections();

  return (
    <AdminPageShell>
      <AdminResourceManager
        table="sections"
        title="Sections"
        queryKey={["sections"]}
        fields={fields}
        rows={data}
        isLoading={isLoading}
        titleField="title"
      />
    </AdminPageShell>
  );
}
