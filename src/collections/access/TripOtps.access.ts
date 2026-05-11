import { can } from '@/access/rbac.config'

export const TripOtpsAccess = {
  create: ({ req }) => can(req.user.role, 'TripOtps', 'create'),
  read: ({ req }) => can(req.user.role, 'TripOtps', 'read'),
  update: ({ req }) => can(req.user.role, 'TripOtps', 'update'),
  delete: ({ req }) => can(req.user.role, 'TripOtps', 'delete'),
}