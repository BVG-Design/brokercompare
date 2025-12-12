import { defineField, defineType } from 'sanity'

export const worksWithType = defineType({
    name: 'worksWith',
    title: 'Works With',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'websiteUrl',
            title: 'Website URL',
            type: 'url',
        }),
        defineField({
            name: 'logo',
            title: 'Logo',
            type: 'image',
            options: { hotspot: true },
        }),
    ],
})
