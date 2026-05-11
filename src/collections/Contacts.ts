import { CollectionConfig } from 'payload'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'inquiryType', 'status', 'createdAt'],
    group: 'Collection',
    description: 'Manage customer, partner, and driver inquiries.',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/InquiryManager#default',
        },
      },
    },
  },
  access: {
  read: ({ req }) => {
    const role = req.user?.role

    return ['superadmin', 'admin', 'accounts'].includes(role || '')
  },

  create: ({ req }) => {
    // public form submissions allowed (no auth required usually)
    return true
  },

  update: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin' || role === 'accounts'
  },

  delete: ({ req }) => {
    return req.user?.role === 'superadmin'
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
    },
    {
      name: 'inquiryType',
      type: 'select',
      required: true,
      options: [
        { label: 'Service Request', value: 'service' },
        { label: 'Billing Inquiry', value: 'billing' },
        { label: 'Partnership', value: 'partnership' },
        { label: 'Emergency', value: 'emergency' },
      ],
      defaultValue: 'service',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Pending', value: 'pending' },
        { label: 'Resolved', value: 'resolved' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },
  ],
}
