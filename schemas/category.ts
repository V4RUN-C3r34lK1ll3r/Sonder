import { defineField, defineType } from "sanity";
import { FolderIcon } from "@sanity/icons";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: FolderIcon,
  fields: [
    defineField({
      name: "name",
      title: "Category name",
      type: "string",
      description: 'e.g. "Weddings", "Couples", "Family", "Housewarming"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL path)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      description: 'Auto-generated from name. e.g. "weddings"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      description: "Shown on the /gallery category grid",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 3,
      description: "One or two lines shown under the category name",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first on the gallery page",
      initialValue: 10,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      media: "coverImage",
    },
  },
});
