// import {defineField, defineType} from 'sanity'

// export default defineType({
//   name: 'gallery',
//   title: 'Gallery',
//   type: 'document',
//   fields: [
//     defineField({
//       name: 'title',
//       title: 'Title',
//       type: 'string',
//       validation: Rule => Rule.required()
//     }),
//     defineField({
//       name: 'description',
//       title: 'Description',
//       type: 'text',
//       rows: 2,
//     }),
//     defineField({
//       name: 'images',
//       title: 'Images',
//       type: 'array',
//       of: [
//         {
//           type: 'object',
//           fields: [
//             {
//               name: 'image',
//               title: 'Image',
//               type: 'image',
//               options: { hotspot: true },
//             },
//             {
//               name: 'alt',
//               title: 'Alt Text',
//               type: 'string',
//             },
//           ],
//         },
//       ],
//     }),
//     defineField({
//       name: 'order',
//       title: 'Order',
//       type: 'number',
//     }),
//   ],
//   preview: {
//     select: {
//       title: 'title',
//       images: 'images',
//     },
//     prepare(selection) {
//       const {title, images} = selection
//       return {
//         title: `${title} (${images?.length || 0} images)`,
//       }
//     },
//   },
// })
