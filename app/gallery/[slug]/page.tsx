import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { sanityFetch } from "@/lib/sanity";
import { categoryBySlugQuery, eventsByCategory, categoriesQuery } from "@/lib/queries";
import type { Category, SonderEvent } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const categories = await sanityFetch<Category[]>(categoriesQuery);
    return categories.map((cat) => ({ slug: cat.slug.current }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const category = await sanityFetch<Category>(categoryBySlugQuery, { slug });
    if (!category) return { title: "Gallery" };
    return {
      title: category.name,
      description:
        category.description ??
        `Browse our ${category.name.toLowerCase()} photography collection.`,
    };
  } catch {
    return { title: "Gallery" };
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  let category: Category | null = null;
  let events: SonderEvent[] = [];

  try {
    [category, events] = await Promise.all([
      sanityFetch<Category>(categoryBySlugQuery, { slug }),
      sanityFetch<SonderEvent[]>(eventsByCategory, { slug }),
    ]);
  } catch {
    // Sanity not configured
  }

  if (!category) notFound();

  return (
    <div className="min-h-screen pt-24 pb-16 px-5 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <ScrollReveal className="mb-12">
          <nav className="flex items-center gap-2 text-muted text-[10px] tracking-[0.35em] uppercase">
            <Link href="/gallery" className="hover:text-gold transition-colors duration-200">
              Gallery
            </Link>
            <span>/</span>
            <span className="text-ivory">{category.name}</span>
          </nav>
        </ScrollReveal>

        {/* Header */}
        <ScrollReveal className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-3">
              Collection
            </p>
            <h1 className="font-serif text-5xl md:text-6xl text-ivory">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-muted mt-4 max-w-lg leading-relaxed">
                {category.description}
              </p>
            )}
          </div>
          <p className="text-muted text-[10px] tracking-[0.35em] uppercase mb-1">
            {events.length} {events.length === 1 ? "event" : "events"}
          </p>
        </ScrollReveal>

        {/* Events grid */}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <ScrollReveal key={event._id} delay={i * 80}>
                <EventCard event={event} categorySlug={slug} index={i} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-border">
            <p className="font-serif text-2xl text-ivory mb-3">No events yet</p>
            <p className="text-muted text-sm">
              Create events under this category in Sanity Studio.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
