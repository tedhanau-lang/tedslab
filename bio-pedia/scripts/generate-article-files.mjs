import fs from 'fs/promises';
import path from 'path';

const articlesData = [
  {
    slug: 'mitosis-cell-division',
    title: 'Mitosis and Cell Division',
    section: 'cells-microscopy',
    description: 'How cells divide to produce two identical daughter cells.',
    tags: ['Cell Biology', 'Division', 'Reproduction'],
  },
  {
    slug: 'enzyme-catalysis',
    title: 'Enzymes and Catalysis',
    section: 'cells-microscopy',
    description: 'How enzymes speed up chemical reactions in cells.',
    tags: ['Biochemistry', 'Catalysis', 'Enzymes'],
  },
  {
    slug: 'evolution-natural-selection',
    title: 'Evolution and Natural Selection',
    section: 'evolution',
    description: 'How populations change over time through natural selection.',
    tags: ['Evolution', 'Adaptation', 'Biology'],
  },
  {
    slug: 'human-anatomy-systems',
    title: 'Human Anatomy and Organ Systems',
    section: 'human-biology',
    description: 'Overview of the major organ systems in the human body.',
    tags: ['Anatomy', 'Physiology', 'Systems'],
  },
  {
    slug: 'food-chains-energy-flow',
    title: 'Food Chains and Energy Flow',
    section: 'ecology-environment',
    description: 'How energy flows through ecosystems via food chains and webs.',
    tags: ['Ecology', 'Energy', 'Food Webs'],
  },
  {
    slug: 'photosynthesis-light-reactions',
    title: 'Photosynthesis: Light Reactions',
    section: 'biological-processes',
    description: 'The light-dependent reactions that power photosynthesis.',
    tags: ['Photosynthesis', 'Energy', 'Light'],
  },
  {
    slug: 'meiosis-gamete-formation',
    title: 'Meiosis and Gamete Formation',
    section: 'genetics-dna',
    description: 'How meiosis produces genetically diverse gametes.',
    tags: ['Genetics', 'Reproduction', 'Division'],
  },
];

const componentTemplate = (title, slug, description, tags) => `import { BookOpenText, CheckCircle2, ChevronRight, Leaf, Microscope, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";
import discoveryLeaf from "@/assets/discovery-leaf.jpg";
import { AppShell } from "@/components/biopedia/AppShell";

const topicTags = [${tags.map(t => `"${t}"`).join(', ')}];

export default function ${title.replace(/\s+/g, '')}Page() {
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
              {["Overview", "Key Concepts", "Process Steps", "Examples", "Summary"].map((item, index) => (
                <a
                  key={item}
                  href="#"
                  className={\`flex items-center justify-between rounded-md px-3 py-2 transition-colors \${
                    index === 0
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }\`}
                >
                  <span>{item}</span>
                  {index !== 0 && <ChevronRight className="size-3.5" />}
                </a>
              ))}
            </nav>
          </section>
        </aside>
      }
    >
      <div className="max-w-5xl">
        <header className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/80">
          <div className="grid gap-6 p-6 md:grid-cols-[1.3fr_1fr] md:items-center">
            <div>
              <h1 className="font-display text-4xl font-black tracking-tight text-foreground">
                ${title}
              </h1>
              <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <CheckCircle2 className="size-3.5" />
                Reviewed by Experts
              </div>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                ${description}
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
                alt="Article illustration"
                className="h-full min-h-[220px] w-full object-cover"
              />
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-border bg-card/80 p-6">
          <h2 className="text-3xl font-bold text-foreground">Overview</h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              ${description} This article explores the fundamental concepts, processes, and applications.
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
`;

const routeTemplate = (slug, componentName) => `import { createFileRoute } from "@tanstack/react-router";
import ${componentName}Page from "@/components/biopedia/pages/articles/biology/${slug}";

export const Route = createFileRoute("/articles/${slug}")({
  component: ${componentName}Page,
});
`;

async function generateArticles() {
  const basePath = '/Users/ted/Downloads/study-hub-tedslab';
  const componentsPath = path.join(basePath, 'src/components/biopedia/pages/articles/biology');
  const routesPath = path.join(basePath, 'src/routes');

  try {
    console.log('📝 Generating 7 biology articles...');

    for (const article of articlesData) {
      // Generate component name from slug
      const componentName = article.slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

      // Create component file
      const componentContent = componentTemplate(article.title, article.slug, article.description, article.tags);
      const componentFile = path.join(componentsPath, `${article.slug}.tsx`);
      await fs.writeFile(componentFile, componentContent);
      console.log(`✓ Created component: ${article.slug}.tsx`);

      // Create route file
      const routeContent = routeTemplate(article.slug, componentName);
      const routeFile = path.join(routesPath, `articles.${article.slug}.tsx`);
      await fs.writeFile(routeFile, routeContent);
      console.log(`✓ Created route: articles.${article.slug}.tsx`);
    }

    console.log('\n✅ Successfully generated 7 articles!');
    console.log('\nNew articles created:');
    articlesData.forEach(a => {
      console.log(`   • /articles/${a.slug} - ${a.title}`);
    });
  } catch (err) {
    console.error('❌ Error generating articles:', err);
    process.exit(1);
  }
}

generateArticles();
