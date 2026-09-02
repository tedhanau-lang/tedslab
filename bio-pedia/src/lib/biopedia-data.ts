import catOrganisms from "@/assets/cat-organisms.jpg";
import catGenetics from "@/assets/cat-genetics.jpg";
import catHuman from "@/assets/cat-human.jpg";
import catPlants from "@/assets/cat-plants.jpg";
import catEcology from "@/assets/cat-ecology.jpg";
import catEvolution from "@/assets/cat-evolution.jpg";

export type Category = {
  slug: string;
  title: string;
  blurb: string;
  image: string;
};

export const categories: Category[] = [
  {
    slug: "organisms",
    title: "Organisms",
    blurb: "Animals, Fungi, Protists & more",
    image: catOrganisms,
  },
  {
    slug: "genetics-dna",
    title: "Genetics & DNA",
    blurb: "Genes, Inheritance, Molecular Biology",
    image: catGenetics,
  },
  {
    slug: "human-biology",
    title: "Human Biology",
    blurb: "Systems, Organs, Health & Disease",
    image: catHuman,
  },
  { slug: "plants", title: "Plants", blurb: "Structure, Growth, Reproduction", image: catPlants },
  {
    slug: "ecology-environment",
    title: "Ecology",
    blurb: "Ecosystems, Cycles, Conservation",
    image: catEcology,
  },
  {
    slug: "evolution",
    title: "Evolution",
    blurb: "Natural Selection, Fossils, Adaptation",
    image: catEvolution,
  },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  minutes: number;
  tone: "cyan" | "amber" | "green" | "violet" | "rose";
};

export const articles: Article[] = [
  {
    slug: "neurons",
    title: "Neurons: The Body's Communication Network",
    excerpt: "Discover how neurons transmit signals and coordinate every function.",
    minutes: 8,
    tone: "cyan",
  },
  {
    slug: "animal-adaptations",
    title: "Adaptations in the Animal Kingdom",
    excerpt: "Explore amazing adaptations that help animals survive in their environments.",
    minutes: 6,
    tone: "amber",
  },
  {
    slug: "immune-system",
    title: "The Immune System Explained",
    excerpt: "Learn how your body defends itself against harmful invaders.",
    minutes: 7,
    tone: "green",
  },
  {
    slug: "fungi",
    title: "The Hidden World of Fungi",
    excerpt: "Fungi play a crucial role in nature—more than you think.",
    minutes: 5,
    tone: "violet",
  },
  {
    slug: "zygote-to-baby",
    title: "From Zygote to Baby",
    excerpt: "A fascinating journey through human development.",
    minutes: 9,
    tone: "rose",
  },
];

export const timeline = [
  { when: "3.5 Ga", what: "First Life Forms" },
  { when: "541 Ma", what: "Cambrian Explosion" },
  { when: "200 Ma", what: "Age of Dinosaurs" },
  { when: "66 Ma", what: "Mass Extinction" },
  { when: "Present", what: "Human Civilization" },
];

export const quiz = {
  question: "Which organelle is known as the powerhouse of the cell?",
  options: [
    { key: "A", label: "Nucleus" },
    { key: "B", label: "Mitochondria" },
    { key: "C", label: "Ribosome" },
    { key: "D", label: "Golgi Apparatus" },
  ],
  answer: "B",
};

export const heroSlides = [
  {
    title: "The Cell",
    subtitle: "The Basic Unit of Life",
    body: "Explore the incredible world within every living thing. Discover structure, function, and the processes that sustain life.",
  },
  {
    title: "DNA",
    subtitle: "The Blueprint of Life",
    body: "Four letters, endless possibility. See how genetic information is stored, copied and expressed.",
  },
  {
    title: "Photosynthesis",
    subtitle: "Turning Light Into Life",
    body: "Follow the light-driven chemistry that feeds nearly every food chain on Earth.",
    link_to: "/photosynthesis",
  },
  {
    title: "Evolution",
    subtitle: "Four Billion Years of Change",
    body: "Trace how natural selection shaped the staggering diversity of living things.",
  },
];
