import { defineType, defineField } from 'sanity'

export const organisationType = defineType({
  name: 'organisation',
  title: 'Organisation',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Vendor Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'website',
      title: 'Website',
      type: 'url',
    }),

    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'organisationType',
      title: 'Organisation Type',
      type: 'string',
      options: {
        list: [
          { title: 'Software Company', value: 'software' },
          { title: 'Service Provider', value: 'service' },
          { title: 'Marketplace', value: 'marketplace' },
          { title: 'Consultancy', value: 'consultancy' },
          { title: 'Individual / Founder', value: 'individual' },
        ],
        layout: 'radio',
      },
    }),
  ],
})
