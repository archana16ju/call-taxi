import { can } from '@/access/rbac.config'

export const ContactsAccess = {
  create: ({ req }) => can(req.user.role, 'Contacts', 'create'),
  read: ({ req }) => can(req.user.role, 'Contacts', 'read'),
  update: ({ req }) => can(req.user.role, 'Contacts', 'update'),
  delete: ({ req }) => can(req.user.role, 'Contacts', 'delete'),
}