import { GlobalConfig } from 'payload'

export const GeneralSettings: GlobalConfig = {
  slug: 'general-settings',
  admin: {
    group: 'Management',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'systemName',
      type: 'text',
      label: 'System Name',
      required: true,
      defaultValue: 'Kani Taxi',
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'WhatsApp Support Number',
      required: true,
      defaultValue: '911234567890',
      admin: {
        description: 'Enter number with country code (e.g. 91xxxxxxxxxx)',
      },
    },
    {
      name: 'supportEmail',
      type: 'text',
      label: 'Support Email',
      defaultValue: 'support@kanitaxi.com',
    },
    {
      name: 'currencySymbol',
      type: 'text',
      defaultValue: '₹',
    },
  ],
}
