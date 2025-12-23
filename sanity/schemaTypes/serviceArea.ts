import { defineField, defineType } from 'sanity'

export const serviceAreaType = defineType({
  name: 'serviceArea',
  title: 'Service Area',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),

    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 3,
      validation: Rule =>
        Rule.max(160).warning('Recommended max 155–160 characters')
    }),

    defineField({
      name: 'group',
      title: 'Group / Category',
      type: 'string',
      description: 'e.g. Technology, IT & Infrastructure'
    }),

    defineField({
      name: 'icon',
      title: 'Icon (Emoji or Reference)',
      type: 'string'
    }),

    defineField({
      name: 'synonyms',
      title: 'Synonyms / Related Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional related keywords used for SEO, tagging, and AI context.'
    }),

  ]
})