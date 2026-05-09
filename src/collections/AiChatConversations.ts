import type { CollectionConfig } from 'payload'

const AiChatConversations: CollectionConfig = {
  slug: 'ai-chat-conversations',
  admin: {
    useAsTitle: 'sessionId',
    components: {
      views: {
        list: {
          Component: '@/payload/admin/components/AIChatSupport#default',
        },
      },
    },
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'sessionId',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'bookingId',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Pending', value: 'pending' },
        { label: 'Escalated', value: 'escalated' },
        { label: 'Resolved', value: 'resolved' },
      ],
      defaultValue: 'active',
    },
    {
      name: 'messages',
      type: 'array',
      fields: [
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'User', value: 'user' },
            { label: 'AI', value: 'ai' },
            { label: 'System', value: 'system' },
          ],
        },
        {
          name: 'message',
          type: 'textarea',
        },
        {
          name: 'timestamp',
          type: 'date',
          defaultValue: () => new Date(),
        },
      ],
    },
    {
      name: 'notifications',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'text', // booking / chat / alert
        },
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'read',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
}

export default AiChatConversations
