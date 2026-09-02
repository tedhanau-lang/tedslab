import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, BrainCircuit, NotebookPen, Sparkles, BookmarkCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useSubjects, useArticles } from "@/lib/content";
import { resolveImage } from "@/lib/images";

const NOTES_KEY = "biopedia:notes";

type Note = {
  id: string;
  text: string;
  created: string;
};

export const Route = createFileRoute("/_authenticated/dashboard")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Your dashboard — Ted's Lab" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, isAdmin, loading } = useAuth();
  const { bookmarks } = useBookmarks();
  const { data: subjects = [] } = useSubjects();
  const { data: articles = [] } = useArticles();
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      if (raw) setNotes(JSON.parse(raw) as Note[]);
    } catch {
      /* ignore */
    }
  }, []);

  const saved = useMemo(() => articles.filter((a) => bookmarks.includes(a.slug)), [articles, bookmarks]);
  const recentNotes = notes.slice(0, 3);
  const studyMomentum = Math.min(100, Math.round(((bookmarks.length + notes.length) / 8) * 100));

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Your learning space</p>
          <h1 className="mt-2 text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isAdmin && (
            <Button asChild variant="outline">
              <Link to="/admin">Admin</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link to="/settings">Settings</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Browse site</Link>
          </Button>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>
            Sign out
          </Button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="bio-panel p-4">
          <p className="text-xs text-muted-foreground">Saved items</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{bookmarks.length}</p>
        </div>
        <div className="bio-panel p-4">
          <p className="text-xs text-muted-foreground">Notebook notes</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{notes.length}</p>
        </div>
        <div className="bio-panel p-4">
          <p className="text-xs text-muted-foreground">Published articles</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {articles.filter((a) => a.published).length}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link to="/ai" className="bio-panel flex h-full flex-col justify-between p-5 transition-colors hover:border-primary/50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BrainCircuit className="size-5" />
            </div>
            <p className="text-sm font-medium text-foreground">AI Tutor</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Ask for explanations, revision prompts, and study guidance.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            Open AI <ArrowRight className="size-4" />
          </span>
        </Link>

        <Link to="/notebook" className="bio-panel flex h-full flex-col justify-between p-5 transition-colors hover:border-primary/50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <NotebookPen className="size-5" />
            </div>
            <p className="text-sm font-medium text-foreground">Notes</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Capture ideas, chapter summaries, and the things you want to revisit.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            Open notebook <ArrowRight className="size-4" />
          </span>
        </Link>

        <Link to="/saved" className="bio-panel flex h-full flex-col justify-between p-5 transition-colors hover:border-primary/50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookmarkCheck className="size-5" />
            </div>
            <p className="text-sm font-medium text-foreground">Saved</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Keep your important articles and study material in one place.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            View saved <ArrowRight className="size-4" />
          </span>
        </Link>

        <Link to="/articles" className="bio-panel flex h-full flex-col justify-between p-5 transition-colors hover:border-primary/50">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>
            <p className="text-sm font-medium text-foreground">Learn</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Continue through the encyclopedia and discover new topics.</p>
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            Explore topics <ArrowRight className="size-4" />
          </span>
        </Link>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="bio-panel p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg font-semibold">Study momentum</h2>
            <span className="text-sm font-medium text-primary">{studyMomentum}%</span>
          </div>
          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${studyMomentum}%` }} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Saved</p>
              <p className="mt-1 text-xl font-bold text-foreground">{bookmarks.length}</p>
            </div>
            <div className="rounded-xl bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Notes</p>
              <p className="mt-1 text-xl font-bold text-foreground">{notes.length}</p>
            </div>
            <div className="rounded-xl bg-secondary p-3">
              <p className="text-xs text-muted-foreground">Focus</p>
              <p className="mt-1 text-xl font-bold text-foreground">{subjects.length}</p>
            </div>
          </div>
        </div>

        <div className="bio-panel p-5">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="size-4" />
            <p className="text-sm font-semibold uppercase tracking-[0.12em]">Recent notes</p>
          </div>

          {recentNotes.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No notes yet. Write a quick summary in your notebook to start building your learning trail.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentNotes.map((note) => (
                <li key={note.id} className="rounded-xl border border-border bg-secondary/40 p-3">
                  <p className="line-clamp-3 text-sm text-foreground">{note.text}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.08em] text-muted-foreground">{note.created}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold">Continue exploring</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {subjects.map((s) => (
            <Link
              key={s.id}
              to={`/${s.slug}`}
              className="overflow-hidden bio-panel transition-colors hover:border-primary/50"
            >
              <img
                src={resolveImage(s.image_url, s.image_key)}
                alt={s.title}
                loading="lazy"
                className="h-20 w-full object-cover"
              />
              <p className="p-3 text-sm font-semibold">{s.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold">Your saved articles</h2>
        {saved.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing saved yet — bookmark articles as you read to see them here.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {saved.map((a) => (
              <li key={a.id} className="bio-panel p-3 text-sm">
                {a.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
