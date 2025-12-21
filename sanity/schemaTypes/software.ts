import { defineField, defineType } from 'sanity'

export const softwareType = defineType({
    name: 'software',
    title: 'Software',
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
            name: 'tagline',
            title: 'Tagline',
            type: 'string'
        }),

        defineField({
            name: 'category',
            title: 'Category',
            type: 'string'
        }),

        defineField({
            name: 'websiteURL',
            title: 'Website URL',
            type: 'url'
        }),

        defineField({
            name: 'serviceArea',
            title: 'Service Areas',
            type: 'array',
            of: [{ type: 'string' }]
        }),

        defineField({
            name: 'description',
            title: 'Description',
            type: 'text'
        }),

        defineField({
            name: 'pricing_model',
            title: 'Pricing Model',
            type: 'string'
        }),

        defineField({
            name: 'image1_alt',
            title: 'Image Alt Text',
            type: 'string'
        }),

        defineField({
            name: 'image1_isLogo',
            title: 'Is Image a Logo?',
            type: 'boolean',
            initialValue: false
        }),

        defineField({
            name: 'brokerType',
            title: 'Broker Types',
            type: 'array',
            of: [{ type: 'string' }]
        }),

        defineField({
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        {
                            name: 'name',
                            title: 'Feature name',
                            type: 'string',
                            validation: r => r.required()
                        },
                        {
                            name: 'description',
                            title: 'Description',
                            type: 'text'
                        },
                        {
                            name: 'featureType',
                            title: 'Feature type',
                            type: 'string',
                            options: {
                                list: [
                                    { title: 'Core', value: 'core' },
                                    { title: 'Automation', value: 'automation' },
                                    { title: 'AI', value: 'ai' },
                                    { title: 'Compliance', value: 'compliance' },
                                    { title: 'Reporting', value: 'reporting' },
                                    { title: 'Integration', value: 'integration' },
                                    { title: 'UX / Productivity', value: 'ux' }
                                ]
                            }
                        },
                        {
                            name: 'isKeyFeature',
                            title: 'Key feature',
                            type: 'boolean',
                            initialValue: false
                        }
                    ]
                }
            ]
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
            description: 'Optional related keywords used for SEO, tagging, and AI context.'
        }),

    ]
})