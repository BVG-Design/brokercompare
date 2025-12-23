import { defineType, defineField } from 'sanity'

export const searchIntentType = defineType({
  name: 'searchIntent',
  title: 'Search Intent',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Intent Title',
      type: 'string',
      description: 'Human-friendly name shown in navigation and UI',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'categoryKey',
      title: 'Category Key',
      type: 'string',
      description: 'Stable machine key (matches frontend routing / filters)',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Explains what this intent covers (SEO + AI context)',
    }),

    defineField({
      name: 'synonyms',
      title: 'Synonyms & Related Terms',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Terms users might search that mean the same thing',
    }),

    defineField({
      name: 'exampleQueries',
      title: 'Example User Queries',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Real phrases users might type into search',
    }),

    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      description: 'Controls ordering in nav & search ranking',
      initialValue: 50,
    }),

    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Used to hide intents without deleting them',
      initialValue: true,
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
      description: 'Manual override for navigation ordering',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'categoryKey',
    },
  },
})
