import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  FileText,
  Hash,
  Hexagon,
  Search,
  User,
} from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { CLUSTERS, NODES, NODE_BY_ID } from "@/data/atlas/catalog";
import { cn } from "@/lib/utils";
import type { AtlasNode, ClusterId, NodeKind } from "@/data/atlas/types";
import { useAtlas } from "@/store/atlas";
import { clusterColor } from "./GraphCanvas";

function KindIcon({ kind, className }: { kind: NodeKind; className?: string }) {
  const cls = cn("size-3.5 shrink-0", className);
  if (kind === "hub" || kind === "atlas") return <Hexagon className={cls} strokeWidth={1.8} />;
  if (kind === "figure") return <User className={cls} strokeWidth={1.8} />;
  if (kind === "concept") return <Hash className={cls} strokeWidth={1.8} />;
  return <FileText className={cls} strokeWidth={1.8} />;
}

function NodeRow({ node, depth }: { node: AtlasNode; depth: number }) {
  const selectedId = useAtlas((s) => s.selectedId);
  const select = useAtlas((s) => s.select);
  const openArticle = useAtlas((s) => s.openArticle);
  const bookmarks = useAtlas((s) => s.bookmarks);
  const active = selectedId === node.id;
  return (
    <button
      type="button"
      onClick={() => select(node.id)}
      onDoubleClick={() => openArticle(node.id)}
      className={cn(
        "group flex w-full items-center gap-1.5 rounded-xs py-1 pr-2 text-left text-[12.5px] leading-tight",
        active ? "bg-bg-active text-fg" : "text-fg-muted hover:bg-bg-hover hover:text-fg",
      )}
      style={{ paddingLeft: 8 + depth * 12 }}
    >
      <KindIcon
        kind={node.kind}
        className="opacity-80"
      />
      <span
        className="min-w-0 flex-1 truncate"
        style={active ? { color: clusterColor(node.cluster) } : undefined}
      >
        {node.title}
      </span>
      {bookmarks.includes(node.id) && (
        <Bookmark className="size-3 fill-accent text-accent opacity-80" />
      )}
    </button>
  );
}

function Folder({
  id,
  title,
  children,
  color,
  count,
}: {
  id: string;
  title: string;
  children: ReactNode;
  color?: string;
  count?: number;
}) {
  const expanded = useAtlas((s) => s.expandedFolders.includes(id));
  const toggle = useAtlas((s) => s.toggleFolder);
  return (
    <div>
      <button
        type="button"
        onClick={() => toggle(id)}
        className="flex w-full items-center gap-1 rounded-xs px-2 py-1 text-left text-[12px] font-medium text-fg-muted hover:bg-bg-hover hover:text-fg"
      >
        {expanded ? (
          <ChevronDown className="size-3.5 opacity-70" />
        ) : (
          <ChevronRight className="size-3.5 opacity-70" />
        )}
        <span
          className="size-1.5 rounded-full"
          style={{ background: color ?? "#9299A1" }}
        />
        <span className="min-w-0 flex-1 truncate">{title}</span>
        {count != null && (
          <span className="font-mono text-[10px] tabular-nums text-fg-subtle">{count}</span>
        )}
      </button>
      {expanded && <div>{children}</div>}
    </div>
  );
}

function FilesPane() {
  const filter = useAtlas((s) => s.explorerFilter).trim().toLowerCase();
  const grouped = useMemo(() => {
    const match = (n: AtlasNode) =>
      !filter ||
      n.title.toLowerCase().includes(filter) ||
      n.tags.some((t) => t.includes(filter));
    return CLUSTERS.map((c) => {
      const all = NODES.filter((n) => n.cluster === c.id && match(n));
      return {
        cluster: c,
        topics: all.filter((n) => n.kind === "topic" || n.kind === "hub"),
        figures: all.filter((n) => n.kind === "figure"),
        concepts: all.filter((n) => n.kind === "concept"),
      };
    });
  }, [filter]);

  return (
    <div className="atlas-scroll flex-1 overflow-y-auto py-1">
      <Folder id="atlas" title="Atlas" color="#EAFBEA" count={1}>
        {NODE_BY_ID["knowledge-atlas"] && (
          <NodeRow node={NODE_BY_ID["knowledge-atlas"]} depth={1} />
        )}
      </Folder>
      {grouped.map(({ cluster, topics, figures, concepts }) => {
        const total = topics.length + figures.length + concepts.length;
        if (filter && total === 0) return null;
        return (
          <Folder
            key={cluster.id}
            id={cluster.id}
            title={cluster.title}
            color={cluster.accent}
            count={total}
          >
            <Folder id={`${cluster.id}-topics`} title="Topics" count={topics.length}>
              {topics.map((n) => (
                <NodeRow key={n.id} node={n} depth={2} />
              ))}
            </Folder>
            <Folder id={`${cluster.id}-figures`} title="Figures" count={figures.length}>
              {figures.map((n) => (
                <NodeRow key={n.id} node={n} depth={2} />
              ))}
            </Folder>
            <Folder id={`${cluster.id}-concepts`} title="Concepts" count={concepts.length}>
              {concepts.map((n) => (
                <NodeRow key={n.id} node={n} depth={2} />
              ))}
            </Folder>
          </Folder>
        );
      })}
    </div>
  );
}

function TagsPane() {
  const tags = useMemo(() => {
    const m = new Map<string, number>();
    for (const n of NODES) for (const t of n.tags) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, []);
  const select = useAtlas((s) => s.select);
  return (
    <div className="atlas-scroll flex-1 overflow-y-auto p-2">
      <ul className="flex flex-col gap-0.5">
        {tags.map(([tag, count]) => (
          <li key={tag}>
            <button
              type="button"
              onClick={() => {
                const n = NODES.find((x) => x.tags.includes(tag));
                if (n) select(n.id);
                useAtlas.getState().setExplorerFilter(tag);
                useAtlas.getState().setRail("files");
              }}
              className="flex w-full items-center justify-between rounded-xs px-2 py-1 text-[12px] text-fg-muted hover:bg-bg-hover hover:text-fg"
            >
              <span className="flex items-center gap-1.5">
                <Hash className="size-3 text-accent-dim" />
                {tag}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-fg-subtle">{count}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StarredPane() {
  const bookmarks = useAtlas((s) => s.bookmarks);
  const recent = useAtlas((s) => s.recent);
  return (
    <div className="atlas-scroll flex-1 overflow-y-auto py-1">
      <p className="px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-fg-subtle">Starred</p>
      {bookmarks.length === 0 && (
        <p className="px-3 py-2 text-[12px] text-fg-subtle">No starred notes yet.</p>
      )}
      {bookmarks.map((id) => NODE_BY_ID[id] && <NodeRow key={id} node={NODE_BY_ID[id]} depth={0} />)}
      <p className="mt-3 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-fg-subtle">Recent</p>
      {recent.map((id) => NODE_BY_ID[id] && <NodeRow key={`r-${id}`} node={NODE_BY_ID[id]} depth={0} />)}
    </div>
  );
}

export function Explorer() {
  const rail = useAtlas((s) => s.rail);
  const filter = useAtlas((s) => s.explorerFilter);
  const setFilter = useAtlas((s) => s.setExplorerFilter);
  const title =
    rail === "tags" ? "Tags" : rail === "starred" ? "Starred" : rail === "graph" ? "Graph files" : "Explorer";

  return (
    <aside className="flex h-full min-w-0 flex-col border-r border-border bg-bg-sidebar">
      <div className="flex h-10 items-center justify-between border-b border-border px-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-muted">{title}</h2>
        <span className="font-mono text-[10px] tabular-nums text-fg-subtle">{NODES.length}</span>
      </div>
      {rail !== "tags" && rail !== "starred" && (
        <div className="border-b border-border px-2 py-2">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-fg-subtle" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter"
              className="h-8 w-full rounded-sm border border-border bg-bg pr-2 pl-7 text-[12px] text-fg placeholder:text-fg-subtle"
            />
          </label>
        </div>
      )}
      {rail === "tags" ? <TagsPane /> : rail === "starred" ? <StarredPane /> : <FilesPane />}
    </aside>
  );
}
