import type { CollectionConfig } from 'payload'

export const SliderImages: CollectionConfig = {
  slug: 'slider-images',
  admin: {
    group: 'Collection',
    useAsTitle: 'alt',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/SliderManagement#default',
        },
      },
    },
    
  },
  access: {
  read: () => true,

  create: ({ req }) => {
    return ['superadmin', 'admin'].includes(req.user?.role || '')
  },

  update: ({ req }) => {
    return ['superadmin', 'admin'].includes(req.user?.role || '')
  },

  delete: ({ req }) => {
    return req.user?.role === 'superadmin'
  },
},
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
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
