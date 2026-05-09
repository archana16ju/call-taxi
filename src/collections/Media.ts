import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Collection',
    useAsTitle: 'title',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/MediaLibrary#default',
        },
      },
    },
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-set title from alt if not provided
        if (!data.title && data.alt) {
          data.title = data.alt
        }
        return data
      },
    ],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Drivers', value: 'drivers' },
        { label: 'Vehicles', value: 'vehicles' },
        { label: 'Banners', value: 'banners' },
        { label: 'Sliders', value: 'sliders' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'other',
    },
    {
      name: 'sourceId',
      type: 'text',
      admin: {
        description: 'ID of the linked entity (driver, vehicle, etc.)',
        readOnly: false,
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
  ],
  upload: {
    staticDir: 'media',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
}
