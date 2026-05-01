import type { CollectionConfig } from 'payload'

export const TripOtps: CollectionConfig = {
  slug: 'trip-otps',
  admin: {
    group: 'Fleet Logistics',
    useAsTitle: 'otp',
    defaultColumns: ['booking', 'otp', 'expiresAt', 'verified', 'deliveryMethod'],
    components: {
      views: {
        list: {
          Component: '@/app/(payload)/components/OtpManagement#default',
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
      name: 'otp',
      type: 'text',
      required: true,
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'deliveryMethod',
      type: 'select',
      options: ['sms', 'whatsapp', 'email'],
      defaultValue: 'sms',
    },
    {
      name: 'deliveryStatus',
      type: 'select',
      options: ['pending', 'sent', 'failed'],
      defaultValue: 'pending',
    },
  ],
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
}
