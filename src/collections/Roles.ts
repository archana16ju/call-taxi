import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',

  admin: {
    useAsTitle: 'name',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/Roles#default',
        },
      },
    },
  },

  access: {
    read: ({ req }) => {
      const user = req.user

      return user?.role === 'superadmin'
    },

    create: ({ req }) => {
      const user = req.user

      return user?.role === 'superadmin'
    },

    update: ({ req }) => {
      const user = req.user

      return user?.role === 'superadmin'
    },

    delete: ({ req }) => {
      const user = req.user

      return user?.role === 'superadmin'
    },
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'permissions',
      type: 'json',
    },
  ],
}