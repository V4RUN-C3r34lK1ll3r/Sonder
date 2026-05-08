import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import { sanityFetch } from "@/lib/sanity";
import { categoriesQuery } from "@/lib/queries";
import type { Category } from "@/lib/types";

const PLACEHOLDER_CATEGORIES: Category[] = [
  { _id: "p1", name: "Weddings",     slug: { current: "weddings" } },
  { _id: "p2", name: "Couples",      slug: { current: "couples" } },
  { _id: "p3", name: "Family",       slug: { current: "family" } },
  { _id: "p4", name: "Housewarming", slug: { current: "housewarming" } },
  { _id: "p5", name: "Milestones",   slug: { current: "milestones" } },
  { _id: "p6", name: "Portraits",    slug: { current: "portraits" } },
];

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse our photography portfolio — weddings, couples, family sessions, and housewarming celebrations.",
};

export default async function GalleryPage() {
  let categories: Category[] = [];
  try {
    categories = await sanityFetch<Category[]>(categoriesQuery);
  } catch {
    // Sanity not configured yet
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-5 sm:px-8 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">
            Portfolio
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-ivory tracking-wide mb-4">
            Gallery
          </h1>
          <p className="text-muted max-w-md mx-auto leading-relaxed">
            Every image is a feeling — choose a collection to explore.
          </p>
        </ScrollReveal>

        {/* Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat._id} delay={i * 80}>
                <CategoryCard category={cat} index={i} />
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLACEHOLDER_CATEGORIES.map((cat, i, arr) => (
              <ScrollReveal
                key={cat._id}
                delay={i * 80}
                className={i === arr.length - 1 && arr.length % 2 !== 0 ? "sm:col-span-2" : ""}
              >
                <CategoryCard category={cat} index={i} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
