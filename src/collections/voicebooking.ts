import type { CollectionConfig } from 'payload'

export const VoiceBooking: CollectionConfig = {
  slug: 'voice-bookings',
  admin: {
    useAsTitle: 'bookingId',
    group: 'Fleet Logistics',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/voicebooking#default',
        },
      },
    },
  },
  access: {
  read: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin' || role === 'accounts'
  },

  create: ({ req }) => {
    return true // public voice booking allowed
  },

  update: ({ req }) => {
    return req.user?.role === 'superadmin' || req.user?.role === 'admin'
  },

  delete: ({ req }) => {
    return req.user?.role === 'superadmin'
  },
},
  fields: [
    {
      name: 'bookingId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Pending', value: 'pending' },
        { label: 'Flagged', value: 'flagged' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'transcript',
      type: 'textarea',
      required: true,
    },
    {
      name: 'pickup',
      type: 'group',
      fields: [
        { name: 'address', type: 'text', required: true },
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    {
      name: 'dropoff',
      type: 'group',
      fields: [
        { name: 'address', type: 'text', required: true },
        { name: 'lat', type: 'number' },
        { name: 'lng', type: 'number' },
      ],
    },
    {
      name: 'fare',
      type: 'group',
      fields: [
        { name: 'amount', type: 'number', defaultValue: 0 },
        { name: 'currency', type: 'text', defaultValue: 'GBP' },
      ],
    },
    {
      name: 'driver',
      type: 'group',
      fields: [
        { name: 'id', type: 'text' },
        { name: 'name', type: 'text', defaultValue: 'Unassigned' },
        { name: 'phone', type: 'text' },
        { name: 'vehicle', type: 'text' },
      ],
    },
    {
      name: 'passenger',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      name: 'allocatedTime',
      type: 'text',
    },
    {
      name: 'estimatedArrival',
      type: 'text',
    },
    {
      name: 'ai',
      type: 'group',
      fields: [
        { name: 'confidence', type: 'number', defaultValue: 0 },
        { name: 'voiceProvider', type: 'text', defaultValue: 'Google Text-to-Speech' },
        { name: 'speechToText', type: 'text', defaultValue: 'OpenAI Whisper' },
      ],
    },
    {
      name: 'bookingType',
      type: 'select',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Premium', value: 'premium' },
        { label: 'Luxury', value: 'luxury' },
      ],
      defaultValue: 'standard',
    },
  ],
}

export default VoiceBooking