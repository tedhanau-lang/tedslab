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

console.log("Environment loaded:");
console.log("- URL:", env.VITE_SUPABASE_URL ? "✓" : "missing");
console.log("- Key:", env.VITE_SUPABASE_PUBLISHABLE_KEY ? "✓" : "missing");

const supabase = createClient(
  env.VITE_SUPABASE_URL || env.SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_PUBLISHABLE_KEY
);

// Test update on first article
const { data, error } = await supabase
  .from("articles")
  .update({
    body: "<h2>Test</h2><p>Testing update...</p>",
  })
  .eq("slug", "neurons")
  .select();

console.log("\nUpdate test result:");
if (error) {
  console.log("Error:", error);
} else {
  console.log("Success! Updated:", data?.length, "records");
  if (data?.[0]) {
    console.log("First record:", data[0].slug, "-", data[0].title);
  }
}
