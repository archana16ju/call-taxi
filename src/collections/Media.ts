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
      ({ data, req }) => {
        // Auto title from alt
        if (!data.title && data.alt) {
          data.title = data.alt
        }

        // 🧠 AUTO CATEGORY DETECTION
        const text = `${data.title || ''} ${data.alt || ''}`.toLowerCase()

        if (text.includes('driver') || text.includes('person') || text.includes('profile')) {
          data.category = 'drivers'
        } else if (
          text.includes('car') ||
          text.includes('vehicle') ||
          text.includes('truck') ||
          text.includes('bike')
        ) {
          data.category = 'vehicles'
        } else if (text.includes('banner') || text.includes('ad')) {
          data.category = 'banners'
        } else if (text.includes('slider') || text.includes('carousel')) {
          data.category = 'sliders'
        } else {
          data.category = 'other'
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
    staticDir: 'public/media',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'center',
      },
    ],
    adminThumbnail: 'thumbnail',
  },
}
