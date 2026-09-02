import { ArrowLeft, Bookmark, Clock, Network } from "lucide-react";
import { ARTICLES } from "@/data/atlas/articles/compose";
import { CLUSTERS, NODE_BY_ID, neighborsOf } from "@/data/atlas/catalog";
import { WikiBody } from "@/lib/wiki";
import { cn } from "@/lib/utils";
import { useAtlas } from "@/store/atlas";
import { clusterColor } from "./GraphCanvas";

export function ArticlePane() {
  const openArticleId = useAtlas((s) => s.openArticleId);
  const selectedId = useAtlas((s) => s.selectedId);
  const openId = openArticleId ?? selectedId;
  const select = useAtlas((s) => s.select);
  const openArticle = useAtlas((s) => s.openArticle);
  const closeArticle = useAtlas((s) => s.closeArticle);
  const setView = useAtlas((s) => s.setView);
  const bookmarks = useAtlas((s) => s.bookmarks);
  const toggleBookmark = useAtlas((s) => s.toggleBookmark);

  const article = openId ? ARTICLES[openId] : undefined;
  const node = openId ? NODE_BY_ID[openId] : undefined;

  if (!article || !node) {
    return (
      <div className="flex h-full items-center justify-center bg-canvas px-6 text-center">
        <p className="max-w-sm text-[13px] text-fg-muted">
          Select a node and open its article to read a long-form entry from the vault.
        </p>
      </div>
    );
  }

  const cluster = node.cluster === "atlas" ? null : CLUSTERS.find((c) => c.id === node.cluster);
  const mins = Math.max(4, Math.round(article.wordCount / 220));
  const next = neighborsOf(node.id)
    .map((id) => NODE_BY_ID[id])
    .filter(Boolean)
    .slice(0, 8);
  const starred = bookmarks.includes(node.id);

  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
        <button
          type="button"
          onClick={() => {
            closeArticle();
            setView("graph");
          }}
          className="flex size-8 items-center justify-center rounded-sm text-fg-muted hover:bg-bg-hover hover:text-fg"
          title="Back to graph"
        >
          <ArrowLeft className="size-4" />
        </button>
        <Network className="size-3.5 text-accent" />
        <span className="min-w-0 truncate text-[12px] text-fg-muted">{article.title}</span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => toggleBookmark(node.id)}
          className={cn("flex size-8 items-center justify-center rounded-sm", starred ? "text-accent" : "text-fg-subtle")}
        >
          <Bookmark className={cn("size-3.5", starred && "fill-accent")} />
        </button>
      </div>
      <div className="atlas-scroll min-h-0 flex-1 overflow-y-auto">
        <article className="mx-auto w-full max-w-[42rem] px-5 py-10 sm:px-8">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-fg-subtle">
            {cluster?.title ?? "Atlas"} · {node.kind}
          </p>
          <h1 className="mt-2 font-serif text-[2rem] leading-[1.15] tracking-[-0.03em] text-fg sm:text-[2.35rem]">
            {article.title}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-fg-muted">{article.summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-[12px] text-fg-subtle">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {mins} min read
            </span>
            <span className="font-mono tabular-nums">{article.wordCount.toLocaleString()} words</span>
            {node.born && <span>{node.born}</span>}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {article.tags.map((t) => (
              <span key={t} className="rounded-sm bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <WikiBody
              markdown={article.body}
              onNavigate={(id) => {
                select(id);
                openArticle(id);
              }}
            />
          </div>
          <nav className="mt-12 border-t border-border pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">Continue</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {next.map(
                (n) =>
                  n && (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => {
                          select(n.id);
                          openArticle(n.id);
                        }}
                        className="flex w-full items-start gap-2 rounded-md border border-border bg-bg-elevated px-3 py-2.5 text-left hover:border-border-strong"
                      >
                        <span
                          className="mt-1 size-2 shrink-0 rounded-full"
                          style={{ background: clusterColor(n.cluster) }}
                        />
                        <span>
                          <span className="block text-[13px] text-fg">{n.title}</span>
                          <span className="mt-0.5 line-clamp-2 text-[11px] text-fg-muted">{n.summary}</span>
                        </span>
                      </button>
                    </li>
                  ),
              )}
            </ul>
          </nav>
        </article>
      </div>
    </div>
  );
}
