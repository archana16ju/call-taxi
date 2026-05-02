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
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
}
