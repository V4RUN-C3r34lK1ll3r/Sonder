import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface SanityImage {
  asset: SanityImageSource;
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  coverImage?: SanityImage & { alt?: string };
  eventCount?: number;
}

export interface Photo {
  _id: string;
  title?: string;
  alt: string;
  date?: string;
  featured?: boolean;
  order?: number;
  image: SanityImage;
  categorySlug?: string;
}

export interface EventPhoto {
  _key: string;
  asset: SanityImageSource;
  hotspot?: { x: number; y: number; width: number; height: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface SonderEvent {
  _id: string;
  name: string;
  slug: { current: string };
  category: { _id: string; name: string; slug: { current: string } };
  date?: string;
  location?: string;
  coverImage?: SanityImage;
  description?: string;
  photos: EventPhoto[];
  photoCount?: number;
  order?: number;
}

export interface SiteSettings {
  tagline: string;
  subTagline?: string;
  heroImages: Array<SanityImage & { alt: string }>;
  aboutText?: unknown[]; // Portable Text
  photographerName?: string;
  photographerPhoto?: SanityImage & { alt?: string };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    email?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: { asset: SanityImageSource };
}
