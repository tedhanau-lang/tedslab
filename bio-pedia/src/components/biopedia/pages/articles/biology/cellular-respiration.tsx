import { BookOpenText, CheckCircle2, ChevronRight, Leaf, Microscope, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import discoveryLeaf from "@/assets/discovery-leaf.jpg";
import { AppShell } from "@/components/biopedia/AppShell";

const topicTags = ["Cell Biology", "Energy", "Mitochondria", "Biological Process"];

export default function CellularRespirationPage() {
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
                "Glycolysis",
                "Krebs Cycle",
                "Electron Transport Chain",
                "Aerobic Respiration",
                "Anaerobic Respiration",
                "Energy Yield",
                "Comparison to Photosynthesis",
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
                <Fact label="Type" value="Catabolic process" />
                <Fact label="Occurs in" value="Mitochondria" />
                <Fact label="Required for" value="ATP production and energy" />
                <Fact label="ATP per glucose" value="36-38 molecules" />
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
          <span>Cell Biology</span>
          <span>›</span>
          <span className="font-medium text-primary">Cellular Respiration</span>
        </nav>

        <header className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/80">
          <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
                Cellular Respiration
              </h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <CheckCircle2 className="size-3.5" />
                Reviewed by Experts
              </div>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Cellular respiration is the process by which cells break down glucose and other organic molecules to extract chemical energy. This energy is released and used to form ATP, the primary energy currency of the cell, enabling all cellular functions including metabolism, growth, and reproduction.
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
                alt="Mitochondrial energy production"
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
            "Energy Yield",
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
              Cellular respiration is the process by which cells break down glucose to produce ATP (adenosine triphosphate), the energy currency of the cell. Unlike photosynthesis, which stores energy, respiration releases the energy stored in glucose molecules.
            </p>

            <div className="overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-5 text-center">
              <div className="text-sm font-semibold text-foreground">
                C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                Glucose + Oxygen yields Carbon Dioxide + Water + Energy
              </div>
            </div>

            <p>
              Cellular respiration occurs in three main stages: glycolysis, the Krebs cycle, and the electron transport chain. Each stage releases energy that is captured in ATP molecules.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card/80 p-6">
          <h3 className="text-3xl font-bold text-foreground">The Three Main Stages</h3>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <h4 className="font-semibold text-foreground">1. Glycolysis</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Occurs in the cytoplasm. One glucose molecule is broken into two pyruvate molecules, producing a small amount of ATP and NADH without requiring oxygen.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <h4 className="font-semibold text-foreground">2. Krebs Cycle (Citric Acid Cycle)</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Takes place in the mitochondrial matrix. Each pyruvate is converted to Acetyl-CoA, which enters the cycle. This stage produces CO₂, ATP, and electron carriers.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <h4 className="font-semibold text-foreground">3. Electron Transport Chain</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                The most efficient stage, occurring on the inner mitochondrial membrane. Produces most of the ATP from one glucose molecule.
              </p>
            </div>
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
