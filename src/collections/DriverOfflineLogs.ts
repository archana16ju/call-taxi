import type { CollectionConfig } from 'payload'

export const DriverOfflineLogs: CollectionConfig = {
  slug: 'driver-offline-logs',
  admin: {
    group: 'Fleet Logistics',
    useAsTitle: 'id',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/OfflineDriverDashboard#default',
        },
      },
    },
    defaultColumns: ['driver', 'trip', 'syncedAt', 'batchSize'],
  },
  fields: [
    {
      name: 'driver',
      type: 'relationship',
      relationTo: 'drivers',
      required: true,
    },
    {
      name: 'trip',
      type: 'relationship',
      relationTo: 'bookings',
      required: false,
    },
    {
      name: 'offlineCoordinates',
      type: 'array',
      fields: [
        { name: 'location', type: 'point', required: true },
        { name: 'timestamp', type: 'date', required: true },
        { name: 'speed', type: 'number' },
      ],
    },
    {
      name: 'syncedAt',
      type: 'date',
    },
    {
      name: 'batchSize',
      type: 'number',
    },
  ],
  access: {
  read: ({ req }) => {
    const role = req.user?.role

    return ['superadmin', 'admin', 'accounts', 'driver'].includes(role || '')
  },

  create: ({ req }) => {
    const role = req.user?.role

    return role === 'driver' || role === 'superadmin' || role === 'admin'
  },

  update: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin'
  },

  delete: ({ req }) => {
    return req.user?.role === 'superadmin'
  },
},
}
