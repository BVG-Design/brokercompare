import { defineField, defineType } from 'sanity'

export const listingType = defineType({
    name: 'listingType',
    title: 'Listing Type',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'value',
            title: 'Value',
            type: 'string',
            description: 'The machine-readable value (e.g., "software", "service")',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text'
        })
    ]
})
