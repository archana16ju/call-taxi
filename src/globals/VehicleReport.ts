import type { GlobalConfig } from 'payload'

export const VehicleReport: GlobalConfig = {
  slug: 'vehicle-report',
  label: 'Vehicle Report',
  admin: {
    group: 'Report',
    components: {
      views: {
        edit: {
          default: {
            Component: '@/payload/admin/components/VehicleReport#default',
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