import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/biopedia/AppShell";
import { TopicGrid } from "@/components/biopedia/TopicGrid";
import { useSections, useTopics, useSubjects } from "@/lib/content";

const SECTION_SLUG = "evolution";

export const Route = createFileRoute("/evolution")({
  head: () => ({
    meta: [{ title: "Ted's Lab" }],
  }),
  component: SectionPage,
});

function SectionPage() {
  const { data: sections = [] } = useSections();
  const { data: topics = [] } = useTopics();
  const { data: subjects = [] } = useSubjects();
  const section = sections.find((s) => s.slug === SECTION_SLUG);
  const subject = section ? subjects.find((s) => s.id === section.subject_id) : undefined;
  const sectionTopics = section ? topics.filter((t) => t.section_id === section.id) : [];

  return (
    <AppShell>
      {(q) => (
        <>
          <PageHeader
            title={section?.title ?? ""}
            description={section?.description ?? ""}
          />
          <TopicGrid
            sectionSlug={SECTION_SLUG}
            subjectSlug={subject?.slug}
            topics={
              q
                ? sectionTopics.filter((t) =>
                    `${t.title} ${t.blurb ?? ""}`.toLowerCase().includes(q),
                  )
                : sectionTopics
            }
          />
        </>
      )}
    </AppShell>
  );
}
