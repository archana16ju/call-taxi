import { can } from '@/access/rbac.config'

export const BookingsAccess = {
  create: ({ req }) => can(req.user.role, 'Bookings', 'create'),
  read: ({ req }) => can(req.user.role, 'Bookings', 'read'),
  update: ({ req }) => can(req.user.role, 'Bookings', 'update'),
  delete: ({ req }) => can(req.user.role, 'Bookings', 'delete'),
}