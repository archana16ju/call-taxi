import type { CollectionConfig } from 'payload'

export const TripSharing: CollectionConfig = {
  slug: 'trip-sharing',
  admin: {
    group: 'Fleet Logistics',
    useAsTitle: 'shareToken',
    defaultColumns: ['booking', 'shareToken', 'active', 'expiresAt'],
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/TripSharingManagement#default',
        },
      },
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
      name: 'shareToken',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
    },
  ],
  access: {
  read: ({ req }) => {
    const role = req.user?.role

    return ['superadmin', 'admin', 'accounts', 'driver'].includes(role || '')
  },

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
}
