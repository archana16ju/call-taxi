import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  admin: {
    group: 'Collection',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/UserManagement#default',
        },
        edit: {
          default: {
            Component: '@/payload/admin/components/UserCreate#default',
          },
        },
      },
    },
  },

  auth: {
    loginWithUsername: true,
  },

 access: {
  read: ({ req }) => {
    const role = req.user?.role

    if (role === 'superadmin') return true
    if (role === 'admin') return true
    if (role === 'accounts') return true
    if (role === 'driver') return true // later restrict to own record if needed

    return false
  },

  create: ({ req }) => {
    const role = req.user?.role

    if (role === 'superadmin') return true
    if (role === 'admin') return true

    return false
  },

  update: ({ req }) => {
    const role = req.user?.role

    if (role === 'superadmin') return true
    if (role === 'admin') return true
    if (role === 'driver') return true // own profile assumed

    return false
  },

  delete: ({ req }) => {
    const role = req.user?.role

    return role === 'superadmin'
  },
},

  fields: [
    {
      name: 'username',
      type: 'text',
      required: true,
      unique: true,
    },

    {
      name: 'email',
      type: 'email',
    },

    {
      name: 'password',
      type: 'text',
    },

    {
      name: 'fullName', // ✅ ADD
      type: 'text',
    },

    {
      name: 'phoneNumber', // ✅ ADD
      type: 'text',
    },

    {
      name: 'active', // ✅ ADD
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Superadmin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Accounts', value: 'accounts' },
        { label: 'Driver', value: 'driver' },
      ],
    },

    {
      name: 'driverProfile', // ✅ ADD
      type: 'relationship',
      relationTo: 'drivers', // make sure you have this collection
      required: false,
    },
  ],
}
