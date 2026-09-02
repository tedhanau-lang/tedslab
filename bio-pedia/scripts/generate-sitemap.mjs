import { generateSitemapXML } from "../src/lib/sitemap-generator.js";

async function generateSitemap() {
  const baseUrl = process.env.SITE_URL || "https://teds-lab.com";
  console.log(`Generating sitemap for ${baseUrl}...`);

  try {
    const sitemap = await generateSitemapXML(baseUrl);
    console.log("Sitemap generated successfully!");
    console.log(sitemap.substring(0, 500) + "...");
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    process.exit(1);
  }
}

generateSitemap();
