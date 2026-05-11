import { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'rating',
     components: {
      views: {
        list: {
          Component: '@/payload/admin/components/review#default',
        },
      },
    },
    group: 'Collection',
    defaultColumns: ['rating', 'booking', 'user', 'createdAt'],
  },
  access: {
  read: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin' || role === 'accounts' || role === 'driver'
  },

  create: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin'
  },

  update: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin'
  },

  delete: ({ req }) => {
    return req.user?.role === 'superadmin'
  },
},
  fields: [
    {
      name: 'booking',
      type: 'relationship',
      relationTo: 'bookings',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'rating',
      type: 'number',
      min: 1,
      max: 5,
      required: true,
      admin: {
        description: 'Star rating from 1 to 5',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
    },
  ],
}
