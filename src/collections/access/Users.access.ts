import { can } from '@/access/rbac.config'

export const UsersAccess = {
  create: ({ req }) => can(req.user.role, 'Users', 'create'),
  read: ({ req }) => can(req.user.role, 'Users', 'read'),
  update: ({ req }) => can(req.user.role, 'Users', 'update'),
  delete: ({ req }) => can(req.user.role, 'Users', 'delete'),
}