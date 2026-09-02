// Generates SQL seed files for the site content tables.
import { sections as bioSections } from "../src/lib/biopedia-sections.ts";
import fs from "node:fs";

const q = (v) =>
  v === null || v === undefined ? "NULL" : `'${String(v).replaceAll("'", "''")}'`;

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function body(title, blurb, sectionTitle, subjectTitle) {
  return [
    `${title} is one of the core ideas you meet when studying ${sectionTitle} within ${subjectTitle}. ${blurb} Understanding it well gives you a framework you can reuse across many other topics, because the same reasoning keeps reappearing in new contexts.`,
    `Start with the big picture: what problem does ${title.toLowerCase()} solve, and what would be impossible to explain without it? Once the purpose is clear, work through the details — the vocabulary, the steps, and the common exceptions. Sketching a diagram or writing your own one-sentence definition is usually enough to expose the parts you have not yet understood.`,
    `In practice, ${title.toLowerCase()} shows up in exam questions that ask you to compare, explain a process, or apply the idea to an unfamiliar example. Practise all three. Try to state the idea in plain language, then support it with a concrete example and, where relevant, an exception that shows the limits of the rule.`,
    `Key things to remember: definitions matter, examples make them stick, and connections to neighbouring topics in ${sectionTitle} are what turn isolated facts into real understanding.`,
  ].join("\n\n");
}

const subjects = [
  {
    slug: "biology",
    title: "Biology",
    icon: "Sprout",
    description:
      "Life at every scale — from single molecules and cells to whole ecosystems and four billion years of evolution.",
    image_key: "hero-cell",
  },
  {
    slug: "mathematics",
    title: "Mathematics",
    icon: "Sigma",
    description:
      "Number, algebra, shape, change and chance: the language used to describe patterns precisely.",
    image_key: "math-algebra",
  },
  {
    slug: "science",
    title: "Science",
    icon: "Atom",
    description:
      "Physics, chemistry and earth science, plus the method that keeps all of it honest.",
    image_key: "sci-physics",
  },
  {
    slug: "english",
    title: "English",
    icon: "BookOpen",
    description:
      "Reading closely, writing clearly and understanding how language shapes meaning.",
    image_key: "eng-literature",
  },
  {
    slug: "history",
    title: "History",
    icon: "Landmark",
    description:
      "How societies formed, collided and changed — and how we know what we claim to know.",
    image_key: "his-ancient",
  },
  {
    slug: "technology",
    title: "Technology",
    icon: "Cpu",
    description:
      "Computers, code, digital systems and the fast-moving fields of AI, robotics and security.",
    image_key: "tech-computing",
  },
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
    ["geometry-measurement", "Geometry & Measurement", "Shape, space, angle and the measurement of both.", [
      ["Angles & Lines", "Parallel lines, transversals and angle reasoning."],
      ["Triangles", "Congruence, similarity and Pythagoras' theorem."],
      ["Circles", "Arcs, sectors, chords and circle theorems."],
      ["Area & Volume", "Measuring 2D regions and 3D solids."],
      ["Transformations", "Translation, reflection, rotation and dilation."],
      ["Coordinate Geometry", "Distance, midpoint, gradient and equations of lines."],
    ]],
    ["trigonometry", "Trigonometry", "Relationships between angles and side lengths, and the waves they generate.", [
      ["Right-Angle Trig", "Sine, cosine and tangent ratios."],
      ["Sine & Cosine Rules", "Solving non-right triangles."],
      ["The Unit Circle", "Extending trig beyond 90 degrees."],
      ["Trig Graphs", "Amplitude, period and phase shift."],
      ["Identities", "Pythagorean and compound-angle identities."],
      ["Applications", "Bearings, heights, distances and oscillations."],
    ]],
    ["calculus", "Calculus", "The mathematics of change and accumulation.", [
      ["Limits", "What a function approaches, and why it matters."],
      ["Differentiation", "Rates of change and gradient functions."],
      ["Rules of Differentiation", "Product, quotient and chain rules."],
      ["Applications of Derivatives", "Maxima, minima and motion."],
      ["Integration", "Antiderivatives and the area under a curve."],
      ["Definite Integrals", "Evaluating accumulated change between bounds."],
    ]],
    ["statistics-probability", "Statistics & Probability", "Describing data and reasoning under uncertainty.", [
      ["Data Displays", "Histograms, box plots and choosing the right chart."],
      ["Measures of Centre & Spread", "Mean, median, range, IQR and standard deviation."],
      ["Probability Basics", "Sample spaces, complements and independence."],
      ["Conditional Probability", "Tree diagrams and Bayes-style reasoning."],
      ["Distributions", "Binomial and normal distributions in context."],
      ["Sampling & Bias", "Why how you collect data changes the answer."],
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
    ["earth-space-science", "Earth & Space Science", "The planet beneath us and the universe around it.", [
      ["Plate Tectonics", "Drifting plates, earthquakes and volcanoes."],
      ["Rocks & Minerals", "The rock cycle and how rocks are classified."],
      ["Weather & Climate", "Atmospheric systems and long-term change."],
      ["The Solar System", "Planets, moons and orbital mechanics."],
      ["Stars & Galaxies", "Stellar life cycles and cosmic structure."],
      ["Space Exploration", "Telescopes, probes and human spaceflight."],
    ]],
    ["scientific-method", "Scientific Method", "How reliable knowledge is actually produced and tested.", [
      ["Hypotheses", "Writing testable, falsifiable statements."],
      ["Variables", "Independent, dependent and controlled variables."],
      ["Experimental Design", "Controls, replication and fair tests."],
      ["Measurement & Error", "Accuracy, precision and uncertainty."],
      ["Analysing Results", "Turning raw data into supported claims."],
      ["Peer Review", "Why scrutiny is part of the method."],
    ]],
    ["energy-matter", "Energy & Matter", "The shared ideas that connect physics, chemistry and biology.", [
      ["States of Matter", "Solids, liquids, gases and phase change."],
      ["Heat Transfer", "Conduction, convection and radiation."],
      ["Conservation Laws", "Why energy and mass books must balance."],
      ["Nuclear Energy", "Fission, fusion and radioactivity."],
      ["Renewable Energy", "Solar, wind, hydro and storage."],
      ["Thermodynamics", "Entropy and the direction of change."],
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
    ["poetry", "Poetry", "Compressed language, sound and image.", [
      ["Imagery", "Writing that appeals directly to the senses."],
      ["Metaphor & Simile", "Comparison as a tool for meaning."],
      ["Rhythm & Metre", "Stress patterns and why they matter."],
      ["Rhyme & Sound", "Alliteration, assonance and half rhyme."],
      ["Poetic Forms", "Sonnet, ballad, free verse and villanelle."],
      ["Analysing a Poem", "A repeatable method for unseen poetry."],
    ]],
    ["grammar-syntax", "Grammar & Syntax", "The machinery that makes sentences work.", [
      ["Word Classes", "Nouns, verbs, adjectives and the rest."],
      ["Sentence Types", "Simple, compound, complex and compound-complex."],
      ["Punctuation", "Commas, semicolons, colons and dashes."],
      ["Tense & Voice", "Active and passive constructions."],
      ["Clauses & Phrases", "Building longer sentences that still work."],
      ["Common Errors", "Agreement, apostrophes and misplaced modifiers."],
    ]],
    ["writing-craft", "Writing Craft", "Planning, drafting and revising your own writing.", [
      ["Essay Structure", "Thesis, body paragraphs and conclusion."],
      ["Paragraphing", "Topic sentences, evidence and analysis."],
      ["Persuasive Writing", "Ethos, pathos, logos and rhetorical devices."],
      ["Creative Writing", "Voice, tension and showing rather than telling."],
      ["Editing & Redrafting", "Cutting, sharpening and proofreading."],
      ["Referencing", "Quoting fairly and citing sources."],
    ]],
    ["language-analysis", "Language Analysis", "How texts persuade, position and shape readers.", [
      ["Tone & Register", "Formality and attitude in a text."],
      ["Rhetorical Devices", "Repetition, contrast, anecdote and appeal."],
      ["Media Texts", "Reading news, advertising and opinion writing."],
      ["Visual Language", "Images, layout and framing as argument."],
      ["Audience & Purpose", "Who a text is for and what it wants."],
      ["Comparing Texts", "Analysing two views on one issue."],
    ]],
  ],
  history: [
    ["ancient-civilisations", "Ancient Civilisations", "The first cities, states, laws and writing systems.", [
      ["Mesopotamia", "Cities, cuneiform and the first written laws."],
      ["Ancient Egypt", "Nile agriculture, pharaohs and belief."],
      ["Ancient Greece", "City-states, philosophy and early democracy."],
      ["Ancient Rome", "Republic, empire and Roman law."],
      ["Ancient China", "Dynasties, bureaucracy and invention."],
      ["Indigenous Histories", "Deep-time cultures and oral tradition."],
    ]],
    ["medieval-world", "The Medieval World", "Roughly a thousand years of empires, faith and trade.", [
      ["Feudal Europe", "Land, loyalty and social hierarchy."],
      ["The Islamic Golden Age", "Science, medicine and translation."],
      ["The Black Death", "A pandemic that reshaped a continent."],
      ["Crusades & Contact", "Conflict and exchange across regions."],
      ["Silk Road Trade", "Goods, ideas and disease on the move."],
      ["Medieval Japan", "Shoguns, samurai and isolation."],
    ]],
    ["age-of-revolutions", "Age of Revolutions", "Political and industrial upheaval that made the modern world.", [
      ["The Enlightenment", "Reason, rights and new political theory."],
      ["American Revolution", "Independence and constitutional government."],
      ["French Revolution", "Liberty, terror and Napoleon."],
      ["Industrial Revolution", "Machines, cities and a new working class."],
      ["Abolition Movements", "Campaigns against slavery and their limits."],
      ["Nationalism", "Nations imagined, unified and contested."],
    ]],
    ["world-wars", "The World Wars", "Two global conflicts and the century they defined.", [
      ["Causes of WWI", "Alliances, empire and militarism."],
      ["Life in the Trenches", "The daily reality of industrial war."],
      ["Treaty of Versailles", "Peace terms and their consequences."],
      ["Rise of Dictatorships", "Fascism, communism and the 1930s."],
      ["World War II", "Global theatres and total war."],
      ["The Holocaust", "Genocide, testimony and remembrance."],
    ]],
    ["modern-world", "The Modern World", "From the Cold War to globalisation and the present.", [
      ["The Cold War", "Two superpowers and a divided world."],
      ["Decolonisation", "Independence movements after 1945."],
      ["Civil Rights", "Struggles for equality and legal change."],
      ["Globalisation", "Trade, migration and connected economies."],
      ["Digital Age", "How information technology reshaped society."],
      ["Using Sources", "Reliability, bias and historical argument."],
    ]],
  ],
  technology: [
    ["computing-basics", "Computing Basics", "How a computer actually works, from bits to operating systems.", [
      ["Binary & Data", "Bits, bytes and representing information."],
      ["Hardware", "CPU, memory, storage and input/output."],
      ["Operating Systems", "Managing processes, files and resources."],
      ["Networks", "Packets, protocols and the internet."],
      ["The Web", "Clients, servers, HTTP and browsers."],
      ["File Formats", "Compression, encoding and interoperability."],
    ]],
    ["programming", "Programming", "Telling a machine exactly what to do.", [
      ["Variables & Types", "Storing and labelling values."],
      ["Control Flow", "Conditionals, loops and branching logic."],
      ["Functions", "Reusable blocks and parameters."],
      ["Data Structures", "Arrays, objects, stacks and queues."],
      ["Algorithms", "Searching, sorting and complexity."],
      ["Debugging", "Reading errors and testing assumptions."],
    ]],
    ["digital-systems", "Digital Systems", "Designing systems that store and move data safely.", [
      ["Databases", "Tables, keys, queries and relationships."],
      ["APIs", "How programs talk to each other."],
      ["Cloud Computing", "Servers you rent instead of own."],
      ["Version Control", "Tracking changes and collaborating."],
      ["UX & Interface Design", "Designing for the person using it."],
      ["Systems Analysis", "Requirements, constraints and testing."],
    ]],
    ["ai-robotics", "AI & Robotics", "Machines that sense, decide and act.", [
      ["What Is AI?", "Rules, statistics and learning from data."],
      ["Machine Learning", "Training, features and generalisation."],
      ["Neural Networks", "Layers, weights and why depth helps."],
      ["Computer Vision", "Teaching machines to interpret images."],
      ["Robotics", "Sensors, actuators and control loops."],
      ["AI Ethics", "Bias, transparency and accountability."],
    ]],
    ["cybersecurity", "Cybersecurity", "Protecting data, systems and people.", [
      ["Threats & Attacks", "Malware, phishing and social engineering."],
      ["Encryption", "Keys, hashing and secure channels."],
      ["Authentication", "Passwords, MFA and identity."],
      ["Network Security", "Firewalls, VPNs and monitoring."],
      ["Privacy", "Data collection, consent and rights."],
      ["Digital Citizenship", "Safe, ethical behaviour online."],
    ]],
  ],
};

const heroSlides = {
  biology: [
    ["The Cell", "The Basic Unit of Life", "Explore the incredible world within every living thing — structure, function and the processes that sustain life.", "hero-cell", "/s/cells-microscopy"],
    ["DNA", "The Blueprint of Life", "Four letters, endless possibility. See how genetic information is stored, copied and expressed.", "cat-genetics", "/s/genetics-dna"],
    ["Photosynthesis", "Turning Light Into Life", "Follow the light-driven chemistry that feeds nearly every food chain on Earth.", "cat-plants", "/s/plants"],
    ["Evolution", "Four Billion Years of Change", "Trace how natural selection shaped the staggering diversity of living things.", "cat-evolution", "/s/evolution"],
  ],
  mathematics: [
    ["Algebra", "The Language of Patterns", "Letters standing in for numbers let you describe every case at once.", "math-algebra", "/s/number-algebra"],
    ["Geometry", "Shape, Space and Proof", "From angle chasing to elegant proofs about circles and triangles.", "math-geometry", "/s/geometry-measurement"],
    ["Calculus", "The Mathematics of Change", "Gradients, rates and areas — the tools behind physics and engineering.", "math-calculus", "/s/calculus"],
    ["Statistics", "Reasoning Under Uncertainty", "Describe data honestly and judge how much it can really tell you.", "math-statistics", "/s/statistics-probability"],
  ],
  science: [
    ["Physics", "Forces, Motion and Energy", "The rules that govern everything from falling apples to orbiting satellites.", "sci-physics", "/s/physics"],
    ["Chemistry", "Matter and Its Reactions", "Atoms, bonds and the transformations that make new substances.", "sci-chemistry", "/s/chemistry"],
    ["Earth & Space", "Our Planet and Beyond", "Plate tectonics, climate systems, stars and the scale of the universe.", "sci-earth", "/s/earth-space-science"],
    ["The Scientific Method", "How We Know Things", "Hypotheses, controls, error and peer review — knowledge that earns trust.", "sci-method", "/s/scientific-method"],
  ],
  english: [
    ["Literature", "Stories That Argue", "Read novels and plays closely enough to see the ideas underneath.", "eng-literature", "/s/literature"],
    ["Poetry", "Language Under Pressure", "Image, rhythm and sound doing more work in fewer words.", "eng-poetry", "/s/poetry"],
    ["Grammar", "The Machinery of Meaning", "Clauses, punctuation and structure — the grip behind clear writing.", "eng-grammar", "/s/grammar-syntax"],
    ["Writing Craft", "Draft, Cut, Sharpen", "Planning, paragraphing and revision that actually improves a piece.", "eng-writing", "/s/writing-craft"],
  ],
  history: [
    ["Ancient Civilisations", "Where Cities Began", "Writing, law and empire in Mesopotamia, Egypt, Greece, Rome and China.", "his-ancient", "/s/ancient-civilisations"],
    ["The Medieval World", "Faith, Trade and Plague", "A thousand years of connected empires and hard-won knowledge.", "his-medieval", "/s/medieval-world"],
    ["Age of Revolutions", "The Modern World Is Built", "Political upheaval and industrial machinery remake everyday life.", "his-revolutions", "/s/age-of-revolutions"],
    ["The World Wars", "A Century Defined", "Causes, experiences and consequences of two global conflicts.", "his-wars", "/s/world-wars"],
  ],
  technology: [
    ["Computing", "From Bits to Systems", "How hardware, operating systems and networks fit together.", "tech-computing", "/s/computing-basics"],
    ["Programming", "Instructions That Run", "Variables, logic, data structures and the habit of debugging.", "tech-programming", "/s/programming"],
    ["AI & Robotics", "Machines That Learn", "Training data, neural networks and the ethics of automation.", "tech-ai", "/s/ai-robotics"],
    ["Cybersecurity", "Defending the Network", "Encryption, authentication and thinking like an attacker.", "tech-security", "/s/cybersecurity"],
  ],
};

const bioImageKeys = {
  organisms: "cat-organisms",
  "cells-microscopy": "hero-cell",
  "genetics-dna": "cat-genetics",
  "human-biology": "cat-human",
  plants: "cat-plants",
  "ecology-environment": "cat-ecology",
  evolution: "cat-evolution",
  "biological-processes": "discovery-leaf",
  anatomy: "cat-human",
  biotechnology: "cat-genetics",
};

const out = [];
out.push("DELETE FROM public.topics; DELETE FROM public.sections; DELETE FROM public.subjects; DELETE FROM public.hero_slides; DELETE FROM public.articles; DELETE FROM public.videos; DELETE FROM public.pages; DELETE FROM public.nav_links;");

subjects.forEach((s, i) => {
  out.push(
    `INSERT INTO public.subjects (slug,title,description,icon,image_key,sort) VALUES (${q(s.slug)},${q(s.title)},${q(s.description)},${q(s.icon)},${q(s.image_key)},${i});`,
  );
});

// biology sections come from the existing static data
const allSections = [];
bioSections.forEach((s, i) =>
  allSections.push({
    subject: "biology",
    slug: s.slug,
    label: s.label,
    title: s.title,
    description: s.description,
    image_key: bioImageKeys[s.slug] ?? "hero-cell",
    sort: i,
    topics: s.topics,
  }),
);
for (const [subject, list] of Object.entries(extraSections)) {
  list.forEach(([slug, title, description, topics], i) =>
    allSections.push({
      subject,
      slug,
      label: title,
      title,
      description,
      image_key: heroSlides[subject][Math.min(i, 3)][3],
      sort: i,
      topics: topics.map(([t, b]) => ({ title: t, blurb: b })),
    }),
  );
}

for (const s of allSections) {
  const subjectTitle = subjects.find((x) => x.slug === s.subject).title;
  const intro = `${s.description}\n\nThis part of ${subjectTitle} is best approached topic by topic. Each card below opens a full explanation with worked context, the vocabulary you need, and the connections that make the ideas stick. Work through them in order the first time, then use them as revision notes.`;
  out.push(
    `INSERT INTO public.sections (subject_id,slug,label,title,description,body,image_key,sort) SELECT id,${q(s.slug)},${q(s.label)},${q(s.title)},${q(s.description)},${q(intro)},${q(s.image_key)},${s.sort} FROM public.subjects WHERE slug=${q(s.subject)};`,
  );
  s.topics.forEach((t, i) => {
    out.push(
      `INSERT INTO public.topics (section_id,slug,title,blurb,body,sort) SELECT id,${q(slugify(t.title))},${q(t.title)},${q(t.blurb)},${q(body(t.title, t.blurb, s.title, subjectTitle))},${i} FROM public.sections WHERE slug=${q(s.slug)};`,
    );
  });
}

let slideSort = 0;
for (const [subject, slides] of Object.entries(heroSlides)) {
  for (const [title, subtitle, text, key, link] of slides) {
    out.push(
      `INSERT INTO public.hero_slides (subject_slug,title,subtitle,body,image_key,link_to,sort) VALUES (${q(subject)},${q(title)},${q(subtitle)},${q(text)},${q(key)},${q(link)},${slideSort++});`,
    );
  }
}

const articles = [
  ["neurons", "Neurons: The Body's Communication Network", "Discover how neurons transmit signals and coordinate every function.", 8, "cyan", "biology", "human-biology", "cat-human"],
  ["animal-adaptations", "Adaptations in the Animal Kingdom", "Explore amazing adaptations that help animals survive in their environments.", 6, "amber", "biology", "organisms", "cat-organisms"],
  ["immune-system", "The Immune System Explained", "Learn how your body defends itself against harmful invaders.", 7, "green", "biology", "human-biology", "cat-human"],
  ["fungi", "The Hidden World of Fungi", "Fungi play a crucial role in nature — more than you think.", 5, "violet", "biology", "organisms", "cat-organisms"],
  ["zygote-to-baby", "From Zygote to Baby", "A fascinating journey through human development.", 9, "rose", "biology", "human-biology", "cat-human"],
  ["why-algebra-works", "Why Algebra Works", "The quiet logic behind moving symbols across an equals sign.", 6, "cyan", "mathematics", "number-algebra", "math-algebra"],
  ["reading-a-graph", "How to Read Any Graph", "Axes, scale and the tricks that make data look better than it is.", 5, "amber", "mathematics", "statistics-probability", "math-statistics"],
  ["forces-everywhere", "Forces Are Everywhere", "Newton's laws explained with things you can try at home.", 7, "green", "science", "physics", "sci-physics"],
  ["periodic-table-story", "The Story of the Periodic Table", "How a card game of elements predicted matter we had not found yet.", 8, "violet", "science", "chemistry", "sci-chemistry"],
  ["closing-reading", "Close Reading in Five Steps", "A method for pulling meaning out of any unfamiliar text.", 6, "rose", "english", "literature", "eng-literature"],
  ["essays-that-argue", "Essays That Actually Argue", "Turning a list of observations into a real thesis.", 7, "cyan", "english", "writing-craft", "eng-writing"],
  ["sources-and-bias", "Sources, Bias and Evidence", "How historians decide what to believe.", 6, "amber", "history", "modern-world", "his-revolutions"],
  ["why-wwi-started", "Why the First World War Started", "Alliances, empire and a decade of miscalculation.", 9, "green", "history", "world-wars", "his-wars"],
  ["how-the-internet-works", "How the Internet Actually Works", "From typing a URL to pixels on screen, one packet at a time.", 8, "violet", "technology", "computing-basics", "tech-computing"],
  ["machine-learning-plain", "Machine Learning in Plain English", "What 'training a model' really means, without the maths.", 7, "rose", "technology", "ai-robotics", "tech-ai"],
];

articles.forEach(([slug, title, excerpt, minutes, tone, subject, section, key], i) => {
  const text = [
    `${excerpt}`,
    `This article sits inside the ${section.replaceAll("-", " ")} area of ${subject}. It is written to be read in one sitting, so the goal is a solid mental model rather than exhaustive coverage — you can follow the topic pages afterwards for the detail.`,
    `Start with the core idea. ${title} matters because it explains something that otherwise looks arbitrary. Once you can state the idea in a sentence, everything else becomes detail you can look up rather than facts you must memorise.`,
    `Next, look at the mechanism. What causes what, in which order, and what would happen if one step were removed? Answering that question is usually the difference between recognising a topic and genuinely understanding it.`,
    `Finally, test yourself. Explain it aloud, sketch it, or apply it to an example that was not used here. If any part of your explanation goes vague, that is exactly where to reread.`,
  ].join("\n\n");
  out.push(
    `INSERT INTO public.articles (slug,title,excerpt,body,minutes,tone,subject_slug,section_slug,image_key,sort) VALUES (${q(slug)},${q(title)},${q(excerpt)},${q(text)},${minutes},${q(tone)},${q(subject)},${q(section)},${q(key)},${i});`,
  );
});

const videos = [
  ["welcome-to-tedslab", "Welcome to Ted's Lab", "A short tour of how the encyclopedia is organised and how to study with it.", "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", "biology"],
  ["inside-the-cell", "Inside the Cell", "A visual walkthrough of organelles and what each one does.", "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", "biology"],
];
videos.forEach(([slug, title, description, url, subject], i) =>
  out.push(
    `INSERT INTO public.videos (slug,title,description,url,subject_slug,sort) VALUES (${q(slug)},${q(title)},${q(description)},${q(url)},${q(subject)},${i});`,
  ),
);

const pages = [
  ["about", "About Ted's Lab", "What this site is and who it is for.", "Ted's Lab is a study encyclopedia covering biology, mathematics, science, English, history and technology.\n\nEvery subject is broken into sections, and every section into topics with a full explanation. Study tools — notebook, flashcards, quizzes and saved content — sit alongside the reference material so you can revise without leaving the site.\n\nAll content on this site is editable by the site administrator, including pages like this one."],
  ["study-guide", "How to Study Here", "A simple routine for using the encyclopedia well.", "1. Pick a section and skim every topic card first.\n\n2. Read one topic properly, then close the page and explain it out loud.\n\n3. Save the topics you found hard — they appear under Saved Content.\n\n4. Turn those into flashcards and run a quiz at the end of the week.\n\nRepetition spread over days beats one long session, every time."],
  ["contact", "Contact", "Get in touch about the site.", "Questions, corrections and suggestions are welcome. Administrators can update this page at any time with current contact details."],
];
pages.forEach(([slug, title, description, text], i) =>
  out.push(
    `INSERT INTO public.pages (slug,title,description,body,show_in_nav,sort) VALUES (${q(slug)},${q(title)},${q(description)},${q(text)},true,${i});`,
  ),
);

const navLinks = [
  ["Glossary", "/glossary", "BookA", "tools", 0],
  ["Timeline of Life", "/timeline", "Clock", "tools", 1],
  ["Quizzes", "/quizzes", "HelpCircle", "tools", 2],
  ["Videos", "/videos", "PlayCircle", "tools", 3],
  ["Notebook", "/notebook", "NotebookPen", "study", 0],
  ["Flashcards", "/flashcards", "Layers", "study", 1],
  ["Saved Content", "/saved", "Bookmark", "study", 2],
  ["Create Custom List", "/custom-lists", "Plus", "study", 3],
];
navLinks.forEach(([label, href, icon, group, sort]) =>
  out.push(
    `INSERT INTO public.nav_links (label,href,icon,group_name,sort) VALUES (${q(label)},${q(href)},${q(icon)},${q(group)},${sort});`,
  ),
);

const settings = [
  ["site_name", "Ted's Lab"],
  ["site_tagline", "The Learning Encyclopedia"],
  ["hero_rotate_seconds", "6"],
  ["footer_quote", "Nothing in biology makes sense except in the light of evolution."],
];
settings.forEach(([k, v]) =>
  out.push(`INSERT INTO public.site_settings (key,value) VALUES (${q(k)},${q(v)}) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value;`),
);

fs.mkdirSync("/tmp/seed", { recursive: true });
const chunks = [];
let cur = [];
for (const line of out) {
  cur.push(line);
  if (cur.join("\n").length > 40000) {
    chunks.push(cur.join("\n"));
    cur = [];
  }
}
if (cur.length) chunks.push(cur.join("\n"));
chunks.forEach((c, i) => fs.writeFileSync(`/tmp/seed/part-${i}.sql`, c));
console.log("parts:", chunks.length, "statements:", out.length);
