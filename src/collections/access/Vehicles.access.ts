import { can } from '@/access/rbac.config'

export const VehiclesAccess = {
  create: ({ req }) => can(req.user.role, 'Vehicles', 'create'),
  read: ({ req }) => can(req.user.role, 'Vehicles', 'read'),
  update: ({ req }) => can(req.user.role, 'Vehicles', 'update'),
  delete: ({ req }) => can(req.user.role, 'Vehicles', 'delete'),
}