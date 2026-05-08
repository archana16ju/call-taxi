import { GlobalConfig } from 'payload'

export const GeneralSettings: GlobalConfig = {
  slug: 'general-settings',
  admin: {
    components: {
      views: {
        edit: {
          default: {
            Component: '@/payload/admin/components/GeneralSettings#default',
          },
        },
      },
    },
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
    {
      name: 'whatsappConfig',
      type: 'group',
      label: 'Automated Messaging (WhatsApp API)',
      fields: [
        {
          name: 'apiEndpoint',
          type: 'text',
          label: 'API Endpoint URL',
          admin: {
            description: 'The endpoint for your custom WhatsApp API',
          },
        },
        {
          name: 'apiKey',
          type: 'text',
          label: 'API Key / Token',
          admin: {
            description: 'Authentication key for the API',
          },
        },
        {
          name: 'messageTemplate',
          type: 'textarea',
          label: 'Trip Started Message Template',
          defaultValue: 'Hello {name}, your ride has started! Track your live location here: {link}',
          admin: {
            description: 'Use {name} and {link} as placeholders',
          },
        },
      ],
    },
  ],
}
