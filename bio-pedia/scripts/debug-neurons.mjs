import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const envContent = readFileSync(".env", "utf-8");
const env = {};
envContent.split("\n").forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#")) {
    const [key, ...valueParts] = trimmed.split("=");
    let value = valueParts.join("=").trim();
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key.trim()] = value;
  }
});

const supabase = createClient(
  env.VITE_SUPABASE_URL || env.SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY
);

console.log("Querying for neurons article...");
const { data, error } = await supabase
  .from("articles")
  .select("*")
  .eq("slug", "neurons");

console.log("Error:", error);
console.log("Found:", data?.length, "records");
if (data?.[0]) {
  console.log("Record found:");
  console.log("  slug:", JSON.stringify(data[0].slug));
  console.log("  title:", data[0].title);
  console.log("  body length:", data[0].body?.length);
}

// Try update
console.log("\nAttempting update...");
const { data: updateData, error: updateError } = await supabase
  .from("articles")
  .update({
    body: "<h2>Test Body</h2><p>This is a test update.</p>",
  })
  .eq("slug", "neurons")
  .select();

console.log("Update error:", updateError);
console.log("Update success:", updateData?.length > 0);
