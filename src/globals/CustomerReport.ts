import type { GlobalConfig } from 'payload'

export const CustomerReport: GlobalConfig = {
  slug: 'customer-report',
  label: 'Customer Report',
  admin: {
    group: 'Report',
    components: {
      views: {
        edit: {
          default: {
            Component: '@/payload/admin/components/CustomerReport#default',
          },
        },
      },
    },
  },
  fields: [],
  access: {
  read: ({ req }) => {
    const role = req.user?.role

    if (!role) return false

    if (role === 'superadmin') return true
    if (role === 'admin') return true
    if (role === 'accounts') return true

    return false
  },
},
}
