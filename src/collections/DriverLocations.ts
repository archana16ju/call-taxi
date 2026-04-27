import { CollectionConfig } from 'payload'

export const DriverLocations: CollectionConfig = {
  slug: 'driver-locations',
  admin: {
    useAsTitle: 'phoneNumber',
    group: 'Fleet Tracking',
    defaultColumns: ['phoneNumber', 'location', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Unique identifier for the driver (Phone Number)',
      },
    },
    {
      name: 'location',
      type: 'point',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'On Trip', value: 'on_trip' },
        { label: 'Offline', value: 'offline' },
      ],
      defaultValue: 'online',
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [({ value }) => new Date().toISOString()],
      },
    },
  ],
}
