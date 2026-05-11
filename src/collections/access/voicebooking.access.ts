import { can } from '@/access/rbac.config'

export const voicebookingAccess = {
  create: ({ req }) => can(req.user.role, 'voicebooking', 'create'),
  read: ({ req }) => can(req.user.role, 'voicebooking', 'read'),
  update: ({ req }) => can(req.user.role, 'voicebooking', 'update'),
  delete: ({ req }) => can(req.user.role, 'voicebooking', 'delete'),
}