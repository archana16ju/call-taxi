import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Collection',
    useAsTitle: 'email',
    components: {
      views: {
        list: {
          Component: './app/(payload)/components/UserManagement.tsx#default',
        },
        edit: {
          default: {
            Component: './app/(payload)/components/UserCreate.tsx#default',
          },
        },
      },
    },
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Superadmin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Accounts', value: 'accounts' },
        { label: 'Driver', value: 'driver' },
      ],
      defaultValue: 'driver', // Default to least privileged
    },
    {
      name: 'driverProfile',
      type: 'relationship',
      relationTo: 'drivers',
      required: false, // Make true if mandatory for drivers
      hasMany: false, // One-to-one link
      admin: {
        condition: (data) => data.role === 'driver',
        position: 'sidebar',
      },
    },
    {
  name: 'fullName',
  type: 'text',
},
{
  name: 'phone',
  type: 'text',
},
{
  name: 'username',
  type: 'text',
},
{
  name: 'active',
  type: 'checkbox',
  defaultValue: true,
},
  ],
}
