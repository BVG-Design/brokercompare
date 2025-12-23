import { defineField } from 'sanity'

export const listingFeatureType = {
    name: 'listingFeature',
    title: 'Listing Feature',
    type: 'object',
    fields: [
        defineField({
            name: 'feature',
            title: 'Feature',
            type: 'reference',
            to: [{ type: 'feature' }],
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'availability',
            title: 'Availability',
            type: 'string',
            options: {
                list: [
                    { title: 'Yes', value: 'yes' },
                    { title: 'Partial', value: 'partial' },
                    { title: 'No', value: 'no' }
                ],
                layout: 'radio'
            },
            initialValue: 'yes',
            validation: Rule => Rule.required()
        }),
        defineField({
            name: 'limitationType',
            title: 'Limitation Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Plan Limited', value: 'plan_limited' },
                    { title: 'Add-on Required', value: 'add_on' },
                    { title: 'Role Limited', value: 'role_limited' },
                    { title: 'Usage Limited', value: 'usage_limited' },
                    { title: 'Beta Feature', value: 'beta' }
                ]
            },
            hidden: ({ parent }) => parent?.availability !== 'partial'
        }),
        defineField({
            name: 'notes',
            title: 'Notes',
            type: 'text',
            rows: 2,
            description: 'Explain the partial support or any specific limitations'
        })
    ],
    preview: {
        select: {
            title: 'feature.title',
            availability: 'availability'
        },
        prepare({ title, availability }: { title: string, availability: string }) {
            const status = availability === 'yes' ? '✅' : availability === 'partial' ? '⚠️' : '❌'
            return {
                title: `${status} ${title || 'Unnamed Feature'}`,
            }
        }
    }
}
