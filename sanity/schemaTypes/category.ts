import { defineField, defineType } from 'sanity'

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),

    defineField({
      name: 'synonyms',
      title: 'Synonyms / Related Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional related keywords used for SEO, tagging, and filtering.'
    })
  ]
})
