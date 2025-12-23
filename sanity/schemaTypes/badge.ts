import { defineType, defineField } from 'sanity'

export const badgeType = defineType({
    name: 'badge',
    title: 'Badge',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Badge Title',
            type: 'string',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title' }
        }),

        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'What this badge represents and why it is awarded'
        }),

        defineField({
            name: 'badgeType',
            title: 'Badge Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Editorial', value: 'editorial' },
                    { title: 'Commercial', value: 'commercial' },
                    { title: 'Status', value: 'status' }
                ]
            }
        }),

        defineField({
            name: 'color',
            title: 'Badge Color',
            type: 'string',
            options: {
                list: [
                    { title: 'Gold', value: 'gold' },
                    { title: 'Purple', value: 'purple' },
                    { title: 'Pink', value: 'pink' },
                    { title: 'Green', value: 'green' },
                    { title: 'Blue', value: 'blue' },
                    { title: 'Orange', value: 'orange' },
                    { title: 'Grey', value: 'grey' }
                ]
            }
        }),

        defineField({
            name: 'icon',
            title: 'Icon',
            type: 'image',
            options: { hotspot: true }
        }),

        defineField({
            name: 'priority',
            title: 'Display Priority',
            type: 'number',
            description: 'Lower number = higher priority in UI'
        })
    ],
    preview: {
        select: {
            title: 'title',
            badgeType: 'badgeType',
            media: 'icon'
        },
        prepare({ title, badgeType, media }) {
            return {
                title,
                subtitle: badgeType?.toUpperCase(),
                media
            }
        }
    }
})
