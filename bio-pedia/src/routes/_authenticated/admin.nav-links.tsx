import { createFileRoute } from "@tanstack/react-router";
import { useNavLinks, type NavLinkRow } from "@/lib/content";
import { AdminPageShell, AdminResourceManager, type FieldConfig } from "./-admin-shared";

export const Route = createFileRoute("/_authenticated/admin/nav-links")({
  ssr: false,
  head: () => ({ meta: [{ title: "Nav Links — Admin" }] }),
  component: NavLinksAdminPage,
});

const fields: FieldConfig<NavLinkRow>[] = [
  { key: "label", label: "Label", type: "text" },
  { key: "href", label: "Href", type: "text" },
  { key: "icon", label: "Icon", type: "text" },
  { key: "group_name", label: "Group", type: "text" },
  { key: "sort", label: "Sort", type: "number" },
];

function NavLinksAdminPage() {
  const { data, isLoading } = useNavLinks();

  return (
    <AdminPageShell>
      <AdminResourceManager
        table="nav_links"
        title="Nav Links"
        queryKey={["nav_links"]}
        fields={fields}
        rows={data}
        isLoading={isLoading}
        titleField="label"
      />
    </AdminPageShell>
  );
}
