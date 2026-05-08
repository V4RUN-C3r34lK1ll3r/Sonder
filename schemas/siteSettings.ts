import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  // Singleton — only one document of this type
  // @ts-expect-error __experimental_actions is valid at runtime but not in current Sanity types
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "tagline",
      title: "Hero tagline",
      type: "string",
      description: 'Main headline on the homepage. e.g. "Moments made to last."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subTagline",
      title: "Hero sub-tagline",
      type: "string",
      description: "Supporting line under the tagline",
    }),
    defineField({
      name: "heroImages",
      title: "Hero images (crossfade slideshow)",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      description:
        "3–6 portrait or landscape images that crossfade on the homepage hero. Upload your best shots.",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "aboutText",
      title: "About text",
      type: "array",
      of: [{ type: "block" }],
      description: "Your story — shown on the /about page",
    }),
    defineField({
      name: "photographerName",
      title: "Photographer name",
      type: "string",
    }),
    defineField({
      name: "photographerPhoto",
      title: "Photographer photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "object",
      fields: [
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "email", title: "Email address", type: "string" }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO — Site title",
      type: "string",
      description: "Shown in browser tab and search results",
      initialValue: "Sonder Photography",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO — Meta description",
      type: "text",
      rows: 2,
      description: "1–2 sentences for search engine previews (≤160 chars)",
    }),
    defineField({
      name: "ogImage",
      title: "OG / Share image",
      type: "image",
      description: "Image shown when the site is shared on social media",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
