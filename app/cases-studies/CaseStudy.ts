import { defineField, defineType } from "sanity";

export const caseStudySchema = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",

  groups: [
    { name: "hero",     title: "① Hero & Overview"     },
    { name: "challenge",title: "② The Challenge"       },
    { name: "goal",     title: "③ Goal"               },
    { name: "insight",  title: "④ Insight"            },
    { name: "strategy", title: "⑤ Strategy"           },
    { name: "idea",     title: "⑥ Creative Idea"      },
    { name: "visual",   title: "⑦ Visual Direction"   },
    { name: "results",  title: "⑧ Results & Impact"   },
  ],

  fields: [
    // ── ① Hero ──────────────────────────────────────────────────────────────
    defineField({
      name: "projectName",
      title: "Project Name",
      type: "string",
      group: "hero",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "hero",
      options: { source: "projectName", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / Tagline",
      type: "string",
      group: "hero",
      description: "e.g. 'More to explore, memories to store'",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "hero",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "e.g. SOCIAL MEDIA, VISUAL ARTIST, TOURISM",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt Text" }),
        defineField({ name: "caption", type: "string", title: "Caption" }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Video URL (optional)",
      type: "url",
      group: "hero",
    }),
    // ✅ جديد: الصور الأربعة تحت الـ Hero (الـ details/highlights)
    defineField({
      name: "heroDetailImages",
      title: "Hero Detail Images (4 الصور تحت الهيرو)",
      type: "array",
      group: "hero",
      description: "أجزاء/تفاصيل من صورة الهيرو بتسلط الضوء على عناصر معينة",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt Text" },
          ],
        },
      ],
      validation: (R) => R.max(4),
    }),

    // ── ② Challenge ──────────────────────────────────────────────────────────
    defineField({
      name: "challengeTitle",
      title: "Challenge Headline",
      type: "string",
      group: "challenge",
      description: "e.g. 'THE CHALLENGED'",
    }),
    defineField({
      name: "challengeDescription",
      title: "Challenge Description",
      type: "text",
      group: "challenge",
      rows: 4,
    }),

    // ── ③ Goal ──────────────────────────────────────────────────────────────
    defineField({
      name: "goalTitle",
      title: "Goal Headline",
      type: "string",
      group: "goal",
      description: "e.g. 'WE NEED TO'",
    }),
    defineField({
      name: "goalDescription",
      title: "Goal Description",
      type: "text",
      group: "goal",
      rows: 4,
    }),

    // ── ④ Insight ────────────────────────────────────────────────────────────
    defineField({
      name: "insightTitle",
      title: "Insight Headline",
      type: "string",
      group: "insight",
      description: "e.g. 'INSIGHT'",
    }),
    defineField({
      name: "insightDescription",
      title: "Insight Description",
      type: "text",
      group: "insight",
      rows: 4,
    }),

    // ── ⑤ Strategy ──────────────────────────────────────────────────────────
    defineField({
      name: "strategyTitle",
      title: "Strategy Headline",
      type: "string",
      group: "strategy",
      description: "e.g. 'STRATEGY'",
    }),
    defineField({
      name: "strategyDescription",
      title: "Strategy Description",
      type: "text",
      group: "strategy",
      rows: 4,
    }),

    // ── ⑥ Creative Idea ─────────────────────────────────────────────────────
    defineField({
      name: "creativeIdeaTitle",
      title: "Creative Idea Headline",
      type: "string",
      group: "idea",
      description: "e.g. 'CREATIVE IDEA'",
    }),
    defineField({
      name: "creativeIdeaDescription",
      title: "Creative Idea Description",
      type: "text",
      group: "idea",
      rows: 4,
    }),

    // ── ⑦ Visual Direction ──────────────────────────────────────────────────
    defineField({
      name: "visualDirectionTitle",
      title: "Visual Direction Headline",
      type: "string",
      group: "visual",
      description: "e.g. 'VISUAL DIRECTION'",
    }),
    // ✅ جديد: صور المعرض (الـ 6 صور)
    defineField({
      name: "visualDirectionImages",
      title: "Visual Direction Gallery (6 صور)",
      type: "array",
      group: "visual",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt Text" },
          ],
        },
      ],
      validation: (R) => R.max(6),
    }),
    // ✅ جديد: الوصف اللي تحت المعرض
    defineField({
      name: "visualDirectionDescription",
      title: "Visual Direction Description",
      type: "text",
      group: "visual",
      rows: 3,
    }),
    defineField({
      name: "colorPalette",
      title: "Color Palette",
      type: "array",
      group: "visual",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Color Name" },
            { name: "hex",  type: "string", title: "Hex Value (e.g. #D4A853)" },
            { name: "role", type: "string", title: "Role (e.g. Primary / Accent)" },
          ],
          preview: { select: { title: "name", subtitle: "hex" } },
        },
      ],
    }),

    // ── ⑧ Results & Impact ──────────────────────────────────────────────────
    defineField({
      name: "resultsTitle",
      title: "Results Headline",
      type: "string",
      group: "results",
      description: "e.g. 'RESULTS & IMPACT'",
    }),
    defineField({
      name: "metrics",
      title: "Result Metrics",
      type: "array",
      group: "results",
      of: [
        {
          type: "object",
          fields: [
            { name: "label",       type: "string", title: "Metric Label" },
            { name: "value",       type: "string", title: "Value (e.g. +63%)" },
            { name: "description", type: "string", title: "Short Description" },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "clientFeedback",
      title: "Client Feedback",
      type: "text",
      group: "results",
      rows: 3,
    }),
  ],

  preview: {
    select: {
      title: "projectName",
      subtitle: "subtitle",
      media: "heroImage",
    },
  },

  orderings: [
    {
      title: "Year — Newest First",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
});