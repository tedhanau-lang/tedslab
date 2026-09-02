import { Bookmark, ChevronDown, ExternalLink, FileText } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { ARTICLES } from "@/data/atlas/articles/compose";
import { CLUSTERS, NODE_BY_ID, NODES, backlinksTo, neighborsOf } from "@/data/atlas/catalog";
import { extractHeadings } from "@/lib/wiki";
import { cn } from "@/lib/utils";
import { useAtlas } from "@/store/atlas";
import { clusterColor } from "./GraphCanvas";

function Section({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <ChevronDown
          className={cn("size-3.5 text-fg-subtle transition-transform duration-150", !open && "-rotate-90")}
        />
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg-muted">{title}</span>
        {count != null && (
          <span className="ml-auto font-mono text-[10px] tabular-nums text-fg-subtle">{count}</span>
        )}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </section>
  );
}

function LinkList({ ids, onOpen }: { ids: string[]; onOpen: (id: string) => void }) {
  if (!ids.length) return <p className="text-[12px] text-fg-subtle">None</p>;
  return (
    <ul className="flex flex-col gap-0.5">
      {ids.map((id) => {
        const n = NODE_BY_ID[id];
        if (!n) return null;
        return (
          <li key={id}>
            <button
              type="button"
              onClick={() => onOpen(id)}
              className="flex w-full items-center gap-2 rounded-xs px-1 py-1 text-left text-[12px] text-fg-muted hover:bg-bg-hover hover:text-fg"
            >
              <span className="size-1.5 rounded-full" style={{ background: clusterColor(n.cluster) }} />
              <span className="truncate">{n.title}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function Inspector() {
  const selectedId = useAtlas((s) => s.selectedId);
  const select = useAtlas((s) => s.select);
  const openArticle = useAtlas((s) => s.openArticle);
  const bookmarks = useAtlas((s) => s.bookmarks);
  const toggleBookmark = useAtlas((s) => s.toggleBookmark);
  const node = selectedId ? NODE_BY_ID[selectedId] : undefined;
  const article = selectedId ? ARTICLES[selectedId] : undefined;

  const outgoing = node?.related.filter((id) => NODE_BY_ID[id]) ?? [];
  const backs = node ? backlinksTo(node.id) : [];
  const neigh = node ? neighborsOf(node.id) : [];
  const headings = article ? extractHeadings(article.body) : [];
  const cluster = node && node.cluster !== "atlas" ? CLUSTERS.find((c) => c.id === node.cluster) : undefined;

  const tagCloud = useMemo(() => {
    const m = new Map<string, number>();
    for (const n of NODES) for (const t of n.tags) m.set(t, (m.get(t) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 18);
  }, []);

  if (!node) {
    return (
      <aside className="flex h-full min-w-0 flex-col border-l border-border bg-bg-sidebar">
        <div className="flex h-10 items-center border-b border-border px-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-muted">Inspector</h2>
        </div>
        <p className="p-4 text-[12.5px] leading-relaxed text-fg-subtle">
          Select a node in the graph or explorer to inspect its properties, outline, and links.
        </p>
        <Section title="Vault tags" count={tagCloud.length}>
          <div className="flex flex-wrap gap-1">
            {tagCloud.map(([t, n]) => (
              <span
                key={t}
                className="rounded-sm bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-fg-muted"
              >
                {t} {n}
              </span>
            ))}
          </div>
        </Section>
      </aside>
    );
  }

  const starred = bookmarks.includes(node.id);

  return (
    <aside className="flex h-full min-w-0 flex-col border-l border-border bg-bg-sidebar">
      <div className="flex h-10 items-center gap-2 border-b border-border px-3">
        <h2 className="min-w-0 flex-1 truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-muted">
          Inspector
        </h2>
        <button
          type="button"
          title={starred ? "Unstar" : "Star"}
          onClick={() => toggleBookmark(node.id)}
          className={cn(
            "flex size-7 items-center justify-center rounded-sm",
            starred ? "text-accent" : "text-fg-subtle hover:text-fg",
          )}
        >
          <Bookmark className={cn("size-3.5", starred && "fill-accent")} />
        </button>
      </div>
      <div className="atlas-scroll flex-1 overflow-y-auto">
        <div className="border-b border-border px-3 py-3">
          <p className="text-[10px] uppercase tracking-[0.14em] text-fg-subtle">{node.kind}</p>
          <h3 className="mt-1 font-serif text-[18px] leading-snug tracking-tight text-fg">{node.title}</h3>
          <p className="mt-2 text-[12.5px] leading-relaxed text-fg-muted">{node.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span
              className="rounded-sm px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                color: clusterColor(node.cluster),
                background: "color-mix(in oklab, var(--color-accent) 12%, transparent)",
              }}
            >
              {cluster?.title ?? "Atlas"}
            </span>
            {node.born && (
              <span className="rounded-sm bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
                {node.born}
              </span>
            )}
            {article && (
              <span className="rounded-sm bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-fg-muted">
                {article.wordCount.toLocaleString()} words
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => openArticle(node.id)}
            className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-sm bg-fg px-2.5 text-[12px] font-medium text-bg transition-opacity hover:opacity-90"
          >
            <FileText className="size-3.5" />
            Open article
            <ExternalLink className="size-3 opacity-70" />
          </button>
        </div>

        <Section title="Tags" count={node.tags.length}>
          <div className="flex flex-wrap gap-1">
            {node.tags.map((t) => (
              <span key={t} className="rounded-sm bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
                {t}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Outline" count={headings.length}>
          <ul className="flex flex-col gap-1">
            {headings.map((h) => (
              <li key={h} className="text-[12px] text-fg-muted">
                {h}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Outgoing" count={outgoing.length}>
          <LinkList
            ids={outgoing}
            onOpen={(id) => {
              select(id);
            }}
          />
        </Section>

        <Section title="Backlinks" count={backs.length}>
          <LinkList ids={backs} onOpen={(id) => select(id)} />
        </Section>

        <Section title="Neighborhood" count={neigh.length} defaultOpen={false}>
          <LinkList ids={neigh} onOpen={(id) => select(id)} />
        </Section>
      </div>
    </aside>
  );
}
