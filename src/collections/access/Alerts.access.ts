import { can } from '@/access/rbac.config'

export const AlertsAccess = {
  create: ({ req }) => can(req.user.role, 'Alerts', 'create'),
  read: ({ req }) => can(req.user.role, 'Alerts', 'read'),
  update: ({ req }) => can(req.user.role, 'Alerts', 'update'),
  delete: ({ req }) => can(req.user.role, 'Alerts', 'delete'),
}