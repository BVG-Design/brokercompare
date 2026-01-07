import { defineField, defineType } from 'sanity'

export const videoEmbedType = defineType({
    name: 'videoEmbed',
    title: 'Video Embed',
    type: 'object',
    fields: [
        defineField({
            name: 'platform',
            title: 'Platform',
            type: 'string',
            options: {
                list: [
                    { title: 'YouTube', value: 'youtube' },
                    { title: 'Vimeo', value: 'vimeo' },
                    { title: 'Spotify Video', value: 'spotify' },
                    { title: 'Other', value: 'other' },
                ],
                layout: 'radio',
            },
        }),
        defineField({
            name: 'url',
            title: 'Video URL',
            type: 'url',
            validation: Rule => Rule.uri({ scheme: ['https', 'http'] }),
        }),
        defineField({
            name: 'videoId',
            title: 'Video ID (optional)',
            type: 'string',
        }),
    ],
})
