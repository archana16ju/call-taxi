import { CollectionConfig } from 'payload'

export const Alerts: CollectionConfig = {
  slug: 'alerts',
  admin: {
    useAsTitle: 'title',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/AlertPage#default',
        },
      },
    },
    group: 'Collection',
    defaultColumns: ['title', 'type', 'triggeredBy', 'createdAt'],
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

    if (role === 'superadmin') return true
    if (role === 'admin') return true

    return false
  },

  update: ({ req }) => {
    const role = req.user?.role

    if (role === 'superadmin') return true
    if (role === 'admin') return true

    return false
  },

  delete: ({ req }) => {
    return req.user?.role === 'superadmin'
  },
},
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Information', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Emergency (SOS)', value: 'emergency' },
        { label: 'Payment Failure', value: 'payment_fail' },
        { label: 'Booking', value: 'booking' },
      ],
      defaultValue: 'info',
    },
    {
      name: 'triggeredBy',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'isRead',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
