import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/SiteShell";
import { sanityFetch } from "@/lib/sanity";
import { siteSettingsQuery } from "@/lib/queries";
import type { SiteSettings } from "@/lib/types";
import { urlFor } from "@/lib/sanity";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  // Fall back gracefully if Sanity isn't configured yet
  let settings: SiteSettings | null = null;
  try {
    settings = await sanityFetch<SiteSettings>(siteSettingsQuery);
  } catch {
    // Sanity not configured — use defaults
  }

  const title = settings?.seoTitle ?? "Sonder Photography";
  const description =
    settings?.seoDescription ??
    "Capturing the quiet magic of your most meaningful moments.";

  const ogImageUrl = settings?.ogImage?.asset
    ? urlFor(settings.ogImage.asset).width(1200).height(630).url()
    : undefined;

  return {
    title: {
      default: title,
      template: `%s — ${title}`,
    },
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-canvas text-ivory antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
