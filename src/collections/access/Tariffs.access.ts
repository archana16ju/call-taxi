import { can } from '@/access/rbac.config'

export const TariffsAccess = {
  create: ({ req }) => can(req.user.role, 'Tariffs', 'create'),
  read: ({ req }) => can(req.user.role, 'Tariffs', 'read'),
  update: ({ req }) => can(req.user.role, 'Tariffs', 'update'),
  delete: ({ req }) => can(req.user.role, 'Tariffs', 'delete'),
}