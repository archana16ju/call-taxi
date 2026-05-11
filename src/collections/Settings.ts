import type { CollectionConfig } from 'payload'

export const Settings: CollectionConfig = {
  slug: 'settings',

  admin: {
    useAsTitle: 'siteName',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/Settings#default',
        },
      },
    },
    group: 'System',
  },

  access: {
    read: ({ req }) =>
      ['superadmin', 'admin'].includes(req.user?.role || ''),
    create: ({ req }) => req.user?.role === 'superadmin',
    update: ({ req }) =>
      ['superadmin', 'admin'].includes(req.user?.role || ''),
    delete: ({ req }) => req.user?.role === 'superadmin',
  },

  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
    },
    {
      name: 'supportPhone',
      type: 'text',
    },
    {
      name: 'supportEmail',
      type: 'text',
    },
    {
      name: 'whatsappNumber',
      type: 'text',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'INR',
    },
    {
      name: 'bookingEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'maintenanceMode',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'voiceBookingEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'aiChatEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'liveTrackingEnabled',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}