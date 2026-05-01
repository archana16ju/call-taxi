import type { CollectionConfig } from 'payload'

export const Tariffs: CollectionConfig = {
  slug: 'tariffs',

  admin: {
    group: 'Collection',
    useAsTitle: 'name',
    components: {
      views: {
        list: {
          Component: '@/app/(payload)/components/TariffManagement#default',
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
      name: 'description',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Draft', value: 'draft' },
        { label: 'Pending Review', value: 'pending_review' },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'vehicleType',
      type: 'relationship',
      relationTo: 'vehicles',
      required: true,
    },
    {
      type: 'group',
      name: 'oneway',
      label: 'One Way Trip',
      fields: [
        { name: 'perKmRate', type: 'number', required: true },
        { name: 'bata', type: 'number', required: true },
        { name: 'minDistance', type: 'number', defaultValue: 130, required: true },
        { name: 'extras', type: 'number', defaultValue: 0 },
      ],
    },
    {
      type: 'group',
      name: 'roundtrip',
      label: 'Round Trip',
      fields: [
        { name: 'perKmRate', type: 'number', required: true },
        { name: 'bata', type: 'number', required: true },
        { name: 'minDistance', type: 'number', defaultValue: 250, required: true },
        { name: 'extras', type: 'number', defaultValue: 0 },
      ],
    },
    {
      type: 'group',
      name: 'packages',
      label: 'Packages',
      fields: [
        { name: 'hours', type: 'number', required: true },
        { name: 'km', type: 'number', required: true },
        { name: 'baseRate', type: 'number', required: true },
        { name: 'baseBata', type: 'number', required: true },
        { name: 'extraKmRate', type: 'number', required: true },
        { name: 'extraHourRate', type: 'number', required: true },
        { name: 'nightBata', type: 'number', defaultValue: 0 },
        { name: 'otherExtras', type: 'number', defaultValue: 0 },
      ],
    },
  ],

  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'superadmin',
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'superadmin',
    delete: ({ req: { user } }) => user?.role === 'superadmin',
  },
}
