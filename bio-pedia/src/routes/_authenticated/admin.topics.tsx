import { createFileRoute } from "@tanstack/react-router";
import { useTopics, type TopicRow } from "@/lib/content";
import { AdminPageShell, AdminResourceManager, type FieldConfig } from "./-admin-shared";

export const Route = createFileRoute("/_authenticated/admin/topics")({
  ssr: false,
  head: () => ({ meta: [{ title: "Topics — Admin" }] }),
  component: TopicsAdminPage,
});

const fields: FieldConfig<TopicRow>[] = [
  { key: "section_id", label: "Section ID", type: "text" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "blurb", label: "Blurb", type: "textarea" },
  { key: "body", label: "Body", type: "textarea" },
  { key: "image_url", label: "Image URL", type: "text" },
  { key: "sort", label: "Sort", type: "number" },
];

function TopicsAdminPage() {
  const { data, isLoading } = useTopics();

  return (
    <AdminPageShell>
      <AdminResourceManager
        table="topics"
        title="Topics"
        queryKey={["topics"]}
        fields={fields}
        rows={data}
        isLoading={isLoading}
        titleField="title"
      />
    </AdminPageShell>
  );
}
