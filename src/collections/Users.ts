import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',

  admin: {
    group: 'Collection',
    components: {
      views: {
        list: {
          Component: '../app/(payload)/components/UserManagement#default',
        },
        edit: {
          default: {
            Component: '../app/(payload)/components/UserCreate#default',
          },
        },
      },
    },
  },

  auth: {
    loginWithUsername: true,
  },

  access: {
    update: () => true,
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
