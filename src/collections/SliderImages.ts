import type { CollectionConfig } from 'payload'

export const SliderImages: CollectionConfig = {
  slug: 'slider-images',
  upload: true,
  admin: {
    group: 'Collection',
    useAsTitle: 'alt',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
