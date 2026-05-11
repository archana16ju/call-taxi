import { can } from '@/access/rbac.config'

export const TripSharingAccess = {
  create: ({ req }) => can(req.user.role, 'TripSharing', 'create'),
  read: ({ req }) => can(req.user.role, 'TripSharing', 'read'),
  update: ({ req }) => can(req.user.role, 'TripSharing', 'update'),
  delete: ({ req }) => can(req.user.role, 'TripSharing', 'delete'),
}