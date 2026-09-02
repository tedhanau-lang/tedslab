import { useState, type ReactNode } from "react";
import {
  ArrowLeftRight,
  BookOpen,
  Columns2,
  Focus,
  LocateFixed,
  Maximize2,
  Network,
  Palette,
  PanelLeft,
  PanelRight,
  ScanSearch,
  Sparkles,
  Spline,
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAtlas } from "@/store/atlas";

function Tool({
  active,
  title,
  onClick,
  children,
}: {
  active?: boolean;
  title: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex size-8 items-center justify-center rounded-sm text-fg-muted transition-colors duration-150",
        active ? "bg-bg-active text-accent" : "hover:bg-bg-hover hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

export function Toolbar() {
  const view = useAtlas((s) => s.view);
  const setView = useAtlas((s) => s.setView);
  const settings = useAtlas((s) => s.settings);
  const patch = useAtlas((s) => s.patchSettings);
  const setSearchOpen = useAtlas((s) => s.setSearchOpen);
  const selectedId = useAtlas((s) => s.selectedId);
  const explorerOpen = useAtlas((s) => s.explorerOpen);
  const inspectorOpen = useAtlas((s) => s.inspectorOpen);
  const toggleExplorer = useAtlas((s) => s.toggleExplorer);
  const toggleInspector = useAtlas((s) => s.toggleInspector);
  const [aiState, setAiState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [aiMessage, setAiMessage] = useState<string>("");

  async function runAiAssist() {
    if (aiState === "running") return;
    setAiState("running");
    setAiMessage("Generating today's articles…");
    try {
      const res = await fetch("/api/atlas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ perSubject: 10 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Generation failed");
      setAiState("done");
      setAiMessage(`Added ${data.added} new article(s). Reloading…`);
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setAiState("error");
      setAiMessage(err instanceof Error ? err.message : "Generation failed");
    }
  }

  return (
    <header className="flex h-10 shrink-0 items-center gap-1 border-b border-border bg-bg-sidebar px-2">
      <Tool title="Toggle explorer" active={explorerOpen} onClick={toggleExplorer}>
        <PanelLeft className="size-3.5" />
      </Tool>
      <div className="flex items-center gap-2 pr-2">
        <Network className="size-3.5 text-accent" strokeWidth={1.8} />
        <h1 className="text-[13px] font-medium tracking-tight text-fg">Knowledge Graph</h1>
      </div>
      <div className="mx-1 h-4 w-px bg-border-strong" />
      <Tool title="Graph view" active={view === "graph"} onClick={() => setView("graph")}>
        <Network className="size-3.5" />
      </Tool>
      <Tool title="Reader" active={view === "article"} onClick={() => setView("article")}>
        <BookOpen className="size-3.5" />
      </Tool>
      <Tool title="Split" active={view === "split"} onClick={() => setView("split")}>
        <Columns2 className="size-3.5" />
      </Tool>
      <div className="mx-1 h-4 w-px bg-border-strong" />
      <Tool title="Show labels" active={settings.showLabels} onClick={() => patch({ showLabels: !settings.showLabels })}>
        <Type className="size-3.5" />
      </Tool>
      <Tool
        title="Color groups"
        active={settings.colorGroups}
        onClick={() => patch({ colorGroups: !settings.colorGroups })}
      >
        <Palette className="size-3.5" />
      </Tool>
      <Tool
        title="Dim unrelated"
        active={settings.dimUnrelated}
        onClick={() => patch({ dimUnrelated: !settings.dimUnrelated })}
      >
        <Focus className="size-3.5" />
      </Tool>
      <Tool title="Local graph" active={settings.localMode} onClick={() => patch({ localMode: !settings.localMode })}>
        <LocateFixed className="size-3.5" />
      </Tool>
      <Tool title="Show arrows" active={settings.showArrows} onClick={() => patch({ showArrows: !settings.showArrows })}>
        <Spline className="size-3.5" />
      </Tool>
      <Tool title="Fit graph" onClick={() => window.dispatchEvent(new Event("atlas:fit"))}>
        <Maximize2 className="size-3.5" />
      </Tool>
      <div className="flex-1" />
      <span className="hidden max-w-[180px] truncate px-2 font-mono text-[10px] text-fg-subtle sm:block">
        {selectedId ?? "no selection"}
      </span>
      <Tool title="Search (⌘K)" onClick={() => setSearchOpen(true)}>
        <ScanSearch className="size-3.5" />
      </Tool>
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="ml-1 hidden h-7 items-center gap-2 rounded-sm border border-border bg-bg px-2 text-[11px] text-fg-subtle md:flex"
      >
        <span>Search</span>
        <kbd className="rounded-xs border border-border px-1 font-mono text-[9px]">⌘K</kbd>
      </button>
      <ArrowLeftRight className="ml-1 hidden size-3.5 text-fg-subtle lg:block" />
      <Tool
        title={aiMessage || "AI Assist: generate today's articles (local model, no API key)"}
        active={aiState === "running"}
        onClick={runAiAssist}
      >
        <Sparkles className={cn("size-3.5", aiState === "running" && "animate-pulse")} />
      </Tool>
      <Tool title="Toggle inspector" active={inspectorOpen} onClick={toggleInspector}>
        <PanelRight className="size-3.5" />
      </Tool>
    </header>
  );
}
