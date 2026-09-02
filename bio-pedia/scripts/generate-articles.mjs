// Enhanced seed script to generate articles for all topics and link them properly
import { sections as bioSections } from "../src/lib/biopedia-sections.ts";
import fs from "node:fs";

const q = (v) =>
  v === null || v === undefined ? "NULL" : `'${String(v).replaceAll("'", "''")}'`;

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// Generate article body content for a topic
function generateArticleBody(title, topicBlurb, sectionTitle, subjectTitle) {
  return [
    `${topicBlurb}`,
    `This article explains ${title.toLowerCase()} as part of the ${sectionTitle} area within ${subjectTitle}. It is written to be read in one sitting, so the goal is a solid mental model rather than exhaustive coverage.`,
    `Start with the core idea. ${title} matters because it explains something that otherwise looks arbitrary. Once you can state the idea in a sentence, everything else becomes detail you can look up.`,
    `Next, understand the mechanism. What causes what, in which order? What would happen if one step were removed? This is often the difference between recognising a topic and truly understanding it.`,
    `Look for patterns and connections. Where does this idea appear in other contexts within ${sectionTitle}? What other topics does this build on or lead into?`,
    `Finally, test yourself. Explain it aloud, sketch it, or apply it to an example. If any part of your explanation becomes vague, that is exactly where to reread and clarify.`,
  ].join("\n\n");
}

// Color palette for articles
const tones = ["cyan", "amber", "green", "violet", "rose", "blue", "orange", "indigo"];

const subjects = [
  { slug: "biology", title: "Biology" },
  { slug: "mathematics", title: "Mathematics" },
  { slug: "science", title: "Science" },
  { slug: "english", title: "English" },
  { slug: "history", title: "History" },
  { slug: "technology", title: "Technology" },
];

const extraSections = {
  mathematics: [
    ["number-algebra", "Number & Algebra", "Working with number systems, expressions and equations.", [
      ["Number Systems", "Naturals, integers, rationals, reals and where each is used."],
      ["Indices & Surds", "Laws of powers and simplifying irrational roots."],
      ["Linear Equations", "Solving, rearranging and modelling with straight-line relationships."],
      ["Quadratics", "Factorising, completing the square and the quadratic formula."],
      ["Simultaneous Equations", "Finding values that satisfy several conditions at once."],
      ["Sequences & Series", "Arithmetic, geometric and recursive patterns."],
    ]],
  ],
  science: [
    ["physics", "Physics", "Motion, forces, energy and the rules the universe seems to follow.", [
      ["Motion", "Displacement, velocity, acceleration and graphs."],
      ["Forces", "Newton's laws, friction and free-body diagrams."],
      ["Energy & Work", "Conservation, transfer and efficiency."],
      ["Waves & Sound", "Frequency, wavelength, reflection and resonance."],
      ["Electricity", "Current, voltage, resistance and circuits."],
      ["Light & Optics", "Reflection, refraction, lenses and the spectrum."],
    ]],
    ["chemistry", "Chemistry", "Matter, its structure and the reactions that rearrange it.", [
      ["Atomic Structure", "Protons, neutrons, electrons and shells."],
      ["The Periodic Table", "Groups, periods and predicting behaviour."],
      ["Bonding", "Ionic, covalent and metallic bonds."],
      ["Chemical Reactions", "Balancing equations and reaction types."],
      ["Acids & Bases", "pH, neutralisation and indicators."],
      ["Stoichiometry", "The mole and quantitative chemistry."],
    ]],
  ],
  english: [
    ["literature", "Literature", "Novels, plays and short fiction, and how to read them closely.", [
      ["Narrative Structure", "Exposition, conflict, climax and resolution."],
      ["Character & Motivation", "How writers build people worth caring about."],
      ["Theme", "Finding the argument underneath the story."],
      ["Setting & Context", "Time, place and the world a text was written in."],
      ["Point of View", "First person, third limited, omniscient and unreliable narrators."],
      ["Shakespeare", "Reading early modern drama with confidence."],
    ]],
  ],
};

// Build sections list including biology sections
const allSections = [];

// Add biology sections from existing data
bioSections.forEach((s, i) =>
  allSections.push({
    subject: "biology",
    slug: s.slug,
    label: s.label,
    title: s.title,
    description: s.description,
    sort: i,
    topics: s.topics,
  }),
);

// Add extra sections
for (const [subject, list] of Object.entries(extraSections)) {
  list.forEach(([slug, title, description, topics], i) =>
    allSections.push({
      subject,
      slug,
      label: title,
      title,
      description,
      sort: i,
      topics: topics.map(([t, b]) => ({ title: t, blurb: b })),
    }),
  );
}

const out = [];

// Generate articles for each topic
let articleSort = 0;
for (const section of allSections) {
  const subjectData = subjects.find((x) => x.slug === section.subject);
  const subjectTitle = subjectData?.title ?? section.subject;

  for (let topicIdx = 0; topicIdx < section.topics.length; topicIdx++) {
    const topic = section.topics[topicIdx];
    const topicSlug = slugify(topic.title);
    const articleSlug = `${section.slug}-${topicSlug}`;
    const tone = tones[articleSort % tones.length];
    const minutes = 4 + (articleSort % 8); // 4-11 min articles
    const imageKey = section.image_key ?? `${section.slug}-hero`;

    const articleBody = generateArticleBody(
      topic.title,
      topic.blurb,
      section.title,
      subjectTitle,
    );

    // Insert article linked to topic
    out.push(
      `INSERT INTO public.articles (slug,title,excerpt,body,minutes,tone,subject_slug,section_slug,topic_slug,image_key,published,sort) VALUES (${q(articleSlug)},${q(topic.title)},${q(topic.blurb)},${q(articleBody)},${minutes},${q(tone)},${q(section.subject)},${q(section.slug)},${q(topicSlug)},${q(imageKey)},true,${articleSort});`,
    );

    articleSort++;
  }
}

console.log(`Generated ${articleSort} articles for all topics`);
fs.mkdirSync("/tmp/seed", { recursive: true });

// Write to output file
const sqlScript = out.join("\n");
fs.writeFileSync("/tmp/seed/generate-articles.sql", sqlScript);
fs.writeFileSync("/tmp/seed/article-count.txt", `Total articles generated: ${articleSort}`);

console.log(`Total articles: ${articleSort}`);
console.log("SQL file saved to: /tmp/seed/generate-articles.sql");
