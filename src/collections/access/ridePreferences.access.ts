import { can } from '@/access/rbac.config'

export const ridePreferencesAccess = {
  create: ({ req }) => can(req.user.role, 'ridePreferences', 'create'),
  read: ({ req }) => can(req.user.role, 'ridePreferences', 'read'),
  update: ({ req }) => can(req.user.role, 'ridePreferences', 'update'),
  delete: ({ req }) => can(req.user.role, 'ridePreferences', 'delete'),
}