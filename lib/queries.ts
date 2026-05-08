import { groq } from "next-sanity";

// ─── Site Settings ───────────────────────────────────────────────────────────
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    tagline,
    subTagline,
    heroImages[] {
      asset,
      hotspot,
      crop,
      alt
    },
    aboutText,
    photographerName,
    photographerPhoto { asset, hotspot, crop, alt },
    socialLinks,
    seoTitle,
    seoDescription,
    ogImage { asset }
  }
`;

// ─── Categories ──────────────────────────────────────────────────────────────
export const categoriesQuery = groq`
  *[_type == "category"] | order(order asc) {
    _id,
    name,
    slug,
    description,
    coverImage { asset, hotspot, crop, alt },
    "eventCount": count(*[_type == "event" && references(^._id)])
  }
`;

// Hero cover images — pulled from latest published events
export const heroCoverImagesQuery = groq`
  *[_type == "event" && defined(coverImage.asset)] | order(date desc) [0...6] {
    _id,
    name,
    "image": coverImage { asset, hotspot, crop }
  }
`;

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    coverImage { asset, hotspot, crop }
  }
`;

// ─── Photos ──────────────────────────────────────────────────────────────────
export const photosByCategoryQuery = groq`
  *[_type == "photo" && category->slug.current == $slug] | order(order asc, date desc) {
    _id,
    title,
    alt,
    date,
    featured,
    order,
    image { asset, hotspot, crop }
  }
`;

export const recentEventsQuery = groq`
  *[_type == "event" && defined(coverImage.asset)] | order(date desc) [0...12] {
    _id,
    name,
    slug,
    date,
    location,
    "categoryName": category->name,
    "categorySlug": category->slug.current,
    coverImage { asset, hotspot, crop },
    "photoCount": count(photos)
  }
`;

export const eventsByCategory = groq`
  *[_type == "event" && category->slug.current == $slug] | order(date desc) {
    _id,
    name,
    slug,
    date,
    location,
    description,
    coverImage { asset, hotspot, crop, alt },
    "photoCount": count(photos)
  }
`;

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    date,
    location,
    description,
    category-> { _id, name, slug },
    coverImage { asset, hotspot, crop, alt },
    photos[defined(asset)] {
      _key,
      asset,
      hotspot,
      crop
    }
  }
`;

export const featuredPhotosQuery = groq`
  *[_type == "photo" && featured == true] | order(order asc) [0...12] {
    _id,
    title,
    alt,
    image { asset, hotspot, crop },
    "categorySlug": category->slug.current
  }
`;
