import { defineField, defineType } from 'sanity'

export const blogType = defineType({
  name: 'blog',
  title: 'Blog',
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
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
    }),

    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),

    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
    }),

    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image' }
      ],
    }),

    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'readTime',
      title: 'Estimated read time (minutes)',
      type: 'number',
      validation: Rule => Rule.min(1).max(60),
    }),

    defineField({
      name: 'authors',
      title: 'Additional authors',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'author' }] }],
      description: 'Use this to show “Name A & Name B” like Mangools.',
    }),
    defineField({
      name: 'seo',
      title: 'SEO settings',
      type: 'object',
      fields: [
        { name: 'title', title: 'SEO title', type: 'string' },
        { name: 'description', title: 'Meta description', type: 'text' },
        { name: 'canonicalUrl', title: 'Canonical URL', type: 'url' },
      ],
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured on Homepage?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featuredLabel',
      title: 'Featured Label',
      type: 'string',
      description: 'Label to show on homepage (e.g. "GUIDE")',
      hidden: ({ document }) => !document?.isFeatured,
    }),
  ]
})
