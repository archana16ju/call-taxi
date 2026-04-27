import type { CollectionConfig } from 'payload'

export const Drivers: CollectionConfig = {
  slug: 'drivers',
  admin: {
    group: 'Collection',
    useAsTitle: 'name',
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
      name: 'address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'experience',
      type: 'number',
      required: true,
      admin: {
        description: 'Years of driving experience',
      },
    },
    {
      name: 'aadharNo',
      type: 'text',
      required: false,
    },
    {
      name: 'panNo',
      type: 'text',
      required: false,
    },
    {
      name: 'license',
      type: 'text',
      required: false,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Driver photo',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Not Available', value: 'not_available' },
        { label: 'Driving', value: 'driving' },
      ],
      defaultValue: 'available',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'location',
      type: 'point',
      label: 'Live Location',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'assignedVehicle',
      type: 'relationship',
      relationTo: 'vehicles',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
      required: false,
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        // If location is being updated, set the lastUpdated timestamp
        if (data.location) {
          data.lastUpdated = new Date().toISOString()
        }
        return data
      },
    ],
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: ({ req: { user } }) => user?.role === 'superadmin',
  },
}
