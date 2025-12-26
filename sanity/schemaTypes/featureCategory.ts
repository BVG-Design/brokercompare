import { defineField, defineType } from 'sanity'

export const featureCategoryType = defineType({
    name: 'featureCategory',
    title: 'Feature Category',
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
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Used for sorting categories in comparison tables'
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text'
        })
    ]
})
