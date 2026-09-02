import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const envPath = resolve(__dirname, "../.env");

// Load .env file
const envContent = readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...valueParts] = trimmed.split("=");
    let value = valueParts.join("=").trim();
    // Remove surrounding quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key.trim()] = value;
  }
});

const supabase = createClient(
  env.VITE_SUPABASE_URL || env.SUPABASE_URL || "",
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || ""
);

const articlesData = [
  {
    slug: "cellular-respiration",
    title: "Cellular Respiration",
    excerpt: "The process cells use to break down glucose and release energy as ATP.",
    body: "<h2>Overview</h2><p>Cellular respiration is the process by which cells break down glucose and other organic molecules to extract chemical energy stored in these substances. This energy is released and used to form ATP (adenosine triphosphate), the primary energy currency of the cell. The process occurs in virtually all living organisms and is essential for maintaining cellular functions, including metabolism, growth, and reproduction.</p><h2>Aerobic Respiration</h2><p>Aerobic respiration occurs in the presence of oxygen and is the most efficient method of energy extraction. It consists of three main stages: glycolysis, the citric acid cycle, and the electron transport chain. Together, these processes yield approximately 30-32 ATP molecules per glucose molecule, making aerobic respiration far more efficient than anaerobic alternatives.</p><h2>Anaerobic Respiration</h2><p>In the absence of oxygen, cells can undergo anaerobic respiration or fermentation. This process is less efficient, typically producing only 2 ATP molecules per glucose molecule, but allows cells to continue generating energy when oxygen is unavailable. Anaerobic respiration is employed by certain bacteria and by muscle cells during intense physical exertion.</p><h2>Significance</h2><p>Understanding cellular respiration is fundamental to comprehending how organisms obtain and utilize energy. Disruptions in this process can lead to various metabolic disorders and diseases, making it a critical area of study in biochemistry and medicine.</p>",
  },
  {
    slug: "mitosis-cell-division",
    title: "Mitosis and Cell Division",
    excerpt: "How cells divide to produce two identical daughter cells.",
    body: "<h2>Overview</h2><p>Mitosis is the process of nuclear division by which a single parent cell divides to produce two genetically identical daughter cells. This process is fundamental to growth, tissue repair, and asexual reproduction in eukaryotic organisms. Each daughter cell receives an exact copy of the parent cell's genetic material, ensuring consistent genetic composition across all somatic cells in an organism.</p><h2>Phases of Mitosis</h2><p>Mitosis is typically divided into four distinct phases: prophase, metaphase, anaphase, and telophase. During prophase, chromosomes condense and become visible under a microscope, while the nuclear envelope begins to break down. In metaphase, chromosomes align at the cell's equatorial plate. During anaphase, sister chromatids separate and move to opposite poles of the cell. Finally, in telophase, nuclear envelopes reform around each set of chromosomes, and cytokinesis begins, ultimately creating two separate cells.</p><h2>Cell Cycle Regulation</h2><p>Mitosis is carefully regulated by checkpoint mechanisms throughout the cell cycle. These checkpoints ensure that DNA has been properly replicated and that the cell is ready to divide. Errors in mitotic regulation can lead to uncontrolled cell division, which is a hallmark of cancer and other proliferative diseases.</p><h2>Biological Importance</h2><p>Mitosis enables multicellular organisms to grow, maintain tissue homeostasis, and repair damage. Understanding mitotic mechanisms is essential in developmental biology, oncology, and regenerative medicine.</p>",
  },
  {
    slug: "enzyme-catalysis",
    title: "Enzymes and Catalysis",
    excerpt: "How enzymes speed up chemical reactions in cells.",
    body: "<h2>Overview</h2><p>Enzymes are protein molecules that function as biological catalysts, dramatically accelerating the rate of chemical reactions within cells without being consumed in the process. These remarkable molecules enable biochemical reactions to occur at rates compatible with life, converting substrates into products with extraordinary specificity and efficiency.</p><h2>Enzyme Structure and Function</h2><p>Each enzyme possesses a unique three-dimensional structure with an active site—a region specifically shaped to bind to substrate molecules. The enzyme-substrate complex forms through weak interactions, lowering the activation energy required for the reaction to proceed. After the reaction completes, the enzyme is released unchanged and can catalyze additional reactions. This specificity is achieved through precise amino acid arrangements that evolved over millions of years.</p><h2>Factors Affecting Enzyme Activity</h2><p>Enzyme activity is influenced by several environmental factors, including temperature, pH, substrate concentration, and the presence of inhibitors. Each enzyme functions optimally within a narrow range of conditions; deviations from these optimal parameters can denature the enzyme or reduce its catalytic efficiency. Understanding these factors is critical for controlling biochemical processes in both living organisms and industrial applications.</p><h2>Practical Applications</h2><p>Enzymes are exploited in numerous industrial and medical contexts, from food production and pharmaceuticals to environmental remediation. Their specificity and efficiency make them invaluable tools in biotechnology and molecular diagnostics.</p>",
  },
  {
    slug: "evolution-natural-selection",
    title: "Evolution and Natural Selection",
    excerpt: "How populations change over time through natural selection.",
    body: "<h2>Overview</h2><p>Evolution is the process by which populations of organisms change over successive generations, resulting in the diversity of life observed today. Natural selection, proposed by Charles Darwin, provides the primary mechanism explaining how heritable traits become more or less common in populations based on their effects on survival and reproduction. This fundamental principle unifies all of biology and explains the adaptation of organisms to their environments.</p><h2>Natural Selection Mechanism</h2><p>Natural selection operates through several key principles: organisms produce more offspring than can survive, individuals within populations exhibit heritable variation, and those with advantageous traits are more likely to survive and reproduce. Over time, beneficial traits accumulate in populations, while disadvantageous ones decline. This differential reproductive success creates the appearance of organisms being designed for their environments, though no conscious design is involved.</p><h2>Evidence for Evolution</h2><p>Multiple lines of evidence support evolutionary theory, including fossil records showing gradual morphological changes, comparative anatomy revealing structural similarities among different species, molecular biology demonstrating genetic relationships between all organisms, and direct observation of evolutionary processes in laboratory and field settings. These converging lines of evidence constitute one of the strongest scientific theories ever developed.</p><h2>Modern Evolutionary Synthesis</h2><p>Contemporary evolutionary biology integrates Darwin's natural selection with our understanding of genetics, population dynamics, and molecular biology. This modern synthesis explains not only how evolution occurs but also the rates at which it proceeds and the mechanisms driving genetic variation and change.</p>",
  },
  {
    slug: "human-anatomy-systems",
    title: "Human Anatomy and Organ Systems",
    excerpt: "Overview of the major organ systems in the human body.",
    body: "<h2>Overview</h2><p>The human body is an extraordinarily complex organism composed of multiple integrated physiological systems that work in concert to maintain homeostasis and enable survival. Each system specializes in particular functions while remaining interconnected with all others through neural, hormonal, and circulatory mechanisms. Understanding the structure and function of these systems is essential to comprehending human biology and medicine.</p><h2>Major Organ Systems</h2><p>The cardiovascular system circulates blood throughout the body, delivering oxygen and nutrients while removing metabolic waste products. The respiratory system facilitates gas exchange, supplying oxygen to the blood and removing carbon dioxide. The nervous system processes sensory information and coordinates responses through neural signaling. The endocrine system regulates physiological processes through hormone secretion. The digestive system breaks down food and absorbs nutrients. The urinary system filters blood and removes waste. The reproductive system enables sexual reproduction and hormone production. The immune system defends against pathogens and maintains internal surveillance.</p><h2>Cellular Organization</h2><p>These organ systems are composed of tissues, which are assemblies of specialized cells performing related functions. Tissues include epithelial, connective, muscle, and nervous tissues, each with distinct properties suited to their roles. The arrangement and integration of these tissues into organs and systems represents one of biology's remarkable achievements in organization and efficiency.</p><h2>Homeostatic Regulation</h2><p>A critical feature of human physiology is the maintenance of stable internal conditions despite external environmental changes. This homeostasis is achieved through numerous feedback mechanisms that detect deviations and trigger corrective responses, illustrating the elegant self-regulating nature of living systems.</p>",
  },
  {
    slug: "food-chains-energy-flow",
    title: "Food Chains and Energy Flow",
    excerpt: "How energy flows through ecosystems via food chains and webs.",
    body: "<h2>Overview</h2><p>Food chains and food webs are conceptual models describing the transfer of energy and matter through ecosystems. All energy in most ecosystems originates from the sun and is captured by photosynthetic organisms (primary producers). This energy is subsequently transferred through trophic levels—producer, primary consumer, secondary consumer, and tertiary consumer—with significant energy loss at each transfer step. Understanding these energy pathways is fundamental to ecology and environmental science.</p><h2>Food Chain Structure</h2><p>A food chain represents a linear sequence of organisms linked by feeding relationships. In terrestrial ecosystems, a typical chain might progress from plants to herbivores to carnivores. In aquatic systems, it often begins with microscopic phytoplankton serving as primary producers. Each organism occupies a specific trophic level determined by its feeding relationship to other organisms. This linear representation, while useful for illustration, oversimplifies the actual complexity of real ecosystems.</p><h2>Food Webs and Ecosystem Complexity</h2><p>Real ecosystems contain multiple interconnected food chains forming intricate food webs. Many organisms occupy multiple trophic levels simultaneously, consuming organisms from several levels below them. This complexity provides ecosystem stability and resilience, as disruption of a single species affects the system less severely than in a simplified linear chain.</p><h2>Energy Transfer and Efficiency</h2><p>Energy transfer between trophic levels is remarkably inefficient, with approximately 90% of energy lost at each step through heat production, movement, and metabolic processes. Only about 10% of energy is converted to biomass at each trophic level, a principle known as the 10% rule. This fundamental constraint explains why ecosystems support fewer individuals and less biomass at higher trophic levels and why ecosystems cannot support many top predators.</p>",
  },
  {
    slug: "photosynthesis-light-reactions",
    title: "Photosynthesis: Light Reactions",
    excerpt: "The light-dependent reactions that power photosynthesis.",
    body: "<h2>Overview</h2><p>The light reactions, occurring in the thylakoid membranes of chloroplasts, represent the light-dependent phase of photosynthesis. During these reactions, light energy is captured by chlorophyll and other photosynthetic pigments, then converted into chemical energy stored in ATP and NADPH. These energy-rich molecules subsequently power the synthesis of glucose from carbon dioxide during the Calvin cycle. The light reactions are among the most efficient energy-conversion processes known to science.</p><h2>Photosystem II and Water Splitting</h2><p>The light reactions begin at Photosystem II, where absorbed light excites electrons in the P680 chlorophyll molecule to high-energy states. These energized electrons are passed through an electron transport chain, driving proton pumping across the thylakoid membrane. To replace lost electrons, water molecules are split in a process called photolysis, releasing oxygen as a byproduct. This oxygen evolution is responsible for virtually all atmospheric oxygen and represents one of Earth's most significant biochemical processes.</p><h2>Photosystem I and NADPH Formation</h2><p>Electrons from Photosystem II ultimately reach Photosystem I, where additional light absorption further excites these electrons. The energized electrons are then used to reduce NADP+ to NADPH, creating another energy carrier essential for the Calvin cycle. This cyclic electron flow, combined with the chemiosmotic gradient established across the thylakoid membrane, drives ATP synthesis through ATP synthase.</p><h2>Significance and Regulation</h2><p>The light reactions represent the essential first stage of photosynthetic energy capture, enabling all subsequent biosynthetic reactions in plants. These reactions are regulated by light intensity, wavelength, and other environmental factors, allowing plants to optimize photosynthetic efficiency in response to changing conditions.</p>",
  },
  {
    slug: "meiosis-gamete-formation",
    title: "Meiosis and Gamete Formation",
    excerpt: "How meiosis produces genetically diverse gametes.",
    body: "<h2>Overview</h2><p>Meiosis is a specialized form of cell division distinct from mitosis, producing four genetically diverse haploid gametes (sperm or eggs) from a single diploid parent cell. This process reduces chromosome number by half, ensuring that when gametes fuse during fertilization, the diploid chromosome number is restored in offspring. Meiosis is essential for sexual reproduction and generates genetic diversity within populations through recombination and independent assortment.</p><h2>Meiosis I: The Reductional Division</h2><p>Meiosis I is the first meiotic division and differs fundamentally from mitosis. During prophase I, homologous chromosomes pair up in a process called synapsis, and exchange genetic material through crossing over or recombination. This exchange shuffles alleles between homologous chromosomes, creating new genetic combinations. During metaphase I, paired homologous chromosomes align at the cell's equator. At anaphase I, homologous chromosomes separate, with each pole receiving only one chromosome from each homologous pair, reducing chromosome number by half.</p><h2>Meiosis II: The Equational Division</h2><p>Meiosis II resembles mitosis, with sister chromatids separating during anaphase II. However, cells entering meiosis II are already haploid, so the division produces four haploid cells rather than diploid cells. These four cells differentiate into mature gametes through gametogenesis, a process that continues throughout the reproductive life of an organism.</p><h2>Genetic Significance</h2><p>Meiosis generates genetic diversity through two mechanisms: recombination during prophase I and random assortment of chromosomes during anaphase I. Each gamete produced is genetically unique, ensuring that siblings are genetically different despite sharing the same parents. This genetic variation is the raw material for evolution and provides populations with the adaptive flexibility necessary to survive environmental changes.</p>",
  },
];

async function updateArticles() {
  console.log("Starting article content update...\n");

  for (const article of articlesData) {
    try {
      const { data, error } = await supabase
        .from("articles")
        .update({
          excerpt: article.excerpt,
          body: article.body,
        })
        .eq("slug", article.slug)
        .select();

      if (error) {
        console.error(`❌ Error updating ${article.slug}:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`✓ Updated: ${article.title}`);
      } else {
        console.log(`⚠ No records found for slug: ${article.slug}`);
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${article.slug}:`, err.message);
    }
  }

  console.log("\n✓ Article content update complete!");
}

updateArticles();
