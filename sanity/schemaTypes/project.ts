import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',

  fields: [
    // ======================
    // REQUIRED FIELDS
    // ======================

    defineField({
      name: 'title',
      title: 'Project Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    // 🔥 URL SLUG (IMPORTANT)
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'service',
      title: 'Service Type',
      type: 'reference',
      to: [{ type: 'service' }],
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower number appears first (0 = top priority)',
      initialValue: 0,
      validation: Rule =>
        Rule.required()
          .integer()
          .min(0),
    }),

    // ======================
    // OPTIONAL FIELDS
    // ======================

    defineField({
      name: 'behanceUrl',
      title: 'Behance Link',
      type: 'url',
      validation: Rule =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),

    defineField({
      name: 'gallery',
      title: 'Project Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    }),

    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
    }),

    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
    }),

    defineField({
      name: 'featured',
      title: 'Featured Project',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
      service: 'service.title',
      order: 'order',
      featured: 'featured',
    },
    prepare({ title, media, service, order, featured }) {
      return {
        title: `${title}${featured ? '' : ''}`,
   
        subtitle: `Order: ${order ?? 0} | Service: ${service || 'No service'}`,
        media,
      }
    },
  },
})