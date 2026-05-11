import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    group: 'Collection',
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'email'],
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/CustomerManagement#default',
        },
      },
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      unique: true, // Ensuring unique customers by phone
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'accountType',
      type: 'select',
      options: [
        { label: 'Individual', value: 'individual' },
        { label: 'Corporate', value: 'corporate' }
      ],
      defaultValue: 'individual',
    },
    {
      name: 'bookings',
      type: 'join',
      collection: 'bookings',
      on: 'customer',
    },
  ],
  access: {
  read: ({ req }) => {
    const role = req.user?.role

    if (role === 'superadmin') return true
    if (role === 'admin') return true
    if (role === 'accounts') return true

    return false
  },

  create: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin'
  },

  update: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin' || role === 'accounts'
  },

  delete: ({ req }) => {
    return req.user?.role === 'superadmin'
  },
},
}
