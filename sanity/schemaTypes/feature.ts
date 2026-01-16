import { defineField, defineType } from 'sanity'

export const featureType = defineType({
    name: 'feature',
    title: 'Feature',
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
            name: 'description',
            title: 'Neutral Description',
            type: 'text',
            description: 'Standard definition of this feature for comparison tables'
        }),
        defineField({
            name: 'featureCategory',
            title: 'Feature Category',
            type: 'reference',
            to: [{ type: 'featureCategory' }],
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'subCategories',
            title: 'Sub Categories',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'subCategory' }] }],
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'synonyms',
            title: 'Synonyms / Related Keywords',
            type: 'array',
            of: [{ type: 'string' }],
            description: 'Optional keywords for search and AI reasoning context'
        })
    ]
})
