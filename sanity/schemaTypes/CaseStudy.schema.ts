import { defineField, defineType } from "sanity";

// ─────────────────────────────────────────────────────────────────────────────
// Sanity Schema — Case Study
// Portfolio for a Graphic Designer
// Structured for max editorial flexibility + easy CMS editing
// ─────────────────────────────────────────────────────────────────────────────

export const caseStudySchema = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",

  groups: [
    { name: "hero",     title: "① Hero & Overview"        },
    { name: "problem",  title: "② Problem Context"         },
    { name: "research", title: "③ Research & Strategy"     },
    { name: "process",  title: "④ Implementation Journey"  },
    { name: "solution", title: "⑤ Final Solution"          },
    { name: "results",  title: "⑥ Results & Impact"        },
  ],

  fields: [

    // ── ① HERO & OVERVIEW ────────────────────────────────────────────────────

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
      name: "projectType",
      title: "Project Type",
      type: "string",
      group: "hero",
      description: "e.g. Brand Identity · UI/UX · Motion Graphics · Packaging",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "role",
      title: "Your Role",
      type: "string",
      group: "hero",
      description: "e.g. Lead Designer, Art Director, Solo Designer",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      group: "hero",
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "string",
      group: "hero",
      description: "e.g. 6 weeks · 3 months",
    }),
    defineField({
      name: "summary",
      title: "Quick Summary",
      type: "text",
      group: "hero",
      rows: 3,
      description: "2–3 sharp sentences. The elevator pitch. Max 300 chars.",
      validation: (R) => R.required().max(300),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt",     type: "string", title: "Alt Text"  }),
        defineField({ name: "caption", type: "string", title: "Caption"   }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "heroVideo",
      title: "Hero Video URL (optional)",
      type: "url",
      group: "hero",
      description: "Vimeo or YouTube embed URL",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "hero",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    // ── ② PROBLEM CONTEXT ────────────────────────────────────────────────────

    defineField({
      name: "problemTitle",
      title: "Problem Headline",
      type: "string",
      group: "problem",
      description: "e.g. 'A brand trusted by no one'",
    }),
    defineField({
      name: "problemContext",
      title: "Problem Description",
      type: "text",
      group: "problem",
      rows: 5,
    }),
    defineField({
      name: "clientQuote",
      title: "Client Quote (optional)",
      type: "string",
      group: "problem",
    }),
    defineField({
      name: "problemImages",
      title: "Supporting Images",
      type: "array",
      group: "problem",
      of: [{
        type: "image",
        options: { hotspot: true },
        fields: [
          { name: "alt",     type: "string", title: "Alt Text" },
          { name: "caption", type: "string", title: "Caption"  },
        ],
      }],
    }),

    // ── ③ RESEARCH & STRATEGY ────────────────────────────────────────────────

    defineField({
      name: "moodBoardImages",
      title: "Mood Board Images",
      type: "array",
      group: "research",
      of: [{
        type: "image",
        options: { hotspot: true },
        fields: [{ name: "alt", type: "string", title: "Alt Text" }],
      }],
    }),
    defineField({
      name: "keywords",
      title: "Design Direction Keywords",
      type: "array",
      group: "research",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "e.g. Bold · Minimal · Trustworthy · Energetic",
    }),
    defineField({
      name: "competitors",
      title: "Competitive Analysis",
      type: "array",
      group: "research",
      of: [{
        type: "object",
        fields: [
          { name: "name",      type: "string", title: "Competitor Name"     },
          { name: "strength",  type: "string", title: "What they do well"   },
          { name: "weakness",  type: "string", title: "The Gap / Weakness"  },
          {
            name: "image",
            type: "image",
            title: "Screenshot",
            options: { hotspot: true },
          },
        ],
        preview: { select: { title: "name", subtitle: "weakness" } },
      }],
    }),
    defineField({
      name: "researchInsights",
      title: "Research Insights",
      type: "text",
      group: "research",
      rows: 4,
    }),

    // ── ④ IMPLEMENTATION JOURNEY ─────────────────────────────────────────────

    defineField({
      name: "sketchImages",
      title: "Initial Sketches",
      type: "array",
      group: "process",
      of: [{
        type: "image",
        options: { hotspot: true },
        fields: [
          { name: "alt",     type: "string", title: "Alt Text" },
          { name: "caption", type: "string", title: "Caption"  },
        ],
      }],
    }),
    defineField({
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      group: "process",
      of: [{
        type: "object",
        fields: [
          { name: "phase",       type: "string", title: "Phase Name"        },
          { name: "description", type: "text",   title: "Description", rows: 3 },
          {
            name: "images",
            type: "array",
            title: "Images",
            of: [{ type: "image", options: { hotspot: true } }],
          },
        ],
        preview: { select: { title: "phase" } },
      }],
    }),
    defineField({
      name: "rejectedOptions",
      title: "Rejected Directions",
      type: "array",
      group: "process",
      of: [{
        type: "object",
        fields: [
          { name: "title",  type: "string", title: "Direction Title"     },
          { name: "reason", type: "text",   title: "Why Rejected", rows: 2 },
          {
            name: "image",
            type: "image",
            title: "Image",
            options: { hotspot: true },
          },
        ],
        preview: { select: { title: "title" } },
      }],
    }),

    // ── ⑤ FINAL SOLUTION ────────────────────────────────────────────────────

    defineField({
      name: "finalImages",
      title: "Final Design Images",
      type: "array",
      group: "solution",
      of: [{
        type: "image",
        options: { hotspot: true },
        fields: [
          { name: "alt",     type: "string", title: "Alt Text" },
          { name: "caption", type: "string", title: "Caption"  },
        ],
      }],
    }),
    defineField({
      name: "mockupImages",
      title: "Mockup Images",
      type: "array",
      group: "solution",
      of: [{
        type: "image",
        options: { hotspot: true },
        fields: [
          { name: "alt",     type: "string", title: "Alt Text" },
          { name: "caption", type: "string", title: "Caption"  },
        ],
      }],
    }),
    defineField({
      name: "colorPalette",
      title: "Color Palette",
      type: "array",
      group: "solution",
      of: [{
        type: "object",
        fields: [
          { name: "name", type: "string", title: "Color Name"                    },
          { name: "hex",  type: "string", title: "Hex Value (e.g. #D4A853)"      },
          { name: "role", type: "string", title: "Role (e.g. Primary / Accent)"  },
        ],
        preview: { select: { title: "name", subtitle: "hex" } },
      }],
    }),
    defineField({
      name: "typography",
      title: "Typography",
      type: "array",
      group: "solution",
      of: [{
        type: "object",
        fields: [
          { name: "fontName", type: "string", title: "Font Name" },
          {
            name: "role",
            type: "string",
            title: "Role",
            options: {
              list: [
                { title: "Display", value: "display" },
                { title: "Body",    value: "body"    },
                { title: "Accent",  value: "accent"  },
              ],
            },
          },
          { name: "weight", type: "string", title: "Weights (e.g. 400, 700)" },
          { name: "sample", type: "string", title: "Sample Text"              },
        ],
        preview: { select: { title: "fontName", subtitle: "role" } },
      }],
    }),
    defineField({
      name: "designRationale",
      title: "Design Rationale",
      type: "text",
      group: "solution",
      rows: 5,
      description: "Sharp, specific reasoning. Why these choices for this client?",
    }),

    // ── ⑥ RESULTS & IMPACT ──────────────────────────────────────────────────

    defineField({
      name: "metrics",
      title: "Result Metrics",
      type: "array",
      group: "results",
      of: [{
        type: "object",
        fields: [
          { name: "label",       type: "string", title: "Metric Label"         },
          { name: "value",       type: "string", title: "Value (e.g. +63%)"    },
          { name: "description", type: "string", title: "Short Description"    },
        ],
        preview: { select: { title: "label", subtitle: "value" } },
      }],
    }),
    defineField({
      name: "clientFeedback",
      title: "Client Feedback",
      type: "text",
      group: "results",
      rows: 3,
    }),
    defineField({
      name: "lessonsLearned",
      title: "Lessons Learned",
      type: "text",
      group: "results",
      rows: 4,
    }),
    defineField({
      name: "nextSteps",
      title: "Next Steps (optional)",
      type: "text",
      group: "results",
      rows: 3,
    }),
  ],

  preview: {
    select: {
      title:    "projectName",
      subtitle: "projectType",
      media:    "heroImage",
    },
  },

  orderings: [{
    title: "Year — Newest First",
    name:  "yearDesc",
    by:    [{ field: "year", direction: "desc" }],
  }],
});