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
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'serviceAreas',
      title: 'Service Areas',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'serviceArea' }] }]
    }),

    defineField({
      name: 'brokerType',
      title: 'Broker Types',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Mortgage', value: 'Mortgage' },
          { title: 'Asset Finance', value: 'Asset Finance' },
          { title: 'Commercial', value: 'Commercial' }
        ]
      }
    }),

    defineField({
      name: 'worksWith',
      title: 'Works With / Integrations',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'directoryListing' }],
          options: {
            filter: 'listingType == "software"'
          }
        }
      ],
      description: 'Other software tools this listing integrates with',
      validation: Rule =>
        Rule.custom((refs, context) => {
          if (!refs || !Array.isArray(refs)) return true

          const selfId = context.document?._id
          if (!selfId) return true

          const hasSelfReference = refs.some(
            (ref: any) => ref._ref === selfId
          )

          return hasSelfReference
            ? 'A listing cannot reference itself in “Works With”.'
            : true
        })
    }),

    defineField({
      name: 'editorNotes',
      title: 'Editor Notes',
      type: 'text',
      description: 'Public Commentary',
    }),

    defineField({
      name: 'listingType',
      title: 'Listing Type',
      type: 'string',
      options: {
        list: [
          { title: 'Software', value: 'software' },
          { title: 'Service', value: 'service' },
          { title: 'Podcast', value: 'podcast' },
          { title: 'Guide', value: 'guide' },
          { title: 'FAQ', value: 'faq' },
          { title: 'Resource', value: 'resource' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'badges',
      title: 'Badges',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'badge' }]
        }
      ],
      description: 'Editorial or commercial badges applied to this listing'
    }),

    defineField({
      name: 'journeyStages',
      title: 'Journey Stages',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'journeyStage' }] }],
      description: 'The journey stages this article is relevant to.'
    }),
    defineField({
      name: 'journeyAssociations',
      title: 'Journey Associations',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'People', value: 'people' },
          { title: 'Software', value: 'software' },
          { title: 'Processes & Automations', value: 'processes_automations' },
          { title: 'Services', value: 'services' }
        ]
      },
      description: 'The types of business pillars this article impacts.'
    }),

    defineField({
      name: 'video',
      title: 'Featured Video (optional)',
      type: 'videoEmbed',
      hidden: ({ document }) => !['podcast', 'guide', 'resource'].includes(document?.listingType as string),
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
  ],

})
