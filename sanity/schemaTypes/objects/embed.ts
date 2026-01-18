import { defineType, defineField } from 'sanity'

export const embed = defineType({
    name: 'embed',
    title: 'Embed',
    type: 'object',
    fields: [
        defineField({
            name: 'url',
            title: 'Embed URL',
            type: 'url',
            description:
                'Paste the embed URL (YouTube, Vimeo, Spotify, Loom, Calendly, etc.)',
            validation: Rule => Rule.required()
        }),

        defineField({
            name: 'height',
            title: 'Height (px)',
            type: 'number',
            initialValue: 400
        })
    ],
    preview: {
        select: { url: 'url' },
        prepare({ url }) {
            return {
                title: 'Embedded content',
                subtitle: url
            }
        }
    }
})
