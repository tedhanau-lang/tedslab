import { FileText, Hash, Hexagon, Search, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NODES } from "@/data/atlas/catalog";
import { cn } from "@/lib/utils";
import type { NodeKind } from "@/data/atlas/types";
import { useAtlas } from "@/store/atlas";

function icon(kind: NodeKind) {
  if (kind === "hub" || kind === "atlas") return Hexagon;
  if (kind === "figure") return User;
  if (kind === "concept") return Hash;
  return FileText;
}

export function SearchModal() {
  const open = useAtlas((s) => s.searchOpen);
  const setOpen = useAtlas((s) => s.setSearchOpen);
  const select = useAtlas((s) => s.select);
  const openArticle = useAtlas((s) => s.openArticle);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!useAtlas.getState().searchOpen);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return NODES.slice(0, 12);
    return NODES.filter(
      (n) =>
        n.title.toLowerCase().includes(s) ||
        n.summary.toLowerCase().includes(s) ||
        n.tags.some((t) => t.includes(s)) ||
        n.id.includes(s),
    ).slice(0, 24);
  }, [q]);

  if (!open) return null;

  const go = (id: string, read: boolean) => {
    select(id);
    if (read) openArticle(id);
    setOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-bg/70 px-4 pt-[12vh] backdrop-blur-[2px]"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-label="Search the atlas"
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border-strong bg-bg-elevated shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="size-4 text-fg-subtle" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(results.length - 1, i + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(0, i - 1));
              } else if (e.key === "Enter" && results[active]) {
                go(results[active].id, e.metaKey || e.ctrlKey);
              }
            }}
            placeholder="Search notes, figures, tags…"
            className="h-11 flex-1 bg-transparent text-[14px] text-fg outline-none placeholder:text-fg-subtle"
          />
          <kbd className="rounded-xs border border-border px-1.5 font-mono text-[10px] text-fg-subtle">esc</kbd>
        </div>
        <ul className="atlas-scroll max-h-[52vh] overflow-y-auto py-1">
          {results.length === 0 && (
            <li className="px-4 py-6 text-center text-[13px] text-fg-subtle">No matching notes.</li>
          )}
          {results.map((n, i) => {
            const Icon = icon(n.kind);
            return (
              <li key={n.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(n.id, false)}
                  onDoubleClick={() => go(n.id, true)}
                  className={cn(
                    "flex w-full items-start gap-3 px-3 py-2 text-left",
                    i === active ? "bg-bg-active" : "hover:bg-bg-hover",
                  )}
                >
                  <Icon className="mt-0.5 size-4 text-accent-dim" strokeWidth={1.7} />
                  <span className="min-w-0">
                    <span className="block text-[13px] text-fg">{n.title}</span>
                    <span className="line-clamp-1 text-[11px] text-fg-muted">{n.summary}</span>
                  </span>
                  <span className="ml-auto shrink-0 font-mono text-[10px] text-fg-subtle">{n.kind}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="border-t border-border px-3 py-2 text-[11px] text-fg-subtle">
          Enter selects · ⌘Enter opens the article · double-click reads
        </p>
      </div>
    </div>
  );
}
