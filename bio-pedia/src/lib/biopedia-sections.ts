export type Topic = { title: string; blurb: string };

export type Section = {
  slug: string;
  label: string;
  title: string;
  description: string;
  topics: Topic[];
};

export const sections: Section[] = [
  {
    slug: "organisms",
    label: "Organisms",
    title: "Organisms",
    description:
      "Survey the kingdoms of life — animals, fungi, protists, bacteria and archaea — and how they are classified.",
    topics: [
      { title: "Animal Kingdom", blurb: "Invertebrates to vertebrates and their body plans." },
      { title: "Fungi", blurb: "Decomposers, mycelium networks and symbiosis." },
      { title: "Protists", blurb: "Single-celled eukaryotes with astonishing variety." },
      { title: "Bacteria", blurb: "Prokaryotic life, metabolism and reproduction." },
      { title: "Archaea", blurb: "Extremophiles thriving where little else survives." },
      { title: "Taxonomy", blurb: "Binomial naming and the tree of classification." },
    ],
  },
  {
    slug: "cells-microscopy",
    label: "Cells & Microscopy",
    title: "Cells & Microscopy",
    description:
      "Zoom into the basic unit of life: organelles, membranes, cell division and the tools used to see them.",
    topics: [
      { title: "Cell Structure", blurb: "Organelles and their specialised jobs." },
      { title: "Cell Membrane", blurb: "The fluid mosaic model and transport." },
      { title: "Mitosis", blurb: "How cells copy themselves faithfully." },
      { title: "Meiosis", blurb: "Halving chromosomes to make gametes." },
      { title: "Light Microscopy", blurb: "Magnification, resolution and staining." },
      { title: "Electron Microscopy", blurb: "Seeing structures beyond the light limit." },
    ],
  },
  {
    slug: "genetics-dna",
    label: "Genetics & DNA",
    title: "Genetics & DNA",
    description:
      "From the double helix to inheritance patterns and the molecular machinery that reads the genome.",
    topics: [
      { title: "DNA Structure", blurb: "Base pairing, the double helix and packaging." },
      { title: "Replication", blurb: "Copying the genome before cell division." },
      { title: "Transcription", blurb: "Turning DNA into messenger RNA." },
      { title: "Translation", blurb: "Ribosomes building proteins from codons." },
      { title: "Mendelian Inheritance", blurb: "Dominant, recessive and Punnett squares." },
      { title: "Mutations", blurb: "Point mutations, frameshifts and consequences." },
    ],
  },
  {
    slug: "human-biology",
    label: "Human Biology",
    title: "Human Biology",
    description: "How the human body works — organ systems, health, immunity and development.",
    topics: [
      { title: "Circulatory System", blurb: "Heart, blood and vessels in motion." },
      { title: "Respiratory System", blurb: "Gas exchange from nose to alveoli." },
      { title: "Nervous System", blurb: "Neurons, brain regions and reflexes." },
      { title: "Digestive System", blurb: "Breaking food into usable molecules." },
      { title: "Immune System", blurb: "Innate and adaptive defence layers." },
      { title: "Human Development", blurb: "From zygote to newborn." },
    ],
  },
  {
    slug: "plants",
    label: "Plants",
    title: "Plants",
    description: "Plant structure, growth, reproduction and the chemistry that feeds the planet.",
    topics: [
      { title: "Photosynthesis", blurb: "Light reactions and the Calvin cycle." },
      { title: "Roots & Stems", blurb: "Anchorage, transport and support tissues." },
      { title: "Leaves", blurb: "Structure tuned for capturing light." },
      { title: "Flowers & Pollination", blurb: "Reproductive strategies and partners." },
      { title: "Seeds & Germination", blurb: "Dormancy, dispersal and sprouting." },
      { title: "Plant Hormones", blurb: "Auxins, gibberellins and tropisms." },
    ],
  },
  {
    slug: "ecology-environment",
    label: "Ecology & Environment",
    title: "Ecology & Environment",
    description:
      "Ecosystems, energy flow, nutrient cycles and the human impact on the living world.",
    topics: [
      { title: "Food Chains & Webs", blurb: "Energy transfer between trophic levels." },
      { title: "Biomes", blurb: "Tundra to rainforest and what shapes them." },
      { title: "Carbon Cycle", blurb: "Carbon moving through life, air and rock." },
      { title: "Nitrogen Cycle", blurb: "Fixation, nitrification and denitrification." },
      { title: "Biodiversity", blurb: "Why variety keeps ecosystems resilient." },
      { title: "Conservation", blurb: "Protecting habitats and species at risk." },
    ],
  },
  {
    slug: "evolution",
    label: "Evolution",
    title: "Evolution",
    description: "Four billion years of change explained by variation, selection and time.",
    topics: [
      { title: "Natural Selection", blurb: "Differential survival and reproduction." },
      { title: "Speciation", blurb: "How populations split into new species." },
      { title: "Fossil Record", blurb: "Reading history in rock layers." },
      { title: "Adaptation", blurb: "Traits shaped by environmental pressure." },
      { title: "Genetic Drift", blurb: "Chance changes in small populations." },
      { title: "Phylogenetics", blurb: "Building trees from shared ancestry." },
    ],
  },
  {
    slug: "biological-processes",
    label: "Biological Processes",
    title: "Biological Processes",
    description: "The recurring chemical and physical processes that keep organisms alive.",
    topics: [
      { title: "Respiration", blurb: "Glycolysis, Krebs cycle and ATP yield." },
      { title: "Osmosis & Diffusion", blurb: "Passive movement across membranes." },
      { title: "Homeostasis", blurb: "Feedback loops keeping conditions steady." },
      { title: "Enzymes", blurb: "Catalysts, active sites and inhibition." },
      { title: "Metabolism", blurb: "Anabolic and catabolic pathways." },
      { title: "Cell Signalling", blurb: "Receptors, messengers and responses." },
    ],
  },
  {
    slug: "anatomy",
    label: "Anatomy",
    title: "Anatomy",
    description: "The structural map of bodies: bones, muscles, organs and tissue types.",
    topics: [
      { title: "Skeletal System", blurb: "206 bones, joints and marrow." },
      { title: "Muscular System", blurb: "Smooth, cardiac and skeletal muscle." },
      { title: "Organ Systems", blurb: "How organs cooperate as systems." },
      { title: "Tissue Types", blurb: "Epithelial, connective, muscle, nervous." },
      { title: "Comparative Anatomy", blurb: "Homologous and analogous structures." },
      { title: "Anatomical Terms", blurb: "Planes, directions and regions." },
    ],
  },
  {
    slug: "biotechnology",
    label: "Biotechnology",
    title: "Biotechnology",
    description: "Applying biology as technology — from PCR and cloning to gene editing.",
    topics: [
      { title: "CRISPR", blurb: "Targeted editing of the genome." },
      { title: "PCR", blurb: "Amplifying DNA millions of times over." },
      { title: "Cloning", blurb: "Copying genes, cells and organisms." },
      { title: "Genetic Engineering", blurb: "Recombinant DNA and transgenics." },
      { title: "Fermentation", blurb: "Microbes producing food and medicine." },
      { title: "Bioethics", blurb: "Weighing benefit, risk and consent." },
    ],
  },
];

export function getSection(slug: string) {
  return sections.find((s) => s.slug === slug);
}

export const glossary = [
  { term: "Allele", definition: "One of several alternative forms of a gene." },
  { term: "ATP", definition: "Adenosine triphosphate, the cell's main energy currency." },
  { term: "Biome", definition: "A large community of plants and animals in a major habitat." },
  { term: "Chromosome", definition: "A threadlike structure of DNA carrying genes." },
  { term: "Diffusion", definition: "Net movement of particles from high to low concentration." },
  { term: "Enzyme", definition: "A protein that speeds up a biochemical reaction." },
  { term: "Gamete", definition: "A reproductive cell with half the chromosome number." },
  { term: "Homeostasis", definition: "Maintenance of a stable internal environment." },
  { term: "Mitochondrion", definition: "Organelle producing most of a cell's ATP." },
  { term: "Osmosis", definition: "Diffusion of water across a semi-permeable membrane." },
  { term: "Phenotype", definition: "The observable characteristics of an organism." },
  { term: "Ribosome", definition: "The molecular machine that assembles proteins." },
];

export const fullTimeline = [
  { when: "4.5 Ga", what: "Earth forms", detail: "A molten young planet cools and gains oceans." },
  { when: "3.5 Ga", what: "First life", detail: "Simple prokaryotic cells appear in the sea." },
  {
    when: "2.4 Ga",
    what: "Great Oxidation",
    detail: "Cyanobacteria flood the atmosphere with oxygen.",
  },
  { when: "1.8 Ga", what: "Eukaryotes", detail: "Cells with nuclei and organelles emerge." },
  { when: "541 Ma", what: "Cambrian Explosion", detail: "Most animal body plans appear rapidly." },
  { when: "470 Ma", what: "Plants on land", detail: "Early land plants colonise the continents." },
  { when: "200 Ma", what: "Age of Dinosaurs", detail: "Reptiles dominate terrestrial ecosystems." },
  { when: "66 Ma", what: "Mass Extinction", detail: "An impact ends the non-avian dinosaurs." },
  { when: "300 ka", what: "Homo sapiens", detail: "Modern humans arise in Africa." },
  { when: "Present", what: "Human Civilization", detail: "One species reshapes the biosphere." },
];

export type QuizItem = {
  question: string;
  options: { key: string; label: string }[];
  answer: string;
};

export const quizBank: QuizItem[] = [
  {
    question: "Which organelle is known as the powerhouse of the cell?",
    options: [
      { key: "A", label: "Nucleus" },
      { key: "B", label: "Mitochondria" },
      { key: "C", label: "Ribosome" },
      { key: "D", label: "Golgi Apparatus" },
    ],
    answer: "B",
  },
  {
    question: "What molecule carries the genetic code from nucleus to ribosome?",
    options: [
      { key: "A", label: "tRNA" },
      { key: "B", label: "mRNA" },
      { key: "C", label: "DNA" },
      { key: "D", label: "ATP" },
    ],
    answer: "B",
  },
  {
    question: "Photosynthesis mainly takes place in which structure?",
    options: [
      { key: "A", label: "Chloroplast" },
      { key: "B", label: "Vacuole" },
      { key: "C", label: "Root hair" },
      { key: "D", label: "Stoma" },
    ],
    answer: "A",
  },
  {
    question: "Which process halves the chromosome number?",
    options: [
      { key: "A", label: "Mitosis" },
      { key: "B", label: "Binary fission" },
      { key: "C", label: "Meiosis" },
      { key: "D", label: "Replication" },
    ],
    answer: "C",
  },
  {
    question: "Which cycle converts atmospheric N₂ into usable compounds?",
    options: [
      { key: "A", label: "Carbon cycle" },
      { key: "B", label: "Nitrogen cycle" },
      { key: "C", label: "Water cycle" },
      { key: "D", label: "Rock cycle" },
    ],
    answer: "B",
  },
];

export const flashcards = [
  { front: "Osmosis", back: "Movement of water across a semi-permeable membrane." },
  { front: "Genotype", back: "The genetic make-up of an organism." },
  { front: "Producer", back: "An organism that makes its own food, usually by photosynthesis." },
  { front: "Homologous structures", back: "Similar structures inherited from a common ancestor." },
  { front: "Enzyme active site", back: "The region where a substrate binds and reacts." },
  { front: "Diploid", back: "A cell containing two complete sets of chromosomes." },
];
