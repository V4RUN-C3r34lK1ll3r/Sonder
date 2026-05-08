import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

// Parse .env.local manually — no dotenv dependency needed
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
    .filter(([k, v]) => k && v)
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const categories = [
  {
    _id: "category-weddings",
    _type: "category",
    name: "Weddings",
    slug: { _type: "slug", current: "weddings" },
    description: "Intimate ceremonies and grand celebrations, told with intention.",
    order: 1,
  },
  {
    _id: "category-couples",
    _type: "category",
    name: "Couples",
    slug: { _type: "slug", current: "couples" },
    description: "Engagements, anniversaries, and quiet moments between two people.",
    order: 2,
  },
  {
    _id: "category-family",
    _type: "category",
    name: "Family",
    slug: { _type: "slug", current: "family" },
    description: "Generations together — candid, warm, and full of life.",
    order: 3,
  },
  {
    _id: "category-housewarming",
    _type: "category",
    name: "Housewarming",
    slug: { _type: "slug", current: "housewarming" },
    description: "New beginnings celebrated in the spaces that become home.",
    order: 4,
  },
];

async function seed() {
  console.log("Seeding categories...\n");

  for (const cat of categories) {
    await client.createOrReplace(cat);
    console.log(`✓ ${cat.name}`);
  }

  console.log("\nDone. All 4 categories created.");
  console.log("You can now add cover images in Sanity Studio → Categories.");
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
