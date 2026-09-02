import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/biopedia/AppShell";
import { quizBank } from "@/lib/biopedia-sections";

const title = "Biology Quizzes — Ted's Lab";
const description = "Test what you know with quick multiple-choice questions across biology.";

export const Route = createFileRoute("/quizzes")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuizzesPage,
});

function QuizzesPage() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const item = quizBank[index]!;

  const next = () => {
    if (index + 1 >= quizBank.length) {
      setDone(true);
      return;
    }
    setIndex(index + 1);
    setPicked(null);
    setChecked(false);
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setChecked(false);
    setScore(0);
    setDone(false);
  };

  return (
    <AppShell>
      <PageHeader title="Quizzes" description={description} />

      {done ? (
        <section className="mt-6 bio-panel p-6 text-center">
          <h2 className="font-display text-2xl font-bold">
            You scored {score} / {quizBank.length}
          </h2>
          <button
            type="button"
            onClick={restart}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
        </section>
      ) : (
        <section className="mt-6 bio-panel p-6">
          <p className="text-xs text-muted-foreground">
            Question {index + 1} of {quizBank.length} · Score {score}
          </p>
          <h2 className="mt-2 text-lg font-semibold">{item.question}</h2>
          <div className="mt-4 space-y-2">
            {item.options.map((o) => {
              const isPicked = picked === o.key;
              const isCorrect = checked && o.key === item.answer;
              const isWrong = checked && isPicked && o.key !== item.answer;
              return (
                <button
                  key={o.key}
                  type="button"
                  disabled={checked}
                  onClick={() => setPicked(o.key)}
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
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={!picked || checked}
              onClick={() => {
                setChecked(true);
                if (picked === item.answer) setScore((s) => s + 1);
              }}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              Check answer
            </button>
            <button
              type="button"
              disabled={!checked}
              onClick={next}
              className="rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {index + 1 === quizBank.length ? "Finish" : "Next question"}
            </button>
          </div>
        </section>
      )}
    </AppShell>
  );
}
