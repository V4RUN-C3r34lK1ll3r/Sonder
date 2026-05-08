import { sanityFetch } from "@/lib/sanity";
import { PhotoUploader } from "./PhotoUploader";
import { groq } from "next-sanity";

const allEventsQuery = groq`
  *[_type == "event"] | order(date desc) {
    _id,
    name,
    "category": category->name
  }
`;

interface SanityEvent {
  _id: string;
  name: string;
  category: string;
}

export default async function UploadPage() {
  let events: SanityEvent[] = [];
  try {
    events = await sanityFetch<SanityEvent[]>(allEventsQuery);
  } catch {
    // Sanity not configured
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-8 md:px-16">
      <div className="max-w-4xl mx-auto">

        <div className="mb-14">
          <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-3">Admin</p>
          <h1 className="font-serif text-5xl text-ivory">Upload Photos</h1>
          <p className="text-muted mt-4 leading-relaxed">
            Select an event, drag in your photos, and upload. After uploading,
            open Sanity Studio to publish the event.
          </p>
        </div>

        <PhotoUploader events={events} />

      </div>
    </div>
  );
}
