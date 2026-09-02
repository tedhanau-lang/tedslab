import { ReactNode } from "react";
import { AppShell } from "./AppShell";
import { ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { resolveImage } from "@/lib/images";

interface ContentLayoutProps {
  title: string;
  description: string;
  image?: string | null;
  imageAlt?: string;
  backLink: string;
  backLabel: string;
  subject?: { title: string; slug: string };
  metadata?: Array<{ label: string; value: string }>;
  body?: string;
  children?: ReactNode;
  searchFunction?: (query: string) => ReactNode;
}

export function ContentLayout({
  title,
  description,
  image,
  imageAlt = title,
  backLink,
  backLabel,
  subject,
  metadata,
  body,
  children,
  searchFunction,
}: ContentLayoutProps) {
  return (
    <AppShell>
      {searchFunction
        ? searchFunction
        : () => (
            <>
              <Link
                to={backLink}
                className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Back to {backLabel}
              </Link>

              <div className="mt-4">
                {/* Header Section */}
                <header className="bio-panel p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h1 className="font-display text-3xl font-bold text-foreground break-words">
                        {title}
                      </h1>
                      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                      {subject && (
                        <div className="mt-4 flex items-center gap-2">
                          <Link
                            to={`/${subject.slug}`}
                            className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            {subject.title}
                          </Link>
                        </div>
                      )}
                      {metadata && metadata.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-4">
                          {metadata.map((meta) => (
                            <div key={meta.label}>
                              <p className="text-xs text-muted-foreground">{meta.label}</p>
                              <p className="text-sm font-medium text-foreground">{meta.value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </header>

                {/* Image Section */}
                {image && (
                  <div className="mt-6 overflow-hidden rounded-lg">
                    <img src={image} alt={imageAlt} className="w-full" loading="eager" />
                  </div>
                )}

                {/* Body Section */}
                {body && (
                  <div className="mt-6 bio-panel p-6">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: body }} />
                    </div>
                  </div>
                )}

                {/* Children (additional sections) */}
                {children}
              </div>
            </>
          )}
    </AppShell>
  );
}
