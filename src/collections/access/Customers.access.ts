import { can } from '@/access/rbac.config'

export const CustomersAccess = {
  create: ({ req }) => can(req.user.role, 'Customers', 'create'),
  read: ({ req }) => can(req.user.role, 'Customers', 'read'),
  update: ({ req }) => can(req.user.role, 'Customers', 'update'),
  delete: ({ req }) => can(req.user.role, 'Customers', 'delete'),
}