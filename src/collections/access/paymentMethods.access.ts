import { can } from '@/access/rbac.config'

export const paymentMethodsAccess = {
  create: ({ req }) => can(req.user.role, 'paymentMethods', 'create'),
  read: ({ req }) => can(req.user.role, 'paymentMethods', 'read'),
  update: ({ req }) => can(req.user.role, 'paymentMethods', 'update'),
  delete: ({ req }) => can(req.user.role, 'paymentMethods', 'delete'),
}