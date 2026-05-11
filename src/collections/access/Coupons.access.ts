import { can } from '@/access/rbac.config'

export const CouponsAccess = {
  create: ({ req }) => can(req.user.role, 'Coupons', 'create'),
  read: ({ req }) => can(req.user.role, 'Coupons', 'read'),
  update: ({ req }) => can(req.user.role, 'Coupons', 'update'),
  delete: ({ req }) => can(req.user.role, 'Coupons', 'delete'),
}