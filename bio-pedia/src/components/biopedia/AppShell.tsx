import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { QuoteBar } from "./QuoteBar";
import { useBookmarks } from "@/hooks/use-bookmarks";

export function AppShell({
  children,
  rail,
}: {
  children: ReactNode | ((query: string) => ReactNode);
  rail?: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState(false);
  const { bookmarks } = useBookmarks();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          query={query}
          onQueryChange={setQuery}
          bookmarkCount={bookmarks.length}
          compact={compact}
          onToggleCompact={() => setCompact((c) => !c)}
        />
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 xl:flex-row">
          <div className="min-w-0 flex-1">
            {typeof children === "function" ? children(query.trim().toLowerCase()) : children}
            <QuoteBar />
          </div>
          {rail}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="bio-panel p-6">
      <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  );
}
