import { can } from '@/access/rbac.config'

export const DriversAccess = {
  create: ({ req }) => can(req.user.role, 'Drivers', 'create'),
  read: ({ req }) => can(req.user.role, 'Drivers', 'read'),
  update: ({ req }) => can(req.user.role, 'Drivers', 'update'),
  delete: ({ req }) => can(req.user.role, 'Drivers', 'delete'),
}