import { can } from '@/access/rbac.config'

export const MediaAccess = {
  create: ({ req }) => can(req.user.role, 'Media', 'create'),
  read: ({ req }) => can(req.user.role, 'Media', 'read'),
  update: ({ req }) => can(req.user.role, 'Media', 'update'),
  delete: ({ req }) => can(req.user.role, 'Media', 'delete'),
}