import { can } from '@/access/rbac.config'

export const driverallocationAccess = {
  create: ({ req }) => can(req.user.role, 'driver-allocation', 'create'),
  read: ({ req }) => can(req.user.role, 'driver-allocation', 'read'),
  update: ({ req }) => can(req.user.role, 'driver-allocation', 'update'),
  delete: ({ req }) => can(req.user.role, 'driver-allocation', 'delete'),
}