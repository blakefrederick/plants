import {LeafIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/**
 * Plant schema.
 */

export const plant = defineType({
  name: 'plant',
  title: 'Plant',
  icon: LeafIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Plant Name',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'scientificName',
      title: 'Scientific Name',
      type: 'string',
      description: 'Latin botanical name (e.g., Monstera deliciosa)',
      validation: (rule) => rule.max(150),
    }),
    defineField({
      name: 'commonNames',
      title: 'Common Names',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Alternative names for this plant',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional description of the image',
            }),
          ],
        },
      ],
      validation: (rule) => rule.max(10),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      description: 'Rich text description of the plant',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Houseplant', value: 'houseplant'},
          {title: 'Tree', value: 'tree'},
          {title: 'Shrub', value: 'shrub'},
          {title: 'Flower', value: 'flower'},
          {title: 'Succulent', value: 'succulent'},
          {title: 'Herb', value: 'herb'},
          {title: 'Fern', value: 'fern'},
          {title: 'Grass', value: 'grass'},
          {title: 'Vine', value: 'vine'},
          {title: 'Aquatic', value: 'aquatic'},
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'careLevel',
      title: 'Care Level',
      type: 'string',
      options: {
        list: [
          {title: 'Beginner', value: 'beginner'},
          {title: 'Intermediate', value: 'intermediate'},
          {title: 'Advanced', value: 'advanced'},
          {title: 'Expert', value: 'expert'},
        ],
        layout: 'radio',
      },
      initialValue: 'beginner',
    }),
    defineField({
      name: 'lightRequirements',
      title: 'Light Requirements',
      type: 'string',
      options: {
        list: [
          {title: 'Low Light', value: 'low'},
          {title: 'Medium Light', value: 'medium'},
          {title: 'Bright Indirect', value: 'bright-indirect'},
          {title: 'Direct Sun', value: 'direct-sun'},
          {title: 'Full Sun', value: 'full-sun'},
        ],
      },
    }),
    defineField({
      name: 'wateringFrequency',
      title: 'Watering Frequency',
      type: 'string',
      options: {
        list: [
          {title: 'Daily', value: 'daily'},
          {title: 'Every few days', value: 'few-days'},
          {title: 'Weekly', value: 'weekly'},
          {title: 'Bi-weekly', value: 'bi-weekly'},
          {title: 'Monthly', value: 'monthly'},
          {title: 'Rarely', value: 'rarely'},
        ],
      },
    }),
    defineField({
      name: 'mature Size',
      title: 'Mature Size',
      type: 'object',
      fields: [
        defineField({
          name: 'height',
          title: 'Height (cm)',
          type: 'number',
          validation: (rule) => rule.positive(),
        }),
        defineField({
          name: 'width',
          title: 'Width (cm)',
          type: 'number',
          validation: (rule) => rule.positive(),
        }),
      ],
    }),
    defineField({
      name: 'isIndoor',
      title: 'Suitable for Indoors',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'isOutdoor',
      title: 'Suitable for Outdoors',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'toxicity',
      title: 'Toxicity',
      type: 'object',
      fields: [
        defineField({
          name: 'isPetSafe',
          title: 'Pet Safe',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'isChildSafe',
          title: 'Child Safe',
          type: 'boolean',
          initialValue: true,
        }),
        defineField({
          name: 'toxicityNotes',
          title: 'Toxicity Notes',
          type: 'text',
          description: 'Details about any toxicity concerns',
        }),
      ],
    }),
    defineField({
      name: 'season',
      title: 'Growing Season',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Spring', value: 'spring'},
          {title: 'Summer', value: 'summer'},
          {title: 'Fall', value: 'fall'},
          {title: 'Winter', value: 'winter'},
        ],
      },
    }),
    defineField({
      name: 'price',
      title: 'Price (CAD)',
      type: 'number',
      validation: (rule) => rule.positive(),
    }),
    defineField({
      name: 'availability',
      title: 'Availability',
      type: 'boolean',
      description: 'Is this plant currently available?',
      initialValue: true,
    }),
    defineField({
      name: 'location',
      title: 'Location Found',
      type: 'geopoint',
      description: 'Where this plant was photographed or found in Metro Vancouver',
    }),
    defineField({
      name: 'dateAdded',
      title: 'Date Added',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'scientificName',
      media: 'images.0',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title: title,
        subtitle: subtitle ? `(${subtitle})` : '',
        media: media,
      }
    },
  },
})