import type { CollectionConfig } from 'payload'

export const Drivers: CollectionConfig = {
  slug: 'drivers',
  admin: {
    group: 'Collection',
    useAsTitle: 'name',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/DriverManagement#default',
        },
      },
    },
  },
  access: {
  read: ({ req }) => {
    const role = req.user?.role

    if (role === 'superadmin') return true
    if (role === 'admin') return true
    if (role === 'accounts') return true
    if (role === 'driver') return true

    return false
  },

  create: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin' || role === 'admin'
  },

  update: ({ req }) => {
    const role = req.user?.role

    if (role === 'superadmin') return true
    if (role === 'admin') return true
    if (role === 'driver') return true

    return false
  },

  delete: ({ req }) => {
    return req.user?.role === 'superadmin'
  },
},
 fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'phone',
      type: 'text',
    },

   {
  name: 'status',
  type: 'select',

  defaultValue: 'available',

  options: [
    {
      label: 'Available',
      value: 'available',
    },

    {
      label: 'On Duty',
      value: 'onduty',
    },

    {
      label: 'Not Available',
      value: 'not_available',
    },
  ],

  admin: {
    position: 'sidebar',
    readOnly: true,
  },
},

    // DRIVER LIVE LOCATION
    {
      name: 'liveLocation',
      type: 'group',
      fields: [
        {
          name: 'lat',
          type: 'number',
        },
        {
          name: 'lng',
          type: 'number',
        },
        {
          name: 'lastUpdated',
          type: 'date',
        },
      ],
    },

  ],

  hooks: {
  beforeChange: [
    async ({ data }) => {

      // DRIVER HAS ACTIVE RIDE
      if (data.tripActive === true) {
        data.status = 'onduty'
      }

      // DRIVER LOCATION / ENGINE ACTIVE
      else if (data.engineOn === true) {
        data.status = 'available'
      }

      // DRIVER OFFLINE
      else {
        data.status = 'not_available'
      }

      return data
    },
  ],
},
}