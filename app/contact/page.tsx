import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { ScrollReveal } from "@/components/ScrollReveal";
import { sanityFetch } from "@/lib/sanity";
import { siteSettingsQuery } from "@/lib/queries";
import type { SiteSettings } from "@/lib/types";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a photography session or send us an inquiry. Weddings, couples, family, and housewarming shoots.",
};

export default async function ContactPage() {
  let settings: SiteSettings | null = null;
  try {
    settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  } catch {
    // Sanity not configured
  }

  const email = settings?.socialLinks?.email;
  const instagram = settings?.socialLinks?.instagram;

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
        {/* Left — info */}
        <ScrollReveal className="pt-4">
          <p className="text-gold text-xs tracking-[0.3em] uppercase mb-4">
            Get in touch
          </p>
          <h1 className="font-serif text-5xl md:text-6xl text-ivory tracking-wide mb-6">
            Let&apos;s talk.
          </h1>
          <p className="text-muted leading-relaxed mb-10">
            Reach out to check availability, ask questions, or just say hello.
            We typically reply within 24 hours.
          </p>

          <div className="space-y-6">
            {email && (
              <div>
                <p className="text-xs text-muted tracking-widest uppercase mb-1">Email</p>
                <a
                  href={`mailto:${email}`}
                  className="text-ivory hover:text-gold transition-colors duration-200"
                >
                  {email}
                </a>
              </div>
            )}
            {instagram && (
              <div>
                <p className="text-xs text-muted tracking-widest uppercase mb-1">Instagram</p>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory hover:text-gold transition-colors duration-200"
                >
                  @sonderphotography
                </a>
              </div>
            )}
          </div>

          <div className="mt-12 pt-12 border-t border-border">
            <p className="text-xs text-muted tracking-widest uppercase mb-4">
              We photograph
            </p>
            <ul className="space-y-2">
              {["Weddings", "Couples", "Family", "Housewarming", "Portraits"].map(
                (type) => (
                  <li
                    key={type}
                    className="text-ivory/60 text-sm flex items-center gap-3"
                  >
                    <span className="block w-3 h-px bg-gold" />
                    {type}
                  </li>
                )
              )}
            </ul>
          </div>
        </ScrollReveal>

        {/* Right — form */}
        <ScrollReveal delay={100}>
          <ContactForm />
        </ScrollReveal>
      </div>
    </div>
  );
}
