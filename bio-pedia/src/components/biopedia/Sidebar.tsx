import * as LucideIcons from "lucide-react";
import {
  Home,
  Sprout,
  NotebookPen,
  Layers,
  Bookmark,
  Plus,
  ChevronRight,
  BookOpen,
  FileText,
  BrainCircuit,
  Download,
  Network,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSubjects, useSections, useNavLinks, useSettings } from "@/lib/content";
import { Skeleton } from "@/components/ui/skeleton";

export const studyTools = [
  { label: "AI Tutor", icon: BrainCircuit, to: "/ai" },
  { label: "Notebook", icon: NotebookPen, to: "/notebook" },
  { label: "Flashcards", icon: Layers, to: "/flashcards" },
  { label: "Saved Content", icon: Bookmark, to: "/saved" },
  { label: "Create Custom List", icon: Plus, to: "/custom-lists" },
] as const;

function resolveIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Sprout;
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  return icons[name] ?? Sprout;
}

export function Sidebar() {
  const { data: subjects, isLoading: subjectsLoading } = useSubjects();
  const { data: sections, isLoading: sectionsLoading } = useSections();
  const { data: navLinks } = useNavLinks();
  const { data: settings } = useSettings();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const brandName = settings?.['site_name'] ?? "Ted's Lab";
  const brandTagline = settings?.['site_tagline'] ?? "The Learning Encyclopedia";

  const toolLinks = navLinks?.filter((n) => n.group_name === "tools") ?? [];
  const resolvedStudyTools = [
    { label: "AI Tutor", icon: BrainCircuit, to: "/ai" },
    ...toolLinks.map((n) => ({ label: n.label, icon: resolveIcon(n.icon), to: n.href })),
    ...studyTools.filter((t) => t.to !== "/ai").map((t) => ({ label: t.label, icon: t.icon, to: t.to })),
  ].filter((tool, index, array) => {
    return array.findIndex((item) => item.to === tool.to && item.label === tool.label) === index;
  });
  const sectionsBySubject = new Map<string, typeof sections>();
  for (const subject of subjects ?? []) {
    sectionsBySubject.set(
      subject.id,
      (sections ?? []).filter((s) => s.subject_id === subject.id).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)),
    );
  }

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <Link to="/" className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
        <img
          src="/logo.png"
          alt={brandName}
          width={40}
          height={40}
          className="size-10 shrink-0 rounded-xl object-cover"
        />
        <div>
          <p className="font-display text-lg leading-none font-bold text-primary">{brandName}</p>
          <p className="mt-1 text-xs text-muted-foreground">{brandTagline}</p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-0.5 pb-3">
          <li>
            <NavLink label="Knowledge Atlas" Icon={Network} to="/atlas" />
          </li>
        </ul>
        <div className="mb-2 border-t border-sidebar-border" />
        <ul className="space-y-0.5">
          <li>
            <NavLink label="Home" Icon={Home} to="/" exact />
          </li>
          {subjectsLoading || sectionsLoading ? (
            <li className="space-y-1 px-3 py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg" />
              ))}
            </li>
          ) : (
            (subjects ?? []).map((subject) => {
              const subjectSections = sectionsBySubject.get(subject.id) ?? [];
              const isExpanded = expanded.has(subject.id);
              return (
                <li key={subject.id}>
                  <button
                    type="button"
                    onClick={() => toggle(subject.id)}
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-secondary"
                  >
                    <span className="shrink-0">
                      {(() => {
                        const Icon = resolveIcon(subject.icon);
                        return <Icon className="size-4 text-muted-foreground" />;
                      })()}
                    </span>
                    <span className="flex-1 truncate text-left">{subject.title}</span>
                    <ChevronRight
                      className={`size-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`}
                    />
                  </button>
                  {isExpanded && subjectSections.length > 0 && (
                    <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2">
                      {subjectSections.map((section) => (
                        <li key={section.id}>
                          <NavLink
                            label={section.label}
                            Icon={resolveIcon(section.icon)}
                            to={`/${subject.slug}/${section.slug}`}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })
          )}
        </ul>

        <p className="px-3 pt-6 pb-2 text-[11px] font-semibold tracking-widest text-primary/80">
          CONTENT
        </p>
        <ul className="space-y-0.5 pb-4">
          <li>
            <NavLink label="All Articles" Icon={BookOpen} to="/articles" />
          </li>
          <li>
            <NavLink label="All Pages" Icon={FileText} to="/pages" />
          </li>
        </ul>

        <p className="px-3 pt-6 pb-2 text-[11px] font-semibold tracking-widest text-primary/80">
          STUDY TOOLS
        </p>
        <ul className="space-y-0.5 pb-4">
          {resolvedStudyTools.map((item) => (
            <li key={`${item.label}-${item.to}`}>
              <NavLink label={item.label} Icon={item.icon} to={item.to} />
            </li>
          ))}
          <li>
            <NavLink label="Video Tutorials" Icon={BookOpen} to="/tutorials" />
          </li>
          <li>
            <a
              href="/tedslab-download.txt"
              download="tedslab-download.txt"
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-secondary"
            >
              <Download className="size-4 text-muted-foreground group-hover:text-primary" />
              <span className="truncate">Download App</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function NavLink({
  label,
  Icon,
  to,
  exact,
}: {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  to: string;
  exact?: boolean;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: exact ?? false }}
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-secondary data-[status=active]:bg-sidebar-accent data-[status=active]:font-medium data-[status=active]:text-primary"
    >
      <Icon className="size-4 text-muted-foreground group-data-[status=active]:text-primary" />
      <span className="truncate">{label}</span>
    </Link>
  );
}
