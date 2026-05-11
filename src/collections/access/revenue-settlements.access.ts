import { can } from '@/access/rbac.config'

export const revenuesettlementsAccess = {
  create: ({ req }) => can(req.user.role, 'revenue-settlements', 'create'),
  read: ({ req }) => can(req.user.role, 'revenue-settlements', 'read'),
  update: ({ req }) => can(req.user.role, 'revenue-settlements', 'update'),
  delete: ({ req }) => can(req.user.role, 'revenue-settlements', 'delete'),
}