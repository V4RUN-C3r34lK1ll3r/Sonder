import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "vk9l1v1i",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const eventId = formData.get("eventId") as string;
    const files = formData.getAll("files") as File[];

    if (!eventId) {
      return NextResponse.json({ error: "No event selected" }, { status: 400 });
    }
    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploaded: object[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const asset = await client.assets.upload("image", buffer, {
        filename: file.name,
        contentType: file.type,
      });
      uploaded.push({
        _type: "image",
        _key: crypto.randomUUID().replace(/-/g, "").slice(0, 12),
        asset: { _type: "reference", _ref: asset._id },
      });
    }

    await client
      .patch(eventId)
      .setIfMissing({ photos: [] })
      .append("photos", uploaded)
      .commit();

    return NextResponse.json({ success: true, count: uploaded.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
