import { can } from '@/access/rbac.config'

export const DriverOfflineLogsAccess = {
  create: ({ req }) => can(req.user.role, 'DriverOfflineLogs', 'create'),
  read: ({ req }) => can(req.user.role, 'DriverOfflineLogs', 'read'),
  update: ({ req }) => can(req.user.role, 'DriverOfflineLogs', 'update'),
  delete: ({ req }) => can(req.user.role, 'DriverOfflineLogs', 'delete'),
}