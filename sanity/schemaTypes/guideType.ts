import { defineField, defineType } from 'sanity'

export const guideType = defineType({
    name: 'guide',
    title: 'Activities',
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
            name: 'summary',
            title: 'Summary',
            type: 'text',
            description: 'A brief description of what this task/guide covers.'
        }),
        defineField({
            name: 'journeyStage',
            title: 'Journey Stage',
            type: 'reference',
            to: [{ type: 'journeyStage' }],
            description: 'The stage of the broker journey this task belongs to.'
        }),
        defineField({
            name: 'journeyAssociations',
            title: 'Journey Associations',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
                list: [
                    { title: 'People', value: 'people' },
                    { title: 'Tools', value: 'tools' },
                    { title: 'Processes', value: 'processes' },
                ]
            }
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [{ type: 'block' }]
        }),
        defineField({
            name: 'relatedLinks',
            title: 'Related Links',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'title', type: 'string' },
                        { name: 'url', type: 'url' }
                    ]
                }
            ]
        })
    ]
})
