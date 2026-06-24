import { defineField, defineType, defineArrayMember } from "sanity";

export const footerSchema = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({
      name: "ctaTagline",
      title: "CTA Tagline",
      type: "string",
      initialValue: "Start a project",
    }),
    defineField({
      name: "ctaHeading",
      title: "CTA Heading",
      type: "string",
      initialValue: "Let's create something remarkable.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: "ctaButtonLabel",
      title: "CTA Button Label",
      type: "string",
      initialValue: "Get in touch",
    }),
    defineField({
      name: "logoText",
      title: "Logo Text",
      type: "string",
      initialValue: "Noran",
    }),
    defineField({
      name: "logoSubtext",
      title: "Logo Subtext",
      type: "string",
      initialValue: "Elgeneady",
    }),
    defineField({
      name: "navigationLinks",
      title: "Navigation Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "href",
              title: "Href",
              type: "string",
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
    }),
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      initialValue: "© 2025 Noran Elgeneady. All rights reserved.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Footer", subtitle: "Global footer settings" };
    },
  },
});