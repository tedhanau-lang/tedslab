import { BookOpenText, CheckCircle2, ChevronRight, Leaf, Microscope, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import discoveryLeaf from "@/assets/discovery-leaf.jpg";
import { AppShell } from "@/components/biopedia/AppShell";

const topicTags = ["Photosynthesis", "Energy", "Light"];

export default function PhotosynthesisLightReactionsPage() {
  return (
    <AppShell
      rail={
        <aside className="w-full shrink-0 space-y-4 xl:w-80">
          <section className="bio-panel">
            <div className="border-b border-border px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BookOpenText className="size-4 text-primary" />
                Article Contents
              </h2>
            </div>
            <nav className="space-y-1 p-2 text-sm">
              {["Overview", "Key Concepts", "Process Steps", "Examples", "Summary"].map((item, index) => (
                <a
                  key={item}
                  href="#"
                  className={`flex items-center justify-between rounded-md px-3 py-2 transition-colors ${
                    index === 0
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <span>{item}</span>
                  {index !== 0 && <ChevronRight className="size-3.5" />}
                </a>
              ))}
            </nav>
          </section>
        </aside>
      }
    >
      <div className="max-w-5xl">
        <header className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/80">
          <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
                Photosynthesis: Light Reactions
              </h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <CheckCircle2 className="size-3.5" />
                Reviewed by Experts
              </div>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                The light reactions, occurring in the thylakoid membranes of chloroplasts, represent the light-dependent phase of photosynthesis where light energy is converted into chemical energy stored in ATP and NADPH.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {topicTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-secondary">
              <img
                src={discoveryLeaf}
                alt="Article illustration"
                className="h-full min-h-[220px] w-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-border bg-card/80 p-6">
          <h2 className="text-3xl font-bold text-foreground">Overview</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              The light-dependent reactions that power photosynthesis. This article explores the fundamental concepts, processes, and applications.
            </p>
          </div>
        </section>

        <div className="mt-8 flex items-center justify-between gap-3 rounded-xl border border-border bg-card/80 p-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Was this article helpful?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              <ThumbsUp className="size-3.5" />
              Yes
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-medium hover:bg-accent"
            >
              <ThumbsDown className="size-3.5" />
              No
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
