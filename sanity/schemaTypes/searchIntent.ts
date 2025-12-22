import { defineField, defineType } from 'sanity'

export const searchIntentType = defineType({
  name: 'searchIntent',
  title: 'Search Intent',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'searchTerms',
      title: 'Search Terms',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Search phrases and synonyms tied to this intent.',
    }),
    defineField({
      name: 'contentTypes',
      title: 'Content Types',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Product', value: 'product' },
          { title: 'Software', value: 'software' },
          { title: 'Service Provider', value: 'serviceProvider' },
        ],
      },
      description: 'Document types associated with this intent.',
    }),
    defineField({
      name: 'showInNav',
      title: 'Show in Navigation',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first when sorting navigation items.',
    }),
  ],
})
