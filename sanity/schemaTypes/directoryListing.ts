import { defineField, defineType } from 'sanity'

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
            validation: (rule) => rule.required(),
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
            of: [{ type: 'reference', to: [{ type: 'worksWith' }] }]
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
                subtitle: `${listingType.toUpperCase()} | ${category || 'No Category'}`,
                media: media
            }
        }
    }
})
