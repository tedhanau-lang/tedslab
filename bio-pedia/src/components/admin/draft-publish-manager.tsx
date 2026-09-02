import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export type ContentStatus = "draft" | "review" | "published";

interface DraftPublishItem {
  id: string;
  title: string;
  status?: ContentStatus;
  published?: boolean;
  updated_at?: string;
}

interface DraftPublishManagerProps<T extends DraftPublishItem> {
  item: T;
  table: string;
  queryKey: string[];
  onStatusChange?: (newStatus: ContentStatus) => void;
}

const db = supabase as unknown as {
  from: (table: string) => any;
};

const statusColors: Record<ContentStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  review: "bg-amber-100 text-amber-800",
  published: "bg-green-100 text-green-800",
};

export function DraftPublishManager<T extends DraftPublishItem>({
  item,
  table,
  queryKey,
  onStatusChange,
}: DraftPublishManagerProps<T>) {
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine current status from both status field and published boolean
  const currentStatus: ContentStatus =
    (item.status as ContentStatus) ||
    (item.published ? "published" : "draft");

  const handleStatusChange = async (newStatus: ContentStatus) => {
    setUpdating(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        status: newStatus,
        published: newStatus === "published",
      };

      const { error: updateError } = await db.from(table).update(payload).eq("id", item.id);
      if (updateError) throw updateError;

      await queryClient.invalidateQueries({ queryKey });
      onStatusChange?.(newStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          <Badge className={statusColors[currentStatus]}>
            {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
          </Badge>
        </div>
        {item.updated_at && (
          <span className="text-xs text-muted-foreground">
            Updated: {new Date(item.updated_at).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["draft", "review", "published"] as const).map((status) => (
          <Button
            key={status}
            size="sm"
            variant={currentStatus === status ? "default" : "outline"}
            onClick={() => handleStatusChange(status)}
            disabled={updating}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function StatusBadge({ status }: { status?: ContentStatus }) {
  const effectiveStatus = status || "draft";
  return (
    <Badge className={statusColors[effectiveStatus]}>
      {effectiveStatus.charAt(0).toUpperCase() + effectiveStatus.slice(1)}
    </Badge>
  );
}
