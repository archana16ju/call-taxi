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
            Component: '@/payload/admin/components/PaymentSettingsComponent#default',
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
    read: ({ req }) => {
      const role = req.user?.role

      return role === 'superadmin' || role === 'admin' || role === 'accounts'
    },

    update: ({ req }) => {
      const role = req.user?.role

      return role === 'superadmin' || role === 'admin'
    },
  },
}
