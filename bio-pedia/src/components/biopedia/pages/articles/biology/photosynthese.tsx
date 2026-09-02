import { BookOpenText, CheckCircle2, ChevronRight, Leaf, Microscope, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import discoveryLeaf from "@/assets/discovery-leaf.jpg";
import { AppShell } from "@/components/biopedia/AppShell";

const topicTags = ["Plants", "Energy", "Chloroplasts", "Biological Process"];

export default function PhotosyntheseTopicPage() {
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
              {[
                "Overview",
                "Where Does It Happen?",
                "The Process of Photosynthesis",
                "The Two Main Stages",
                "Light-Dependent Reactions",
                "Light-Independent Reactions",
                "Factors Affecting Photosynthesis",
                "Importance of Photosynthesis",
                "Examples",
                "Summary",
              ].map((item, index) => (
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

          <section className="bio-panel">
            <div className="border-b border-border px-4 py-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="size-4 text-primary" />
                Quick Facts
              </h2>
            </div>
            <div className="space-y-3 p-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Fact label="Type" value="Anabolic process" />
                <Fact label="Occurs in" value="Chloroplasts" />
                <Fact label="Required for" value="Plant growth, oxygen production, and energy" />
                <Fact label="Discovered by" value="Jan Ingenhousz (1779)" />
              </div>
            </div>
          </section>
        </aside>
      }
    >
      <div className="max-w-5xl">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Home</span>
          <span>›</span>
          <span>Biological Processes</span>
          <span>›</span>
          <span className="font-medium text-primary">Photosynthesis</span>
        </nav>

        <header className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/80">
          <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
                Photosynthesis
              </h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <CheckCircle2 className="size-3.5" />
                Reviewed by Experts
              </div>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Photosynthesis is the fundamental biochemical process by which plants, algae, and certain bacteria convert light energy from the sun into chemical energy stored in glucose molecules. This process is essential for virtually all life on Earth, as it produces oxygen and organic compounds that sustain entire ecosystems.
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
                alt="Leaf under sunlight"
                className="h-full min-h-[220px] w-full object-cover"
              />
            </div>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap gap-2 rounded-2xl border border-border bg-card/80 p-2">
          {[
            "Overview",
            "Key Concepts",
            "Process Steps",
            "Examples",
            "Importance",
            "References",
          ].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                index === 0
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {index === 0 && <BookOpenText className="size-4" />}
              {index === 1 && <Leaf className="size-4" />}
              {index === 2 && <Sparkles className="size-4" />}
              {index === 3 && <Microscope className="size-4" />}
              {tab}
            </button>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card/80 p-6">
          <h2 className="text-3xl font-bold text-foreground">Overview</h2>

          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              Photosynthesis occurs mainly in the chloroplasts of plant cells. It uses light energy
              from the sun to convert carbon dioxide and water into glucose (a sugar) and oxygen.
              The overall equation for photosynthesis is:
            </p>

            <div className="overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 text-lg font-semibold text-foreground">
                <span>6CO₂</span>
                <span>+</span>
                <span>6H₂O</span>
                <span>+ light energy</span>
                <span>→</span>
                <span>C₆H₁₂O₆</span>
                <span>+</span>
                <span>6O₂</span>
              </div>
              <div className="mt-3 flex justify-center gap-8 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <span>Carbon dioxide</span>
                <span>Water</span>
                <span>Light energy</span>
                <span>Glucose</span>
                <span>Oxygen</span>
              </div>
            </div>

            <p>
              This process is fundamental to life on Earth, providing energy for organisms and
              helping to regulate the atmosphere by releasing oxygen.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card/80 p-6">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_1.2fr] lg:items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground">Where Does It Happen?</h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Photosynthesis takes place in the chloroplasts, which are found in the cells of
                green plants and algae. Chloroplasts contain chlorophyll, the green pigment that
                captures light energy.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary p-4">
              <div className="relative mx-auto flex h-56 max-w-md items-center justify-center">
                <div className="absolute h-36 w-36 rounded-full border border-primary/50 bg-primary/20 shadow-[0_0_40px_rgba(120,200,100,0.3)]" />
                <div className="absolute h-28 w-28 rounded-full border border-primary/50 bg-primary/20" />
                <div className="absolute h-52 w-48 rounded-[45%] border border-primary/60 bg-gradient-to-br from-lime-300/80 via-green-400/70 to-emerald-600/80" />
                <div className="absolute h-24 w-24 rounded-full border border-primary/70 bg-gradient-to-br from-lime-100 via-lime-300 to-emerald-500" />
                <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/70" />
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span>Outer membrane</span>
                <span>Inner membrane</span>
                <span>Stroma</span>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/15 p-2 text-primary">
                <Leaf className="size-4" />
              </div>
              <h4 className="text-xl font-semibold text-foreground">Key Takeaway</h4>
            </div>
            <p className="mt-3 text-base text-muted-foreground">
              Chloroplasts are the “solar panels” of the cell, capturing light energy and converting
              it into chemical energy in the form of glucose.
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xs font-medium text-foreground">{value}</p>
    </div>
  );
}
