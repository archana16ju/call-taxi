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
          Component: '@/app/(payload)/components/InquiryManager#default',
        },
      },
    },
  },
  access: {
    create: () => true,
    read: () => true,
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
