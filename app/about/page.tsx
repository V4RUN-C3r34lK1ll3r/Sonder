import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { sanityFetch, urlFor } from "@/lib/sanity";
import { siteSettingsQuery } from "@/lib/queries";
import type { SiteSettings } from "@/lib/types";

export const metadata: Metadata = {
  title: "About",
  description: "Pittsburgh-based photographer devoted to capturing the moments your family will cherish forever.",
};

// Minimal Portable Text renderer (avoids adding a full @portabletext dep)
function renderBlock(block: { _type: string; style?: string; children?: { text: string }[] }) {
  if (block._type !== "block") return null;
  const text = block.children?.map((c) => c.text).join("") ?? "";
  if (!text) return null;
  if (block.style === "h2") return <h2 className="font-serif text-2xl text-ivory mt-8 mb-3">{text}</h2>;
  if (block.style === "h3") return <h3 className="font-serif text-xl text-ivory mt-6 mb-2">{text}</h3>;
  return <p className="text-ivory/70 leading-relaxed mb-4">{text}</p>;
}

export default async function AboutPage() {
  let settings: SiteSettings | null = null;
  try {
    settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  } catch {
    // Sanity not configured
  }

  const photographerName = settings?.photographerName ?? "The Photographer";
  const photographerPhoto = settings?.photographerPhoto;
  const aboutBlocks = (settings?.aboutText ?? []) as {
    _type: string;
    _key: string;
    style?: string;
    children?: { text: string }[];
  }[];
  const instagram = settings?.socialLinks?.instagram;
  const email = settings?.socialLinks?.email;

  const photoSrc = photographerPhoto
    ? urlFor(photographerPhoto.asset).width(800).height(1000).fit("crop").url()
    : "/about/photographer.jpg";

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero strip */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-20">
        <ScrollReveal className="max-w-xl">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">
            About
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-ivory tracking-wide">
            {photographerName}
          </h1>
        </ScrollReveal>
      </section>

      {/* Content — two-column on desktop */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Photo */}
        <ScrollReveal>
          <div className="relative aspect-[3/4] overflow-hidden bg-surface">
            <Image
              src={photoSrc}
              alt={photographerPhoto?.alt ?? photographerName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </ScrollReveal>

        {/* Text */}
        <ScrollReveal delay={100} className="pt-4">
          {aboutBlocks.length > 0 ? (
            <div className="prose-custom">
              {aboutBlocks.map((block) => (
                <div key={block._key}>{renderBlock(block)}</div>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-ivory/70 leading-relaxed mb-5">
                Hey — I&apos;m Varun, the photographer behind Sonder Studios.
                I care deeply about making every event feel special — because
                every moment you&apos;ll look back on deserves to be treated that way.
                Not just captured, but felt.
              </p>
              <p className="text-ivory/70 leading-relaxed mb-6">
                Based in Pittsburgh and always happy to travel. I keep things
                relaxed, flexible, and pressure-free — clients usually say it
                feels less like hiring a photographer and more like having a
                friend with a camera.
              </p>
              <p className="text-ivory/50 text-sm">
                Friendly. Flexible. Fully devoted to getting it right.
              </p>
            </div>
          )}

          {/* Social links */}
          <div className="mt-10 flex flex-col gap-3">
            <div className="w-10 h-px bg-gold mb-2" />
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-gold transition-colors duration-200 text-sm tracking-wider flex items-center gap-2"
              >
                <span className="text-xs uppercase tracking-widest">Instagram</span>
                <span className="block w-4 h-px bg-current" />
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-muted hover:text-gold transition-colors duration-200 text-sm tracking-wider"
              >
                {email}
              </a>
            )}
          </div>

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-block px-8 py-3.5 bg-gold text-canvas text-sm tracking-widest uppercase font-medium hover:bg-gold-light transition-colors duration-300"
            >
              Work With Me
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
