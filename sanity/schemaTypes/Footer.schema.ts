import { defineField, defineType, defineArrayMember } from "sanity";

export const footerSchema = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  // singleton — حد واحد بس في الـ studio
  // No __experimental_actions here; remove for valid config.
  fields: [
    // ─── CTA Section ───────────────────────────────────────────────────────
    defineField({
      name: "ctaTagline",
      title: "CTA Tagline",
      type: "string",
      description: "النص الصغير فوق الهيدينج — مثلاً: Start a project",
      initialValue: "Start a project",
    }),
    defineField({
      name: "ctaHeading",
      title: "CTA Heading",
      type: "string",
      description: "الهيدينج الكبير — مثلاً: Let's create something remarkable.",
      initialValue: "Let's create something remarkable.",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "email",
      title: "Contact Email",
      type: "string",
      description: "الإيميل اللي هيظهر في الفوتر",
      validation: (R) => R.required().email(),
    }),
    defineField({
      name: "ctaButtonLabel",
      title: "CTA Button Label",
      type: "string",
      initialValue: "Get in touch",
    }),

    // ─── Branding ──────────────────────────────────────────────────────────
    defineField({
      name: "logoText",
      title: "Logo Text",
      type: "string",
      description: "الاسم الأساسي — مثلاً: Noran",
      initialValue: "Noran",
    }),
    defineField({
      name: "logoSubtext",
      title: "Logo Subtext",
      type: "string",
      description: "الاسم الأخير — مثلاً: Elgeneady",
      initialValue: "Elgeneady",
    }),

    // ─── Navigation ────────────────────────────────────────────────────────
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
              description: "مثلاً: /#work أو /about",
              validation: (R) => R.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
    }),

    // ─── Social Links ──────────────────────────────────────────────────────
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "Instagram" },
                  { title: "Behance", value: "Behance" },
                  { title: "LinkedIn", value: "LinkedIn" },
                  { title: "Twitter / X", value: "Twitter" },
                  { title: "YouTube", value: "YouTube" },
                  { title: "Pinterest", value: "Pinterest" },
                ],
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: "label",
              title: "Display Label",
              type: "string",
              description: "مثلاً: IG أو BE أو LI",
              validation: (R) => R.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (R) => R.required().uri({ scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        }),
      ],
    }),

    // ─── Copyright ─────────────────────────────────────────────────────────
    defineField({
      name: "copyrightText",
      title: "Copyright Text",
      type: "string",
      description: "مثلاً: © 2025 Noran Elgeneady. All rights reserved.",
      initialValue: "© 2025 Noran Elgeneady. All rights reserved.",
    }),
  ],

  preview: {
    prepare() {
      return { title: "Footer", subtitle: "Global footer settings" };
    },
  },
});
