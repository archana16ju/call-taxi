import type { CollectionConfig } from 'payload'

export const SliderImages: CollectionConfig = {
  slug: 'slider-images',
  upload: true,
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
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
