import { CollectionConfig } from 'payload'

export const DriverAllocation: CollectionConfig = {
  slug: 'driver-allocation',

  admin: {
    useAsTitle: 'booking',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/DriverAllocationManagement#default',
        },
      },
    },
    defaultColumns: ['booking', 'driver', 'status', 'createdAt'],
  },

  access: {
  read: ({ req }) => {
    const role = req.user?.role

    if (role === 'superadmin') return true
    if (role === 'admin') return true
    if (role === 'accounts') return true
    if (role === 'driver') return true

    return false
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
      name: 'driver',
      type: 'relationship',
      relationTo: 'drivers',
    },

    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Assigned', value: 'assigned' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Timeout', value: 'timeout' },
        { label: 'Reallocated', value: 'reallocated' },
      ],
    },

    {
      name: 'allocationType',
      type: 'select',
      defaultValue: 'auto',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: 'Manual', value: 'manual' },
      ],
    },

    {
      name: 'distanceKm',
      type: 'number',
      admin: {
        description: 'Distance between driver and pickup',
      },
    },

    {
      name: 'estimatedArrivalTime',
      type: 'number',
      admin: {
        description: 'ETA in minutes',
      },
    },

    {
      name: 'attempts',
      type: 'number',
      defaultValue: 1,
    },

    {
      name: 'reallocationHistory',
      type: 'array',
      fields: [
        {
          name: 'previousDriver',
          type: 'relationship',
          relationTo: 'drivers',
        },
        {
          name: 'reason',
          type: 'text',
        },
        {
          name: 'timestamp',
          type: 'date',
          defaultValue: () => new Date(),
        },
      ],
    },

    {
      name: 'logs',
      type: 'array',
      fields: [
        {
          name: 'message',
          type: 'text',
        },
        {
          name: 'timestamp',
          type: 'date',
          defaultValue: () => new Date(),
        },
      ],
    },
  ],

  timestamps: true,
}
