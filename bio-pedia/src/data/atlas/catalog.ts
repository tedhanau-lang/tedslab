import type { AtlasNode, ClusterId, ClusterMeta, NodeKind } from "./types";
import { MORE_BY_CLUSTER } from "./catalog-more";
import { GENERATED_BY_CLUSTER } from "./catalog-generated";

export const CLUSTERS: ClusterMeta[] = [
  { id: "philosophy", title: "Philosophy", subtitle: "Mind, value, being", accent: "#C27DFF" },
  { id: "physics", title: "Physics", subtitle: "Matter, energy, spacetime", accent: "#00C7E5" },
  { id: "mathematics", title: "Mathematics", subtitle: "Structure and proof", accent: "#00DAD2" },
  { id: "biology", title: "Biology", subtitle: "Life and its lineages", accent: "#5AD664" },
  { id: "computing", title: "Computing", subtitle: "Information and machines", accent: "#00AFF3" },
  { id: "history", title: "History", subtitle: "Civilizations in time", accent: "#EFA831" },
  { id: "mind", title: "Mind", subtitle: "Cognition and language", accent: "#EB7FE3" },
  { id: "systems", title: "Systems", subtitle: "Wholes, feedback, nets", accent: "#00C38B" },
];

type Seed = {
  id: string;
  title: string;
  kind: NodeKind;
  tags: string[];
  summary: string;
  related: string[];
  born?: string;
};

const byCluster: Record<ClusterId, Seed[]> = {
  philosophy: [
    { id: "philosophy", title: "Philosophy", kind: "hub", tags: ["hub", "inquiry"], summary: "The disciplined attempt to ask what is, what we can know, and how we ought to live — the root system of the atlas.", related: ["epistemology", "metaphysics", "ethics", "logic", "consciousness", "political-philosophy", "aesthetics", "existentialism", "knowledge-atlas", "enlightenment"] },
    { id: "epistemology", title: "Epistemology", kind: "topic", tags: ["knowledge", "justification", "skepticism"], summary: "The study of knowledge: what it is, how it is acquired, and how it can fail.", related: ["empiricism", "rationalism", "hume", "kant", "logic", "science", "scientific-revolution"] },
    { id: "metaphysics", title: "Metaphysics", kind: "topic", tags: ["being", "ontology", "reality"], summary: "Inquiry into the basic furniture of the world — substance, time, causation, possibility.", related: ["aristotle", "kant", "dualism", "spacetime", "consciousness", "set-theory"] },
    { id: "ethics", title: "Ethics", kind: "topic", tags: ["value", "morality", "virtue"], summary: "The theory of right action, good lives, and the reasons that bind us to one another.", related: ["utilitarianism", "aristotle", "kant", "political-philosophy", "decision-making", "game-theory"] },
    { id: "logic", title: "Logic", kind: "topic", tags: ["inference", "validity", "form"], summary: "The science of valid inference, from Aristotelian syllogism to modern proof and computation.", related: ["aristotle", "godel", "computation-theory", "set-theory", "proof", "epistemology"] },
    { id: "consciousness", title: "Consciousness", kind: "topic", tags: ["mind", "experience", "hard-problem"], summary: "The fact of felt experience, and the puzzle of how it arises in a physical universe.", related: ["qualia", "dualism", "neuroscience", "attention", "phenomenology", "wittgenstein", "free-will"] },
    { id: "political-philosophy", title: "Political Philosophy", kind: "topic", tags: ["justice", "state", "liberty"], summary: "What political authority is, when it is legitimate, and how collective life should be arranged.", related: ["plato", "ethics", "democracy", "enlightenment", "capitalism", "social-psychology"] },
    { id: "plato", title: "Plato", kind: "figure", tags: ["figure", "antiquity", "forms"], summary: "Athenian philosopher whose dialogues set the agenda for metaphysics, politics, and the soul.", related: ["philosophy", "aristotle", "political-philosophy", "metaphysics", "axial-age"], born: "c. 427 BCE" },
    { id: "aristotle", title: "Aristotle", kind: "figure", tags: ["figure", "antiquity", "virtue"], summary: "The great systematizer of logic, biology, ethics, and the categories of being.", related: ["plato", "logic", "ethics", "biology", "metaphysics", "rhetoric"], born: "384 BCE" },
    { id: "kant", title: "Immanuel Kant", kind: "figure", tags: ["figure", "enlightenment", "critique"], summary: "The Copernican revolutionary of philosophy, who relocated the conditions of knowledge into the structure of mind.", related: ["epistemology", "ethics", "enlightenment", "metaphysics", "hume"], born: "1724" },
    { id: "hume", title: "David Hume", kind: "figure", tags: ["figure", "empiricism", "skepticism"], summary: "Scottish empiricist who unmasked causation, the self, and morality as habits of mind.", related: ["empiricism", "epistemology", "kant", "ethics", "enlightenment"], born: "1711" },
    { id: "wittgenstein", title: "Ludwig Wittgenstein", kind: "figure", tags: ["figure", "language", "logic"], summary: "Philosopher of language and logic who twice rebuilt the map of meaning.", related: ["logic", "language", "consciousness", "philosophy", "computation-theory"], born: "1889" },
    { id: "empiricism", title: "Empiricism", kind: "concept", tags: ["knowledge", "experience", "school"], summary: "The thesis that experience, not innate ideas, is the wellspring of knowledge.", related: ["epistemology", "hume", "rationalism", "scientific-revolution", "perception"] },
    { id: "rationalism", title: "Rationalism", kind: "concept", tags: ["knowledge", "reason", "school"], summary: "The thesis that reason can yield knowledge independent of sensory experience.", related: ["epistemology", "kant", "plato", "mathematics", "logic"] },
    { id: "utilitarianism", title: "Utilitarianism", kind: "concept", tags: ["ethics", "consequences", "welfare"], summary: "The moral theory that right action maximizes aggregate well-being.", related: ["ethics", "decision-making", "game-theory", "economics", "political-philosophy"] },
    { id: "dualism", title: "Dualism", kind: "concept", tags: ["mind", "substance", "ontology"], summary: "The claim that mind and body are of fundamentally different kinds.", related: ["consciousness", "metaphysics", "neuroscience", "qualia", "descartes"] },
    { id: "free-will", title: "Free Will", kind: "concept", tags: ["agency", "responsibility", "determinism"], summary: "The disputed capacity to have done otherwise, and the moral weight that hangs on it.", related: ["ethics", "consciousness", "neuroscience", "decision-making", "metaphysics"] },
    { id: "qualia", title: "Qualia", kind: "concept", tags: ["experience", "phenomenology", "mind"], summary: "The raw feels of experience — the redness of red, the sting of pain — that resist functional reduction.", related: ["consciousness", "phenomenology", "perception", "dualism", "neuroscience"] },
    { id: "phenomenology", title: "Phenomenology", kind: "concept", tags: ["experience", "method", "first-person"], summary: "A method of describing experience as it is lived, before theories overlay it.", related: ["consciousness", "qualia", "perception", "philosophy", "embodied-cognition"] },
  ],
  physics: [
    { id: "physics", title: "Physics", kind: "hub", tags: ["hub", "nature"], summary: "The science of matter, energy, space, and time — the operating system of the cosmos.", related: ["classical-mechanics", "quantum-mechanics", "relativity", "thermodynamics", "particle-physics", "cosmology", "optics", "statistical-mechanics", "knowledge-atlas", "mathematics"] },
    { id: "classical-mechanics", title: "Classical Mechanics", kind: "topic", tags: ["motion", "newton", "determinism"], summary: "The laws of motion and gravitation that still run the middle-scale world.", related: ["newton", "calculus", "relativity", "thermodynamics", "chaos-theory"] },
    { id: "quantum-mechanics", title: "Quantum Mechanics", kind: "topic", tags: ["quanta", "measurement", "wavefunction"], summary: "The theory of the very small, in which chance, superposition, and entanglement replace classical trajectories.", related: ["uncertainty-principle", "wave-function", "bohr", "particle-physics", "quantum-computing", "information-theory"] },
    { id: "relativity", title: "Relativity", kind: "topic", tags: ["spacetime", "gravity", "light"], summary: "Einstein's reconstruction of space, time, and gravity as geometry in motion.", related: ["einstein", "spacetime", "cosmology", "black-holes", "classical-mechanics"] },
    { id: "thermodynamics", title: "Thermodynamics", kind: "topic", tags: ["heat", "entropy", "energy"], summary: "The science of heat, work, and the arrow of time written in entropy.", related: ["entropy", "information-theory", "statistical-mechanics", "origin-of-life", "complexity"] },
    { id: "particle-physics", title: "Particle Physics", kind: "topic", tags: ["standard-model", "fields", "accelerators"], summary: "The catalog of elementary particles and the forces that braid them.", related: ["standard-model", "quantum-mechanics", "cosmology", "feynman"] },
    { id: "cosmology", title: "Cosmology", kind: "topic", tags: ["universe", "origin", "large-scale"], summary: "The study of the universe as a whole — its beginning, contents, and fate.", related: ["relativity", "dark-matter", "black-holes", "particle-physics", "entropy"] },
    { id: "newton", title: "Isaac Newton", kind: "figure", tags: ["figure", "mechanics", "calculus"], summary: "Architect of classical mechanics, optics, and co-inventor of calculus.", related: ["classical-mechanics", "calculus", "scientific-revolution", "optics"], born: "1643" },
    { id: "einstein", title: "Albert Einstein", kind: "figure", tags: ["figure", "relativity", "quanta"], summary: "The physicist who bent spacetime and opened the quantum door with the photon.", related: ["relativity", "spacetime", "quantum-mechanics", "cosmology"], born: "1879" },
    { id: "bohr", title: "Niels Bohr", kind: "figure", tags: ["figure", "quantum", "complementarity"], summary: "Founder of the Copenhagen reading of quantum theory and the correspondence principle.", related: ["quantum-mechanics", "wave-function", "uncertainty-principle", "feynman"], born: "1885" },
    { id: "feynman", title: "Richard Feynman", kind: "figure", tags: ["figure", "qed", "path-integrals"], summary: "Virtuoso of quantum electrodynamics, path integrals, and explanation.", related: ["particle-physics", "quantum-mechanics", "computation-theory", "nanotechnology"], born: "1918" },
    { id: "maxwell", title: "James Clerk Maxwell", kind: "figure", tags: ["figure", "fields", "electromagnetism"], summary: "Unifier of electricity, magnetism, and light into a single field theory.", related: ["electromagnetism", "relativity", "information-theory", "thermodynamics"], born: "1831" },
    { id: "entropy", title: "Entropy", kind: "concept", tags: ["disorder", "information", "arrow-of-time"], summary: "The measure of missing information, the tally of ways a system can be, the reason cups cool.", related: ["thermodynamics", "information-theory", "complexity", "origin-of-life", "statistical-mechanics"] },
    { id: "spacetime", title: "Spacetime", kind: "concept", tags: ["geometry", "relativity", "continuum"], summary: "The four-dimensional arena in which events have no absolute when or where, only interval.", related: ["relativity", "einstein", "black-holes", "cosmology", "metaphysics"] },
    { id: "uncertainty-principle", title: "Uncertainty Principle", kind: "concept", tags: ["quantum", "limits", "measurement"], summary: "The built-in trade-off between knowing a particle's position and its momentum.", related: ["quantum-mechanics", "wave-function", "information-theory", "epistemology"] },
    { id: "black-holes", title: "Black Holes", kind: "concept", tags: ["gravity", "horizon", "information"], summary: "Regions where spacetime curves past the point of return, and information's fate is still on trial.", related: ["relativity", "spacetime", "cosmology", "entropy", "information-theory"] },
    { id: "wave-function", title: "Wave Function", kind: "concept", tags: ["quantum", "amplitude", "state"], summary: "The complete quantum state: a map of amplitudes whose squared modulus yields chance.", related: ["quantum-mechanics", "uncertainty-principle", "information-theory", "bohr"] },
    { id: "standard-model", title: "Standard Model", kind: "concept", tags: ["particles", "gauge", "fields"], summary: "The most precise theory humans have, cataloging quarks, leptons, and gauge bosons — and still incomplete.", related: ["particle-physics", "quantum-mechanics", "dark-matter", "cosmology"] },
    { id: "dark-matter", title: "Dark Matter", kind: "concept", tags: ["cosmology", "invisible", "mass"], summary: "The unseen mass that sculpts galaxies and refuses, so far, to show up in our detectors.", related: ["cosmology", "particle-physics", "standard-model", "relativity"] },
    { id: "electromagnetism", title: "Electromagnetism", kind: "concept", tags: ["fields", "light", "force"], summary: "One force with two faces, carrying light, chemistry, and almost every machine.", related: ["maxwell", "relativity", "particle-physics", "photosynthesis"] },
  ],
  mathematics: [
    { id: "mathematics", title: "Mathematics", kind: "hub", tags: ["hub", "structure"], summary: "The study of pattern, quantity, space, and change — a language the other sciences borrow.", related: ["number-theory", "calculus", "linear-algebra", "topology", "probability", "graph-theory", "combinatorics", "abstract-algebra", "knowledge-atlas", "logic"] },
    { id: "number-theory", title: "Number Theory", kind: "topic", tags: ["integers", "primes", "arithmetic"], summary: "The higher arithmetic: primes, congruences, and the secret life of the integers.", related: ["prime-numbers", "cryptography", "gauss", "proof", "infinity"] },
    { id: "calculus", title: "Calculus", kind: "topic", tags: ["change", "limits", "integrals"], summary: "The mathematics of continuous change, invented twice and then made rigorous.", related: ["newton", "classical-mechanics", "fourier-analysis", "analysis", "probability"] },
    { id: "linear-algebra", title: "Linear Algebra", kind: "topic", tags: ["vectors", "matrices", "spaces"], summary: "The geometry of linear maps — the skeleton inside graphics, quantum theory, and machine learning.", related: ["quantum-mechanics", "machine-learning", "fourier-analysis", "category-theory"] },
    { id: "topology", title: "Topology", kind: "topic", tags: ["space", "continuity", "invariants"], summary: "Geometry without a ruler: what survives stretching, and how spaces can be classified.", related: ["set-theory", "graph-theory", "category-theory", "spacetime"] },
    { id: "probability", title: "Probability", kind: "topic", tags: ["chance", "measure", "inference"], summary: "The mathematics of uncertainty, from dice to the Bayesian brain.", related: ["statistics", "information-theory", "decision-making", "bayesian-brain", "entropy"] },
    { id: "graph-theory", title: "Graph Theory", kind: "topic", tags: ["networks", "vertices", "edges"], summary: "The mathematics of connection — vertices, edges, and the shapes of relation.", related: ["networks", "algorithms", "scale-free-networks", "knowledge-representation", "internet"] },
    { id: "euclid", title: "Euclid", kind: "figure", tags: ["figure", "geometry", "axioms"], summary: "Author of the Elements, the template of axiomatic method for two millennia.", related: ["proof", "mathematics", "rationalism", "ancient-civilizations"], born: "c. 300 BCE" },
    { id: "gauss", title: "Carl Friedrich Gauss", kind: "figure", tags: ["figure", "number-theory", "prince"], summary: "The prince of mathematicians, who left fingerprints on number theory, statistics, and magnetism.", related: ["number-theory", "probability", "electromagnetism", "prime-numbers"], born: "1777" },
    { id: "godel", title: "Kurt Gödel", kind: "figure", tags: ["figure", "incompleteness", "logic"], summary: "The logician who proved that any sufficiently rich formal system cannot prove all its truths.", related: ["logic", "set-theory", "computation-theory", "infinity", "proof"], born: "1906" },
    { id: "riemann", title: "Bernhard Riemann", kind: "figure", tags: ["figure", "geometry", "primes"], summary: "Visionary of curved spaces and of the zeta function's hidden zeros.", related: ["topology", "number-theory", "relativity", "prime-numbers"], born: "1826" },
    { id: "euler", title: "Leonhard Euler", kind: "figure", tags: ["figure", "analysis", "graphs"], summary: "The most prolific mathematician, who opened graph theory with a stroll through Königsberg.", related: ["graph-theory", "calculus", "number-theory", "networks"], born: "1707" },
    { id: "prime-numbers", title: "Prime Numbers", kind: "concept", tags: ["integers", "atoms-of-arithmetic"], summary: "The atoms of the integers, irregularly sprinkled, and the raw material of modern cryptography.", related: ["number-theory", "cryptography", "gauss", "riemann"] },
    { id: "set-theory", title: "Set Theory", kind: "concept", tags: ["foundations", "infinity", "axioms"], summary: "The official foundation of mathematics, and the stage on which infinity was made precise.", related: ["infinity", "godel", "logic", "mathematics", "proof"] },
    { id: "chaos-theory", title: "Chaos Theory", kind: "concept", tags: ["dynamics", "sensitivity", "order"], summary: "Deterministic systems that forget their past — the butterfly, the weather, the dripping tap.", related: ["classical-mechanics", "complexity", "emergence", "calculus"] },
    { id: "category-theory", title: "Category Theory", kind: "concept", tags: ["structure", "morphisms", "foundations"], summary: "Mathematics about mathematics: objects and arrows, and what is preserved when you change the names.", related: ["topology", "logic", "programming-languages", "knowledge-representation"] },
    { id: "infinity", title: "Infinity", kind: "concept", tags: ["endless", "cardinals", "paradox"], summary: "A family of sizes beyond the finite, tamed by Cantor and still philosophically wild.", related: ["set-theory", "godel", "calculus", "cosmology", "metaphysics"] },
    { id: "proof", title: "Proof", kind: "concept", tags: ["certainty", "method", "rigor"], summary: "The social technology by which mathematicians convert insight into shared certainty.", related: ["logic", "euclid", "godel", "computation-theory", "epistemology"] },
    { id: "fourier-analysis", title: "Fourier Analysis", kind: "concept", tags: ["waves", "spectra", "decomposition"], summary: "The art of taking any signal apart into waves — and putting the world back together from them.", related: ["calculus", "linear-algebra", "quantum-mechanics", "information-theory", "perception"] },
  ],
  biology: [
    { id: "biology", title: "Biology", kind: "hub", tags: ["hub", "life"], summary: "The science of living systems, from molecules that copy themselves to planets that green.", related: ["evolution", "genetics", "neuroscience", "cell-biology", "ecology", "origin-of-life", "developmental-biology", "paleontology", "knowledge-atlas", "chemistry"] },
    { id: "evolution", title: "Evolution", kind: "topic", tags: ["change", "lineage", "deep-time"], summary: "Descent with modification: the process that grew every lineage from a common root.", related: ["natural-selection", "darwin", "genetics", "origin-of-life", "cambrian-explosion", "biodiversity"] },
    { id: "genetics", title: "Genetics", kind: "topic", tags: ["heredity", "genes", "variation"], summary: "The architecture of heredity, from Mendel's peas to sequenced genomes.", related: ["dna", "mendel", "evolution", "protein-folding", "origin-of-life"] },
    { id: "neuroscience", title: "Neuroscience", kind: "topic", tags: ["brain", "neurons", "circuit"], summary: "The study of nervous systems — how wet circuits sense, decide, remember, and feel.", related: ["consciousness", "memory", "perception", "neural-networks", "attention", "emotion"] },
    { id: "cell-biology", title: "Cell Biology", kind: "topic", tags: ["cell", "organelles", "membranes"], summary: "Life's unit of organization: membranes, metabolism, and the city-state of the cell.", related: ["dna", "protein-folding", "origin-of-life", "microbiome", "photosynthesis"] },
    { id: "ecology", title: "Ecology", kind: "topic", tags: ["systems", "niches", "flows"], summary: "The science of relations among organisms and their worlds — energy, niches, collapse, recovery.", related: ["biodiversity", "systems-thinking", "symbiosis", "photosynthesis", "networks"] },
    { id: "origin-of-life", title: "Origin of Life", kind: "topic", tags: ["abiogenesis", "emergence", "chemistry"], summary: "The still-open question of how chemistry crossed the threshold into Darwinian evolution.", related: ["evolution", "cell-biology", "entropy", "emergence", "dna"] },
    { id: "darwin", title: "Charles Darwin", kind: "figure", tags: ["figure", "evolution", "voyage"], summary: "Naturalist who assembled the evidence for common descent and proposed natural selection as its engine.", related: ["evolution", "natural-selection", "biodiversity", "scientific-revolution"], born: "1809" },
    { id: "mendel", title: "Gregor Mendel", kind: "figure", tags: ["figure", "heredity", "peas"], summary: "The Augustinian who counted peas and found the atoms of heredity.", related: ["genetics", "dna", "evolution"], born: "1822" },
    { id: "franklin", title: "Rosalind Franklin", kind: "figure", tags: ["figure", "dna", "crystallography"], summary: "Physical chemist whose X-ray images made the double helix visible.", related: ["dna", "genetics", "cell-biology"], born: "1920" },
    { id: "pasteur", title: "Louis Pasteur", kind: "figure", tags: ["figure", "microbes", "germ-theory"], summary: "Chemist who buried spontaneous generation and founded the germ theory of disease.", related: ["microbiome", "immune-system", "cell-biology", "scientific-revolution"], born: "1822" },
    { id: "linnaeus", title: "Carl Linnaeus", kind: "figure", tags: ["figure", "taxonomy", "names"], summary: "The namer of names, who gave biology a nested language for life.", related: ["biodiversity", "biology", "knowledge-representation", "enlightenment"], born: "1707" },
    { id: "dna", title: "DNA", kind: "concept", tags: ["molecule", "code", "replication"], summary: "The molecule that stores hereditary information as a four-letter text that copies itself.", related: ["genetics", "franklin", "protein-folding", "information-theory", "origin-of-life"] },
    { id: "natural-selection", title: "Natural Selection", kind: "concept", tags: ["mechanism", "adaptation", "fitness"], summary: "The filter: heritable variation plus differential reproduction yields design without a designer.", related: ["evolution", "darwin", "genetics", "algorithms", "complexity"] },
    { id: "photosynthesis", title: "Photosynthesis", kind: "concept", tags: ["energy", "plants", "carbon"], summary: "The biochemical bridge that turns sunlight into chemical wealth and oxygen into an atmosphere.", related: ["ecology", "cell-biology", "electromagnetism", "entropy"] },
    { id: "immune-system", title: "Immune System", kind: "concept", tags: ["defense", "self", "memory"], summary: "A distributed learning system that distinguishes self from other and remembers insults.", related: ["cell-biology", "microbiome", "networks", "learning", "pasteur"] },
    { id: "cambrian-explosion", title: "Cambrian Explosion", kind: "concept", tags: ["deep-time", "body-plans", "radiation"], summary: "The brief geological moment when most animal body plans appear in the rock.", related: ["evolution", "biodiversity", "ecology", "origin-of-life"] },
    { id: "protein-folding", title: "Protein Folding", kind: "concept", tags: ["structure", "function", "computation"], summary: "How a string of amino acids finds a shape, and why that shape is almost all of biochemistry.", related: ["dna", "cell-biology", "algorithms", "machine-learning"] },
    { id: "microbiome", title: "Microbiome", kind: "concept", tags: ["microbes", "symbiosis", "ecology"], summary: "The communities of microorganisms that live with, on, and in us — a second genome of sorts.", related: ["ecology", "symbiosis", "immune-system", "cell-biology"] },
    { id: "biodiversity", title: "Biodiversity", kind: "concept", tags: ["variety", "extinction", "value"], summary: "The variety of life at every scale, now thinning under human weather.", related: ["ecology", "evolution", "linnaeus", "ethics", "systems-thinking"] },
    { id: "symbiosis", title: "Symbiosis", kind: "concept", tags: ["partnership", "cooperation", "cells"], summary: "Living together: from lichens to the ancient merger that made mitochondria.", related: ["ecology", "cell-biology", "evolution", "microbiome", "emergence"] },
  ],
  computing: [
    { id: "computing", title: "Computing", kind: "hub", tags: ["hub", "machines"], summary: "The art of making processes explicit enough that matter can carry them out.", related: ["algorithms", "artificial-intelligence", "cryptography", "programming-languages", "computation-theory", "information-theory", "operating-systems", "software-engineering", "knowledge-atlas", "turing"] },
    { id: "algorithms", title: "Algorithms", kind: "topic", tags: ["procedure", "complexity", "correctness"], summary: "Finite procedures for transforming inputs into outputs, judged by correctness and cost.", related: ["computation-theory", "complexity-classes", "graph-theory", "knuth", "machine-learning"] },
    { id: "artificial-intelligence", title: "Artificial Intelligence", kind: "topic", tags: ["machines", "learning", "agency"], summary: "The project of building systems that perceive, model, and act in the world.", related: ["machine-learning", "neural-networks", "cognitive-psychology", "language", "decision-making", "turing"] },
    { id: "cryptography", title: "Cryptography", kind: "topic", tags: ["secrets", "proofs", "adversaries"], summary: "The mathematics of secrets, authenticity, and computation in the presence of enemies.", related: ["prime-numbers", "number-theory", "information-theory", "internet", "algorithms"] },
    { id: "programming-languages", title: "Programming Languages", kind: "topic", tags: ["syntax", "semantics", "abstraction"], summary: "Notations for instructing machines, each a philosophy of what should be easy to say.", related: ["compilers", "computation-theory", "category-theory", "lovelace", "knowledge-representation"] },
    { id: "computation-theory", title: "Theory of Computation", kind: "topic", tags: ["limits", "machines", "undecidability"], summary: "What can be computed, how much it costs, and which questions no machine can settle.", related: ["turing", "godel", "complexity-classes", "algorithms", "logic"] },
    { id: "information-theory", title: "Information Theory", kind: "topic", tags: ["bits", "noise", "compression"], summary: "Shannon's science of communication: bits, noise, and the price of reliability.", related: ["shannon", "entropy", "cryptography", "dna", "internet"] },
    { id: "turing", title: "Alan Turing", kind: "figure", tags: ["figure", "computation", "intelligence"], summary: "Founder of computer science, breaker of ciphers, and poser of the imitation game.", related: ["computation-theory", "artificial-intelligence", "cryptography", "godel"], born: "1912" },
    { id: "shannon", title: "Claude Shannon", kind: "figure", tags: ["figure", "information", "bits"], summary: "The man who made information measurable and communication a branch of mathematics.", related: ["information-theory", "entropy", "cryptography", "internet"], born: "1916" },
    { id: "von-neumann", title: "John von Neumann", kind: "figure", tags: ["figure", "architecture", "games"], summary: "Polymath of computers, games, and self-replicating automata.", related: ["game-theory", "computing", "self-organization", "algorithms"], born: "1903" },
    { id: "lovelace", title: "Ada Lovelace", kind: "figure", tags: ["figure", "programs", "imagination"], summary: "The first to see that machines for number might also weave patterns of thought.", related: ["programming-languages", "algorithms", "computing", "industrial-revolution"], born: "1815" },
    { id: "knuth", title: "Donald Knuth", kind: "figure", tags: ["figure", "algorithms", "literate"], summary: "Author of The Art of Computer Programming and high priest of algorithmic analysis.", related: ["algorithms", "programming-languages", "proof"], born: "1938" },
    { id: "neural-networks", title: "Neural Networks", kind: "concept", tags: ["learning", "layers", "approximation"], summary: "Layered functions inspired by brains, now the engine of modern machine learning.", related: ["machine-learning", "neuroscience", "artificial-intelligence", "linear-algebra"] },
    { id: "machine-learning", title: "Machine Learning", kind: "concept", tags: ["data", "generalization", "models"], summary: "Algorithms that improve with examples rather than explicit rules.", related: ["artificial-intelligence", "neural-networks", "probability", "protein-folding", "bayesian-brain"] },
    { id: "quantum-computing", title: "Quantum Computing", kind: "concept", tags: ["qubits", "interference", "speedup"], summary: "Computation that rides superposition and interference, promising speedups that are real and rare.", related: ["quantum-mechanics", "algorithms", "cryptography", "information-theory"] },
    { id: "compilers", title: "Compilers", kind: "concept", tags: ["translation", "languages", "optimization"], summary: "Programs that turn human-facing code into machine-facing instructions.", related: ["programming-languages", "algorithms", "computation-theory"] },
    { id: "distributed-systems", title: "Distributed Systems", kind: "concept", tags: ["consensus", "failure", "scale"], summary: "Computation spread across unreliable machines that must still agree on a world.", related: ["internet", "algorithms", "networks", "databases"] },
    { id: "complexity-classes", title: "Complexity Classes", kind: "concept", tags: ["P", "NP", "hardness"], summary: "The taxonomy of difficulty: P, NP, and the questions that organize theoretical computer science.", related: ["algorithms", "computation-theory", "proof", "cryptography"] },
    { id: "databases", title: "Databases", kind: "concept", tags: ["storage", "query", "consistency"], summary: "The art of remembering at scale, and of asking questions of what was stored.", related: ["knowledge-representation", "distributed-systems", "information-theory", "algorithms"] },
    { id: "internet", title: "The Internet", kind: "concept", tags: ["networks", "protocols", "commons"], summary: "A network of networks, built on packets, protocols, and a bet that best-effort is enough.", related: ["networks", "distributed-systems", "information-theory", "information-age", "cryptography"] },
  ],
  history: [
    { id: "history", title: "History", kind: "hub", tags: ["hub", "time"], summary: "The study of what happened, why it seemed inevitable only afterward, and how it still acts.", related: ["ancient-civilizations", "renaissance", "scientific-revolution", "enlightenment", "industrial-revolution", "world-wars", "roman-empire", "french-revolution", "knowledge-atlas", "axial-age"] },
    { id: "ancient-civilizations", title: "Ancient Civilizations", kind: "topic", tags: ["cities", "writing", "states"], summary: "The first dense settlements, scripts, and states — Sumer, Egypt, the Indus, China, Mesoamerica.", related: ["agricultural-revolution", "library-of-alexandria", "axial-age", "writing", "silk-road"] },
    { id: "renaissance", title: "Renaissance", kind: "topic", tags: ["rebirth", "art", "humanism"], summary: "A European reopening of classical learning that remade art, politics, and the self.", related: ["printing-press", "scientific-revolution", "plato", "history"] },
    { id: "scientific-revolution", title: "Scientific Revolution", kind: "topic", tags: ["method", "nature", "instruments"], summary: "The seventeenth-century turn that made nature a book to be read by experiment and mathematics.", related: ["newton", "empiricism", "galileo", "enlightenment", "astronomy"] },
    { id: "enlightenment", title: "The Enlightenment", kind: "topic", tags: ["reason", "rights", "public"], summary: "The wager that public reason could improve institutions, knowledge, and lives.", related: ["kant", "hume", "democracy", "scientific-revolution", "political-philosophy"] },
    { id: "industrial-revolution", title: "Industrial Revolution", kind: "topic", tags: ["energy", "machines", "capital"], summary: "The shift to fossil energy and factory production that rebuilt the material world.", related: ["capitalism", "thermodynamics", "lovelace", "information-age"] },
    { id: "world-wars", title: "The World Wars", kind: "topic", tags: ["conflict", "state", "technology"], summary: "Two industrial wars that redrew maps, accelerated science, and taught the century fear.", related: ["cold-war", "turing", "einstein", "information-age"] },
    { id: "library-of-alexandria", title: "Library of Alexandria", kind: "concept", tags: ["archive", "memory", "loss"], summary: "The emblem of collected knowledge — and of how easily a civilization's memory can burn.", related: ["ancient-civilizations", "knowledge-atlas", "knowledge-representation", "printing-press"] },
    { id: "printing-press", title: "Printing Press", kind: "concept", tags: ["media", "replication", "reformation"], summary: "Movable type as a revolution in the cost of copying, and therefore in who could argue.", related: ["renaissance", "information-theory", "enlightenment", "internet"] },
    { id: "silk-road", title: "Silk Road", kind: "concept", tags: ["trade", "exchange", "networks"], summary: "The overland and maritime webs that moved silk, spices, religions, and plague.", related: ["ancient-civilizations", "networks", "history", "information-cascade"] },
    { id: "axial-age", title: "Axial Age", kind: "concept", tags: ["thought", "religion", "ethics"], summary: "Karl Jaspers' name for the middle-first-millennium BCE bloom of philosophy and prophecy.", related: ["plato", "philosophy", "ancient-civilizations", "ethics"] },
    { id: "cold-war", title: "Cold War", kind: "concept", tags: ["bipolar", "nuclear", "ideology"], summary: "A forty-year standoff that wired the planet, funded science, and split the sky.", related: ["world-wars", "internet", "game-theory", "information-age"] },
    { id: "information-age", title: "Information Age", kind: "concept", tags: ["digital", "networks", "now"], summary: "The present tense of history, in which information is the cheap, volatile, organizing stuff.", related: ["internet", "computing", "industrial-revolution", "knowledge-atlas"] },
    { id: "democracy", title: "Democracy", kind: "concept", tags: ["politics", "rule", "demos"], summary: "Government by the many, always incomplete, always argued, never merely a machine.", related: ["political-philosophy", "enlightenment", "social-psychology", "ancient-civilizations"] },
    { id: "capitalism", title: "Capitalism", kind: "concept", tags: ["markets", "capital", "growth"], summary: "An economic order organized around private capital, markets, and perpetual reinvestment.", related: ["industrial-revolution", "game-theory", "political-philosophy", "networks"] },
    { id: "agricultural-revolution", title: "Agricultural Revolution", kind: "concept", tags: ["farming", "surplus", "settlement"], summary: "The Neolithic turn to farming that made cities, states, and specialists possible.", related: ["ancient-civilizations", "ecology", "history", "biodiversity"] },
  ],
  mind: [
    { id: "mind", title: "Mind", kind: "hub", tags: ["hub", "cognition"], summary: "The inner workshop: perception, memory, language, and the feeling of being someone.", related: ["cognitive-psychology", "language", "memory", "decision-making", "perception", "social-psychology", "developmental-psychology", "imagination", "knowledge-atlas", "consciousness"] },
    { id: "cognitive-psychology", title: "Cognitive Psychology", kind: "topic", tags: ["process", "experiment", "models"], summary: "The experimental science of mental processes — how we see, remember, decide, and err.", related: ["memory", "attention", "perception", "artificial-intelligence", "bayesian-brain"] },
    { id: "language", title: "Language", kind: "topic", tags: ["syntax", "meaning", "communication"], summary: "The combinatorial system that lets finite minds say infinitely many things.", related: ["chomsky", "wittgenstein", "knowledge-representation", "language-acquisition", "artificial-intelligence"] },
    { id: "memory", title: "Memory", kind: "topic", tags: ["encoding", "storage", "forgetting"], summary: "Not a warehouse but a reconstruction — the past as the brain tells it now.", related: ["working-memory", "learning", "neuroscience", "bartlett", "databases"] },
    { id: "decision-making", title: "Decision Making", kind: "topic", tags: ["choice", "bias", "value"], summary: "How agents choose under uncertainty, and the shortcuts that both save and betray them.", related: ["dual-process", "kahneman", "game-theory", "probability", "ethics"] },
    { id: "perception", title: "Perception", kind: "topic", tags: ["senses", "inference", "world"], summary: "The controlled hallucination by which brains meet a world they cannot touch raw.", related: ["bayesian-brain", "attention", "neuroscience", "empiricism", "fourier-analysis"] },
    { id: "social-psychology", title: "Social Psychology", kind: "topic", tags: ["groups", "norms", "influence"], summary: "The science of minds in company — conformity, persuasion, identity, and crowd.", related: ["collective-intelligence", "emotion", "political-philosophy", "information-cascade"] },
    { id: "chomsky", title: "Noam Chomsky", kind: "figure", tags: ["figure", "syntax", "innateness"], summary: "Linguist who argued that language is a biological organ with a deep, shared grammar.", related: ["language", "language-acquisition", "rationalism", "cognitive-psychology"], born: "1928" },
    { id: "kahneman", title: "Daniel Kahneman", kind: "figure", tags: ["figure", "judgment", "two-systems"], summary: "Psychologist who, with Tversky, mapped the biases that live inside reason.", related: ["decision-making", "dual-process", "probability", "cognitive-psychology"], born: "1934" },
    { id: "james", title: "William James", kind: "figure", tags: ["figure", "pragmatism", "stream"], summary: "Psychologist-philosopher of the stream of consciousness, habit, and the will to believe.", related: ["consciousness", "attention", "emotion", "pragmatism", "phenomenology"], born: "1842" },
    { id: "bartlett", title: "Frederic Bartlett", kind: "figure", tags: ["figure", "schemas", "remembering"], summary: "The Cambridge psychologist who showed that remembering is reconstructing, not replaying.", related: ["memory", "cognitive-psychology", "knowledge-representation"], born: "1886" },
    { id: "working-memory", title: "Working Memory", kind: "concept", tags: ["capacity", "attention", "scratchpad"], summary: "The small, expensive workspace in which thought is actually done.", related: ["memory", "attention", "cognitive-psychology", "consciousness"] },
    { id: "dual-process", title: "Dual Process Theory", kind: "concept", tags: ["fast", "slow", "systems"], summary: "The picture of a fast, associative mind yoked to a slow, deliberative one.", related: ["decision-making", "kahneman", "cognitive-psychology", "free-will"] },
    { id: "embodied-cognition", title: "Embodied Cognition", kind: "concept", tags: ["body", "action", "situation"], summary: "The claim that thinking is not a disembodied program but a skill of a body in a world.", related: ["perception", "phenomenology", "neuroscience", "artificial-intelligence"] },
    { id: "attention", title: "Attention", kind: "concept", tags: ["selection", "salience", "bottleneck"], summary: "The spotlight, the bottleneck, the scarce resource that makes a world out of too much signal.", related: ["consciousness", "working-memory", "perception", "james"] },
    { id: "learning", title: "Learning", kind: "concept", tags: ["change", "practice", "plasticity"], summary: "Enduring change in what an organism can do, from reflexes to proofs.", related: ["memory", "machine-learning", "neuroscience", "education"] },
    { id: "bayesian-brain", title: "Bayesian Brain", kind: "concept", tags: ["prediction", "inference", "priors"], summary: "The thesis that the brain is an engine of probabilistic prediction, always updating.", related: ["perception", "probability", "machine-learning", "cognitive-psychology"] },
    { id: "language-acquisition", title: "Language Acquisition", kind: "concept", tags: ["development", "poverty-of-stimulus"], summary: "How children become native speakers from a lean diet of examples.", related: ["language", "chomsky", "learning", "cognitive-psychology"] },
    { id: "emotion", title: "Emotion", kind: "concept", tags: ["affect", "value", "body"], summary: "The evaluative colors of experience that steer attention, memory, and choice.", related: ["james", "decision-making", "neuroscience", "social-psychology"] },
  ],
  systems: [
    { id: "systems", title: "Systems", kind: "hub", tags: ["hub", "wholes"], summary: "The study of organized wholes — feedback, emergence, networks, and the maps we make of them.", related: ["systems-thinking", "complexity", "emergence", "networks", "knowledge-representation", "cartography-of-knowledge", "control-theory", "climate-system", "knowledge-atlas", "cybernetics"] },
    { id: "systems-thinking", title: "Systems Thinking", kind: "topic", tags: ["wholes", "loops", "leverage"], summary: "A discipline of seeing loops, delays, and leverage rather than isolated events.", related: ["feedback", "cybernetics", "ecology", "complexity", "industrial-revolution"] },
    { id: "complexity", title: "Complexity", kind: "topic", tags: ["many-body", "adaptive", "edge"], summary: "The middle kingdom between the simple and the random, where adaptive order lives.", related: ["emergence", "chaos-theory", "networks", "evolution", "entropy"] },
    { id: "emergence", title: "Emergence", kind: "topic", tags: ["levels", "novelty", "reduction"], summary: "When a whole grows powers that its parts do not possess separately.", related: ["complexity", "consciousness", "self-organization", "symbiosis", "origin-of-life"] },
    { id: "networks", title: "Networks", kind: "topic", tags: ["nodes", "links", "structure"], summary: "The abstract form of connection, from brains to banks to this atlas.", related: ["graph-theory", "scale-free-networks", "internet", "silk-road", "knowledge-atlas"] },
    { id: "knowledge-representation", title: "Knowledge Representation", kind: "topic", tags: ["ontology", "graphs", "symbols"], summary: "How minds and machines store what they know so that it can be used, shared, and revised.", related: ["graphs", "databases", "language", "artificial-intelligence", "cartography-of-knowledge"] },
    { id: "cartography-of-knowledge", title: "Cartography of Knowledge", kind: "topic", tags: ["maps", "atlas", "navigation"], summary: "The craft of mapping what is known so that a mind can travel it without getting lost.", related: ["knowledge-atlas", "knowledge-representation", "library-of-alexandria", "networks", "graph-theory"] },
    { id: "wiener", title: "Norbert Wiener", kind: "figure", tags: ["figure", "cybernetics", "feedback"], summary: "Mathematician who named cybernetics and saw control and communication as one science.", related: ["cybernetics", "feedback", "information-theory", "systems-thinking"], born: "1894" },
    { id: "bateson", title: "Gregory Bateson", kind: "figure", tags: ["figure", "ecology-of-mind", "patterns"], summary: "Anthropologist of the pattern that connects mind, nature, and schizophrenia.", related: ["cybernetics", "systems-thinking", "ecology", "mind"], born: "1904" },
    { id: "barabasi", title: "Albert-László Barabási", kind: "figure", tags: ["figure", "scale-free", "networks"], summary: "Physicist of networks who showed that many real graphs grow by preferential attachment.", related: ["scale-free-networks", "networks", "graph-theory", "internet"], born: "1967" },
    { id: "maturana", title: "Humberto Maturana", kind: "figure", tags: ["figure", "autopoiesis", "biology"], summary: "Biologist who, with Varela, described living systems as self-producing unities.", related: ["autopoiesis", "origin-of-life", "systems-thinking", "cognition"], born: "1928" },
    { id: "cybernetics", title: "Cybernetics", kind: "concept", tags: ["control", "communication", "feedback"], summary: "The mid-century science of steering, whether the steersman is an animal, a thermostat, or a state.", related: ["wiener", "feedback", "systems-thinking", "artificial-intelligence", "information-theory"] },
    { id: "feedback", title: "Feedback", kind: "concept", tags: ["loops", "control", "stability"], summary: "When a system's outputs return as inputs — the move that makes thermostats, markets, and minds.", related: ["cybernetics", "systems-thinking", "ecology", "learning"] },
    { id: "scale-free-networks", title: "Scale-Free Networks", kind: "concept", tags: ["hubs", "power-laws", "robustness"], summary: "Networks whose degrees follow a power law: a few hubs, many leaves, fragile to targeted hits.", related: ["networks", "barabasi", "internet", "graph-theory", "knowledge-atlas"] },
    { id: "autopoiesis", title: "Autopoiesis", kind: "concept", tags: ["self-production", "life", "boundary"], summary: "The organization of the living: a system that produces the parts that produce it.", related: ["maturana", "origin-of-life", "cell-biology", "emergence"] },
    { id: "collective-intelligence", title: "Collective Intelligence", kind: "concept", tags: ["groups", "swarm", "knowledge"], summary: "What a group can know or do that its members, alone, cannot.", related: ["social-psychology", "stigmergy", "networks", "knowledge-atlas", "democracy"] },
    { id: "game-theory", title: "Game Theory", kind: "concept", tags: ["strategy", "equilibrium", "conflict"], summary: "The mathematics of interdependent choice — cooperation, defection, and the rules of the game.", related: ["von-neumann", "decision-making", "ethics", "capitalism", "evolution"] },
    { id: "self-organization", title: "Self-Organization", kind: "concept", tags: ["order", "local-rules", "pattern"], summary: "Order that grows from local interactions without a conductor.", related: ["emergence", "stigmergy", "complexity", "ant-colony"] },
    { id: "stigmergy", title: "Stigmergy", kind: "concept", tags: ["traces", "coordination", "ants"], summary: "Coordination through traces left in the environment, from termite mounds to Wikipedia.", related: ["self-organization", "collective-intelligence", "networks", "knowledge-atlas"] },
  ],
};

for (const id of Object.keys(MORE_BY_CLUSTER) as ClusterId[]) {
  byCluster[id].push(...(MORE_BY_CLUSTER[id] as Seed[]));
}

// AI Assist: nodes generated by scripts/atlas-ai-assist/generate-daily.mjs.
// New entries are appended here every day, deduplicated by id.
for (const id of Object.keys(GENERATED_BY_CLUSTER) as ClusterId[]) {
  const existingIds = new Set(byCluster[id].map((s) => s.id));
  for (const seed of GENERATED_BY_CLUSTER[id] as Seed[]) {
    if (!existingIds.has(seed.id)) byCluster[id].push(seed);
  }
}

const atlasNode: AtlasNode = {
  id: "knowledge-atlas",
  title: "Knowledge Atlas",
  cluster: "atlas",
  kind: "atlas",
  tags: ["atlas", "index", "map"],
  summary:
    "A living map of connected ideas — the central star around which every cluster in this vault turns.",
  related: CLUSTERS.map((c) => c.id),
};

function extraRelated(id: string, cluster: ClusterId): string[] {
  const extras: string[] = [cluster, "knowledge-atlas"];
  if (id !== cluster) extras.push(id);
  return extras;
}

export const NODES: AtlasNode[] = [
  atlasNode,
  ...CLUSTERS.flatMap((cluster) =>
    byCluster[cluster.id].map((seed) => {
      const related = Array.from(
        new Set([...seed.related, ...extraRelated(seed.id, cluster.id)].filter((x) => x !== seed.id)),
      );
      return {
        id: seed.id,
        title: seed.title,
        cluster: cluster.id,
        kind: seed.kind,
        tags: seed.tags,
        summary: seed.summary,
        related,
        born: seed.born,
      } satisfies AtlasNode;
    }),
  ),
];

export const NODE_BY_ID: Record<string, AtlasNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));

export const TITLE_TO_ID: Record<string, string> = Object.fromEntries(
  NODES.map((n) => [n.title.toLowerCase(), n.id]),
);

export function buildEdges(nodes: AtlasNode[]): { source: string; target: string }[] {
  const ids = new Set(nodes.map((n) => n.id));
  const seen = new Set<string>();
  const edges: { source: string; target: string }[] = [];
  const add = (a: string, b: string) => {
    if (!ids.has(a) || !ids.has(b) || a === b) return;
    const key = a < b ? `${a}::${b}` : `${b}::${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ source: a, target: b });
  };

  for (const n of nodes) {
    for (const r of n.related) add(n.id, r);
  }

  // Mesh topics inside each cluster so the vault looks densely woven.
  for (const cluster of CLUSTERS) {
    const topics = nodes.filter((n) => n.cluster === cluster.id && n.kind === "topic");
    for (let i = 0; i < topics.length; i++) {
      add(topics[i].id, topics[(i + 1) % topics.length].id);
      add(topics[i].id, topics[(i + 2) % topics.length].id);
    }
    const figures = nodes.filter((n) => n.cluster === cluster.id && n.kind === "figure");
    const concepts = nodes.filter((n) => n.cluster === cluster.id && n.kind === "concept");
    figures.forEach((f, i) => add(f.id, topics[i % topics.length]?.id));
    concepts.forEach((c, i) => add(c.id, topics[i % topics.length]?.id));
    for (let i = 0; i < concepts.length; i++) {
      add(concepts[i].id, concepts[(i + 1) % concepts.length]?.id);
      add(concepts[i].id, concepts[(i + 3) % concepts.length]?.id);
      add(concepts[i].id, figures[i % Math.max(1, figures.length)]?.id);
    }
    for (let i = 0; i < figures.length; i++) {
      add(figures[i].id, figures[(i + 1) % figures.length]?.id);
      add(figures[i].id, topics[(i + 2) % topics.length]?.id);
    }
  }

  // Cross-climate bridges so the vault is one graph, not eight islands.
  const bridges: [string, string][] = [
    ["consciousness", "neuroscience"],
    ["consciousness", "attention"],
    ["entropy", "information-theory"],
    ["entropy", "complexity"],
    ["evolution", "algorithms"],
    ["language", "knowledge-representation"],
    ["relativity", "spacetime"],
    ["networks", "graph-theory"],
    ["networks", "internet"],
    ["kant", "enlightenment"],
    ["newton", "scientific-revolution"],
    ["turing", "godel"],
    ["dna", "information-theory"],
    ["game-theory", "decision-making"],
    ["neural-networks", "neuroscience"],
    ["emergence", "origin-of-life"],
    ["feedback", "ecology"],
    ["printing-press", "information-age"],
    ["democracy", "political-philosophy"],
    ["perception", "empiricism"],
    ["proof", "computation-theory"],
    ["chaos-theory", "complexity"],
    ["machine-learning", "probability"],
    ["black-holes", "information-theory"],
    ["collective-intelligence", "democracy"],
    ["embodied-cognition", "phenomenology"],
    ["cryptography", "prime-numbers"],
    ["industrial-revolution", "thermodynamics"],
    ["mind", "philosophy"],
    ["systems", "biology"],
    ["computing", "mathematics"],
    ["history", "philosophy"],
    ["descartes", "philosophy-of-mind"],
    ["nietzsche", "nihilism"],
    ["galileo", "scientific-revolution"],
    ["noether", "particle-physics"],
    ["crispr", "ethics"],
    ["hawking", "information-theory"],
    ["berners-lee", "knowledge-atlas"],
    ["marx", "capitalism"],
    ["piaget", "epistemology"],
    ["meadows", "climate-system"],
    ["fractals", "chaos-theory"],
    ["theory-of-mind", "social-psychology"],
    ["gravitational-waves", "relativity"],
    ["open-source", "collective-intelligence"],
    ["stoicism", "virtue-ethics"],
    ["hinton", "neuroscience"],
    ["writing", "language"],
    ["homeostasis", "feedback"],
    ["small-world-networks", "graph-theory"],
    ["existentialism", "free-will"],
    ["statistics", "machine-learning"],
    ["arendt", "political-philosophy"],
    ["cellular-automata", "computation-theory"],
    ["sleep", "memory"],
    ["globalization", "networks"],
    ["spinoza", "ethics"],
  ];
  for (const [a, b] of bridges) add(a, b);

  return edges;
}

export const EDGES = buildEdges(NODES);

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function backlinksTo(id: string): string[] {
  return NODES.filter((n) => n.id !== id && n.related.includes(id)).map((n) => n.id);
}

export function neighborsOf(id: string): string[] {
  const n = NODE_BY_ID[id];
  if (!n) return [];
  const set = new Set<string>(n.related);
  for (const e of EDGES) {
    if (e.source === id) set.add(e.target);
    if (e.target === id) set.add(e.source);
  }
  set.delete(id);
  return Array.from(set);
}
