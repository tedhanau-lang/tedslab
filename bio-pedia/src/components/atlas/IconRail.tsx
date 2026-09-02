import { Bookmark, Files, Network, Search, Settings2, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAtlas, type RailTab } from "@/store/atlas";

const ITEMS: { id: RailTab; icon: typeof Files; label: string }[] = [
  { id: "files", icon: Files, label: "Explorer" },
  { id: "search", icon: Search, label: "Search" },
  { id: "graph", icon: Network, label: "Graph" },
  { id: "tags", icon: Tags, label: "Tags" },
  { id: "starred", icon: Bookmark, label: "Starred" },
];

export function IconRail() {
  const rail = useAtlas((s) => s.rail);
  const setRail = useAtlas((s) => s.setRail);
  const setSearchOpen = useAtlas((s) => s.setSearchOpen);
  const explorerOpen = useAtlas((s) => s.explorerOpen);
  const toggleExplorer = useAtlas((s) => s.toggleExplorer);

  const onClick = (id: RailTab) => {
    if (id === "search") {
      setSearchOpen(true);
      return;
    }
    if (id === rail && explorerOpen) toggleExplorer();
    else setRail(id);
  };

  return (
    <nav
      className="flex h-full w-12 shrink-0 flex-col items-center border-r border-border bg-bg py-2"
      aria-label="Primary"
    >
      <div className="mb-3 flex size-8 items-center justify-center rounded-md bg-bg-elevated text-[11px] font-semibold tracking-tight text-accent">
        KA
      </div>
      <div className="flex flex-1 flex-col items-center gap-1">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const active = rail === it.id && explorerOpen && it.id !== "search";
          return (
            <button
              key={it.id}
              type="button"
              title={it.label}
              aria-label={it.label}
              aria-pressed={active}
              onClick={() => onClick(it.id)}
              className={cn(
                "relative flex size-10 items-center justify-center rounded-md text-fg-muted transition-colors duration-150",
                active ? "bg-bg-active text-fg" : "hover:bg-bg-hover hover:text-fg",
              )}
            >
              {active && <span className="absolute left-0 h-5 w-0.5 rounded-full bg-accent" />}
              <Icon className="size-4" strokeWidth={1.6} />
            </button>
          );
        })}
      </div>
      <button
        type="button"
        title="Display"
        aria-label="Display settings"
        onClick={() => useAtlas.getState().setSearchOpen(true)}
        className="flex size-10 items-center justify-center rounded-md text-fg-subtle hover:bg-bg-hover hover:text-fg"
      >
        <Settings2 className="size-4" strokeWidth={1.6} />
      </button>
    </nav>
  );
}
