import { defineField, defineType } from 'sanity'

export const subCategoryType = defineType({
    name: 'subCategory',
    title: 'Sub Category',
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
            description: 'Standard definition of this sub category for comparison tables'
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
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'category' }] }],
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
