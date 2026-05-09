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
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  upload: {
  staticDir: 'slider-images',
  mimeTypes: ['image/*'],
},
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
