import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EventPhotoGrid } from "@/components/EventPhotoGrid";
import { ScrollReveal } from "@/components/ScrollReveal";
import { sanityFetch } from "@/lib/sanity";
import { eventBySlugQuery } from "@/lib/queries";
import type { SonderEvent } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string; event: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { event: eventSlug } = await params;
    const event = await sanityFetch<SonderEvent>(eventBySlugQuery, { slug: eventSlug });
    if (!event) return { title: "Gallery" };
    return {
      title: event.name,
      description: event.description ?? `Photos from ${event.name}.`,
    };
  } catch {
    return { title: "Gallery" };
  }
}

export default async function EventPage({ params }: PageProps) {
  const { slug: categorySlug, event: eventSlug } = await params;
  let event: SonderEvent | null = null;

  try {
    event = await sanityFetch<SonderEvent>(eventBySlugQuery, { slug: eventSlug });
  } catch {
    // Sanity not configured
  }

  if (!event) notFound();

  const formattedDate = event.date
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(event.date))
    : null;

  const categoryName = event.category?.name ?? "Gallery";


  return (
    <div className="min-h-screen pt-24 pb-16 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <ScrollReveal className="mb-12">
          <nav className="flex flex-wrap items-center gap-2 text-muted text-[10px] tracking-[0.35em] uppercase">
            <Link href="/gallery" className="hover:text-gold transition-colors duration-200">
              Gallery
            </Link>
            <span>/</span>
            <Link
              href={`/gallery/${categorySlug}`}
              className="hover:text-gold transition-colors duration-200"
            >
              {categoryName}
            </Link>
            <span>/</span>
            <span className="text-ivory">{event.name}</span>
          </nav>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-3">
                {categoryName}
              </p>
              <h1 className="font-serif text-5xl md:text-6xl text-ivory leading-tight">
                {event.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-4 text-muted text-[10px] tracking-[0.35em] uppercase">
                {formattedDate && <span>{formattedDate}</span>}
                {formattedDate && event.location && <span className="text-border">·</span>}
                {event.location && <span>{event.location}</span>}
              </div>
              {event.description && (
                <p className="text-muted mt-4 max-w-lg leading-relaxed text-sm">
                  {event.description}
                </p>
              )}
            </div>
            <p className="text-muted text-[10px] tracking-[0.35em] uppercase mb-1">
              {event.photos?.length ?? 0} photos
            </p>
          </div>
          <div className="mt-8 w-12 h-px bg-gold" />
        </ScrollReveal>

        {/* Photo grid */}
        <EventPhotoGrid photos={event.photos ?? []} />
      </div>
    </div>
  );
}
