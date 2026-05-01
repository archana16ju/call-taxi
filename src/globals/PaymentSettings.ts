import type { GlobalConfig } from 'payload'

export const PaymentSettings: GlobalConfig = {
  slug: 'payment-settings',
  label: 'Payment Settings',
  admin: {
    group: 'Settings',
     components: {
      views: {
        edit: {
          default: {
            Component: '@/app/(payload)/components/PaymentSettingsComponent#default',
          },
        },
      },
    },
  },
  fields: [
    {
      name: 'minimumPayment',
      label: 'Minimum Payment (₹)',
      type: 'number',
      min: 0,
      defaultValue: 500,
      admin: {
        description: 'Minimum amount required to confirm a booking.',
      },
    },
  ],
  access: {
    read: () => true,
    update: () => true,
  },
}
