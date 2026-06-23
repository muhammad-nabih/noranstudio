import { defineField, defineType } from "sanity";

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",

  // singleton: مستند واحد بس في كل الـ dataset
  __experimental_formPreviewTitle: false,

  groups: [
    { name: "brand",   title: "Brand"          },
    { name: "social",  title: "Social Links"   },
    { name: "contact", title: "Contact"        },
  ],

  fields: [
    // ── Brand ────────────────────────────────────────────────────────────────
    defineField({
      name: "siteName",
      title: "Site / Brand Name",
      type: "string",
      group: "brand",
      initialValue: "Noran",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "footerTagline",
      title: "Footer Tagline",
      type: "text",
      group: "brand",
      rows: 2,
      description: "e.g. 'Visual storytelling for brands that want to be remembered.'",
    }),

    // ── Social Links ─────────────────────────────────────────────────────────
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      group: "social",
      of: [
        {
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Instagram", value: "instagram" },
                  { title: "Behance", value: "behance" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "Twitter / X", value: "twitter" },
                  { title: "Dribbble", value: "dribbble" },
                  { title: "YouTube", value: "youtube" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "Facebook", value: "facebook" },
                  { title: "WhatsApp", value: "whatsapp" },
                  { title: "Other", value: "other" },
                ],
              },
              validation: (R) => R.required(),
            }),
            defineField({
              name: "label",
              title: "Custom Label (لو اختارت Other)",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (R) =>
                R.required().uri({ allowRelative: false, scheme: ["http", "https"] }),
            }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),

    // ── Contact ─────────────────────────────────────────────────────────────
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone (optional)",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "location",
      title: "Location (e.g. 'Cairo, Egypt')",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "footerNote",
      title: "Footer Bottom Note",
      type: "string",
      group: "contact",
      description: "e.g. '© 2026 Noran. All rights reserved.' — لو سيبته فاضي هيتولد أوتوماتيك",
    }),
  ],

  preview: {
    select: { title: "siteName" },
    prepare({ title }) {
      return { title: title || "Site Settings" };
    },
  },
});