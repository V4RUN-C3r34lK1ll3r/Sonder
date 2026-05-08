/**
 * Bulk upload photos to a Sanity event.
 *
 * Usage:
 *   node scripts/upload-photos.mjs <event-slug> <folder-path>
 *
 * Example:
 *   node scripts/upload-photos.mjs harsha-s-gender-reveal "F:\Photos\2026-02-Haha-Gender-Reveal\Edit"
 */

import { createClient } from "@sanity/client";
import { readFileSync, readdirSync, createReadStream, statSync } from "fs";
import { extname, join, basename } from "path";

// Parse .env.local
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
    .filter(([k, v]) => k && v)
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".avif"]);

async function main() {
  const [, , eventSlug, folderPath] = process.argv;

  if (!eventSlug || !folderPath) {
    console.error('Usage: node scripts/upload-photos.mjs <event-slug> "<folder-path>"');
    process.exit(1);
  }

  // Find the event document
  const event = await client.fetch(
    `*[_type == "event" && slug.current == $slug][0]{ _id, name }`,
    { slug: eventSlug }
  );

  if (!event) {
    console.error(`No event found with slug "${eventSlug}"`);
    process.exit(1);
  }

  console.log(`\nUploading to: ${event.name}\n`);

  // List image files in folder
  const files = readdirSync(folderPath)
    .filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()))
    .filter((f) => statSync(join(folderPath, f)).isFile());

  if (files.length === 0) {
    console.error("No image files found in that folder.");
    process.exit(1);
  }

  console.log(`Found ${files.length} images. Uploading...\n`);

  const uploaded = [];

  for (const file of files) {
    const filePath = join(folderPath, file);
    const ext = extname(file).toLowerCase().replace(".", "");
    const mimeType = ext === "jpg" || ext === "jpeg" ? "image/jpeg"
      : ext === "png" ? "image/png"
      : ext === "webp" ? "image/webp"
      : "image/jpeg";

    try {
      const asset = await client.assets.upload("image", createReadStream(filePath), {
        filename: basename(file),
        contentType: mimeType,
      });

      uploaded.push({
        _type: "image",
        _key: asset._id.replace("image-", "").replace(/-/g, "").slice(0, 12),
        asset: { _type: "reference", _ref: asset._id },
      });

      process.stdout.write(`✓ ${file}\n`);
    } catch (err) {
      process.stdout.write(`✗ ${file} — ${err.message}\n`);
    }
  }

  if (uploaded.length === 0) {
    console.error("\nNo images uploaded successfully.");
    process.exit(1);
  }

  // Append all uploaded images to the event's photos array
  await client
    .patch(event._id)
    .setIfMissing({ photos: [] })
    .append("photos", uploaded)
    .commit();

  console.log(`\nDone. ${uploaded.length} photos added to "${event.name}".`);
  console.log("Publish the event in Sanity Studio to make them live.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
