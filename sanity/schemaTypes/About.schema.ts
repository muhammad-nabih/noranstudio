// sanity/schemaTypes/About.schema.ts
import { defineField, defineType } from 'sanity'

export const aboutSchema = defineType({
  name: 'about',
  title: 'About Section',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Profile Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'greeting',
      title: 'Greeting Text (e.g. HI...)',
      type: 'string',
      initialValue: 'HI...',
    }),
    defineField({
      name: 'role',
      title: 'Job Title (e.g. Graphic Designer)',
      type: 'string',
      initialValue: 'Graphic Designer',
    }),
    defineField({
      name: 'location',
      title: 'Location (e.g. Based in EG)',
      type: 'string',
      initialValue: 'Based in EG',
    }),
    defineField({
      name: 'heroHeadingLine1',
      title: 'Heading Line 1 (e.g. MEET THE MIND)',
      type: 'string',
      initialValue: 'MEET THE MIND',
    }),
    defineField({
      name: 'heroHeadingLine2',
      title: 'Heading Line 2 (e.g. BEHIND THE WORK)',
      type: 'string',
      initialValue: 'BEHIND THE WORK',
    }),
    defineField({
      name: 'shortBio',
      title: 'Short Bio (Left Column)',
      type: 'text',
      rows: 4,
      description: 'النص القصير اللي بيظهر في العمود الشمال',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fullBio',
      title: 'Full Bio (Card)',
      type: 'text',
      rows: 6,
      description: 'النص اللي بيظهر جوه الكارت الأسود',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'yearsExperience',
      title: 'Years of Experience (e.g. 2+)',
      type: 'string',
      initialValue: '2+',
    }),
    defineField({
      name: 'brandsCrafted',
      title: 'Brands Crafted (e.g. 20+)',
      type: 'string',
      initialValue: '20+',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'photo',
    },
  },
})