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
      return req.user?.role === 'superadmin'
    },

    create: ({ req }) => {
      return req.user?.role === 'superadmin'
    },

    update: ({ req }) => {
      return req.user?.role === 'superadmin'
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
      unique: true,
    },

    {
      name: 'permissions',
      type: 'json',
      required: true,
    },

    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}