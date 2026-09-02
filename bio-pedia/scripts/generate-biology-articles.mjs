import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const articles = [
  {
    slug: 'cellular-respiration',
    title: 'Cellular Respiration',
    excerpt: 'The process cells use to break down glucose and release energy as ATP.',
    body: `Cellular respiration is the process by which cells break down glucose to produce ATP (adenosine triphosphate), the energy currency of the cell.

## Overview
Cellular respiration occurs in all living cells and is essential for survival. Unlike photosynthesis, which stores energy, respiration releases the energy stored in glucose molecules.

## The Three Main Stages

**1. Glycolysis**
Glycolysis occurs in the cytoplasm and breaks one glucose molecule into two pyruvate molecules. This process produces a small amount of ATP and NADH without requiring oxygen.

**2. Krebs Cycle (Citric Acid Cycle)**
The Krebs cycle takes place in the mitochondrial matrix. Each pyruvate is converted to Acetyl-CoA, which enters the cycle. This stage produces CO2, ATP, and electron carriers (NADH and FADH2).

**3. Electron Transport Chain**
The electron transport chain is the most efficient stage, occurring on the inner mitochondrial membrane. NADH and FADH2 donate electrons, which are used to pump protons across the membrane, creating a gradient. This gradient drives ATP synthase, producing most of the ATP from one glucose molecule.

## Aerobic vs Anaerobic Respiration
Aerobic respiration requires oxygen and produces approximately 36-38 ATP per glucose. Anaerobic respiration (fermentation) occurs without oxygen and produces only 2 ATP per glucose but allows cells to continue functioning in low-oxygen conditions.

## Key Takeaway
Cellular respiration is the fundamental process that powers all cellular activities. The mitochondrion is truly the powerhouse of the cell.`,
    minutes: 10,
    tone: 'educational',
    subject_slug: 'biology',
    section_slug: 'cells-microscopy',
    image_key: 'hero-cell',
    published: true,
    sort: 0,
  },
  {
    slug: 'dna-structure-function',
    title: 'DNA Structure and Function',
    excerpt: 'Understanding the double helix structure that carries genetic information.',
    body: `DNA (deoxyribonucleic acid) is the molecule that stores genetic information in all living organisms.

## The Double Helix Structure
DNA consists of two strands twisted together in a double helix pattern. Each strand is made of nucleotides containing a phosphate group, a deoxyribose sugar, and a nitrogenous base.

## Base Pairing Rules
Adenine (A) pairs with Thymine (T), and Guanine (G) pairs with Cytosine (C). These complementary base pairs are held together by hydrogen bonds.

## DNA Replication
DNA replication is semi-conservative, meaning each new DNA molecule contains one original strand and one newly synthesized strand. The enzyme DNA polymerase catalyzes this process.

## From DNA to Proteins
The central dogma of molecular biology describes the flow of information: DNA → RNA → Protein. Genes are specific DNA sequences that code for proteins.

## Key Takeaway
DNA is the blueprint of life, containing all the instructions needed to build and maintain organisms.`,
    minutes: 9,
    tone: 'educational',
    subject_slug: 'biology',
    section_slug: 'genetics-dna',
    image_key: 'hero-cell',
    published: true,
    sort: 1,
  },
  {
    slug: 'protein-synthesis',
    title: 'Protein Synthesis',
    excerpt: 'How cells build proteins using mRNA and ribosomes.',
    body: `Protein synthesis is the process by which cells build proteins based on instructions from DNA.

## Transcription
Transcription occurs in the nucleus. RNA polymerase reads DNA and creates a complementary mRNA strand. This mRNA exits the nucleus and travels to the ribosome.

## Translation
Translation occurs at the ribosome. mRNA is read in triplet codons, and tRNA molecules bring the corresponding amino acids. The ribosome catalyzes peptide bonds between amino acids, forming a polypeptide chain.

## Post-Translational Modifications
After synthesis, proteins may be modified, folded, or transported to specific cellular locations. Chaperone proteins help ensure correct folding.

## Key Takeaway
Protein synthesis is the molecular machinery that converts genetic information into functional proteins that perform most cellular processes.`,
    minutes: 8,
    tone: 'educational',
    subject_slug: 'biology',
    section_slug: 'genetics-dna',
    image_key: 'hero-cell',
    published: true,
    sort: 2,
  },
  {
    slug: 'mitosis-cell-division',
    title: 'Mitosis and Cell Division',
    excerpt: 'How cells divide to produce two identical daughter cells.',
    body: `Mitosis is the process of nuclear division that produces two genetically identical daughter cells.

## The Four Phases

**Prophase**: Chromosomes condense, the nuclear envelope breaks down, and the mitotic spindle forms.

**Metaphase**: Chromosomes align at the cell's equator, attached to spindle fibers at their centromeres.

**Anaphase**: Sister chromatids separate and move to opposite poles of the cell.

**Telophase**: Nuclear envelopes reform, chromosomes decondense, and the cell prepares for cytokinesis.

## Cytokinesis
Cytokinesis is the division of the cytoplasm. In animal cells, a cleavage furrow forms. In plant cells, a cell plate forms.

## Key Takeaway
Mitosis ensures accurate distribution of genetic material to daughter cells, essential for growth and tissue repair.`,
    minutes: 7,
    tone: 'educational',
    subject_slug: 'biology',
    section_slug: 'cells-microscopy',
    image_key: 'hero-cell',
    published: true,
    sort: 3,
  },
  {
    slug: 'enzyme-catalysis',
    title: 'Enzymes and Catalysis',
    excerpt: 'How enzymes speed up chemical reactions in cells.',
    body: `Enzymes are biological catalysts that increase the rate of chemical reactions without being consumed.

## How Enzymes Work
Enzymes lower the activation energy required for reactions. Substrates bind to the active site of the enzyme, forming an enzyme-substrate complex. The enzyme catalyzes the reaction, and products are released.

## Enzyme Specificity
Most enzymes are highly specific for their substrates. The three-dimensional shape of the active site determines what substrates can bind.

## Factors Affecting Enzyme Activity
Temperature, pH, and substrate concentration all affect enzyme activity. Each enzyme has an optimal temperature and pH at which it works best.

## Enzyme Regulation
Cells regulate enzyme activity through competitive and non-competitive inhibition, and allosteric regulation.

## Key Takeaway
Enzymes are essential for life, enabling complex biochemical reactions to occur at rates compatible with living systems.`,
    minutes: 8,
    tone: 'educational',
    subject_slug: 'biology',
    section_slug: 'cells-microscopy',
    image_key: 'hero-cell',
    published: true,
    sort: 4,
  },
  {
    slug: 'evolution-natural-selection',
    title: 'Evolution and Natural Selection',
    excerpt: 'How populations change over time through natural selection.',
    body: `Evolution is the process by which organisms change over time. Natural selection is the primary mechanism of evolution.

## Darwin's Theory of Natural Selection
Organisms produce more offspring than can survive. Individuals with advantageous traits are more likely to survive and reproduce, passing those traits to offspring.

## Evidence for Evolution
Fossil records show transitional forms. DNA evidence reveals genetic similarity among species. Biogeographical distribution and homologous structures support evolution.

## Speciation
Over long periods, natural selection can lead to the formation of new species. Geographic isolation often accelerates speciation.

## Modern Synthesis
The modern evolutionary synthesis combines Darwin's natural selection with genetics, explaining how mutations provide variation for natural selection to act upon.

## Key Takeaway
Evolution explains the diversity of life and how organisms adapt to their environments.`,
    minutes: 9,
    tone: 'educational',
    subject_slug: 'biology',
    section_slug: 'evolution',
    image_key: 'hero-cell',
    published: true,
    sort: 5,
  },
  {
    slug: 'human-anatomy-systems',
    title: 'Human Anatomy and Organ Systems',
    excerpt: 'Overview of the major organ systems in the human body.',
    body: `The human body is organized into multiple organ systems, each performing vital functions.

## Major Organ Systems

**Circulatory System**: Transports oxygen, nutrients, and hormones via the heart and blood vessels.

**Respiratory System**: Enables gas exchange; oxygen enters, carbon dioxide exits.

**Digestive System**: Breaks down food and absorbs nutrients.

**Nervous System**: Coordinates body functions through electrical and chemical signals.

**Endocrine System**: Regulates bodily functions through hormones.

**Immune System**: Defends against pathogens and disease.

**Musculoskeletal System**: Provides structure, movement, and protection.

## System Integration
These systems work together maintaining homeostasis—the stable internal environment necessary for survival.

## Key Takeaway
The complexity of the human body emerges from the coordinated function of multiple organ systems.`,
    minutes: 10,
    tone: 'educational',
    subject_slug: 'biology',
    section_slug: 'human-biology',
    image_key: 'hero-cell',
    published: true,
    sort: 6,
  },
  {
    slug: 'food-chains-energy-flow',
    title: 'Food Chains and Energy Flow',
    excerpt: 'How energy flows through ecosystems via food chains and webs.',
    body: `Food chains and food webs describe the flow of energy and nutrients through ecosystems.

## Trophic Levels

**Producers**: Green plants and autotrophs capture energy from the sun through photosynthesis.

**Consumers**: Primary consumers (herbivores) eat plants. Secondary consumers (carnivores) eat herbivores. Tertiary consumers eat other carnivores.

**Decomposers**: Bacteria and fungi break down dead matter, recycling nutrients.

## Energy Transfer
Only about 10% of energy is transferred from one trophic level to the next. The rest is lost as heat or used for metabolic processes.

## Food Webs
Real ecosystems contain complex food webs with multiple interconnected food chains.

## Key Takeaway
Energy flows one direction through ecosystems—from the sun through producers and consumers to eventual decomposition.`,
    minutes: 8,
    tone: 'educational',
    subject_slug: 'biology',
    section_slug: 'ecology-environment',
    image_key: 'hero-cell',
    published: true,
    sort: 7,
  },
  {
    slug: 'photosynthesis-light-reactions',
    title: 'Photosynthesis: Light Reactions',
    excerpt: 'The light-dependent reactions that power photosynthesis.',
    body: `The light reactions are the photo-dependent portion of photosynthesis, occurring in the thylakoid membranes.

## Photosystem II
Light excites electrons in the P680 reaction center. Water is split, releasing oxygen, protons, and electrons. Electrons are passed through an electron transport chain to Photosystem I.

## Photosystem I
The P700 reaction center absorbs light energy, exciting electrons. These electrons are used to reduce NADP+ to NADPH.

## Chemiosmosis
The electron transport chain pumps protons into the thylakoid lumen, creating a proton gradient. ATP synthase uses this gradient to phosphorylate ADP to ATP.

## Products
The light reactions produce ATP and NADPH, which power the Calvin cycle (light-independent reactions).

## Key Takeaway
The light reactions convert light energy into chemical energy stored in ATP and NADPH.`,
    minutes: 9,
    tone: 'educational',
    subject_slug: 'biology',
    section_slug: 'biological-processes',
    image_key: 'discovery-leaf',
    published: true,
    sort: 8,
  },
  {
    slug: 'meiosis-gamete-formation',
    title: 'Meiosis and Gamete Formation',
    excerpt: 'How meiosis produces genetically diverse gametes.',
    body: `Meiosis is a specialized form of cell division that produces gametes (sex cells) with half the chromosome number of the parent cell.

## Two Divisions
Meiosis I separates homologous chromosomes, reducing chromosome number by half. Meiosis II separates sister chromatids, similar to mitosis.

## Genetic Diversity
Crossing over (recombination) between homologous chromosomes during Prophase I creates new combinations of alleles. Random assortment of chromosomes further increases genetic diversity.

## Products
Meiosis produces four genetically unique haploid cells from one diploid cell.

## Sexual Reproduction
Meiosis enables sexual reproduction, combining genetic material from two parents and creating genetic diversity in offspring.

## Key Takeaway
Meiosis is essential for sexual reproduction and genetic diversity in populations.`,
    minutes: 8,
    tone: 'educational',
    subject_slug: 'biology',
    section_slug: 'genetics-dna',
    image_key: 'hero-cell',
    published: true,
    sort: 9,
  },
];

async function seedArticles() {
  try {
    console.log('🌱 Generating 10 biology articles...');
    
    const { data, error } = await supabase
      .from('articles')
      .insert(articles)
      .select();

    if (error) {
      console.error('❌ Error inserting articles:', error);
      process.exit(1);
    }

    console.log('✅ Successfully created articles!');
    console.log(`📊 Inserted ${data?.length || 0} articles:`);
    data?.forEach((article) => {
      console.log(`   • ${article.title} (${article.slug})`);
    });
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedArticles();
