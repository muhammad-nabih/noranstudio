import { defineField, defineType, defineArrayMember } from "sanity";

const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
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
                  { title: "Dribbble", value: "Dribbble" },
                  { title: "Facebook", value: "Facebook" },
                  { title: "TikTok", value: "TikTok" },
                  { title: "WhatsApp", value: "WhatsApp" },
                ],
                layout: "dropdown",
              },
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
  ],
  preview: {
    prepare() {
      return { title: "Site Settings", subtitle: "Global social links" };
    },
  },
});

export default siteSettingsSchema;