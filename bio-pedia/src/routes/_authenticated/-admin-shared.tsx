import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type FieldType = "text" | "textarea" | "number" | "boolean";

export type FieldConfig<T> = {
  key: keyof T;
  label: string;
  type: FieldType;
};

const db = supabase as unknown as {
  from: (table: string) => any;
};

export const NAV_ITEMS: { to: string; label: string }[] = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/articles", label: "Articles" },
  { to: "/admin/sections", label: "Sections" },
  { to: "/admin/topics", label: "Topics" },
  { to: "/admin/hero-slides", label: "Hero Slides" },
  { to: "/admin/videos", label: "Videos" },
  { to: "/admin/nav-links", label: "Nav Links" },
  { to: "/admin/pages", label: "Pages" },
  { to: "/admin/pages-list", label: "All Pages" },
];

export function AdminNav() {
  return (
    <nav className="flex flex-wrap gap-2 border-b border-border pb-4">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: item.to === "/admin" }}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function emptyRecord<T extends Record<string, unknown>>(fields: FieldConfig<T>[]): Partial<T> {
  const record: Partial<T> = {};
  for (const field of fields) {
    if (field.type === "boolean") record[field.key] = false as never;
    else if (field.type === "number") record[field.key] = null as never;
    else record[field.key] = "" as never;
  }
  return record;
}

export function AdminResourceManager<T extends { id: string }>({
  table,
  title,
  queryKey,
  fields,
  rows,
  isLoading,
  titleField,
}: {
  table: string;
  title: string;
  queryKey: string[];
  fields: FieldConfig<T>[];
  rows: T[] | undefined;
  isLoading: boolean;
  titleField: keyof T;
}) {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Partial<T>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const startEdit = (row: T) => {
    setEditingId(row.id);
    setDraft(row);
    setError(null);
  };

  const startCreate = () => {
    setEditingId("new");
    setDraft(emptyRecord(fields));
    setError(null);
  };

  const cancel = () => {
    setEditingId(null);
    setDraft({});
    setError(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      if (editingId === "new") {
        const { id: _omit, ...payload } = draft as Record<string, unknown>;
        const { error: insertError } = await db.from(table).insert(payload);
        if (insertError) throw insertError;
      } else if (editingId) {
        const { id, ...payload } = draft as Record<string, unknown>;
        const { error: updateError } = await db.from(table).update(payload).eq("id", editingId);
        if (updateError) throw updateError;
      }
      await invalidate();
      cancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this record?")) return;
    setError(null);
    try {
      const { error: deleteError } = await db.from(table).delete().eq("id", id);
      if (deleteError) throw deleteError;
      await invalidate();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  const renderForm = () => (
    <div className="space-y-3 rounded-md border border-border bg-card p-4">
      {fields.map((field) => {
        const value = draft[field.key];
        if (field.type === "boolean") {
          return (
            <label key={String(field.key)} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.checked }))}
              />
              {field.label}
            </label>
          );
        }
        if (field.type === "textarea") {
          return (
            <div key={String(field.key)} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
              <Textarea
                value={(value as string | number | null | undefined) ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
              />
            </div>
          );
        }
        return (
          <div key={String(field.key)} className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">{field.label}</label>
            <Input
              type={field.type === "number" ? "number" : "text"}
              value={(value as string | number | null | undefined) ?? ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  [field.key]: field.type === "number" ? Number(e.target.value) : e.target.value,
                }))
              }
            />
          </div>
        );
      })}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button size="sm" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button size="sm" variant="outline" onClick={cancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {editingId !== "new" && (
          <Button size="sm" onClick={startCreate}>
            Add new
          </Button>
        )}
      </div>

      {editingId === "new" && renderForm()}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-2">
          {(rows ?? []).map((row) =>
            editingId === row.id ? (
              <div key={row.id}>{renderForm()}</div>
            ) : (
              <div
                key={row.id}
                className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-2"
              >
                <span className="truncate text-sm text-foreground">
                  {String(row[titleField] ?? row.id)}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(row)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(row.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ),
          )}
          {(rows ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No records yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function AdminPageShell({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg p-6 text-center">
        <h1 className="text-lg font-semibold text-foreground">Unauthorized</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You are signed in as {user?.email ?? "unknown"}, but this account does not have admin
          access.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <AdminNav />
      {children}
    </div>
  );
}
