import { defineField, defineType } from 'sanity'

export const softwareListingType = defineType({
    name: 'softwareListing',
    title: 'Software Listing',
    type: 'document',
    fields: [
        // Basic Info
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'badge',
            title: 'Badges',
            type: 'array',
            of: [{ type: 'string' }]
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'name', maxLength: 96 }
        }),

        defineField({ name: 'tagline', title: 'Tagline', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text' }),

        // Categorisation
        defineField({ name: 'category', title: 'Category', type: 'string' }),

        defineField({ name: 'websiteURL', title: 'Website URL', type: 'url' }),

        defineField({
            name: 'serviceArea',
            title: 'Service Areas',
            type: 'array',
            of: [{ type: 'string' }]
        }),

        defineField({
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [{ type: 'string' }]
        }),

        // Pricing
        defineField({ name: 'pricing_model', title: 'Pricing Model', type: 'string' }),
        defineField({ name: 'pricing_rangeMin', title: 'Min Price', type: 'number' }),
        defineField({ name: 'pricing_rangeMax', title: 'Max Price', type: 'number' }),
        defineField({ name: 'pricing_notes', title: 'Pricing Notes', type: 'text' }),

        // Works With
        defineField({
            name: 'worksWith',
            title: 'Works With',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'worksWith' }] }]
        }),

        // Images
        defineField({
            name: 'image1',
            title: 'Primary Image',
            type: 'image',
            options: { hotspot: true }
        }),

        defineField({ name: 'image1_alt', title: 'Image Alt', type: 'string' }),
        defineField({ name: 'image1_isLogo', title: 'Is Logo?', type: 'boolean' }),

        // Broker Type
        defineField({
            name: 'brokerType',
            title: 'Broker Types',
            type: 'array',
            of: [{ type: 'string' }]
        }),

        // Editor Block
        defineField({
            name: 'editor',
            title: 'Editor Information',
            type: 'object',
            fields: [
                defineField({
                    name: 'author',
                    title: 'Author',
                    type: 'reference',
                    to: [{ type: 'author' }]
                }),
                defineField({
                    name: 'notes',
                    title: 'Editor Notes',
                    type: 'text'
                }),
                defineField({
                    name: 'updatedAt',
                    title: 'Last Updated',
                    type: 'datetime',
                    initialValue: () => new Date().toISOString()
                })
            ]
        })
    ]
})
