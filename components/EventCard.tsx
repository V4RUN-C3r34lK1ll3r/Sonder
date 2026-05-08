import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import type { SonderEvent } from "@/lib/types";

interface EventCardProps {
  event: SonderEvent;
  categorySlug: string;
  index?: number;
}

// Two alternating orange pastels — light and dark
const PASTELS = [
  { bg: "#FDE8D0", accent: "#C06030" },  // light peach
  { bg: "#F5C8A4", accent: "#A03818" },  // deeper apricot
];

export function EventCard({ event, categorySlug, index = 0 }: EventCardProps) {
  const pastel = PASTELS[index % PASTELS.length];

  const imageUrl = event.coverImage?.asset
    ? urlFor(event.coverImage.asset).width(900).height(600).fit("crop").auto("format").url()
    : null;

  const hasImage = !!imageUrl;

  const formattedDate = event.date
    ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(event.date))
    : null;

  return (
    <Link href={`/gallery/${categorySlug}/${event.slug.current}`} className="group block overflow-hidden">

      {/* Image / pastel area */}
      <div className="aspect-[3/2] relative overflow-hidden" style={{ background: hasImage ? "#000" : pastel.bg }}>
        {hasImage ? (
          <>
            <Image
              src={imageUrl}
              alt={event.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(9,8,10,0.65) 0%, transparent 60%)" }} />
          </>
        ) : (
          /* Pastel placeholder with event name visible */
          <div className="absolute inset-0 flex items-end p-5">
            <span className="font-serif text-xl" style={{ color: pastel.accent }}>
              {event.name}
            </span>
          </div>
        )}
      </div>

      {/* Meta — always light bg */}
      <div className="p-5 bg-surface border-t border-border group-hover:border-gold/30 transition-colors duration-300">
        <h2 className="font-serif text-xl text-ivory mb-1.5 group-hover:text-gold transition-colors duration-300 leading-snug">
          {event.name}
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-muted text-[10px] tracking-[0.3em] uppercase">
          {formattedDate && <span>{formattedDate}</span>}
          {formattedDate && event.location && <span className="text-muted">·</span>}
          {event.location && <span>{event.location}</span>}
        </div>
        {event.photoCount !== undefined && event.photoCount > 0 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-gold text-[10px] tracking-[0.3em] uppercase">{event.photoCount} photos</span>
            <span className="block w-4 h-px bg-gold transition-all duration-300 group-hover:w-8" />
          </div>
        )}
      </div>
    </Link>
  );
}
