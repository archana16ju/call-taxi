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
    read: () => true,
  },
}
