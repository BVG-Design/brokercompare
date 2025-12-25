// sanity/schemas/product.ts
import { defineType, defineField } from 'sanity';

export const productType = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    // Name
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(120),
    }),

    // Description
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Short marketing description for this product.',
      validation: (Rule) => Rule.required().min(10),
    }),

    // Logo / Images
    defineField({
      name: 'images',
      title: 'Logo / Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description: 'Accessibility / SEO description of the image.',
            }),
            defineField({
              name: 'isLogo',
              title: 'Is logo?',
              type: 'boolean',
              description: 'Tick this if this image should be used as the logo.',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error('Add at least one image or logo.'),
    }),

    // Pricing (type + starting price + notes)
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Pricing type',
          type: 'string',
          options: {
            list: [
              { title: 'Free', value: 'free' },
              { title: 'Tiered', value: 'tiered' },
              { title: 'Custom', value: 'custom' },
            ],
            layout: 'radio',
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'startingFrom',
          title: 'Starting price',
          type: 'number',
          description: 'Lowest advertised price (e.g. monthly or per seat).',
        }),
        defineField({
          name: 'notes',
          title: 'Pricing notes',
          type: 'text',
          rows: 3,
          description: 'Extra info (e.g. “Contact sales for enterprise”).',
        }),
      ],
    }),

    // Features (list)
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'One feature per line (e.g. for bullet lists).',
    }),

    // Categories (controlled, from Category table)
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        },
      ],
      description: 'Link this product to one or more predefined categories.',
    }),

    // Tags (optional free-form labels)
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Free-form tags for search and filtering.',
    }),

    // Website URL
    defineField({
      name: 'websiteUrl',
      title: 'Website URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          allowRelative: false,
          scheme: ['http', 'https'],
        }),
    }),

    // Rating (average, number of reviews)
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'object',
      fields: [
        defineField({
          name: 'average',
          title: 'Average rating',
          type: 'number',
          description: 'Average rating score (e.g. 4.5 out of 5).',
          validation: (Rule) => Rule.min(0).max(5),
        }),
        defineField({
          name: 'reviewCount',
          title: 'Number of reviews',
          type: 'number',
          validation: (Rule) => Rule.min(0),
        }),
      ],
    }),
    defineField({
      name: 'integrations',
      title: 'Integrations',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
      description: 'Other products this one integrates with.',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // Relationship to Organisation (Organisation)
    defineField({
      name: 'organisation',
      title: 'Organisation / Owner',
      type: 'reference',
      to: [{ type: 'organisation' }],
      description: 'The organisation or individual that owns this listing.',
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured on Homepage?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featuredLabel',
      title: 'Featured Label',
      type: 'string',
      description: 'Label to show on homepage (e.g. "RECOMMENDED PROVIDER")',
      hidden: ({ document }) => !document?.isFeatured,
    }),
  ]
});
