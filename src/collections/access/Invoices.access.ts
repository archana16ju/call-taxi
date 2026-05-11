import { can } from '@/access/rbac.config'

export const InvoicesAccess = {
  create: ({ req }) => can(req.user.role, 'Invoices', 'create'),
  read: ({ req }) => can(req.user.role, 'Invoices', 'read'),
  update: ({ req }) => can(req.user.role, 'Invoices', 'update'),
  delete: ({ req }) => can(req.user.role, 'Invoices', 'delete'),
}