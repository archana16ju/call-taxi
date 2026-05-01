import type { CollectionConfig } from 'payload'

export const TripSharing: CollectionConfig = {
  slug: 'trip-sharing',
  admin: {
    group: 'Fleet Logistics',
    useAsTitle: 'shareToken',
    defaultColumns: ['booking', 'shareToken', 'active', 'expiresAt'],
    components: {
      views: {
        list: {
          Component: '@/app/(payload)/components/TripSharingManagement#default',
        },
      },
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
      name: 'shareToken',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'views',
      type: 'number',
      defaultValue: 0,
    },
  ],
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
}
