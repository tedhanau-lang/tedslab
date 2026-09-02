#!/usr/bin/env node
// Run with: npm run ai:generate-daily
// Or manually: node scripts/atlas-ai-assist/run.mjs [--per 10]
import { generateDailyArticles } from "./generator.mjs";

const args = process.argv.slice(2);
const perFlagIndex = args.indexOf("--per");
const perSubject = perFlagIndex >= 0 ? Number(args[perFlagIndex + 1]) || 10 : 10;

console.log(`Knowledge Atlas AI Assist: generating up to ${perSubject} article(s) per subject...`);
console.log("Model: Xenova/LaMini-Flan-T5-248M (local, free, no API key)\n");

const { added, total } = await generateDailyArticles({ perSubject });

console.log(`\nDone. Added ${added.length} new article(s). ${total} generated article(s) on file in total.`);
if (added.length === 0) {
  console.log("(No new topics found this run -- every candidate slug already existed. That's fine.)");
}
