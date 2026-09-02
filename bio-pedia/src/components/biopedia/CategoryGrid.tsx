import { ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Subject } from "@/lib/content";
import { resolveImage } from "@/lib/images";

export type CategoryGridItem = Pick<
  Subject,
  "id" | "slug" | "title" | "description" | "image_url" | "image_key"
>;

export function CategoryGrid({ items }: { items: CategoryGridItem[] }) {
  return (
    <section className="mt-8">
      <h2 className="flex items-center gap-1 font-display text-xl font-semibold">
        <Link to="/categories" className="hover:text-primary">
          Explore by Category
        </Link>
        <ChevronRight className="size-5 text-muted-foreground" />
      </h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No categories match your search.</p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {items.map((c) => (
            <Link
              key={c.id}
              to={`/${c.slug}`}
              className="group block cursor-pointer overflow-hidden bio-panel transition-colors hover:border-primary/50"
            >
              <img
                src={resolveImage(c.image_url, c.image_key)}
                alt={c.title}
                loading="lazy"
                width={512}
                height={512}
                className="h-28 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold">{c.title}</h3>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  {c.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
