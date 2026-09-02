import { Bookmark, History, Search, Sun, Moon, User } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";

export function TopBar({
  query,
  onQueryChange,
  bookmarkCount,
  compact,
  onToggleCompact,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  bookmarkCount: number;
  compact: boolean;
  onToggleCompact: () => void;
}) {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:px-6">
      <label className="relative flex-1 max-w-2xl">
        <span className="sr-only">Search Ted's Lab</span>
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search topics, organisms, processes..."
          className="h-11 w-full rounded-full border border-border bg-card pr-11 pl-5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-ring/30"
        />
        <Search className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground" />
      </label>

      <div className="ml-auto hidden items-center gap-5 md:flex">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <Bookmark className="size-4" />
          Bookmarks
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-foreground">
            {bookmarkCount}
          </span>
        </span>
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <History className="size-4" />
          History
        </span>
        <button
          type="button"
          onClick={onToggleCompact}
          aria-pressed={compact}
          aria-label="Toggle compact reading mode"
          className="flex h-8 w-14 items-center rounded-full border border-border bg-secondary px-1 transition-colors"
        >
          <span
            className={`flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform ${
              compact ? "translate-x-6" : "translate-x-0"
            }`}
          >
            {compact ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
          </span>
        </button>
        {user && (
          <div className="flex items-center gap-2 border-l border-border pl-4">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary/15">
                <User className="size-4 text-primary" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-medium">My dashboard</p>
                <p className="max-w-[10rem] truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
