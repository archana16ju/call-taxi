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
    read: () => true,
  },
}