import { can } from '@/access/rbac.config'

export const ReviewsAccess = {
  create: ({ req }) => can(req.user.role, 'Reviews', 'create'),
  read: ({ req }) => can(req.user.role, 'Reviews', 'read'),
  update: ({ req }) => can(req.user.role, 'Reviews', 'update'),
  delete: ({ req }) => can(req.user.role, 'Reviews', 'delete'),
}