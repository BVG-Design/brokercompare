import { defineField, defineType } from 'sanity';

export const journeyStageType = defineType({
    name: 'journeyStage',
    title: 'Journey Stage',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) => Rule.required(),
            description: 'e.g., Pre-Start, Client Acquisition, Ninja-Mode',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'position',
            title: 'Position',
            type: 'number',
            description: 'Used for ordering the stages in the journey (1, 2, 3...)',
            validation: (Rule) => Rule.required().min(1),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            description: 'Briefly describe what this stage entails for a broker.',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            position: 'position',
        },
        prepare({ title, position }) {
            return {
                title: `${position}. ${title}`,
            };
        },
    },
});
