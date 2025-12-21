import { defineField, defineType } from 'sanity'

export const serviceProviderType = defineType({
    name: 'serviceProvider',
    title: 'Service Provider',
    type: 'document',

    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),

        defineField({
            name: 'category',
            title: 'Primary Category',
            type: 'reference',
            to: [{ type: 'category' }],
            validation: (rule) => rule.required(),
            description: 'Primary classification for this service provider',
        }),

        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: { hotspot: true },
        }),

        defineField({
            name: 'tagline',
            title: 'Tagline',
            type: 'string',
        }),

        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),

        defineField({
            name: 'location',
            title: 'Location',
            type: 'string',
        }),

        defineField({
            name: 'website',
            title: 'Website',
            type: 'url',
        }),

        defineField({
            name: 'serviceAreas',
            title: 'Service Areas',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'serviceArea' }] }],
            validation: (rule) => rule.min(1),
            description: 'Capabilities and services offered by this provider',
        }),

        defineField({
            name: 'worksWith',
            title: 'Works With',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'worksWith' }] }],
            description: 'Platforms, tools, CRMs, or systems this provider integrates with',
        }),

        defineField({
            name: 'features',
            title: 'Key Features / Highlights',
            type: 'array',
            of: [{ type: 'string' }],
        }),

        defineField({
            name: 'brokerTypes',
            title: 'Broker Types',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'Mortgage', value: 'Mortgage' },
                    { title: 'Asset Finance', value: 'Asset Finance' },
                    { title: 'Commercial', value: 'Commercial' },
                ],
            },
        }),

        defineField({
            name: 'pricingModel',
            title: 'Pricing Model',
            type: 'string',
            options: {
                list: [
                    { title: 'Fixed', value: 'Fixed' },
                    { title: 'Hourly', value: 'Hourly' },
                    { title: 'Project-based', value: 'Project-based' },
                    { title: 'Retainer', value: 'Retainer' },
                ],
            },
        }),

        defineField({
            name: 'pricingRange',
            title: 'Pricing Range',
            type: 'object',
            fields: [
                defineField({ name: 'min', type: 'number', title: 'Min Price' }),
                defineField({ name: 'max', type: 'number', title: 'Max Price' }),
            ],
        }),

        defineField({
            name: 'badges',
            title: 'Badges',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Internal or marketing badges (e.g. Partner, Verified)',
        }),

        defineField({
            name: 'availability',
            title: 'Availability',
            type: 'string',
        }),

        defineField({
            name: 'reviews',
            title: 'Reviews',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({ name: 'author', type: 'string', title: 'Author' }),
                        defineField({ name: 'avatar', type: 'image', title: 'Avatar' }),
                        defineField({
                            name: 'rating',
                            type: 'number',
                            title: 'Rating',
                            validation: (rule) => rule.min(1).max(5),
                        }),
                        defineField({ name: 'comment', type: 'text', title: 'Comment' }),
                        defineField({ name: 'date', type: 'date', title: 'Date' }),
                        defineField({ name: 'verified', type: 'boolean', title: 'Verified' }),
                    ],
                },
            ],
        }),

        defineField({
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }],
        }),

        defineField({
            name: 'editorNotes',
            title: 'Editor Notes',
            type: 'text',
            description: 'Internal notes – not public',
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
            description: 'Label to show on homepage (e.g. "PARTNER SERVICE")',
            hidden: ({ document }) => !document?.isFeatured,
        }),
    ],
})
