import { defineField, defineType } from 'sanity';

export const directoryListingType = defineType({
  name: 'directoryListing',
  title: 'Directory Listing',
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
      validation: rule => rule.required()
    }),

    defineField({
      name: 'supabaseId',
      title: 'Supabase ID',
      type: 'string',
      description: 'Link back to the Supabase vendors table (sanity_id).'
    }),

    defineField({
      name: 'listingType',
      title: 'Listing Type',
      type: 'string',
      options: {
        list: [
          { title: 'Software', value: 'software' },
          { title: 'Service', value: 'service' }
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string'
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text'
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    }),

    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true }
    }),

    defineField({
      name: 'websiteURL',
      title: 'Website URL',
      type: 'url'
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
      name: 'features',
      title: 'Features (Capability Matrix)',
      type: 'array',
      of: [{ type: 'listingFeature' }]
    }),

    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Pricing Type',
          type: 'string',
          options: {
            list: [
              { title: 'Free', value: 'free' },
              { title: 'Subscription', value: 'subscription' },
              { title: 'One-time', value: 'one_time' },
              { title: 'Contact for Quote', value: 'quote' }
            ]
          }
        }),
        defineField({
          name: 'startingFrom',
          title: 'Starting From ($)',
          type: 'number'
        }),
        defineField({
          name: 'notes',
          title: 'Pricing Notes',
          type: 'text',
          rows: 2
        })
      ]
    }),

    defineField({
      name: 'serviceAreas',
      title: 'Service Areas',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'serviceArea' }] }]
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
          if (!refs || !Array.isArray(refs)) return true;

          const selfId = context.document?._id;
          if (!selfId) return true;

          const hasSelfReference = refs.some((ref: any) => ref._ref === selfId);

          return hasSelfReference ? 'A listing cannot reference itself in Works With.' : true;
        })
    }),

    defineField({
      name: 'similarTo',
      title: 'Similar To (Alternatives)',
      type: 'array',
      description:
        'Up to 6 comparable listings. Top 3 appear in the summary comparison; all appear in the detailed comparison selector.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'listing',
              title: 'Listing',
              type: 'reference',
              to: [{ type: 'directoryListing' }],
              options: {
                filter: ({ document }) => {
                  const id = document?._id?.replace('drafts.', '');
                  return {
                    filter: '!(_id in [$id, $draftId])',
                    params: { id, draftId: `drafts.${id}` }
                  };
                }
              },
              validation: Rule => Rule.required()
            }),
            defineField({
              name: 'priority',
              title: 'Priority (1 = highest)',
              type: 'number',
              initialValue: 1,
              validation: Rule => Rule.min(1).max(6)
            })
          ],
          preview: {
            select: { title: 'listing.title', priority: 'priority' },
            prepare({ title, priority }: any) {
              return {
                title: title || 'Select listing',
                subtitle: priority ? `Priority ${priority}` : 'No priority set'
              };
            }
          }
        }
      ],
      validation: Rule => Rule.max(6)
    }),

    defineField({
      name: 'serviceProviders',
      title: 'Service Providers (Implementation)',
      type: 'array',
      description: 'Recommended implementation partners. Only visible for software listings.',
      hidden: ({ document }) => document?.listingType !== 'software',
      of: [
        {
          type: 'reference',
          to: [{ type: 'directoryListing' }],
          options: {
            filter: 'listingType == "service"'
          }
        }
      ],
      validation: Rule => Rule.max(8)
    }),

    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }]
    }),

    defineField({
      name: 'editorNotes',
      title: 'Editor Notes',
      type: 'text',
      description: 'Public Commentary'
    }),

    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.max(160).warning('Recommended max 155-160 characters')
    }),

    defineField({
      name: 'synonyms',
      title: 'Synonyms / Related Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Used for search and AI reasoning context.'
    }),

    defineField({
      name: 'isFeatured',
      title: 'Featured Listing',
      type: 'boolean',
      initialValue: false
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
      name: 'journeyStage',
      title: 'Journey Stage',
      type: 'reference',
      to: [{ type: 'journeyStage' }],
      description: 'The primary stage of the broker journey this tool serves.'
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
      description: 'The types of business pillars this tool impacts.'
    })
  ],
  preview: {
    select: {
      title: 'title',
      listingType: 'listingType',
      category: 'category.title',
      media: 'logo'
    },
    prepare({ title, listingType, category, media }) {
      return {
        title: title,
        subtitle: `${(listingType || '').toUpperCase()} | ${category || 'No Category'}`,
        media: media
      };
    }
  }
});
