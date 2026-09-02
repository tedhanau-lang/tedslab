import { MessageSquare, Quote, Share2, Sprout } from "lucide-react";

export function QuoteBar() {
  return (
    <footer className="mt-8 flex flex-wrap items-center gap-4 bio-panel px-5 py-4">
      <Sprout className="size-5 text-primary" />
      <p className="flex-1 text-sm italic text-foreground">
        “The study of life is the foundation for understanding our world and our place in it.”
        <span className="ml-3 text-xs not-italic text-muted-foreground">– Unknown</span>
      </p>
      <div className="flex items-center gap-5 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <Quote className="size-4" /> Cite
        </span>
        <span className="flex items-center gap-2">
          <Share2 className="size-4" /> Share
        </span>
        <span className="flex items-center gap-2">
          <MessageSquare className="size-4" /> Feedback
        </span>
      </div>
    </footer>
  );
}
