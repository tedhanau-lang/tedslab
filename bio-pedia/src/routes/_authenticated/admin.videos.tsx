import { createFileRoute } from "@tanstack/react-router";
import { useVideos, type VideoRow } from "@/lib/content";
import { AdminPageShell, AdminResourceManager, type FieldConfig } from "./-admin-shared";

export const Route = createFileRoute("/_authenticated/admin/videos")({
  ssr: false,
  head: () => ({ meta: [{ title: "Videos — Admin" }] }),
  component: VideosAdminPage,
});

const fields: FieldConfig<VideoRow>[] = [
  { key: "slug", label: "Slug", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "url", label: "Video URL", type: "text" },
  { key: "poster_url", label: "Poster URL", type: "text" },
  { key: "subject_slug", label: "Subject slug", type: "text" },
  { key: "sort", label: "Sort", type: "number" },
];

function VideosAdminPage() {
  const { data, isLoading } = useVideos();

  return (
    <AdminPageShell>
      <AdminResourceManager
        table="videos"
        title="Videos"
        queryKey={["videos"]}
        fields={fields}
        rows={data}
        isLoading={isLoading}
        titleField="title"
      />
    </AdminPageShell>
  );
}
