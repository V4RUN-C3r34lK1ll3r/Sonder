import { defineField, defineType } from "sanity";
import { CalendarIcon } from "@sanity/icons";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "name",
      title: "Event name",
      type: "string",
      description: 'e.g. "Priya & Arjun Wedding" or "The Sharma Family"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL path)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Which category this event belongs to (e.g. Weddings)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Event date",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'e.g. "Chennai, India"',
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      description: "Shown as the thumbnail for this event in the gallery",
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Upload all photos for this event here. Drag to reorder.",
      options: { layout: "grid" },
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first within the category",
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category.name",
      media: "coverImage",
      date: "date",
    },
    prepare({ title, subtitle, media, date }) {
      return {
        title,
        subtitle: [subtitle, date].filter(Boolean).join(" · "),
        media,
      };
    },
  },
  orderings: [
    {
      title: "Event date (newest first)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
});
