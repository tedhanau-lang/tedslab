import { Bookmark, Files, Network, Search, Tags } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useAtlas } from "@/store/atlas";
import { ArticlePane } from "./ArticlePane";
import { Explorer } from "./Explorer";
import { GraphCanvas } from "./GraphCanvas";
import { IconRail } from "./IconRail";
import { Inspector } from "./Inspector";
import { SearchModal } from "./SearchModal";
import { StatusBar } from "./StatusBar";
import { Toolbar } from "./Toolbar";

function Center() {
  const view = useAtlas((s) => s.view);
  const openArticleId = useAtlas((s) => s.openArticleId);
  const selectedId = useAtlas((s) => s.selectedId);

  useEffect(() => {
    if (view === "article" && !openArticleId && selectedId) {
      useAtlas.getState().openArticle(selectedId);
    }
  }, [view, openArticleId, selectedId]);

  if (view === "article") return <ArticlePane />;
  if (view === "split") {
    return (
      <div className="flex h-full min-h-0">
        <div className="min-w-0 flex-1">
          <GraphCanvas />
        </div>
        <div className="min-w-0 flex-1 border-l border-border">
          <ArticlePane />
        </div>
      </div>
    );
  }
  return <GraphCanvas />;
}

export function AtlasApp() {
  const explorerOpen = useAtlas((s) => s.explorerOpen);
  const inspectorOpen = useAtlas((s) => s.inspectorOpen);
  const rail = useAtlas((s) => s.rail);
  const setRail = useAtlas((s) => s.setRail);
  const setSearchOpen = useAtlas((s) => s.setSearchOpen);
  const toggleExplorer = useAtlas((s) => s.toggleExplorer);
  const toggleInspector = useAtlas((s) => s.toggleInspector);

  useEffect(() => {
    if (window.innerWidth < 768) {
      useAtlas.setState({ explorerOpen: false, inspectorOpen: false });
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "\\" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleExplorer();
      }
      if (e.key === "]" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleInspector();
      }
      if (e.key === "Enter" && !useAtlas.getState().searchOpen) {
        const id = useAtlas.getState().selectedId;
        const t = e.target as HTMLElement | null;
        if (id && t && t.tagName !== "INPUT" && t.tagName !== "TEXTAREA") {
          useAtlas.getState().openArticle(id);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleExplorer, toggleInspector]);

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-bg text-fg">
      <div className="flex min-h-0 flex-1">
        <div className="hidden md:flex">
          <IconRail />
        </div>
        {explorerOpen && (
          <div className="hidden w-[268px] shrink-0 md:block">
            <Explorer />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <Toolbar />
          <div className="relative min-h-0 flex-1">
            <div className="absolute inset-0">
              <Center />
            </div>
          </div>
          <StatusBar />
        </div>
        {inspectorOpen && (
          <div className="hidden w-[300px] shrink-0 md:block">
            <Inspector />
          </div>
        )}
      </div>

      <div className="flex h-12 items-center justify-around border-t border-border bg-bg md:hidden">
        {(
          [
            ["files", Files, "Files"],
            ["search", Search, "Search"],
            ["graph", Network, "Graph"],
            ["tags", Tags, "Tags"],
            ["starred", Bookmark, "Starred"],
          ] as const
        ).map(([id, Icon, label]) => (
          <button
            key={id}
            type="button"
            className={cn(
              "flex min-h-11 min-w-11 flex-col items-center justify-center gap-0.5 text-[10px]",
              rail === id ? "text-accent" : "text-fg-muted",
            )}
            onClick={() => {
              if (id === "search") setSearchOpen(true);
              else if (id === "graph") {
                useAtlas.getState().setView("graph");
                if (explorerOpen) toggleExplorer();
              } else setRail(id);
            }}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>
      {explorerOpen && (
        <div className="absolute inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-bg/70"
            aria-label="Close explorer"
            onClick={toggleExplorer}
          />
          <div className="absolute inset-y-0 left-0 w-[84%] max-w-xs shadow-2xl">
            <Explorer />
          </div>
        </div>
      )}
      <SearchModal />
    </div>
  );
}
