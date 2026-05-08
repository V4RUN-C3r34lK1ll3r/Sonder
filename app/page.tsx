import Link from "next/link";
import { HeroWrapper } from "@/components/HeroWrapper";
import { CategoryCard } from "@/components/CategoryCard";
import { EventCarousel } from "@/components/EventCarousel";
import { TestimonialSection } from "@/components/TestimonialSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { sanityFetch } from "@/lib/sanity";
import { siteSettingsQuery, categoriesQuery, recentEventsQuery } from "@/lib/queries";
import type { SiteSettings, Category } from "@/lib/types";

export default async function HomePage() {
  let settings: SiteSettings | null = null;
  let categories: Category[] = [];
  let recentEvents: Parameters<typeof EventCarousel>[0]["events"] = [];

  try {
    [settings, categories, recentEvents] = await Promise.all([
      sanityFetch<SiteSettings>(siteSettingsQuery),
      sanityFetch<Category[]>(categoriesQuery),
      sanityFetch<typeof recentEvents>(recentEventsQuery),
    ]);
  } catch {
    // Sanity not configured yet — render with placeholders
  }

  return (
    <>
      {/* ── 3D Galaxy Hero ── */}
      <HeroWrapper
        events={recentEvents}
        tagline={settings?.tagline}
        subTagline={settings?.subTagline}
      />

      {/* ── Intro strip ── */}
      <section className="py-14 md:py-20 px-5 sm:px-8 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end gap-8 md:gap-16 lg:gap-24">
            <div className="flex-1">
              <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-5">
                The Philosophy
              </p>
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-ivory leading-[1.18]">
                Every life is as vivid and full as your own — we photograph the moments that make yours.
              </p>
            </div>
            <div className="flex-1 md:max-w-xs lg:max-w-sm">
              <div className="w-8 h-px bg-gold mb-5 hidden md:block" />
              <p className="text-muted text-sm md:text-base leading-relaxed">
                Quiet, honest, and alive with meaning — we document the moments between moments.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Recent events carousel ── */}
      <EventCarousel events={recentEvents} />

      {/* ── Category grid ── */}
      <section className="px-5 sm:px-8 md:px-12 lg:px-16 pb-14 md:pb-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="mb-10 md:mb-12 flex items-end justify-between">
            <div>
              <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-3">
                Portfolio
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ivory">
                The Work
              </h2>
            </div>
            <div className="hidden md:block w-24 h-px bg-border mb-3" />
          </ScrollReveal>

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
              {[
                { _id: "p1", name: "Weddings",     slug: { current: "weddings" } },
                { _id: "p2", name: "Couples",      slug: { current: "couples" } },
                { _id: "p3", name: "Family",       slug: { current: "family" } },
                { _id: "p4", name: "Housewarming", slug: { current: "housewarming" } },
                { _id: "p5", name: "Milestones",   slug: { current: "milestones" } },
                { _id: "p6", name: "Portraits",    slug: { current: "portraits" } },
              ].map((cat, i, arr) => (
                <ScrollReveal
                  key={cat.name}
                  delay={i * 80}
                  className={i === arr.length - 1 && arr.length % 2 !== 0 ? "sm:col-span-2" : ""}
                >
                  <CategoryCard category={cat as Category} index={i} />
                </ScrollReveal>
              ))}
            </div>
          )}

          <ScrollReveal className="text-center mt-12">
            <Link
              href="/gallery"
              className="inline-block px-8 py-3 border border-gold/40 text-gold text-sm tracking-widest uppercase hover:bg-gold hover:text-canvas transition-all duration-300"
            >
              View All Work
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <TestimonialSection />

      {/* ── CTA / contact strip ── */}
      <section className="border-t border-border py-14 md:py-20 px-5 sm:px-8 md:px-12 lg:px-16">
        <ScrollReveal>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-10 md:gap-16">
            <div>
              <p className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4">
                Let&apos;s work together
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ivory leading-[1.1]">
                Your story deserves<br className="hidden sm:block" /> to be remembered.
              </h2>
            </div>
            <div className="md:max-w-xs flex flex-col gap-5">
              <p className="text-muted text-sm md:text-base leading-relaxed">
                Whether it&apos;s a grand celebration or a quiet afternoon —
                we&apos;d love to be there with a camera.
              </p>
              <Link
                href="/contact"
                className="inline-block self-start px-8 sm:px-10 py-4 bg-gold text-canvas text-xs tracking-[0.25em] uppercase font-semibold hover:bg-gold-light transition-colors duration-300"
              >
                Book a Session
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
