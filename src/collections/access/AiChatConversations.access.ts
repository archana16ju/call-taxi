import { can } from '@/access/rbac.config'

export const AiChatConversationsAccess = {
  create: ({ req }) => can(req.user.role, 'AiChatConversations', 'create'),
  read: ({ req }) => can(req.user.role, 'AiChatConversations', 'read'),
  update: ({ req }) => can(req.user.role, 'AiChatConversations', 'update'),
  delete: ({ req }) => can(req.user.role, 'AiChatConversations', 'delete'),
}