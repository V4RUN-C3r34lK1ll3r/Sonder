import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";

export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true, // enables focal point selection
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title (optional)",
      type: "string",
      description: "Internal label — not shown publicly unless used in lightbox",
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the photo for screen readers and SEO",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "event",
      title: "Event (optional)",
      type: "reference",
      to: [{ type: "event" }],
      description: 'Link to a specific event e.g. "Priya & Arjun Wedding". Leave blank for standalone shots.',
    }),
    defineField({
      name: "date",
      title: "Shoot date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
    }),
    defineField({
      name: "featured",
      title: "Featured (show in hero or highlights)?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first within the category",
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: "title",
      alt: "alt",
      media: "image",
      category: "category.name",
    },
    prepare({ title, alt, media, category }) {
      return {
        title: title || alt || "Untitled photo",
        subtitle: category,
        media,
      };
    },
  },
  orderings: [
    {
      title: "Shoot date (newest first)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Display order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
