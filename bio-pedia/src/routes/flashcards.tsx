import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/biopedia/AppShell";
import { flashcards } from "@/lib/biopedia-sections";

const title = "Flashcards — Ted's Lab";
const description = "Flip through key biology terms and check yourself before an exam.";

export const Route = createFileRoute("/flashcards")({
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
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const [flipped, setFlipped] = useState<string[]>([]);
  const toggle = (front: string) =>
    setFlipped((p) => (p.includes(front) ? p.filter((f) => f !== front) : [...p, front]));

  return (
    <AppShell>
      {(q) => {
        const items = q
          ? flashcards.filter((c) => `${c.front} ${c.back}`.toLowerCase().includes(q))
          : flashcards;
        return (
          <>
            <PageHeader title="Flashcards" description={description} />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((c) => {
                const isFlipped = flipped.includes(c.front);
                return (
                  <button
                    key={c.front}
                    type="button"
                    onClick={() => toggle(c.front)}
                    className="flex h-36 flex-col items-center justify-center bio-panel p-4 text-center transition-colors hover:border-primary/50"
                  >
                    <p className={isFlipped ? "text-sm text-muted-foreground" : "text-base font-semibold"}>
                      {isFlipped ? c.back : c.front}
                    </p>
                    <span className="mt-3 text-xs text-primary">
                      {isFlipped ? "Show term" : "Reveal definition"}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        );
      }}
    </AppShell>
  );
}
