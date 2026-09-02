import { useState } from "react";
import { BadgeCheck, Dna, Hourglass, Leaf, Sparkles } from "lucide-react";
import discoveryLeaf from "@/assets/discovery-leaf.jpg";
import { quiz, timeline } from "@/lib/biopedia-data";

export function RightRail() {
  return (
    <aside className="w-full shrink-0 space-y-4 xl:w-80">
      <TodaysDiscovery />
      <BiologyQuiz />
      <TimelinePanel />
      <QuickFacts />
    </aside>
  );
}

function PanelHeader({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
      <Icon className="size-4 text-primary" />
      <h2 className="text-sm font-semibold">{title}</h2>
    </div>
  );
}

function TodaysDiscovery() {
  return (
    <section className="bio-panel">
      <PanelHeader icon={Leaf} title="Today's Discovery" />
      <div className="flex gap-3 p-4">
        <img
          src={discoveryLeaf}
          alt="Sunlit green leaf with water droplets"
          loading="lazy"
          width={512}
          height={512}
          className="size-24 shrink-0 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-sm font-semibold">Photosynthesis</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            The process plants use to convert light energy into chemical energy.
          </p>
          <button className="mt-3 w-full rounded-md border border-border bg-secondary px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}

function BiologyQuiz() {
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  return (
    <section className="bio-panel">
      <PanelHeader icon={BadgeCheck} title="Biology Quiz" />
      <div className="space-y-2 p-4">
        <p className="text-sm">{quiz.question}</p>
        {quiz.options.map((o) => {
          const isPicked = picked === o.key;
          const isCorrect = checked && o.key === quiz.answer;
          const isWrong = checked && isPicked && o.key !== quiz.answer;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => {
                setPicked(o.key);
                setChecked(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                isCorrect
                  ? "border-primary bg-primary/15 text-primary"
                  : isWrong
                    ? "border-destructive bg-destructive/15 text-destructive"
                    : isPicked
                      ? "border-primary/60 bg-secondary"
                      : "border-border hover:bg-secondary"
              }`}
            >
              <span className="flex size-6 items-center justify-center rounded-full border border-border text-xs">
                {o.key}
              </span>
              {o.label}
            </button>
          );
        })}
        <button
          type="button"
          disabled={!picked}
          onClick={() => setChecked(true)}
          className="mt-2 w-full rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium transition-colors hover:bg-accent disabled:opacity-50"
        >
          Check Answer
        </button>
        {checked && (
          <p className="pt-1 text-xs text-muted-foreground">
            {picked === quiz.answer
              ? "Correct — mitochondria generate most of the cell's ATP."
              : "Not quite. Try again!"}
          </p>
        )}
      </div>
    </section>
  );
}

function TimelinePanel() {
  return (
    <section className="bio-panel">
      <PanelHeader icon={Hourglass} title="Timeline of Life" />
      <ul className="space-y-2.5 p-4">
        {timeline.map((t) => (
          <li key={t.when} className="flex items-center gap-3 text-sm">
            <span className="size-2.5 shrink-0 rounded-full bg-primary" />
            <span className="w-16 shrink-0 text-xs text-bio-cyan">{t.when}</span>
            <span className="text-xs text-foreground">{t.what}</span>
          </li>
        ))}
      </ul>
      <div className="px-4 pb-4">
        <button className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium transition-colors hover:bg-accent">
          Explore Timeline
        </button>
      </div>
    </section>
  );
}

function QuickFacts() {
  return (
    <section className="bio-panel">
      <PanelHeader icon={Sparkles} title="Quick Facts" />
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <Dna className="size-7 text-primary" />
          <div>
            <p className="text-sm font-semibold">
              ~8.7 <span className="text-xs font-normal text-muted-foreground">Million</span>
            </p>
            <p className="text-xs text-muted-foreground">Species on Earth</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Fact label="Cells in Human Body" value="~37 Trillion" />
          <Fact label="Human DNA" value="~3.2 Billion Base Pairs" />
        </div>
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
